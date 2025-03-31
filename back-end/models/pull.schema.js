import * as mongoose from "mongoose";
const pullSchema = new mongoose.Schema({
  id: Number,
  node_id: String,
  html_url: String,
  issue_url:String,
  number:Number,
  state:String,
  title:String,
  body:String,
  user: String,
  created_at:Date,
  updated_at:Date,
  closed_at:Date,
  merged_at:Date,
  merge_commit_sha:String,
  assignee:String,
  assignees:String,
  requested_reviewers:String,
  username:String
});
export const Pull = mongoose.model('pull', pullSchema);
