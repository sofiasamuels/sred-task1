import * as mongoose from "mongoose";
import { userSchema } from "./user.schema.js";
const repoSchema = new mongoose.Schema({
  id: Number,
  username:String,
  name: String,
  full_name: String,
  owner: String,
  private: Boolean,
  html_url: String,
  description: String,
  fork: Boolean,
  language: String,
  forks_count: Number,
  stargazers_count: Number,
  watchers_count: Number,
  size: Number,
  default_branch: String,
  open_issues_count: Number,
  is_template: Boolean,
  topics: Array,
  archived: Boolean,
  disabled: Boolean,
  visibility: String,
  pushed_at: Date,
  created_at: Date,
  updated_at: Date,
});
export const Repo = mongoose.model('repo', repoSchema);
