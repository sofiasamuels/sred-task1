import * as mongoose from "mongoose";
const issueSchema = new mongoose.Schema({
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
  assignee:String,
  assignees:String,
  state_reason:String,
  closed_by:String,
  username:String
});
export const Issue = mongoose.model('issue', issueSchema);
