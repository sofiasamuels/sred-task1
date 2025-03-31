import * as mongoose from 'mongoose';
export const OrgMemberSchema = new mongoose.Schema({
  login: String,
  id: Number,
  node_id: String,
  avatar_url: String,
  gravatar_id: String,
  html_url: String,
  type: String,
  site_admin: Boolean,
  name: String,
  company: String,
  blog: String,
  location: String,
  email: String,
  hireable: Boolean,
  bio: String,
  twitter_username: String,
  public_repos: Number,
  public_gists: Number,
  followers: Number,
  following: Number,
  created_at: Date,
  updated_at: Date,
  username:String,
  organization_name:String
});
export const OrgMember = mongoose.model("orgmember", OrgMemberSchema);
