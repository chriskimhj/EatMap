const mongoose  = require('mongoose');
const Schema    = mongoose.Schema;
const Review    = require('./review')

const ImageSchema = new Schema({
  url:String,
  filename:String
});

ImageSchema.virtual('thumbnail').get(function() {
  return this.url.replace('/upload', '/upload/w_200');
});

const opts = {toJSON:{virtuals:true}};

const SpotSchema = new Schema({
  title:String,
  images: [ImageSchema],
  geometry: {
    type:{
      type:String,
      enum:['Point'],
      required: true
    },
    coordinates:{
      type:[Number],
      required:true
    }
  },
  priceRating: Number,
  rating: Number,
  description:String,
  location:String,
  city:String,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Review'
    }
  ]
}, opts);

SpotSchema.virtual('properties.popUpMarkup').get(function() {
  return `
    <link rel="stylesheet" href="/stylesheets/stars.css">
    <h6><strong>${this.title}<strong></h6>
    <div class="d-grid gap-2 d-md-flex justify-content-center">
      <p class="starability-result" data-rating="${this.rating}">Rated: ${this.rating}</p>
    </div>
    <div class="d-grid gap-2 d-md-flex justify-content-center">
      <p>${this.location}</p>
    </div>
    <div class="d-grid gap-2 d-md-flex justify-content-center">
      <a class="btn btn-primary btn-sm" href="/spots/${this._id}">VIEW</a>
    </div>
  `
});

SpotSchema.post('findOneAndDelete', async function (doc) {
  if(doc){
    await Review.deleteMany({
      _id:{
        $in: doc.reviews
      }
    })
  }
})

module.exports = mongoose.model('Spot', SpotSchema);
