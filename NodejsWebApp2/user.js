module.exports = function (req,res, con, callback ) {
   //console.log('Это куки1 '+req.cookies.id);
   // console.log('Это куки1 '+req.cookies.session);

    if (req.cookies.id == undefined || req.cookies.session == undefined) {
        res.redirect('/loginUsers');
        return false;
    }
    con.query('SELECT*FROM user WHERE user_id='+req.cookies.id+' AND session="'+req.cookies.session+'"',
        function (error,result){
            if(error) throw error;
         //   console.log (result);
            if (result == '') {
                console.log('error user not found');
                res.redirect('/loginUsers');
            } else {
                callback();
            }

        });
}