var express = require('express'),
    mongoose = require('mongoose'),
    Flickr = require('flickrapi'),
    Q = require('q');
    flickrOptions = {
      api_key: "3c842398c0646952e9f7c88f1eb36945",
      secret: "ee5c137977ebdd86",
      user_id: "94525124@N05"
    };

var db = mongoose.connect('mongodb://localhost/xgolfAPI');

var Course = require("./models/courseModel");

var app = express();

var port = process.env.PORT || 3000;

var holeRouter = express.Router();

var getPhotosWithQ = function (photo_set){
  var deferred = Q.defer();
  var image_ids = [];
  Flickr.tokenOnly(flickrOptions, function(error, flickr) {
    //get all images in test album
    flickr.photosets.getPhotos({
      user_id: flickr.options.user_id,
      page: 1,
      per_page: 500,
      photoset_id: "72157658593998562"
    }, function(err, result) {
      // result is Flickr's response
      if (err){
        console.log(err);
        deferred.reject(err);
      }
      else if (result.photoset && result.photoset.photo){
          for (var i = result.photoset.photo.length - 1; i >= 0; i--) {
            image_ids.push(result.photoset.photo[i].id);
          }
          deferred.resolve(image_ids);
      }
      else {
        //handle when there are no photos in set
      }
    });
  });
  return deferred.promise;
};


//Get images from our flickr album
holeRouter.route("/flickr").get(function(req,res){

  var image_ids = [];
  var response = [];
  var urls = [];
  var promises = [];
  getPhotosWithQ("72157658548002705").then(function(image_ids){
    console.log(image_ids);
    
    for (var i in image_ids){
      promises.push(getAlbumUrl(image_ids[i]));
      console.log("Promise: " + promises);
    }
    Q.all(promises).then(function(dataArr) {
      console.log("dataArr:" + dataArr);
      return dataArr;
    })
    .then(function(dataArr){
      console.log("return response");
       res.json(dataArr);
    });
  });
});

var getAlbumUrl = function(image_id){

  var deferred = Q.defer();
  console.log("testing get single album for " + image_id); 
  Flickr.tokenOnly(flickrOptions, function(error, flickr) {
      flickr.photos.getSizes({
        user_id: flickr.options.user_id,
        page: 1,
        per_page: 500,
        photo_id: image_id
      }, function(err, result) {  
          // result is Flickr's response
          if (err){
            console.log(err);
            deferred.reject(err);
          }
            //TODO: order photoset response

            //Get sizes & urls of all images in set
            
          else {
            //handle when there are no photos in set
            console.log(result + " hello");
            deferred.resolve(result);
          }
        });
    });
  return deferred.promise;
};

holeRouter.route('/holes')
  .get(function(req,res){
    Course.find(function(err, books){
      if(err){
        console.log(err);
      }
      else {
        res.json(books);
      }
    });
  });

app.use('/api', holeRouter);

app.get("/", function(req, res){
 res.send('welcome to my new api');
});

app.listen(port, function(){
  console.log("running on port num: " + port);
});
