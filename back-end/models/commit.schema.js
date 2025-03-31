import * as mongoose from "mongoose";
import { userSchema } from "./user.schema.js";
const commitSchema = new mongoose.Schema({
  sha: String,
  node_id: String,
  author: String,
  committer: String,
  repo:String,
  owner:String,
  username:String
});
export const Commit = mongoose.model('commit', commitSchema);
