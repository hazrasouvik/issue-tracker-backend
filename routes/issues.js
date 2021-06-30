const express = require('express');


const IssueController = require('../controllers/issues');
const checkAuth = require('../middleware/check-auth');


const router = express.Router();


router.post("", checkAuth, IssueController.createIssue);

router.patch("/:id", checkAuth, IssueController.updateIssue);

router.get("", IssueController.getIssues);

router.get("/:id", IssueController.getIssue);

router.delete("/deleteMultiple", checkAuth, IssueController.deleteMultipleIssues);

router.delete("/:id", checkAuth, IssueController.deleteIssue);


module.exports = router;
