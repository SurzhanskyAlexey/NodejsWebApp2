"use strict";
console.log('ya rabotau');
let counter = questCount();
let checkbox = document.querySelectorAll('.qwe');
for (let i = 0; i<checkbox.length; i++) {
    checkbox[i].onclick =checkAnswerAmount;
}
document.querySelector('.quest-number').innerHTML = '<h4>Вопрос:  '+counter+'</h4>';
function questCount() {
    let questNumber = getCookie('quC');
    if (questNumber == undefined) {
        setCookie ('quC','1');
        return (getCookie('quC'))
    }
    else {

        //alert(questNumber);
        questNumber++;
        // alert(questNumber);
        setCookie ('quC',questNumber);
        return (getCookie('quC'))

    }
}

function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
};

function setCookie(name, value, options) {
    options = {
        path: '/',
        expires: '50000'
    };

    if (options.expires.toUTCString) {
        options.expires = options.expires.toUTCString();
    }

    let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

    for (let optionKey in options) {
        updatedCookie += "; " + optionKey;
        let optionValue = options[optionKey];
        if (optionValue !== true) {
            updatedCookie += "=" + optionValue;
        };
    };

    document.cookie = updatedCookie;
};

function checkAnswerAmount() {
    let QuestStatus = document.querySelector('.one-question');

    if (QuestStatus.value == 1) {
        let qwe = document.querySelectorAll(".qwe");
        let count = 0;
        for (let i = 0; i < qwe.length; i++) {
            if (qwe[i].checked == true) {

                count++;
            }

        }
        ;
        if (count > 1) {
            let message = document.querySelector('.alertMessage')
            message.innerHTML='Нельзя выбирать более одного ответа!';
            setTimeout(function(){message.innerHTML=''},1000);
            for (let i = 0; i < qwe.length; i++) {
                qwe[i].checked = false;
            }
            ;
        }
    }
    ;
}






let count = 30;
document.getElementById('timer').innerHTML = '<h4>'+count+'<h4>';


setTimeout(function(){Timer (count)},1000);

function Timer (count) {
    if (count>0){
        count--;
        document.getElementById('timer').innerHTML = '<h4>'+count+'<h4>';
        setTimeout(function() {Timer(count)}, 1000);
        return (count);
    } else {

           let form = document.getElementById('formAnswer');
        alert("время на ответ вышло!");
           form.submit();

    }

};