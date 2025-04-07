import { Octokit } from "octokit";
import { Organization } from "../models/organization.schema.js";
import { Repo } from "../models/repo.schema.js";
import { Commit } from "../models/commit.schema.js";
import { saveUser } from "./mongoose.js";
import { paginateRest } from "@octokit/plugin-paginate-rest";
import { Pull } from "../models/pull.schema.js";
import { OrgMember } from "../models/orgMembers.schema.js";
import { Issue } from "../models/issue.schema.js";
export async function getUser(authorization) {
  const octokit = new Octokit({
    auth: authorization,
  });
  let user = await octokit.request("GET /user");
  user.data["syncComplete"] = false;
  let resp = await saveUser(user.data);
  return resp;
}
export async function getOrganizations(authorization, username) {
  const octokit = new Octokit({
    auth: authorization,
  });
  let organizations = await octokit.request("GET /user/orgs", {
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  let data = organizations.data.map((org) => {
    org["username"] = username;
    return {
      updateOne: {
        filter: { login: org.login, username: username },
        update: org,
        upsert: true,
      },
    };
  });

  let response = await Organization.bulkWrite(data)
    .then((d) => d)
    .catch((err) => err);
  return organizations.data;
}
export async function getOrganizationMembers(
  authorization,
  organization,
  username
) {
  const octokit = new Octokit({
    auth: authorization,
  });
  let members = await octokit.request("GET /orgs/{org}/members", {
    org: organization,
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  let data = members.data.map((member) => {
    member["username"] = username;
    member["organization_name"] = organization;
    return {
      updateOne: {
        filter: { login: member.login, username: username },
        update: member,
        upsert: true,
      },
    };
  });

  let response = await OrgMember.bulkWrite(data)
    .then((d) => d)
    .catch((err) => err);
  return members.data;
}
export async function getRepos(authorization, organization, username) {
  const octokit = new Octokit({
    auth: authorization,
  });
  let repos = await octokit.request("GET /orgs/{org}/repos", {
    org: organization,
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
  let data = repos.data.map((repo) => {
    let x = repo;
    x["username"] = username;
    
    return x;
  });
  console.log(data);
  let response = await Repo.create(data);
  return response;
}
export async function getCommits(authorization, repo, owner, username) {
  const octokit = octoKitPaginate(authorization);
  let commit = await octokit.paginate(
    "GET /repos/{owner}/{repo}/commits",
    {
      owner: owner,
      repo: repo,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    },
    async (response, done) => {
      let data =await Promise.all( response.data.map(async (commit) => {
        const octokit = new Octokit({
          auth: authorization,
        });
        let pulls = await octokit.request(
          "GET /repos/{owner}/{repo}/commits/{commit_sha}/pulls",
          {
            owner: owner,
            repo: repo,
            commit_sha: commit.sha,
            headers: {
              "X-GitHub-Api-Version": "2022-11-28",
            },
          }
          
        );
        commit['username']=username;
        commit['pulls'] = pulls.data.map(x=> x.number);
        commit['repo']= repo;
        return commit;
      }));
      let dbUpdate = await Commit.create(data);
      console.log("creating" + data.length);
      return dbUpdate;
    }
  );

  return commit;
}
export async function getPulls(authorization, repo, owner, username) {
  const octokit = octoKitPaginate(authorization);
  let pull = await octokit.paginate(
    "GET /repos/{owner}/{repo}/pulls",
    {
      owner: owner,
      repo: repo,
      state: "all",
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    },
    async (response, done) => {
      let data = response.data.map((pull) => {
        pull['repo']=repo;
        pull['username']=username;
        return pull;
      });
      let dbUpdate = await Pull.create(data);
      console.log("creating" + data.length);
      return dbUpdate;
    }
  );

  return pull;
}
export async function getIssues(authorization, repo, owner, username) {
  const octokit = octoKitPaginate(authorization);
  let issueData = await octokit.paginate(
    "GET /repos/{owner}/{repo}/issues",
    {
      owner: owner,
      repo: repo,
      state: "all",
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    },
    async (response, done) => {
      let data = response.data.map((issue) => {
        issue['repo'] =repo;
        issue['username']=username;
        return issue;
      });
      let dbUpdate = await Issue.create(data);
      console.log("creating" + data.length);
      return dbUpdate;
    }
  );

  return issueData;
}
export function octoKitPaginate(authorization) {
  const pageOctokit = Octokit.plugin(paginateRest);
  const octokit = new pageOctokit({
    auth: authorization,
  });
  return octokit;
}
