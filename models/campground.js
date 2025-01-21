const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;
const imageSchema = new Schema({
    url: String,
    filename: String
})
imageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200')
})
const opts={toJSON:{virtuals:true}};
const CampgroundSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    price:
    {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },

    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    images: [imageSchema],
    location: {
        type: String,
        required: true,
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }]
    , author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
},opts);
CampgroundSchema.virtual('properties.markupText').get(function(){
    return `<a href='/campgrounds/${this._id}' >${this.title}</a>`
})
CampgroundSchema.post('findOneAndDelete', async function (data) {
    if (data) {
        await Review.deleteMany({
            _id: { $in: data.reviews }
        })
    }
})

module.exports = mongoose.model('Campground', CampgroundSchema);
