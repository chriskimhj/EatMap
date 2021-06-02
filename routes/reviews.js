const express = require('express');
const router = express.Router({mergeParams: true});
const {isLoggedIn, validateReview, isSpotReviewAuthor} = require('../middleware')
const Review = require("../models/review");

const ExpressError = require("../utils/ExpressError");
const catchAsync = require('../utils/catchAsync');
const reviews = require('../controllers/reviews');

router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview));

router.delete('/:reviewId', isLoggedIn, isSpotReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;
