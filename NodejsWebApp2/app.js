//var app = require('./app');
var debug = require('debug')('testnode:server');
var http = require('http');
let createError = require('http-errors');
const express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let mysql = require('mysql');
let cookie = require('cookie');
let md5 = require('md5');
const app = express();
let admin = require('./admin');
let const_settings = require('./const');
let user = require('./user');
let validator = require('validator');
const randomInt = require('random-int');
const fs = require('fs');
/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3010');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
console.log('starting on 3010');
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}
/**==============connect to db=========*/
let con = mysql.createConnection({
  host:'localhost',
  user: 'root',
  password: 'root',
  database: 'test'
});
/**-------------connect to db-------------*/
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', function(req, res, next) {
    res.render('index', { Title: 'Информационная система' });
});
app.get('/test', function(req, res, next) {
    user(req, res, con,function() {
 if (req.cookies.test_session == undefined && req.cookies.id !==undefined && req.cookies.session !==undefined){
     let test_session = randomInt (1, 1000000000000);
     test_session = md5(test_session);
     res.cookie('test_session',test_session, { maxAge: 1800000});
         return new Promise(function (resolve, reject) {
             con.query('SET @var_name = (SELECT id_questions FROM questions ORDER BY RAND()LIMIT 1);',
                 function (error, result) {
                     if (error) return reject (error);
                     let resultUsedQuest = JSON.parse(JSON.stringify(result));
                     resolve (resultUsedQuest);

                 });
         }).then(function(resultUsedQuest){

             con.query('SELECT * FROM questions  LEFT JOIN answers USING(id_questions) WHERE questions.id_questions=@var_name;',
                 function (error, resultqId, fields) {
                     if (error) return (error);
                     resultqId = JSON.parse(JSON.stringify(resultqId));
                     res.render('test', {question: JSON.parse(JSON.stringify(resultqId))});
                 });}
         )
     }
     });
});

function getTestSession () {
  return new Promise (function (resolve, reject) {
            con.query('SELECT test_session FROM user_has_questions WHERE test_session = "62f6020e9253d265b097c7d1382d3358"', function (result,error) {
                if(error) reject (error)
                console.log(result)
                resolve (result);
            })

    });

};
app.get('/test1', function(req, res) {
    return new Promise(function (resolve,reject){
        con.query('SELECT test_session FROM user_has_questions WHERE test_session = "62f6020e9253d265b097c7d1382d3358"', function (result,error) {
        if(error) reject (error)
            resolve(result)
        });

    }).then( function(result){res.end(result[0].test_session);})



                     //  let i = getTestSession ();
                     //  console.log(i);
                     // //search();
                     // function search(){
                     // let test_session= '';
                     // test_session = randomInt(1, 1000000000000);
                     // test_session = md5(test_session);
                     //
                     // let answer = getTestSession();
                     // // answer.then(function(result) {
                     // //     console.log(result.length)
                     // //     for (let i=0; i<result.length; i++){
                     // //         if (result == test_session){
                     // //            // console.log(result.length);
                     //             search();
                     //         } else {
                     //             console.log('совпадений нет!')
                     //             res.end(test_session);}
                     //     }
                     // }


                 });



app.get('/testResults', function(req, res, next) {
    user(req, res, con,function() {
      //  if const_settings.constQuestAmount
        if (req.cookies.test_session !== undefined && req.cookies.quC == const_settings.constQuestAmount ) {
            return new Promise(function (resolve, reject) {
                con.query('SELECT user_id,test_session,questions.id_questions,answers.id_answers,answer_result,correct, one_answer FROM user_has_questions LEFT JOIN  answers ON (user_has_questions.id_answers=answers.id_answers) LEFT JOIN questions  ON (user_has_questions.id_questions=questions.id_questions) WHERE user_has_questions.user_id='+req.cookies.id+' AND test_session="'+req.cookies.test_session+'"',
                    function (error, result) {
                        if (error) return reject(error);
                        resolve(result);
                })
            }).then(function(result){
                let countCorrectAnswer = 0;
                let countQuest = 0;
                for (let i = 0; i<result.length; i++) {
                        if (result[i].correct == 1) {
                            countQuest++;}
                }
                   function count(countQuest) {
                    for (let i = 0; i < result.length; i++ ) {
                      //console.log('ответ '+i);
                      if (result[i].one_answer == 1 && result[i].answer_result == 0 && result[i].answer_result == result[i].correct) {

                      }
                      else if (result[i].one_answer == 1 && result[i].answer_result == 1 && result[i].answer_result == result[i].correct) {
                          countCorrectAnswer++;
                      }
                      else if (result[i].one_answer == 1 && result[i].answer_result == 0 && result[i].answer_result !== result[i].correct){
                        }
                      else if (result[i].one_answer == 1 && result[i].answer_result == 1 && result[i].answer_result !== result[i].correct){
                      }
                      else if (result[i].one_answer == 0 && result[i].answer_result == 0 && result[i].answer_result == result[i].correct) {
                      }
                      else if (result[i].one_answer == 0 && result[i].answer_result == 1 && result[i].answer_result == result[i].correct) {
                          countCorrectAnswer++;
                      }
                      else if (result[i].one_answer == 0 && result[i].answer_result == 0 && result[i].answer_result !== result[i].correct){
                      }
                      else if (result[i].one_answer == 0 && result[i].answer_result == 1 && result[i].answer_result !== result[i].correct){
                          countCorrectAnswer--;
                      }

                    }
                    if (countCorrectAnswer < 0) {
                        countCorrectAnswer = 0;
                    } else {

                        countCorrectAnswer = Math.round((countCorrectAnswer/countQuest*100))}

                     return  countCorrectAnswer;
                  };
                   let AnsRes = count(countQuest);
                con.query('UPDATE testresults SET complete = 1, result = '+AnsRes+' WHERE user_id = '+req.cookies.id+' AND test_session = "'+req.cookies.test_session+'";');
                res.clearCookie('test_session');
                res.clearCookie('quC');
                res.render('testResults',{result:AnsRes});
            });
        }
    });

});
app.get('/testReport', function(req, res, next) {
    user(req, res, con,function() {
        console.log(req.query.test_session)
            return new Promise(function (resolve, reject) {
                console.log('SELECT  IF(questions.question = @prevuserQ,\'\',@prevuserQ:=questions.question) AS question,answer,test_session,correct,answer_result FROM user_has_questions LEFT JOIN answers ON (answers.id_answers = user_has_questions.id_answers) LEFT JOIN questions ON (questions.id_questions = user_has_questions.id_questions) WHERE test_session ="'+req.query.test_session+'";');
                con.query('SELECT  IF(questions.question = @prevuserQ,\'\',@prevuserQ:=questions.question) AS question,answer,test_session,correct,answer_result FROM user_has_questions LEFT JOIN answers ON (answers.id_answers = user_has_questions.id_answers) LEFT JOIN questions ON (questions.id_questions = user_has_questions.id_questions) WHERE test_session ="'+req.query.test_session+'";',
                    function (error, result) {
                        if (error) return reject(error);
                        resolve(result);
                    })
            }).then(function(result){

                res.render('testReport',{report:result});
            });
    });

});

app.get('/exit', function(req, res, next) {
    user(req, res, con,function() {
                res.clearCookie('test_session');
                res.clearCookie('quC');
                res.clearCookie('id');
                res.clearCookie('session');
                res.redirect('/',);
            });
        });
app.post('/test', function (req,res) {
    user(req, res, con,function() {
        if (req.cookies.test_session !== undefined && req.cookies.quC == 1 ) {
            // for (let i = 0;)
            return new Promise(function (resolve, reject) {
                        con.query('INSERT INTO `testresults` (user_id,test_session) VALUES (' + req.cookies.id + ',"' + req.cookies.test_session + '")',
                            function (error, result) {
                                if (error) return reject(error);
                                resolve(result);
                            });


            }).then(function(result) {
            return new Promise(function (resolve, reject) {
                let answerKey = '';
                for (let key in req.body) {
                    if (key.includes("answercheckbox:") == true) {
                        answerKey = key.slice(15);
                        con.query('INSERT INTO `user_has_questions` (user_id,id_questions,test_session,id_answers,answer_result) VALUES (' + req.cookies.id + ',' + req.body.id_questions + ',"' + req.cookies.test_session + '",' + answerKey + ',' + req.body[key][0] + ')',
                            function (error, result) {
                                if (error) return reject(error);
                                resolve(result);
                            });
                    }
                }
            })
            }).then(function(result) {
                return new Promise(function (resolve, reject) {
                    con.query('SELECT DISTINCT id_questions FROM user_has_questions WHERE user_id=' + req.cookies.id + ' AND test_session="' + req.cookies.test_session + '"',
                        function (error, SelectResult, fields) {
                            if (error) return reject(error);
                            resolve(SelectResult);
                    });
                });
            }).then(function(SelectResult) {
                return new Promise(function (resolve, reject) {
                    con.query('SELECT test_set_id FROM user_has_test_type WHERE user_id= '+ req.cookies.id + ' AND switch_quest_type= 1',
                        function (error, SelectSwitch, fields) {
                            if (error) return reject(error);

                            let result1 = {
                                SelectResult: SelectResult,
                                SelectSwitch: SelectSwitch
                            }
                            resolve(result1);
                        });
                })
            }).then(function(result1) {
                let SelRes = result1.SelectResult;
                let SelSwi = result1.SelectSwitch;
                let SelResLen = result1.SelectResult.length;
                let SelSwiLen = result1.SelectSwitch.length;
                let outSR='';
                let outSS='';
                for (let i = 0; i < SelResLen; i++) {
                    if ((SelResLen-i) == 1) {
                        outSR += SelRes[i].id_questions;
                    } else {
                        outSR += SelRes[i].id_questions;
                        outSR+=',';
                    }
                }
                for (let i = 0; i < SelSwiLen; i++) {
                    if ((SelSwiLen-i) == 1) {
                        outSS += SelSwi[i].test_set_id;
                    } else {
                        outSS += SelSwi[i].test_set_id;
                        outSS+=',';
                    }
                }

                return new Promise(function (resolve, reject) {
                    con.query('SET @var_name = (SELECT id_questions FROM questions where id_questions NOT IN ('+outSR+') AND test_set_id IN ('+outSS+') ORDER BY RAND()  LIMIT 1);',
                        function (error, SetVarName, fields) {
                            if (error) return reject(error);
                            SetVarName = JSON.stringify(SetVarName);
                            resolve(SetVarName);
                        });
                });
            }).then(function(SetVarName){
                con.query('SELECT * FROM questions  LEFT JOIN answers USING(id_questions) WHERE questions.id_questions=@var_name;',
                    function (error, result, fields) {
                        if (error) return (error);
                        result = JSON.parse(JSON.stringify(result));
                        if(result !== undefined){
                            res.render('test',{question: result});
                        } else {let errorText = "Закончились вопросы";
                            res.render('testerror', {errorText: errorText})}

                    });}
            );
        }
    else if (req.cookies.test_session !== undefined && req.cookies.quC < const_settings.constQuestAmount ) {
               // for (let i = 0;)
                return new Promise(function (resolve, reject) {
                let answerKey = '';
                for (let key in req.body){
                    if (key.includes("answercheckbox:") == true) {
                        answerKey = key.slice(15);
                        con.query('INSERT INTO `user_has_questions` (user_id,id_questions,test_session,id_answers,answer_result) VALUES ('+req.cookies.id+','+req.body.id_questions+',"'+req.cookies.test_session+'",'+answerKey+','+req.body[key][0]+')',
                            function (error, result) {
                                if (error) return reject (error);
                                resolve (result);
                            });
                    }
                }
           }).then(function(result) {
                return new Promise(function (resolve, reject) {
                    con.query('SELECT DISTINCT id_questions FROM user_has_questions WHERE user_id=' + req.cookies.id + ' AND test_session="' + req.cookies.test_session + '"',
                    function (error, SelectResult, fields) {
                        if (error) return reject(error);
                        resolve(SelectResult);
                    });
           })
            }).then(function(SelectResult) {
                    return new Promise(function (resolve, reject) {
                        con.query('SELECT test_set_id FROM user_has_test_type WHERE user_id= '+ req.cookies.id + ' AND switch_quest_type= 1',
                            function (error, SelectSwitch, fields) {
                                if (error) return reject(error);

                                let result1 = {
                                    SelectResult: SelectResult,
                                    SelectSwitch: SelectSwitch
                                }
                                resolve(result1);
                            });
                    })
                }).then(function(result1) {
                    let SelRes = result1.SelectResult;
                    let SelSwi = result1.SelectSwitch;
                    let SelResLen = result1.SelectResult.length;
                    let SelSwiLen = result1.SelectSwitch.length;
                    let outSR='';
                    let outSS='';
                    for (let i = 0; i < SelResLen; i++) {
                        if ((SelResLen-i) == 1) {
                            outSR += SelRes[i].id_questions;
                            // console.log(outSR);
                        } else {
                            outSR += SelRes[i].id_questions;
                            outSR+=',';
                            // console.log(outSR);
                        }
                    }
                    //console.log('SelSwi');
                    //console.log(SelSwi);
                    for (let i = 0; i < SelSwiLen; i++) {
                        if ((SelSwiLen-i) == 1) {
                            outSS += SelSwi[i].test_set_id;
                        } else {
                            outSS += SelSwi[i].test_set_id;
                            outSS+=',';
                            //console.log('нужно'+outSS);
                        }
                    }
                    return new Promise(function (resolve, reject) {
                        con.query('SET @var_name = (SELECT id_questions FROM questions where id_questions NOT IN ('+outSR+') AND test_set_id IN ('+outSS+') ORDER BY RAND()  LIMIT 1);',
                                function (error, SetVarName, fields) {
                                    if (error) return reject(error);
                                    SetVarName = JSON.stringify(SetVarName);
                                    // console.log('tis1'+SelectResult);
                                    //console.log(SelectResult);
                                    resolve(SetVarName);
                                });
                        });
                    }).then(function(SetVarName) {
                            return new Promise(function (resolve, reject){ con.query('SELECT * FROM questions  LEFT JOIN answers USING(id_questions) WHERE questions.id_questions=@var_name;',
                                function (error, result, fields) {
                                    if (error) return (error);
                                    resolve(result);
                                })}

                            )
                    }).then(function(result){
                                result = JSON.parse(JSON.stringify(result));
                                if(result !== undefined){
                                    res.render('test',{question: result});
                                } else {let errorText = "Извините, закончились вопросы";
                                    res.render('testerror', {errorText: errorText})}
                    })



    }


    else if (req.cookies.test_session !== undefined && req.cookies.quC >= const_settings.constQuestAmount) {
            return new Promise(function (resolve, reject) {
            let answerKey = '';
            for (let key in req.body){
                if (key.includes("answercheckbox:") == true) {
                    answerKey = key.slice(15);
                    con.query('INSERT INTO `user_has_questions` (user_id,id_questions,test_session,id_answers,answer_result) VALUES ('+req.cookies.id+','+req.body.id_questions+',"'+req.cookies.test_session+'",'+answerKey+','+req.body[key][0]+')',
                        function (error, result) {
                            if (error) return reject (error);
                            resolve (result);
                        });
                }
            }
        }).then(res.redirect('/Testresults'));
    }
    else {
        let errorText = "Сессия потеряна, Вам нужно снова начать  тест";
        res.render('testerror', {errorText: errorText})
    };
})
});

app.get('/form', function(req, res, next) {
    user(req, res, con,function() {
        res.render('form', { Title: 'Test' });
    });
});
app.get('/materials', function(req, res, next) {
    res.render('materials', { Title: 'Учебный материал' });
});
app.get('/exper', function(req, res, next) {
    res.render('exper', { Title: 'Учебный материал' });
});
app.get('/login', function(req, res, next) {
    res.render('login', { Title: 'Admin-Panel' });
});
app.get('/add-user', function(req, res, next) {
    res.render('users', { Title: 'Admin-Panel' });
});
app.get('/loginUsers', function(req, res, next) {
    res.render('loginUsers', { Title: 'Admin-Panel' });
});
app.get('/admin', function(req, res) {
    admin(req, res, con,function() {
        res.render('admin', { Title: 'Admin-Panel' });
    });
});
app.get('/UserSet', function(req, res) {
    admin (req, res, con,function() {
        let promise = new Promise(function (resolve, reject) {
            con.query(
                'SELECT user_id, login, password, name, date_format(exam_day, \'%d.%m.%Y\') AS exam_day, switch_quest_type, test_name, test_set_id FROM user LEFT JOIN user_has_test_type USING (user_id) LEFT JOIN test_type  USING (test_set_id) WHERE user_id=' + req.query.user_id,
                function (error, result, field) {
                    if (error) return reject(error);
                    resolve(result);
                 }
            );
        });
        let promise2 = new Promise(function (resolve, reject) {
            con.query(
                'SELECT test_name,test_set_id FROM test_type',
                function (error, result, field) {
                if (error) return reject(error);
                resolve(result);
                }
            );

        });
        Promise.all([promise,promise2]).then(function (value) {
            //console.log(JSON.parse(JSON.stringify(value)));
            res.render('UserSet', {
                UserSet: JSON.parse(JSON.stringify(value[0])),
                TestType:JSON.parse(JSON.stringify(value[1])),
            });
        })

        //  console.log('no users');
        // res.end('User is not exist!');

        // console.log(JSON.parse(JSON.stringify(result)));

    });

    });
app.get('/const', function(req, res, next) {
    let fileContent = fs.readFileSync("const.js", "utf8");
    let constQ = '';
    let regexp = /[0-9]/g;
    //console.log(Object.values(fileContent));
    let rew = fileContent.match(regexp)
    for (let i = 0; i<rew.length; i++) {
        constQ +=  rew[i];
    }
    // for (let key in fileContent) {
    //     //console.log(typeof key);
    //
    //     if (key == 23) {
    //         constQ = fileContent[key];

           // console.log(constQ);


    res.render('const', { constants: JSON.parse(JSON.stringify(constQ))});
});
app.get('/users', function(req, res) {
    admin(req, res, con,function() {
        con.query('SELECT user_id, login, password, name, date_format(exam_day, \'%d.%m.%Y\') AS exam_day FROM user',
            function (error,result) {
                if (error) return error;
                if (result == '') {
                   // console.log('no users');
                }
               // console.log(JSON.parse(JSON.stringify(result)));
                res.render('users', {Title:'admin panel', userlist: JSON.parse(JSON.stringify(result))});
         });
    });
});
app.get('/userTestResult', function(req, res) {
    admin(req, res, con,function() {
        con.query('SELECT user_id, name, result, complete,  date_format(test_time, \'%d.%m.%Y %H:%i\') AS test_time, test_session FROM user  LEFT JOIN testresults USING (user_id) WHERE user_id='+req.query.user_id+';',
            function (error,result) {
                if (error) return error;
                if (result == '') {
                    // console.log('no users');
                }
                // console.log(JSON.parse(JSON.stringify(result)));
                res.render('userTestResult', {Title:'Результаты тестирования', userlist: JSON.parse(JSON.stringify(result))});
            });
    });
});
app.get('/TqSet', function(req, res) {
    admin (req, res, con,function() {
       // console.log(req.query);
             con.query(
                'SELECT test_set_id, test_name FROM test_type WHERE test_set_id=' + req.query.test_set_id,
                function (error, result) {
                    if (error) return (error);
                    res.render('TqSet', {
                        questionTypelist: JSON.parse(JSON.stringify(result)),
                    });
                }

            );

    });
});
app.get('/questionSet', function(req, res) {
    admin (req, res, con,function() {
        // console.log(req.query);
        con.query(
            'SELECT questions.id_questions,question,picture,questions.test_set_id,one_answer,answer,correct,test_name,answers.id_answers FROM questions LEFT JOIN answers ON (answers.id_questions=questions.id_questions) LEFT JOIN test_type ON (questions.test_set_id=test_type.test_set_id) WHERE questions.id_questions = ' + req.query.id_questions,
            function (error, result) {
                if (error) throw (error);
                res.render('questionSet', {
                    questionSet: JSON.parse(JSON.stringify(result)),
                });
            }

        );

    });
});
app.get('/question-type', function(req, res) {
    admin(req, res, con,function() {
        con.query('SELECT test_set_id, test_name FROM test_type',
            function (error,result) {
                if (error) return error;
                if (result == '') {
                }
                // console.log(JSON.parse(JSON.stringify(result)));
                res.render('typequestions', {Title:'typequestions', questionTypelist: JSON.parse(JSON.stringify(result))});
            });
    });
});
app.get('/questions', function(req, res) {
    admin(req, res, con,function() {
       console.log('это второй вариант');
        //con.query('SELECT id_questions FROM user_has_questions WHERE user_id=')
        con.query('SELECT id_questions, question FROM questions;',
            function (error,result) {
                if (error) return error;
                if (result == '') {
                    // console.log('no users');
                }


                res.render('questions', {questionlist: JSON.parse(JSON.stringify(result))});
            });
    });
});
app.post('/login', function(req, res) {
    let login = sanitizeString(req.body.login);
    let pass = sanitizeString(req.body.password);
    // console.log('==============================');
    // console.log(req.body.login);
    // console.log(req.body.password);
    // console.log('==============================');
    if (login !=='admin') {
       // console.log('user is not an admin');
        let mess = "Неверный логин или пароль!";
        res.render('login', {message1: mess});
        //return false;
    }
    con.query('SELECT*FROM user WHERE login="'+login+'" AND password="'+pass+'"',
        function (error,result){
        if(error) return error;
        if (result == '') {
            console.log('error,user not found');
            let mess = "Неверный логин или пароль!";
            res.render('login', {message1: mess});
           // return false;
        }
        else {
            result = (JSON.parse(JSON.stringify(result)));
            let session = randomInt (1, 100000);
            session = md5(session);
           // console.log(session);
            res.cookie('session',session);
            res.cookie('id',result[0]['user_id']);
            /**
             * write session
             */
            let sql = 'UPDATE user SET session="'+session+'" WHERE user_id='+result[0]['user_id'];
            con.query(sql, function (error, resultQuery){
                if(error) throw error;
               // console.log(resultQuery);
                res.redirect('/admin');
            });
        };
        });
});
app.post('/update-user', function(req, res) {
   admin(req, res, con, function(){
        let counter = 0;
        for (let key in req.body) {
            if (key !== 'user_id' && key!== 'login'&& key!== 'password' && key!== 'name' && key!== 'exam_day') {
                con.query('INSERT INTO user_has_test_type SET user_id='+req.body.user_id+', test_set_id='+key+', switch_quest_type='+req.body[key][0]+' ON DUPLICATE KEY UPDATE switch_quest_type='+req.body[key][0], function(error){
                    if (error) throw (error);
                });
                counter ++;
            };
        };
        con.query('UPDATE user SET name="'+req.body.name+'",login="'+req.body.login+'",password="'+req.body.password+
            '",exam_day="'+req.body.exam_day+'" WHERE user_id='+req.body.user_id)
       // for (let i = 0; i<)
       }
   );
    res.redirect('/users');

});
app.post('/update-question', function(req, res) {
    admin(req, res, con, function(){
        let promise = new Promise(function (resolve, reject) {
            for (let key in req.body) {
                con.query('UPDATE questions SET question  ="' + req.body.question + '",picture="' + req.body.picture + '",test_set_id=' + req.body.test_set_id + ',one_answer='+req.body.one_answer[0]+' WHERE id_questions =' + req.body.id_questions, function (error, result) {
                    if (error) throw (error);
                })
            }
                for (let key in req.body) {
                    let regexp = /answer:[0-9]/
                    let answer = key.match(regexp)
                    //console.log(ma);
                    if (answer !== null){
                        let id_answer = key.split(':');
                       // console.log (req.body[key]);
                            //console.log (req.body[key][1]);
                            con.query('UPDATE answers SET answer  ="'+req.body[key][0]+'",correct='+req.body[key][1]+' WHERE id_answers ='+id_answer[1]+' AND id_questions='+req.body.id_questions, function (error,result){
                                if(error) throw (error);

                            })
                                // console.log(id_answer[1]);
                            //console.log(req.body[key][0])
                    }
                }



        });
        promise.then(res.redirect('/questions'));


            // for (let i = 0; i<)
        }
    );


});
app.post('/add-type-question', function(req, res) {
    admin(req, res, con, function () {
        let promise = new Promise(function (resolve, reject) {
            con.query('SET @AI = (SELECT (1+MAX(test_set_id)) FROM test_type)', function (error, result) {
                if (error) reject (error);
                resolve(result);
            });
        });
        promise.then(function () {
                con.query('INSERT INTO test_type VALUES (@AI,"' + req.body.test_name + '")', function (error, result) {
                    if (error) throw (error);
                    res.redirect('/question-type')
                });
            });

    });
});

app.post('/update-constants', function(req, res) {
    admin(req, res, con, function(){
        fs.writeFileSync("const.js", 'const constQuestAmount='+req.body.questCount+'; module.exports = {constQuestAmount};')
        res.redirect('/const')
        }
    );


});
app.post('/update-question-type', function(req, res) {
    admin(req, res, con, function () {
            con.query('UPDATE test_type SET test_name="' + req.body.test_name + '" WHERE test_set_id=' + req.body.test_set_id),
                function(error){
                if(error) throw (error);
                }
        }
    );
    res.redirect('/question-type');
});
app.post('/download-csv',function(req,res){
    admin(req,res,con, function (){
        console.log('кнопка загрузки нажата')
        let filename;
        let promise = new Promise(function (resolve, reject) {
            filename = 'typequest'+randomInt(5,500);
            con.query('SELECT * FROM test_type INTO OUTFILE \'W:/csv/'+filename+'.csv\' CHARACTER SET \'cp1251\' FIELDS TERMINATED BY \';\';', function(error){
                if (error) reject(error);
                resolve(filename);
            });
        }).then(function(filename){
            res.download('W://csv/'+filename+'.csv');
            return (filename)
        }).then(function(filename){
            function deleteFile(){
                fs.unlink('W://csv/'+filename+'.csv', function(err) {
                    if (err) {
                        return console.error(err);
                    }
                    console.log("File deleted successfully!");
                });
            };
            setTimeout(deleteFile, 1000);
           });
    });
});
app.post ('/download-csv-questions',function(req,res){
    admin(req,res,con, function (){
        console.log('кнопка загрузки нажата')
        let filename;
        let promise = new Promise(function (resolve, reject) {
            filename = 'questions'+randomInt(5,500);
            con.query('SELECT id_questions,question, answer FROM questions LEFT JOIN answers USING (id_questions) INTO OUTFILE \'W:/csv/'+filename+'.csv\' CHARACTER SET \'cp1251\' FIELDS TERMINATED BY \';\';', function(error){
                if (error) reject(error);
                resolve(filename);
            });
        }).then(function(filename){
            res.download('W://csv/'+filename+'.csv');
            return (filename)
        }).then(function(filename){
            function deleteFile(){
                fs.unlink('W://csv/'+filename+'.csv', function(err) {
                    if (err) {
                        return console.error(err);
                    }
                    console.log("File deleted successfully!");
                });
            };
            setTimeout(deleteFile, 1000);
        });
    });
});
app.post('/add-question', function(req,res){
    admin(req,res,con, function (){
        let question = realEscapeString(req.body.questiontodb);
        console.log('eto'+question);
        let promise = new Promise (function(resolve, reject) {
            console.log('INSERT  INTO questions (question, test_set_id, one_answer, picture) VALUES ("'+question+'","'+req.body.typequestiontodb+'",'+req.body.one_answer+',"'+req.body.picture+'")')
            con.query('INSERT  INTO questions (question, test_set_id, one_answer, picture) VALUES ("'+question+'","'+req.body.typequestiontodb+'",'+req.body.one_answer+',"'+req.body.picture+'")', function (error,result) {
                if(error) reject (error)
                resolve (result);
            })
        });
            promise.then(function(result){
                let promise2 =  new Promise(function(resolve, reject){
                   console.log('SELECT MAX(id_questions) FROM questions WHERE question = "'+question+'"');
                con.query('SELECT MAX(id_questions) FROM questions WHERE question = "'+question+'"', function(error,result) {
                    if (error) reject (error);
                    console.log(result);
                    resolve (JSON.parse(JSON.stringify(result)));
                })
                });
                promise2.then(function(result) {
                    let ans = req.body.answer;
                    // console.log(result);
                    // //console.log(result.MAX(id_questions));
                    // console.log(result['0']['MAX(id_questions)']);
                    for (let i = 0; i< req.body.answer.length; i++) {
                        let answer = realEscapeString(ans[i]);
                        if (ans[i] !== "correctanswer" && ans[i + 1] == "correctanswer") {

                            con.query('INSERT INTO answers (answer, id_questions, correct) VALUES ("' + answer + '",' + result['0']['MAX(id_questions)'] + ',' + 1 + ')', function (error, result) {
                                if (error) throw (error);

                            });
                        }
                        else if (ans[i] !== "correctanswer") {
                            con.query('INSERT INTO answers (answer, id_questions, correct) VALUES ("' + answer + '",' + result['0']['MAX(id_questions)'] + ',' + 0 + ')', function (error, result) {
                                if (error) throw (error);

                            });
                        }
                    }
                    res.redirect('/questions');
                })
            });


    });

});

app.get('/select-type-question', function(req,res){
    console.log('запрос принят');
        let promise = new Promise (function(resolve, reject) {
            con.query('SELECT * FROM test_type', function (error, result){
                if(error) return reject (error)
                resolve(result);
            });
        });
        promise.then(function(result){
            res.json(JSON.parse(JSON.stringify(result)));
            console.log(result);

        })
});

/**=========authorizationUser========================*/
app.post('/loginUsers', function(req, res) {
     console.log('==============================');
     let login = sanitizeString(req.body.login);
     let pass = sanitizeString(req.body.password);
     //console.log(req.body);
     //console.log(req.body.login);
     //console.log(req.body.password);
     //console.log('==============================');
    con.query('SELECT*FROM user WHERE login="'+login+'" AND password="'+pass+'"',
        function (error,result){
            result = (JSON.parse(JSON.stringify(result)));
            if(error) return error;
            if (result == '') {
                console.log('error,user not found');
                let mess = "Неверный логин или пароль!";
                res.render('loginUsers', {message1: mess});

            }
               else {
                   let date = new Date(Date.now());
                   let examDateNum = new Date(result[0]['exam_day']);
                   //console.log(date)
                   let examDate = formateDate(result[0]['exam_day']);
                   let between = (examDateNum-date)/86400000;
                    if (between > 3 || between < -1) {
                        let errorText = "Доступ к сдаче экзамена открывается за 3 дня до экзамена и закрывается через 1 день после, дата Вашего экзамена " + examDate;
                        res.render('testerror', {errorText: errorText})
                    } else {
                        result = (JSON.parse(JSON.stringify(result)));
                        let session = randomInt(1, 100000);
                        session = md5(session);
                        res.cookie('session', session, {
                            expires: new Date(Date.now() + 1800000)
                        });
                        res.cookie('id', result[0]['user_id'], {
                            maxAge: 1800000
                        });
                        /**
                         * write session
                         */
                        let sql = 'UPDATE user SET session="' + session + '" WHERE user_id=' + result[0]['user_id'];
                        con.query(sql, function (error, resultQuery) {
                            if (error) throw error;
                            // console.log(resultQuery);
                            res.redirect('/test');
                        });
                    }
                    ;
                };
        });
});
/**=========authorizationUser========================*/


app.post('/receive-answer', function (req,res) {
});
app.post('/get-user-name', function (req, res) {
    if (req.body.id !== 0) {
        con.query('SELECT name FROM user WHERE user_id = "'+ req.body.id + '"', function (error, result, fields) {
            if (error) throw error;
            let user = {};
            for (let i = 0; i < result.length; i++) {
                user[result[i]['name']] = result[i];
            }
            res.json(result);
        });
    }
    else {
        res.send('0');
    }
});
/**==================add new user==========================*/
app.post('/add-user', function (req,res) {
        let promise = new Promise(function (resolve, reject){
            con.query('INSERT INTO `user` (`login`, `password`, `name`) VALUES ("'+req.body['login']+'","'+req.body['password']+'","'+req.body['name']+'");', function (error, result, fields) {
                if (error) reject (error);
                resolve(result);
            });
        });
        let promise2 = new Promise( function (resolve, reject){
            con.query('SELECT test_set_id FROM test_type;',function (error,result2,fields) {
                if(error) reject (error);
                resolve (result2);
            });
        });
        Promise.all([promise,promise2]).then(function(value){
            let testSetId = JSON.parse(JSON.stringify(value['1']));

            for (let i=0; i<testSetId.length; i++) {
                con.query('INSERT INTO user_has_test_type VALUES ((SELECT MAX(user_id) FROM user),"'+testSetId[i].test_set_id+'","1");',
                function (error,result) {
                          if(error) throw (error);
                       }
                )
                };
        });


        res.redirect('/users');
});
app.get('/delete-user', function (req, res) {
    res.render('/user', {});
});
app.post('/delete-user', function (req,res) {
    let id = req.body['user_id'];
    let promise = new Promise (function(resolve, reject){
        con.query('DELETE FROM user WHERE (user_id = '+id+');',
                  function (error, result, fields) {
                    if (error)  reject (error);
                    resolve (result);
                  })
        }
    );
   let promise2 = new Promise( function (resolve, reject){
        con.query('DELETE FROM `user_has_questions` WHERE (`user_id` = '+id+');',
                  function (error, result, fields) {
                    if (error)  reject (error);
                    resolve(result);
                    }
        )
   });

   let promise3 = new Promise( function (resolve, reject){
       con.query('DELETE FROM `user_has_test_type` WHERE (`user_id` = '+id+');',
                 function (error, result, fields) {
                  if (error)  reject (error);
                  resolve(result);
                  }
       )
   });

    Promise.all([promise,promise2,promise3]).then (function(value){

    });

    res.end('user deleted');
});

app.post('/delete-question', function (req,res) {
    let id_questions = req.body['id_questions'];
    let promise = new Promise (function(resolve, reject){
                con.query('DELETE FROM questions WHERE id_questions='+id_questions+';',
                function (error, result, fields) {
                    if (error)  reject (error);
                    resolve (result);
                })
        }
    );

    Promise.all([promise]).then (function(value){

    });

    res.end('question deleted');
});
app.post('/delete-question-type', function (req,res) {
    let test_set_id = req.body['test_set_id'];
    let promise = new Promise (function(resolve, reject){
            con.query('DELETE FROM test_type WHERE test_set_id='+test_set_id+';',
                function (error, result, fields) {
                    if (error)  reject (error);
                    resolve (result);
                })
        }
    );

    Promise.all([promise]).then (function(value){

    });

    res.end('test_set_id deleted');
});

/**==================UserSet настройки пользователя==========================*/

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
function formateDate (date){
    let dateobj= new Date(date);
    let fullDate= dateobj.getDate();
    fullDate+='.';
    if( dateobj.getMonth()<9){
        fullDate+='0';
        fullDate+=dateobj.getMonth()+1;
    } else {fullDate+=dateobj.getMonth()+1};
    fullDate+='.';
    fullDate+=dateobj.getFullYear();

    return (fullDate);
}
function realEscapeString (str) {
    if (typeof (str) == 'string') {
        let result = str.replace(/\"/g,'\\"');
        return (result);

    } else (console.log('it is not a string'))
};
function sanitizeString (str) {
        let result = validator.escape(str);
        result = realEscapeString(result);
        console.log('строка очищена');
        console.log(result);
        return (result);
};
module.exports = app;
