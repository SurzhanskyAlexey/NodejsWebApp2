module.exports = function (req,res, con, callback ) {

    if (req.cookies.id !== '1' || req.cookies.id == undefined) {

        res.redirect('/login');
        return false;
    } else {
        con.query('SELECT*FROM user WHERE user_id='+req.cookies.id+' AND session="'+req.cookies.session+'"',
        function (error,result){
            if(error) throw error;
            // console.log (result);
            if (result == '') {
                console.log('error user not found');
                res.redirect('/login');
            } else {
               // console.log('проверка пройдена');
                callback();
            }

        });
    }
}
