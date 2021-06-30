const Issue = require('../models/issue');
const User = require('../models/user');

exports.createIssue = (req, res, next) => {
  const issue = new Issue({
    description: req.body.description,
    severity: req.body.severity,
    status: req.body.status,
    createdDate: req.body.createdDate,
    resolvedDate: req.body.resolvedDate,
    issueViewCount: req.body.issueViewCount,
    creator: req.userData.userId,
    lastModifiedBy: req.body.lastModifiedBy
  });
  issue.save().then(createdIssue => {
    res.status(201).json({
      message: "Issue Added successfully",
      issue: {
        id: createdIssue._id,
        description: createdIssue.description,
        severity: createdIssue.severity,
        status: createdIssue.status,
        createdDate: createdIssue.createdDate,
        resolvedDate: createdIssue.resolvedDate,
        issueViewCount: createdIssue.issueViewCount,
        creator: createdIssue.creator,
        lastModifiedBy: createdIssue.lastModifiedBy
      }
    });
  })
  .catch(error => {
    res.status(500).json({
      message: "Failed to create issue!"
    });
  });
};

exports.updateIssue = (req, res, next) => {
  Issue.updateOne({ _id: req.params.id }, req.body, {new: true}).then(result => {
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
      message: "Failed to update issue!"
    });
  });
};

exports.getIssues = (req, res, next) => {
  const pageSize = +req.query._limit;
  const currentPage = +req.query._page;
  const sortBy = req.query._sort;
  const order = req.query._order
  const issueQuery = Issue.find();
  let fetchedIssues;
  if ( pageSize && currentPage ) {
    issueQuery
    .skip(pageSize * (currentPage - 1))
    .limit(pageSize);
  }
  else if ( sortBy && order ) {
    if( order === "desc" ) {
      issueQuery
      .sort({"issueViewCount": -1})
    }
    else if( order === "asc" ) {
      issueQuery
      .sort({"issueViewCount": 1})
    }
  }
  issueQuery.then(documents => {
    fetchedIssues = documents;
    return Issue.count();
  }).then(count => {
    res.status(200).json({
      message: "Issues fetched successfully!",
      issues: fetchedIssues,
      maxIssues: count
    });
  })
  .catch(error => {
    res.status(500).json({
      message: "Failed to fetch issues!"
    });
  });
};

exports.getIssue = (req, res, next) => {
  Issue.findById(req.params.id).then(issue => {
    if(issue) {
      res.status(200).json(issue);
    } else {
      res.status(404).json({
        message: "Issue not found!"
      });
    }
  }).catch(error => {
    res.status(500).json({
      message: "Failed to fetch issue!"
    });
  });
};

exports.deleteIssue = (req, res, next) => {
  Issue.deleteOne({_id: req.params.id }).then(result => {
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
     message: "Failed to delete issue!"
   });
 });
 };

 exports.deleteMultipleIssues = (req, res, next) => {
  var arr = JSON.parse(req.query.ids);
  if(arr) {
    Issue.deleteMany(
      {
        _id: {
          $in: arr
        }
      }).then(result => {
        if(result.n === arr.length) {
          res.status(200).json({
            message: result.n + " issues deletion successful!"
          });
        } else {
          res.status(401).json({
            message: "You are not authorized for multiple deletion!"
          });
        }
      }).catch(error => {
        res.status(500).json({
          message: "Failed to delete many issues!"
        });
      });
  }
 }

