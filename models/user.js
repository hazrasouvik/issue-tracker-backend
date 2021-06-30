const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  location: { type: String, required: true },
  mobile: { type: String, required: true },
  customize: {  description: {type: Boolean, default: true},
                severity: {type: Boolean, default: true},
                status: {type: Boolean, default: true},
                createdDate: {type: Boolean, default: true},
                resolvedDate: {type: Boolean, default: true},
                creator: {type: Boolean, default: true},
                lastModifiedBy: {type: Boolean, default: true} }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
