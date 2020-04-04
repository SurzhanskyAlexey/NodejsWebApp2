'use strict';

fillipQuest();



function fillipQuest () {
    fetch ('/select-type-question', {
        method: 'GET',
        headers: {
            'Content-Type':'application/json; charset=utf-8'
        }
    }).then(function (response){
        let result = response.json();
        return(result);
    }).then(function (result) {
        let option = '';
        let select = document.querySelector('.type-question-to-db');
        for (let i = 0; i < result.length; i++) {
            option = document.createElement("option");
            option.value = result[i].test_set_id;
            select.appendChild(option).innerHTML = result[i].test_name;
        }

    });

}

