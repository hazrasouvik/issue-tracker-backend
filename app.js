const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const issueRoutes = require('./routes/issues');
const userRoutes = require('./routes/user');

const app = express();
//mongodb+srv://souvik:<password>@issue-tracker-cluster.udqlx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
mongoose.connect("mongodb+srv://souvik:" + process.env.MONGO_ATLAS_PW + "@issue-tracker-cluster.udqlx.mongodb.net/nodeAngularIssueTracker?retryWrites=true&w=majority")
.then(() => {
  console.log('Connected to database!')
})
.catch(() => {
  console.log('Connection failed!')
});

app.use(bodyParser.json());
// app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(express.urlencoded());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
next();
});

app.use("/api/issues", issueRoutes);
app.use("/api/users", userRoutes);

module.exports = app;
