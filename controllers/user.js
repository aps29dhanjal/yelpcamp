const User = require('../models/user');
module.exports.logout = (req, res) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
    });
    res.redirect('/login');
}
module.exports.login = async (req, res) => {
    req.flash('success', 'Welcome Back');
    const redirectTo = res.locals.returnUrl || '/campgrounds';
    console.log(redirectTo);
    delete res.locals.returnUrl;
    res.redirect(redirectTo);
}
module.exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, (err) => {
            if (err) {
                next(err);
            }
            else {
                req.flash('success', "Welcome to Campgrounds");
                res.redirect('/campgrounds');
            }
        })
    }
    catch (e) {
        res.redirect('/register');
    }
}
module.exports.loginForm = (req, res) => {
    res.render('users/login');
}
module.exports.registerForm = (req, res) => {
    res.render('users/register');
}