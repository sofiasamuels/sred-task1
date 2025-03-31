import * as mongoose from 'mongoose';
import {User} from '../models/user.schema.js'
import { Organization } from '../models/organization.schema.js';
import { Repo } from '../models/repo.schema.js';
import { Commit } from '../models/commit.schema.js';
import { Pull } from '../models/pull.schema.js';
import { Issue } from '../models/issue.schema.js';
import { OrgMember } from '../models/orgMembers.schema.js';
main().catch(err => console.log(err));

export async function main() {
  await mongoose.connect(process.env.MONGO_DB_URL+process.env.MONGO_DB);
  console.log('Db connection successfule')
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}
export async function saveUser(user){
    const userData = new User(user);
    return await userData.save();

}
export async function findUser(id){
  return await User.findOne({login:id});
}
export async function deleteUser(id){
  let resp =await Promise.all([
     Organization.deleteMany({username:id}),
    Repo.deleteMany({username:id}),
     Commit.deleteMany({username:id}),
     User.deleteMany({
      login:id
    }),
     Pull.deleteMany({username:id}),
     Issue.deleteMany({username:id}),
     OrgMember.deleteMany({username:id})
  ])
  return resp;
}
export async function markSyncComplete(id){
 return await User.updateOne({login:id},{syncComplete:true});
  
}
export async function getCollections(){
  let data = Object.keys(mongoose.connections[0].collections).map(coll => {
      let modelName = mongoose.connections[0].collections[coll].modelName
    return {
      name: mongoose.connections[0].collections[coll].name,
      columns: Object.keys(mongoose.connections[0].models[modelName].schema.obj).map(col => col)
    }
  })
  return data;
}
