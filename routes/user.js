const express = require('express');
const router = express.Router();
const passport = require('passport');
const { storeReturnTo } = require('../middleware');
const user = require('../controllers/user')
router.route('/register')
    .get(user.registerForm)
    .post(user.register)
router.route('/login')
    .get(user.loginForm)
    .post(storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), user.login)
router.get('/logout', user.logout)

module.exports = router;