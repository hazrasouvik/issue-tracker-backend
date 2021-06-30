const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
  .then(hash => {
    const user = new User({
      email: req.body.email,
      password: hash,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      location: req.body.location,
      mobile: req.body.mobile,
      customize: req.body.customize
    });
    user.save().then(result => {
      res.status(201).json({
        message: "User created!",
        result: result
      });
    })
    .catch(err => {
      res.status(500).json({
          message: "User already exists!"
      });
    });
  });
}

exports.userLogin = (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
  .then(user => {
    if(!user) {
      return res.status(401).json({
        message: "User not found. Auth failed!"
      });
    }
    fetchedUser = user;
    return bcrypt.compare(req.body.password, user.password) //compares the hashed password stored in database with the entered password. Same input will always yeild in same hash code. Hashed texts can't be de-hashed for us to comapre.
  }).then(result => {
    if(!result) {
      return res.status(401).json({
        message: "Password did not match. Auth failed!"
      });
    }
    const token = jwt.sign({email: fetchedUser.email, userId: fetchedUser._id}, process.env.JWT_KEY, {expiresIn: "1h"});
    res.status(200).json({
      token: token,
      expiresIn: 3600,
      userId: fetchedUser._id
    });
  })
  .catch(err => {
    return res.status(401).json({
      message: "Invalid login credentials!"
    });
    });
}

exports.getUser = (req, res, next) => {
  User.findById(req.params.id).then(user => {
    if(user) {
      res.status(200).json({
        "id": user._id,
        "email": user.email,
        "firstName": user.firstName,
        "lastName": user.lastName,
        "location": user.location,
        "mobile": user.mobile,
        "customize": user.customize
      });
    } else {
      res.status(404).json({
        message: "User not found!"
      });
    }
  }).catch(error => {
    res.status(500).json({
      message: "Failed to fetch user!"
    });
  });
}

exports.updateUser = (req, res, next) => {
  User.updateOne({ _id: req.params.id }, req.body, {new: true}).then(result => {
    if(result.n > 0) {
      res.status(200).json({
        message: "Update successful!"
      });
    } else {
      res.status(401).json({
        message: "You are not authorized for this action!"
      });
    }
  }).catch(error => {
    res.status(500).json({
      message: "Failed to update user details!"
    });
  });
}

exports.deleteUser = (req, res, next) => {
  User.deleteOne({_id: req.params.id }).then(result => {
    if(result.n > 0) {
      res.status(200).json({
        message: "Deletion successful!"
      });
    } else {
      res.status(401).json({
        message: "You are not authorized for this action!"
      });
    }
   }).catch(error => {
    res.status(500).json({
      message: "Failed to delete User!"
    });
  });
}
