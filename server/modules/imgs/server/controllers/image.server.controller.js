'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  fs = require('fs'),
  Image = mongoose.model('Image'),
  multer = require('multer'),
  FroalaEditor = require(path.resolve('../node_modules/wysiwyg-editor-node-sdk/lib/froalaEditor.js')),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  DIR = './uploads/',
  upload = multer({
    dest: DIR
  }).single('banner');

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function(req, file, cb) {
    var originalname = file.originalname;
    var extension = originalname.split(".");
    var filename = Date.now() + '.' + extension[extension.length - 1];
    cb(null, filename);
  }
});
/* create new folder for image*/
var publicDir = path.join(path.dirname(require.main.filename), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}
var imageDir = path.join(path.dirname(require.main.filename), 'public/images');
if (!fs.existsSync(imageDir)) {
  fs.mkdirSync(imageDir);
}
/**
 * Create an Image
 */

exports.createServer = function(req, res) {
  // Store image.
  FroalaEditor.Image.upload(req, DIR, function(err, data) {
    // Return data.
    //console.log(req);
    if (err) {
      // An error occurred when uploading
      console.log(err);
      return res.status(422).send("an Error occured");
    }
    // No error occured.
  //  console.log(data);
    path = fs.readFileSync(data.link);
    var filePath = data.link;
    var image = new Image({
      data: path,
      path: 'data:image/png;base64,' + path.toString('base64')
    });

    image.save(function(err) {
      if (err) {
        console.log(err);
      }
      else {
        fs.unlinkSync(filePath);// delete the image in server
        console.log("deleted");
      }
    });
    return res.send({ link: image.path });
  });
}
exports.create = function(req, res) {
  // Store image.
  FroalaEditor.Image.upload(req, DIR, function(err, data) {
    // Return data.
    //console.log(req);
    if (err) {
      // An error occurred when uploading
      console.log(err);
      return res.status(422).send("an Error occured");
    }
    // No error occured.
  //  console.log(data);
    path = fs.readFileSync(data.link);
    var filePath = data.link;
    var image = new Image({
      data: path,
      path: 'data:image/png;base64,' + path.toString('base64')
    });

    image.save(function(err) {
      if (err) {
        console.log(err);
      }
      else {
        fs.unlinkSync(filePath);// delete the image in server
        console.log("deleted");
      }
    });
    return res.send(image);
  });
};
/**
 * Show the current image
 */
exports.read = function(req, res, next, id) {
  // convert mongoose document to JSON
  console.log('id', req.params.imageByID);
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'slide is invalid'
    });
  }
  mongoose.set('debug', true);
  Image.findById(id).exec(function (err, image) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.send(image);
    }
  });
};


/**
 * Delete an image
 */
exports.delete = function(req, res) {
  var image = req.image;

  image.remove(function(err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(image);
    }
  });
};

/**
 * List of images
 */
exports.listServer = function(req, res) {

  /*Image.find().sort('-created').populate('user', 'displayName').exec(function(err, images) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(images);
    }
  });
};


exports.imageByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'image is invalid'
    });
  }


  Image.findById(id).populate('user', 'displayName').exec(function(err, image) {
    if (err) {
      return next(err);
    } else if (!image) {
      return res.status(404).send({
        message: 'No image with that identifier has been found'
      });
    }
    req.image = image;
    next();
  });*/
  console.log("listing");

  FroalaEditor.Image.list('public/images/', function(err, data) {

    if (err) {
      return res.status(404).end(JSON.stringify(err));
    }
    console.log(data)
    return res.send(data);
  });
};
exports.list = function(req, res) {

  /*Image.find().sort('-created').populate('user', 'displayName').exec(function(err, images) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(images);
    }
  });
};


exports.imageByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'image is invalid'
    });
  }

  Image.findById(id).populate('user', 'displayName').exec(function(err, image) {
    if (err) {
      return next(err);
    } else if (!image) {
      return res.status(404).send({
        message: 'No image with that identifier has been found'
      });
    }
    req.image = image;
    next();
  });*/
  console.log("listing");

  FroalaEditor.Image.list('public/images/', function(err, data) {

    if (err) {
      return res.status(404).end(JSON.stringify(err));
    }
    console.log(data)
    return res.send(data);
  });
};
exports.imageByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'image is invalid'
    });
  }

  Image.findById(id).populate('user', 'displayName').exec(function(err, image) {
    console.log(id);
    if (err) {
      return next(err);
    } else if (!image) {
      return res.status(404).send({
        message: 'No image with that identifier has been found'
      });
    }
    res.json(image.path);
  });
};
