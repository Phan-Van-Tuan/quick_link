const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const shortid = require("shortid");
const path = require("path")
const validUrl = require('valid-url');
const Url = require("./model");

// configure dotenv
dotenv.config();
const app = express();

// cors for cross-origin requests to the frontend application
app.use(cors());
// parse requests of content-type - application/json
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Database connection
mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log(`👌Connect database successfuly...`);
    })
    .catch((err) => {
        console.log(err.message);
    });



app.get('/', (req, res) => {
    res.render('index');
});


// get all saved URLs 
const secretKey = process.env.SECRET_KEY;
app.post("/all", async (req, res) => {
    try {
        if (req.body.secretKey == secretKey) {
            console.log("ok");
            const urls = await Url.find({});
            return res.status(200).json(urls);
        }
        return res.status(500).json("your secret key is wrong!!");
    } catch (e) {
        console.log(e);
        return res.status(500).json(e);
    }
})

// URL shortener endpoint
app.post("/short", async (req, res) => {
    console.log("HERE", req.body.origUrl);
    const { origUrl } = req.body;
    const base = `https://quick-link-puce.vercel.app/`;

    const urlId = shortid.generate();
    if (validUrl.isUri(origUrl)) {
        try {
            let url = await Url.findOne({ origUrl });
            if (url) {
                res.json(url);
            } else {
                const shortUrl = `${base}/${urlId}`;

                url = new Url({
                    origUrl,
                    shortUrl,
                    urlId,
                    date: new Date(),
                });

                await url.save();
                res.json(url);
            }
        } catch (err) {
            console.log(err);
            res.status(500).json('Server Error');
        }
    } else {
        res.status(400).json('Invalid Original Url');
    }
});


app.delete("/:urlId", async (req, res) => {
    try {
        await Url.findOneAndDelete({ urlId: req.params.urlId });
        res.status(200).json("Delete okey");
    } catch (err) {
        console.log(err);
        res.status(500).json("Server Error");
    }
});

// redirect endpoint
app.get("/:urlId", async (req, res) => {
    try {
        const url = await Url.findOne({ urlId: req.params.urlId });
        console.log(url)
        if (url) {
            url.clicks++;
            url.save();
            return res.redirect(url.origUrl);
        } else res.status(404).json("Not found");
    } catch (err) {
        console.log(err);
        res.status(500).json("Server Error");
    }
});

// Port Listenning on 3333
const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
    console.log(`👌Server is running at PORT ${PORT}`);
});
