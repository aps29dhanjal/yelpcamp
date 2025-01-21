const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground')
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
const campgrounds = require('../controllers/campground');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const {storage,cloudinary}=require('../cloudinary');
const upload = multer({storage});

router.route('/')
  .post(  isLoggedIn,upload.array('image'),validateCampground, catchAsync(campgrounds.createCampground))
    .get(catchAsync(campgrounds.index));
router.get('/new', isLoggedIn, campgrounds.renderNewForm);
router.route('/:id')
    .get(catchAsync(campgrounds.showCampgroundDetailed))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))
    .put(isLoggedIn,isAuthor,upload.array('image'), validateCampground, catchAsync(campgrounds.editCampground));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));
module.exports = router;