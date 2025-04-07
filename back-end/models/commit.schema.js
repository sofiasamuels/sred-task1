import * as mongoose from "mongoose";
import { userSchema } from "./user.schema.js";
const commitSchema = new mongoose.Schema({
  sha: String,
  node_id: String,
  author: userSchema,
  committer: userSchema,
  repo:String,
  owner:String,
  username:String,
  repo:String,
  pulls:Array,
  created_at:Date,
  updated_at:Date
});
export const Commit = mongoose.model('commit', commitSchema);
// db.commits.createIndex({"author.login":"text"},{"repo":"text"},{ "committer.login":"text"},{ "sha":"text"})
