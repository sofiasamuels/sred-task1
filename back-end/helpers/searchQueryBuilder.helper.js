import {getTotalCount}  from './mongoose.js';
import { Organization } from "../models/organization.schema.js";
import { User } from"../models/user.schema.js";
import { Repo } from "../models/repo.schema.js";
import { Commit } from"../models/commit.schema.js";
import { Pull } from"../models/pull.schema.js";
import { Issue } from"../models/issue.schema.js";
import { OrgMember } from"../models/orgMembers.schema.js";
import {parseData} from './dataParsing.helper.js';
export async function searchQueryBuilder(collection, page =1, pageLength, startDate, endDate, search){
     page = parseInt(page);
      pageLength = parseInt(pageLength);
      if (page && page <= 0) {
        page = 1;
      }
      if (!pageLength) pageLength = 10;
    
      let query = {};
      if (search) query["$text"] = { $search: search };
      if (startDate && endDate) {
        if (collection === "commits") {
          query["author.date"] = {
            $gte: new Date(startDate),
            $lt: new Date(endDate),
          };
        }
        query["created_at"] = { $gte: new Date(startDate), $lt: new Date(endDate) };
      } else if (startDate) {
        if (collection === "commits") {
          query["author.date"] = { $gte: new Date(startDate) };
        } else {
          query["created_at"] = { $gte: new Date(startDate) };
        }
      } else if (endDate) {
        if (collection === "commits") {
          query["author.date"] = { $lt: new Date(endDate) };
        } else {
          query["created_at"] = { $lt: new Date(endDate) };
        }
      }
      let totalCount = await getTotalCount(collection, query).catch((err) => {
         throw err;
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
          switch (collection) {
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
          throw err ;
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
        return dataToSend;
      }
}