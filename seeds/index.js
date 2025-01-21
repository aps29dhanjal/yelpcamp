const mongoose=require('mongoose')  ;
const Campground=require('../models/campground');
const cities= require('./cities');
const {descriptors,places}=require('./seedHelpers');

mongoose.connect('mongodb://localhost:27017/yelp-camp');
const db=mongoose.connection;
db.on("error",console.error.bind(console,"connection error"));
db.once("open",()=>{
    console.log("database connected");
})

const sample=array=> array[Math.floor(Math.random() * array.length)];
 const seedDb=async()=>{
   await Campground.deleteMany({});
   for(let i=0;i<50;i++){
    const random1000=Math.floor(Math.random()*1000);
    const camp=new Campground({
        author:'6789df074c401e763885f527',
        location: `${cities[random1000].city}, ${cities[random1000].state}`,
        title: `${sample(descriptors)}, ${sample(places)}`,
        price : 13,
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus minus nesciunt tenetur laboriosam asperiores pariatur in ducimus perspiciatis dolor nobis ut, quo accusamus sed facere cupiditate similique tempora facilis corrupti?",
        images: [{
          url:'https://res.cloudinary.com/djmkkkv7t/image/upload/v1737407257/yelpCamp/nofru0ddcefgifgvzqvo.jpg',
          filename: "file"
        }],
        geometry:{
          type:'Point',
          coordinates:[cities[random1000].longitude,cities[random1000].latitude]
        }
         

    })
    await camp.save();
   }

 }
 seedDb().then(()=>{
  mongoose.connection.close();
 })