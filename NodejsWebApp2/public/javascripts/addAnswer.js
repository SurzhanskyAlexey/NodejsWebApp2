"use strict";

function addAnswer(){
    console.log('nazhalanswer');
    let inputA = document.querySelector('.input-answer');
    let checkbox = document.createElement('input');
    let table = document.createElement('table');
    let tr = document.createElement('tr');
    let td = document.createElement('td');
    let td2 = document.createElement('td');
    let div = document.createElement('div');
    let Butt = document.createElement('button');
    let label = document.createElement('label');
    let input = document.createElement("input");
    div.className = "form-control";
    console.log(div);
    checkbox.type = "checkbox";
    checkbox.name = "answer";
    checkbox.value = "correctanswer";
    input.name = "answer";
    input.type = "text";
    Butt.name = "delButton";
    inputA.appendChild(div).innerHTML;
    div.appendChild(label).innerHTML ='Ответ';
    div.appendChild(table);
    table.appendChild(tr);
    tr.appendChild(td);
    tr.appendChild(td2);
    td.appendChild(input)
    td.appendChild(checkbox)
    div.appendChild(Butt).innerHTML ='удалить';
    //  let delButton = document.getElementsByName('delButton');
    Butt.onclick = function (event) {
        event.preventDefault();
        div.remove();
    }
}

document.querySelector('#add-answer').onclick = addAnswer;