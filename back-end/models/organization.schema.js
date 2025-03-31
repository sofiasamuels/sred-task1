import * as mongoose from 'mongoose';
const organizationSchema = new mongoose.Schema({
  login: String,
  username:String,
  id: Number,
  node_id: String,
  url: String,
  repos_url: String,
  events_url: String,
  hooks_url: String,
  issues_url: String,
  members_url: String,
  public_members_url: String,
  avatar_url: String,
  description: String
});
export const Organization = mongoose.model("organization", organizationSchema);
