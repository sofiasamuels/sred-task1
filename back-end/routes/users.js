var express = require("express");
var router = express.Router();
var axios = require("axios");
const { saveUser, deleteUser,markSyncComplete, findUser } = require("../helpers/mongoose");
const { getUser, getOrganizations, getOrganizationMembers, getRepos, getCommits, getPulls, getIssues } = require("../helpers/git.helper");

/* GET users listing. */
router.get("/", async function (req, res, next) {
  let user = await getUser(req.headers.authorization);
  let organizationResp = await getOrganizations(
    req.headers.authorization,
    user.login
  ); 
  let repoResp =  await Promise.all(organizationResp.map(async org => 
    getRepos(req.headers.authorization, org.login,user.login),
   ));
   let memberResp = await Promise.all(organizationResp.map(async org => 
    getOrganizationMembers(req.headers.authorization, org.login,user.login )
   ));
  let commitResp =  Promise.all(repoResp.flat(1).map(async repository => {
     await Promise.all([
      getCommits(req.headers.authorization, repository.name,repository.owner, user.login),
      getPulls(req.headers.authorization, repository.name,repository.owner, user.login),
      getIssues(req.headers.authorization, repository.name,repository.owner, user.login)])
      
  })).then(async resp => {
    let pullrequests = await getPulls(req.headers.authorization, 'moment','moment',user.login);
    let issues = await getIssues(req.headers.authorization, 'moment','moment',user.login);
    let dbUpdate = await markSyncComplete(user.login);
    console.log('Syncing complete for '+ user.login+ JSON.stringify(dbUpdate));
  });

  res.send(user);
});
router.get('/syncstatus/:id', async function(req,res,next) {
  const {id} =req.params;
  let user = await findUser(id);
  res.send(user);
})
router.delete("/:id", async function (req, res, next) {
  const { id } = req.params;
  let resp = await deleteUser(id);
  console.log(resp);
  res.send(resp);
});

module.exports = router;
