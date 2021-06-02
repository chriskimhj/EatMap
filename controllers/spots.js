const Spot = require('../models/spot');
const {cloudinary} = require("../cloudinary");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken:mapBoxToken});

module.exports.index = async (req,res) => {
  const spots = await Spot.find({}).populate('author');
  res.render('spots/index', {spots});
}

module.exports.renderNewForm = (req,res) => {
  res.render('spots/new')
}

module.exports.createSpot = async(req,res,next) => {
  const geoData = await geocoder.forwardGeocode({
    query: req.body.spot.location + ',' + req.body.spot.city,
    limit:1
  }).send();
  const spot = new Spot(req.body.spot);
  spot.geometry = geoData.body.features[0].geometry;
  spot.images = req.files.map(f => ({url: f.path, filename: f.filename}));
  spot.author = req.user._id;
  spot.city = req.body.spot.city;
  spot.priceRating = req.body.spot.priceRating;
  spot.rating = req.body.spot.rating;
  await spot.save();
  console.log(spot);
  req.flash('success','Successfully added a new spot!');
  res.redirect(`/spots/${spot._id}`);
}

module.exports.showSpot = async (req,res) => {
  const spot = await Spot.findById(req.params.id).populate({
    path:'reviews',
    populate:{
      path:'author'
    }
  }).populate('author');
  if(!spot){
    req.flash('error','Cannot find Spot!');
    res.redirect('/spots');
  }
  res.render('spots/show', { spot });
}

module.exports.renderEditForm = async(req,res) => {
  const spot = await Spot.findById(req.params.id)
  if(!spot){
    req.flash('error','Cannot find Spot!');
    res.redirect('/spots');
  }
  res.render('spots/edit', {spot});
}

module.exports.updateSpot = async(req, res) => {
  const {id} = req.params;
  const spot = await Spot.findByIdAndUpdate(id, {...req.body.spot});
  const imgs = req.files.map(f => ({url: f.path, filename: f.filename}));
  spot.images.push(...imgs);
  await spot.save();
  if(req.body.deleteImages){
    for(let filename of req.body.deleteImages){
      await cloudinary.uploader.destroy(filename);
    }
    await spot.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}});
  }

  req.flash('success','Successfully updated Spot!');
  res.redirect(`/spots/${spot._id}`);
}

module.exports.deleteSpot = async(req, res) => {
  const {id} = req.params;
  await Spot.findByIdAndDelete(id);
  req.flash('success','Successfully deleted Spot!')
  res.redirect('/spots');
}
