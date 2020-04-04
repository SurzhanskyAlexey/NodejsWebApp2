
function sendLogin() {
    let salt1 = 'shmim';
    let salt2 = 'shmak';
    fetch ('/login', {
        method: 'POST',
        body: JSON.stringify({
            'login': document.querySelector('#login').value,
            'password': document.querySelector('#password').value,
        }),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
};
    document.querySelector('form').onsubmit = function (event) {
    event.preventDefault();
    sendLogin();
};




