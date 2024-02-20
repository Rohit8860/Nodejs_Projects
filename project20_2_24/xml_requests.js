// var XMLHttpRequest = require('xhr2');
// function run() {
//     let xhr = new XMLHttpRequest();

//     let url = "https://chelseafc.3ddigitalvenue.com/friends-family/auth/logged/";
//     xhr.open("GET", url, true);
//     xhr.setRequestHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:122.0) Gecko/20100101 Firefox/122.0');
//     xhr.setRequestHeader('Accept', 'application/json, text/plain, */*');
//     xhr.setRequestHeader('Accept-Language', 'en-US,en;q=0.5');
//     // xhr.setRequestHeader('Accept-Encoding', 'gzip, deflate, br');
//     xhr.onreadystatechange = function() {
//         if (this.readyState == 4 && this.status == 200) {
//             var responseData = JSON.parse(this.responseText);
//             var csrf = responseData.csrf;
//             console.log("CSRF Token:", csrf);
//             return csrf
//         }
//         console.log("Request Headers:");
//         var requestHeaders = xhr.getAllResponseHeaders();
//         console.log(requestHeaders);
//     }
//     xhr.send();
//     // xhr.setRequestHeader("X-CSRFTOKEN",csrf);
//     // console.log(xhr.setRequestHeader());
// }


// function account_login(){
//     let csrf = run();
//     console.log("--------")
//     console.log(csrf);
//     let xhr = new XMLHttpRequest();
//     xhr.open('POST', 'https://chelseafc.3ddigitalvenue.com/friends-family/auth/login/');
//     xhr.setRequestHeader('X-CSRFTOKEN',csrf.toString());
//     console.log(xhr.setRequestHeader());
    
// }


// run();
// run();
// account_login();


const myUsers = [
    { name: 'shark', likes: 'ocean' },
    { name: 'turtle', likes: 'pond' },
    { name: 'otter', likes: 'fish biscuits' }
]

const usersByLikes = myUsers.map(item => {
    const container = {};

    container[item.name] = item.likes;
    container.age = item.name.length * 10;

    return container;
})

// var data = container
console.log(usersByLikes);