import * as mongoose from "mongoose";
import { userSchema } from "./user.schema.js";
const pullSchema = new mongoose.Schema({
  id: Number,
  url:String,
  issue_url:String,
  node_id: String,
  html_url: String,
  issue_url:String,
  number:Number,
  state:String,
  title:String,
  body:String,
  user: userSchema,
  labels:Array,
  created_at:Date,
  updated_at:Date,
  closed_at:Date,
  merged_at:Date,
  merge_commit_sha:String,
  assignee:userSchema,
  assignees:{ type : Array , "default" : [] },
  requested_reviewers:{ type : Array , "default" : [] },
  username:String,
  repo:String,
});
export const Pull = mongoose.model('pull', pullSchema);
//db.pulls.createIndex({"user.login":"text"},{"repo":"text"},{ "assignee.login":"text"},{ "closed_by.login":"text"})