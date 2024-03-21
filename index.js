const express = require('express');

// Tạo một ứng dụng Express
const app = express();
app.use(express.json());

// Định nghĩa các router
app.get('/api/json', (req, res) => {
    res.send("như một trò trẻ con thì đây là web anh để giải thích cho tuyến hiểu!");
});
// Lắng nghe các kết nối trên cổng 3000
app.listen(3000, () => {
    console.log('Server đang chạy tại http://127.0.0.1:3000/');
});
