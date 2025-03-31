var express = require("express");
var router = express.Router();
const { getCollections } = require("../helpers/mongoose");
const { Organization } = require("../models/organization.schema");
const { User } = require("../models/user.schema.js");
const { Repo } = require("../models/repo.schema.js");
const { Commit } = require("../models/commit.schema.js");
const { Pull } = require("../models/pull.schema.js");
const { Issue } = require("../models/issue.schema.js");
const { OrgMember } = require("../models/orgMembers.schema.js");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});
router.get("/collections", async function (req, res, next) {
  let response = await getCollections();
  res.send(response);
});
router.get("/collection/:id", async function (req, res, next) {
  const { id } = req.params;
  let resp;
  switch (id) {
    case "organizations":
      resp = await Organization.find().catch(err => err);
      break;
    case "github-integrations":
      resp = await User.find().catch(err => err);
      break;
    case "repos":
      resp = await Repo.find().catch(err => err);
      break;
    case "commits":
      resp = await Commit.find().catch(err => err);
      break;
    case "pulls":
      resp = await Pull.find().catch(err => err);
      break;
    case "issues":
      resp = await Issue.find().catch(err => err);
      break;
    case "orgmembers":
      resp = await OrgMember.find().catch(err => err);
      break;
  }
  res.send(resp);
});

module.exports = router;
