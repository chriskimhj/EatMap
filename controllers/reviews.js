const Spot    = require('../models/spot')
const Review  = require("../models/review");

module.exports.createReview = async(req,res)=>{
  const spot = await Spot.findById(req.params.id);
  const review = new Review(req.body.review);
  review.author = req.user._id;
  spot.reviews.push(review);
  await review.save();
  await spot.save();
  req.flash('success', 'Created new review!')
  res.redirect(`/spots/${spot._id}`);
}

module.exports.deleteReview = async(req,res) => {
  const {id, reviewId} = req.params;
  await Spot.findByIdAndUpdate(id,{$pull:{reviews: reviewId}});         // Removes the reference to the review within the spot
  await Review.findByIdAndDelete(req.params.reviewId);                  // Actually deletes the contents of the review
  req.flash('success','Review Deleted.')
  res.redirect(`/spots/${id}`);
}
