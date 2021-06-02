const mongoose = require('mongoose');
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers')
const Spot = require('../models/spot');

mongoose.connect('mongodb://localhost:27017/eatcode',{
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
})

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", ()=> {
  console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async() => {
  await Spot.deleteMany({});
  for(let i = 0; i < 6; i++){
    const random6 = Math.floor(Math.random()*6);
    const price = Math.floor(Math.random() * 20) + 10;
    const spot = new Spot({
      // YOUR USER ID
      author: '6089e21f4a53ae27246e2b48',
      location: `${cities[random6].city}, ${cities[random6].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      price,
      geometry:{
        type:"Point",
        coordinates:[
          cities[random6].longitude,
          cities[random6].latitude
        ]
      },
      images: [
        {
          url: 'https://res.cloudinary.com/dnaameeyf/image/upload/v1618853362/EatCode/photo-1504113888839-1c8eb50233d3_c24mzw.jpg',
          filename: 'EatCode/photo-1504113888839-1c8eb50233d3_c24mzw'
        },
        {
          url: 'https://res.cloudinary.com/dnaameeyf/image/upload/v1618853299/EatCode/photo-1414235077428-338989a2e8c0_f93lyl.jpg',
          filename: 'EatCode/photo-1414235077428-338989a2e8c0_f93lyl'
        }
      ]
    })
    await spot.save();
  }
}

seedDB().then(() => {
  mongoose.connection.close();
console.log("Connection Closed");
});
