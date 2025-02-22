const Campground=require('./models/campground')
const ExpressError=require('./utils/ExpressError');
const {reviewSchema,campgroundSchema}= require('./schema');
const Review = require('./models/review');
module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.returnTo=req.originalUrl;
        req.flash('error','You must be signed in');
       return  res.redirect('/login');
    }
    else{
        next();
    }

};
module.exports.storeReturnTo=(req,res,next)=>{
    if(req.session.returnTo){
        res.locals.returnUrl= req.session.returnTo;
    }
    next();
}
module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }

}

module.exports.isAuthor=async(req,res,next)=>{
    const{id}=req.params;
    const camp = await Campground.findById(id);
    if(!camp){
        req.flash("error", "Campground not found");
        return res.redirect(`/campgrounds`);
    }
    else if(!(camp.author.equals(req.user._id))){
     req.flash("error", "You don't have permission to do that");
     return res.redirect(`/campgrounds/${id}`);
    }
    next();
}
module.exports.isReviewAuthor=async(req,res,next)=>{
    const{reviewId,id}=req.params;
    const review = await Review.findById(reviewId);
    if( !(review.author.equals(req.user._id))){
     req.flash("error", "You don't have permission to do that");
     return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.validateReview=(req,res,next)=>{
    const {error}=reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
}