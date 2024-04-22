

console.log('03-rs-shutdown.js: INFO: Starting shutdown')

// move to the admin db - always created in Mongo
db = db.getSiblingDB('admin')

// Log as root admin if you decided to authenticate in your docker-compose file...
// You need to be logged on your admin base to create new users.
const rootUserName = process.env.MONGO_ROOT_USERNAME
const rootUserPwd = process.env.MONGO_ROOT_PASSWORD
db.auth(rootUserName, rootUserPwd)

// Send shutdown command and wait for it completes
// Connection will be closed, and it triggers connection error.
try {
  db.adminCommand({ shutdown: 1 })
}
catch (ex){
  if (ex.name==='MongoNetworkError' && /^connection.+closed$/.test(ex.message)){
    // It is ok
    // MongoNetworkError: connection 1 to 127.0.0.1:27017 closed
    
    //console.log("SHUTDOWN COMPLETED", ex)
    //console.log("SHUTDOWN COMPLETED name", ex.name)
    //console.log("SHUTDOWN COMPLETED message", ex.message)
  }
  else throw ex
}

console.log('03-rs-shutdown.js: INFO: Shutdown completed')

