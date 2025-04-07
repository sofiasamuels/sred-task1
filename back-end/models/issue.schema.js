import * as mongoose from "mongoose";
import { userSchema } from "./user.schema.js";

const issueSchema = new mongoose.Schema({
  id: Number,
  node_id: String,
  html_url: String,
  issue_url:String,
  number:Number,
  state:String,
  title:String,
  body:String,
  user: userSchema,
  created_at:Date,
  updated_at:Date,
  closed_at:Date,
  assignee:userSchema,
  assignees:{type:Array, default:[]},
  state_reason:String,
  closed_by:userSchema,
  username:String,
  repo:String,
});
export const Issue = mongoose.model('issue', issueSchema);
//db.issues.createIndex({"user.login":"text"},{"repo":"text"},{ "assignee.login":"text"},{ "closed_by.login":"text"})