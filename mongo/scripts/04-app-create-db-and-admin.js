

console.log('04-app-create-db-and-admin.js --INFO-- Start creating app db and app db admin')

// move to the admin db - always created in Mongo
db = db.getSiblingDB('admin')


// You need to be logged on your admin base to create new users.
const rootUserName = process.env.MONGO_ROOT_USERNAME
const rootUserPwd = process.env.MONGO_ROOT_PASSWORD
//db.auth(rootUserName, rootUserPwd)
/*
 admin root user can connect as: {
   user: adminUsername,
   pwd: adminPwd,
   db: '' | 'admin',
 }
*/




const appDbName = process.env.MONGO_APP_DB_DATABASE
const appDbUserName = process.env.MONGO_APP_DB_USERNAME
const appDbUserPwd = process.env.MONGO_APP_DB_PASSWORD
// create app database and move to it
const appDb = db.getSiblingDB(appDbName)


const appDbUsers = appDb.getUsers()
if (appDbUsers.users.find(it => it.user === appDbUserName)) {
  console.log(`04-app-create-db-and-admin.js --INFO-- app db user already exists: ${appDbUserName}`)
}
else {
  // create app db user
  appDb.createUser({
    user: appDbUserName,
    pwd: appDbUserPwd,
    roles: [{
      role: 'readWrite',
      db: appDbName,
    }]
  })
  /*
   app db readWrite user can connect as: {
     user: appDbUserName,
     pwd: appDbUserPwd,
     db: appDbName,
   }
  */
  console.log('04-app-create-db-and-admin.js --INFO-- app db user was created successfully')
}



