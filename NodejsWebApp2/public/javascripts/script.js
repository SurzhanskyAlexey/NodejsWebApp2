"use strict";


/**========================Открытие и закрытие меню====================**/
document.querySelector('.menu-button').onclick = selector;


function selector() {
    let state =document.querySelector('.menu').style.visibility;
    if (state == "") {
        showMenu();
    } else if (state == "hidden") {
        showMenu();
    } else  {
        closeMenu();
    }
}
function showMenu(){
    document.querySelector('.menu').style.visibility = 'visible';

}
function closeMenu(){
    document.querySelector('.menu').style.visibility = 'hidden';
}
function cookieParse (cookie0) {

    //console.log(cookie0);
    //let regexp = (/^\d+/ig);
    let regexp2 = /[0-9][0-9]/g
    let cookieParse = cookie0.match(/id=\d+/ig);
    //console.log(cookieParse);
    let cookieParse2 = cookieParse[0].match(/\d+/ig);
    //console.log(cookieParse);
    //console.log(cookieParse2);
    //cookieParse = cookieParse[0];
    //let idParse = cookieParse.split('=')
    //console.log(idParse);
    //idParse = idParse[1];
   // console.log(idParse);
    return (cookieParse2[0]);

};


 ajaxgetUser();
 function ajaxgetUser () {
     //console.log (document.cookie);

    let cookie1 = cookieParse(document.cookie);
    console.log('+++++++++эта строка+++++++++++++++++');
    console.log(cookie1);

   // alert(document.cookie);
    if (cookie1 == undefined) {
    return (false);
    } else {
        let a = {
        id: cookie1,
    };
        a = JSON.stringify(a);
        fetch ('/get-user-name', {
            method: 'POST',
            headers: {
                'Content-Type':'application/json;charset=utf-8'
            },
            credentials: 'same-origin',
            body: a
        }).then(function (response) {
            let body = response.json();
            return (body);
        }).then(function (body) {
              //  console.log(body);
                document.querySelector('#Username').innerHTML=body[0]['name'];
        })
    }
};

/**================Открытие и закрытие формы добавления пользователя===================*/
let addUser = document.querySelector('#add-user');
if (addUser !== null){addUser.onclick = AddUserMenu;}

function AddUserMenu() {
    let state =document.querySelector('.add-user-form').childNodes.length;
    if (state == '0') {
        showAddUser();
    } else if (state == "hidden") {
        showAddUser();
    } else  {
        closeAddUser();
    }
}

function showAddUser(){
    let outForm = "<form action=\"\/add-user\" method=\"POST\">\n" +
        "    <div class=\"form-control\">\n" +
        "        <label>Логин</label>\n" +
        "        <input name=\"login\" id=\"login\" type=\"text\" placeholder=\"Введите логин\" autocomplete=\"login\" required>\n" +
        "    </div>\n" +
        "    <div class=\"form-control\">\n" +
        "        <label>Пароль</label>\n" +
        "        <input name=\"password\" id=\"password\" type=\"password\" placeholder=\"Введите пароль\" autocomplete=\"password\" required>\n" +
        "    </div>\n" +
        "    <div class=\"form-control\">\n" +
        "    <label>Имя</label>\n" +
        "        <input name=\"name\" id=\"name\" type=\"text\" placeholder=\"Введите полное имя пользователя\" autocomplete=\"name\" required>\n" +
        "    </div>\n" +
        "   <div class=\"form-control\">\n" +
        "       <label></label>\n" +
        "       <input type=\"submit\" class=\"button-primary-outlined admin-panel\" value=\"Добавить нового пользователя\">\n" +
        "   </div>\n" +
        "</form>";


    document.querySelector('.add-user-form').innerHTML = outForm;
    document.querySelector('#add-user').innerHTML = '&#10010;';
};

function closeAddUser(){
    document.querySelector('.add-user-form').innerHTML = "";
    document.querySelector('#add-user').innerHTML = '&mdash;';
}

console.log('privet')
  let buttonDeleteUser = document.querySelectorAll('.delete-user');
    console.log ('длина кнопки делит'+buttonDeleteUser.length);
    for (let i = 0; i < buttonDeleteUser.length; i++) {
          buttonDeleteUser[i].onclick = deleteUser;
    }
    let buttonDeleteQuestion = document.querySelectorAll('.delete-question');
    console.log ('длина кнопки делит'+buttonDeleteQuestion.length);
    for (let i = 0; i < buttonDeleteQuestion.length; i++) {
        buttonDeleteQuestion[i].onclick = deleteQuestion;
    }
let buttonDeleteQuestionType = document.querySelectorAll('.delete-question-type');
console.log ('длина кнопки делит'+buttonDeleteQuestionType.length);
for (let i = 0; i < buttonDeleteQuestionType.length; i++) {
    buttonDeleteQuestionType[i].onclick = deleteQuestionType;
}

function deleteUser () {
    let elem = this.id;
   fetch ('/delete-user',
    {
        method: 'POST',
        body: JSON.stringify({
           'user_id': JSON.parse(elem)
        }),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }).then(function (response,error) {
            if(response.ok) {
             console.log(response);
             console.log('пользователь удален!');
             location.reload();
            } else{
               console.log(error)
              }

      }) ;
};
function deleteQuestion () {
    let elem = this.id;
    console.log('это айди вопроса '+elem);
    console.log (JSON.stringify(elem));
    fetch ('/delete-question',
        {
            method: 'POST',
            body: JSON.stringify({
                'id_questions': JSON.parse(elem)
            }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(function (response,error){
        if (response.ok) {
            location.reload();
        } else {
            return(error)
        }
    });



};
function deleteQuestionType() {
    let elem = this.id;
    console.log('это айди вопроса '+elem);
    console.log (JSON.stringify(elem));
    fetch ('/delete-question-type',
        {
            method: 'POST',
            body: JSON.stringify({
                'test_set_id': JSON.parse(elem)
            }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(function (response,error){
        if (response.ok) {
            location.reload();
        } else {
            return(error)
        }
    });



};


function addQuestionDb() {
    let question = document.querySelector('.question-to-db');
    let response =  fetch ( '/add-question',{
            method: "POST",
            headers: {
                'Content-type':'application/json;charset=utf8'
            },
            body: JSON.stringify({
                'question': JSON.parse(question.value)
            })
    });
    let result = response.JSON();
    console.log(result);

};



