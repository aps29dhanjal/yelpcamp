if(process.env.NODE_ENV!=='production'){
    require('dotenv').config()
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const campgroundsRoutes=require('./routes/campground');
const reviewsRoutes=require('./routes/review');
const userRoutes=require('./routes/user');
const ExpressError = require('./utils/ExpressError');
const session =require('express-session');
const flash=require('connect-flash');
const passport=require('passport');
const localStrategy=require('passport-local');
const User=require('./models/user');
const mongoSanitize = require('express-mongo-sanitize');
const helmet=require("helmet");
const MongoStore = require('connect-mongo');
const secret= process.env.secret || 'thisshouldbeabettersecret';
const dBUrl=process.env.dbUrl|| 'mongodb://localhost:27017/yelp-camp';

mongoose.connect(dBUrl);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
    console.log("database connected");
})
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
app.use(mongoSanitize());
const store = MongoStore.create({
    mongoUrl: dBUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret
}});
store.on('error',function(e){
    console.log(e)
});
app.use(session({store,name:'session', secret,resave:false,saveUninitialized:true,cookie:{ httpOnly:true,secure:true,expires:Date.now()+ 1000*60*60*24*7}}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com",
    "https://api.tiles.mapbox.com",
    "https://api.mapbox.com",
    "https://kit.fontawesome.com",
    "https://cdnjs.cloudflare.com",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com",
    "https://stackpath.bootstrapcdn.com",
    "https://api.mapbox.com",
    "https://api.tiles.mapbox.com",
    "https://fonts.googleapis.com",
    "https://use.fontawesome.com",
     "https://cdn.jsdelivr.net"
];
const connectSrcUrls = [
    "https://api.mapbox.com",
    "https://events.mapbox.com",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            childSrc: ["blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/djmkkkv7t/", 
                "https://images.unsplash.com",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash('error');
    res.locals.currentUser=req.user;
    next();
})
app.use('/',userRoutes);
app.use('/campgrounds',campgroundsRoutes);
app.use('/campgrounds/:id/review',reviewsRoutes);


app.get('/', (req, res) => {
    res.render('home');
});

app.all('*', (req, res, next) => {
    next(new ExpressError("Page not found", 404))
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Something went wrong";
    res.status(statusCode).render('error', { err });

})

app.listen(3000, () => {
    console.log("running on 3000");
});


