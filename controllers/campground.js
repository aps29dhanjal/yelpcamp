const { cloudinary } = require("../cloudinary");
const Campground = require("../models/campground");
const mbxGeocoding=require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken=process.env.mapBoxToken;
const geoCoder=mbxGeocoding({accessToken:mapBoxToken});

module.exports.index=async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', { campgrounds });
}
module.exports.renderNewForm=(req, res) => {
     res.render("campgrounds/new");
}
module.exports.createCampground=async (req, res) => {
    const geoData=await geoCoder.forwardGeocode({
        query: req.body.location,
        limit: 1
      }).send()
    const camp = new Campground(req.body);
    camp.geometry=geoData.body.features[0].geometry;
    camp.images=req.files.map(f=>({url:f.path, filename:f.filename}))
    camp.author=req.user._id;
    await camp.save();
    req.flash('success',"Successfully made a new campground");
    res.redirect('/campgrounds');
}
module.exports.showCampgroundDetailed=async (req, res) => {
    const camp = await Campground.findById(req.params.id).populate({path:'reviews',populate:{path:'author'}}).populate('author');
    if(!camp){
        req.flash('error',"Cannot find that campground");
         res.redirect('/campgrounds');
    }
    else{
        res.render('campgrounds/show', { camp });
    }
   
}
module.exports.renderEditForm=async (req, res) => {
    const camp = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { camp })
}
module.exports.editCampground=async (req, res) => {
    const camp = await Campground.findByIdAndUpdate(req.params.id, { ...req.body });
    const imgs=req.files.map(f=>({url:f.path, filename:f.filename}))
    camp.images.push(...imgs);
    await camp.save();
    if(req.body.deleteImages){
        for(let img of req.body.deleteImages){
           await cloudinary.uploader.destroy(img) 
        }
        await camp.updateOne({$pull:{images: {filename:{$in:req.body.deleteImages}}}});
    }
    
    req.flash('success', 'Successfully updated campground')
    res.redirect(`/campgrounds/${camp._id}`);
}
module.exports.deleteCampground=async (req, res) => {
    await Campground.findByIdAndDelete(req.params.id);
    res.redirect('/campgrounds');
}