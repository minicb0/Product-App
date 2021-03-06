var jwt = require('jsonwebtoken');
const User = require("../models/adminSchema");
const CLIENT_SECRET = process.env.CLIENT_SECRET

// authorizatiion required
const requiredAuth = async (req, res, next) => {
    const token = req.cookies.jwt;

    // check json web token exists and is verified
    if (token) {
        jwt.verify(token, CLIENT_SECRET, (err, decodedToken) => {
            if (err) {
                console.log(err)
                req.flash('message', 'You need to login to access that page!')
                res.redirect('/admin/login')
            } else {
                // console.log(decodedToken)
                next();
            }
        })
    } else {
        req.flash('message', 'You need to login to access that page!')
        res.redirect('/admin/login')
    }
}

//check curent user
const checkUser = (req, res, next) => {
    const token = req.cookies.jwt

    if (token) {
        jwt.verify(token, CLIENT_SECRET, async (err, decodedToken) => {
            if (err) {
                console.log(err);
                res.locals.currentUser = null;
                next();
            } else {
                // console.log(decodedToken)
                let user = await User.findById(decodedToken.id);
                res.locals.currentUser = user;
                next();
            }
        })
    } else {
        res.locals.currentUser = null;
        next();
    }
}

module.exports = { 
    requiredAuth,
    checkUser
}