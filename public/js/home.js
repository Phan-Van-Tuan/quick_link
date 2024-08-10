let content = document.getElementById("home_content");

let htmlState000 = `
    <button onclick="setState(100)" class="btn" role="button">
        Create short link
    </button>
    <button onclick="setState(200)" class="btn" role="button">
        Management
    </button>
`;


let htmlState100 = `
    <div class="">
      <article class="l-design-widht">
        <div class="card">
          <button onClick="setState(0)" class="btn-s">Back</button>
          <h2>Create short link</h2>
          <label class="input">
            <input
              id="long_link"
              class="input__field"
              type="text"
              placeholder="Please enter your link here"
            />
          </label>
          <label class="input">
          </label>

          <label class="input copy_text">
            <input
              id="short_link"
              class="input__field"
              type="text"
              placeholder="New short link here"
              disabled
            />
            <button class="copy_to_clipboard">
                <span class="tooltiptext">copy</span>
                <img src="../images/copy-link.png" alt="Copy">
            </button>
          </label>
          <div class="button-group">
            <button class="btn-s" onClick="sendCreate()">Generate</button>
            <button class="btn-s" type="reset" onClick="renderState(100)">Reset</button>
          </div>
        </div>
      </article>
    </div>
    `;

let htmlState200 = `
    <div class="">
      <article class="l-design-widht">
        <div class="card">
          <button onClick="setState(0)" class="btn-s">Back</button>
          <h2>Request permission</h2>
          <label class="input">
            <input
              class="input__field"
              type="text"
              placeholder="Please enter your secret key"
            />
          </label>

          <div class="button-group">
            <button class="btn-s" onClick="sendGetAll()">Send</button>
            <button class="btn-s" type="reset" onClick="renderState(200)">Reset</button>
          </div>
        </div>
      </article>
    </div>
    `;
let htmlState201 = ``
const generate201 = function (data) {

  // Sinh ra các hàng trong bảng từ dữ liệu
  const rows = data.map(row => `
      <tr>
          <td>${row.urlId}</td>
          <td>${JSON.stringify(new Date(row.date)).slice(1, 20)}</td>
          <td>${row.clicks}</td>
          <td onClick="alert('delete ${row.urlId} successfuly')">delete</td>
      </tr>
  `).join('');

  // Chuỗi HTML hoàn chỉnh
  return `
  <table>
      <tr>
          <th>URL ID</th>
          <th>DATE</th>
          <th>CLICKS</th>
          <th>HANDLES</th>
      </tr>
      ${rows}
  </table>
  `;
};

const renderState = (state) => {
  switch (state) {
    case 100: {
      content.innerHTML = htmlState100;
      loadState100();
      break;
    }
    case 200: {
      content.innerHTML = htmlState200;
      loadState200();
      break;
    }
    case 201: {
      content.innerHTML = htmlState201;
      break;
    }
    default: {
      content.innerHTML = htmlState000;
      break;
    }
  }
}

//  functions off all 
renderState(0);
let title = document.querySelector(".title");
title.addEventListener('click', () => {
  renderState(0);
})

const setState = (newState) => {
  console.log("state code: " + newState);
  state = newState;
  renderState(state);
};


// functions of create
const loadState100 = () => {
  // handle copy to clipboard 
  let copyText = document.querySelector(".copy_text");
  copyText.querySelector("button").addEventListener("click", function () {
    let input = copyText.querySelector("input");
    if (input) {
      input.select();
      try {
        navigator.clipboard.writeText(input.value).then(() => {
          console.log('Text copied to clipboard');
        }).catch(err => {
          console.error('Failed to copy text: ', err);
        });
      } catch (err) {
        console.error('execCommand copy failed: ', err);
      }
      window.getSelection().removeAllRanges();
      copyText.querySelector('.tooltiptext').innerText = "copied"
      setTimeout(function () {
        copyText.querySelector('.tooltiptext').innerText = "copy"
      }, 2500);
    }
  });

  let input = document.querySelector("#long_link");
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // prevent default behavior
      sendCreate();
    }
  });
}

// handle when click send
const sendCreate = () => {
  let url = document.querySelector("#long_link").value;
  let output = document.querySelector("#short_link");
  let body = JSON.stringify({ origUrl: url })
  callApi('/short', 'POST', body, (data) => {
    output.value = data.shortUrl;
  });
}


// functions of management 
const loadState200 = () => {
  // load 
  let input = document.querySelector(".input__field");
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // prevent default behavior
      sendGetAll();
    }
  });

}

const sendGetAll = () => {
  let secretKey = document.querySelector(".input__field").value;
  let body = JSON.stringify({ secretKey: secretKey })
  callApi('/all', 'POST', body, (data) => {
    console.log(data);
    htmlState201 = generate201(data);
    renderState(201);
  });
}

const callApi = (params, method, body, callback) => {
  fetch(params,
    {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: method,
      body: body
    })
    .then(response => response.json())
    .then(data => callback(data))
    .catch(error => console.error('Error:', error));
}


