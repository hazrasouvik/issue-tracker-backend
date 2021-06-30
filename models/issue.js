const mongoose = require('mongoose');

const issueSchema = mongoose.Schema({
  description: { type: String, required: true },
  severity: { type: String, required: true },
  status: { type: String, required: true },
  createdDate: { type: Date, required: true },
  resolvedDate: { type: Date },
  issueViewCount: { type: Number, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  lastModifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

module.exports = mongoose.model('Issue', issueSchema);
