var express = require("express");
var router = express.Router();
const {
  getCollections,
  getTotalCount,
  getMomentData,
} = require("../helpers/mongoose");
const { Organization } = require("../models/organization.schema");
const { User } = require("../models/user.schema.js");
const { Repo } = require("../models/repo.schema.js");
const { Commit } = require("../models/commit.schema.js");
const { Pull } = require("../models/pull.schema.js");
const { Issue } = require("../models/issue.schema.js");
const { OrgMember } = require("../models/orgMembers.schema.js");
const { parseData } = require("../helpers/dataParsing.helper.js");
const {
  searchQueryBuilder,
} = require("../helpers/searchQueryBuilder.helper.js");
/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});
router.get("/collections", async function (req, res, next) {
  let response = await getCollections();
  res.send(response);
});
//pass id of collection in param and search text in query param
router.get("/collection/:id", async function (req, res, next) {
  const { id } = req.params;
  let { search, page, pageLength, startDate, endDate } = req.query;
  page = parseInt(page);
  pageLength = parseInt(pageLength);
  if (page && page <= 0) {
    page = 1;
  }
  if (!pageLength) pageLength = 10;

  let query = {};
  if (search) query["$text"] = { $search: search };
  if (startDate && endDate) {
    if (id === "commits") {
      query["author.date"] = {
        $gte: new Date(startDate),
        $lt: new Date(endDate),
      };
    }
    query["created_at"] = { $gte: new Date(startDate), $lt: new Date(endDate) };
  } else if (startDate) {
    if (id === "commits") {
      query["author.date"] = { $gte: new Date(startDate) };
    } else {
      query["created_at"] = { $gte: new Date(startDate) };
    }
  } else if (endDate) {
    if (id === "commits") {
      query["author.date"] = { $lt: new Date(endDate) };
    } else {
      query["created_at"] = { $lt: new Date(endDate) };
    }
  }
  let totalCount = await getTotalCount(id, query).catch((err) => {
    res.status(500).json({ message: "Error connecting db :" + err });
  });
  let resp;
  let pageCount;
  if (totalCount) {
    pageCount = Math.ceil(totalCount / pageLength);
    page = parseInt(page);

    if (page > pageCount) {
      page = pageCount;
    }

    try {
      switch (id) {
        case "organizations":
          resp = await Organization.find(query)
            .lean()
            .catch((err) => err);
          break;
        case "github-integrations":
          resp = await User.find(query)
            .lean()
            .catch((err) => err);
          break;
        case "repos":
          resp = await Repo.find(query)
            .lean()
            .catch((err) => err);
          break;
        case "commits":
          resp = await Commit.find(query)
            .skip(page * pageLength - pageLength)
            .limit(pageLength)
            .lean()
            .catch((err) => err);
          break;
        case "pulls":
          resp = await Pull.find(query)
            .skip(page * pageLength - pageLength)
            .limit(pageLength)
            .lean()
            .catch((err) => err);
          break;
        case "issues":
          resp = await Issue.find(query)
            .skip(page * pageLength - pageLength)
            .limit(pageLength)
            .lean()
            .catch((err) => err);
          break;
        case "orgmembers":
          resp = await OrgMember.find(query)
            .lean()
            .catch((err) => err);
          break;
      }
    } catch (err) {
      res.status(500).json({ message: "Error querying db : " + err });
    }
  }
  if (resp) {
    let dataToSend = {
      page: page,
      totalCount: totalCount,
      pageCount: pageCount,
      columns: parseData(resp).columns,
      rows: parseData(resp).data,
    };
    res.send(dataToSend);
  }
});
router.get("/collection/issue/:no", async function (req, res, next) {
  const { no } = req.params;

  let resp = await Issue.find({ number: no })
    .lean()
    .catch((err) => err);

  res.send(resp);
});

router.get("/collections/all", async function (req, res, next) {
  let data = await getMomentData();

  res.send(
    data.map((repo) => {
      return {
        name: repo.name,
        children: repo.children?.map((commit) => {
          return {
            name: commit.sha,
            type: "commit",
            url: commit.html_url,
            children: repo.pulls.filter(
              (pull) => commit.pulls.indexOf(pull.number) > -1
            ),
          };
        }),
        //pulls:repo.pulls?.map(x=> x.number),
        //issues: x.issues?.map(x => x.number)
      };
    })
  );
});
router.get("/globalsearch", async function (req, res, next) {
  let { search, page, pageLength, startDate, endDate } = req.query;

  let data = await Promise.all([
    searchQueryBuilder("commits", page, pageLength, startDate, endDate, search),
    searchQueryBuilder("pulls", page, pageLength, startDate, endDate, search),
    searchQueryBuilder("issues", page, pageLength, startDate, endDate, search),
    searchQueryBuilder("repos", page, pageLength, startDate, endDate, search),
    searchQueryBuilder(
      "organizations",
      page,
      pageLength,
      startDate,
      endDate,
      search
    ),
    searchQueryBuilder(
      "github-integrations",
      page,
      pageLength,
      startDate,
      endDate,
      search
    ),
    searchQueryBuilder(
      "orgmembers",
      page,
      pageLength,
      startDate,
      endDate,
      search
    ),
  ]);
  res.send({
    commits: data[0],
    pulls: data[1],
    issues: data[2],
    repos: data[3],
    organizations: data[4],
    githubIntegrations: data[5],
    orgMembers: data[6],
  });
});
module.exports = router;
