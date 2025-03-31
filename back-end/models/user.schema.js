import * as mongoose from 'mongoose';
export const userSchema = new mongoose.Schema({
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
  private_gists: Number,
  total_private_repos: Number,
  owned_private_repos: Number,
  disk_usage: Number,
  collaborators: Number,
  two_factor_authentication: Boolean,
  syncedDate:{
    type:Date, default:Date.now
  },
  syncComplete: Boolean
});
export const User = mongoose.model("github-integration", userSchema);
