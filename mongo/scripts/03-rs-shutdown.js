

log('Starting shutdown')

// move to the admin db - always created in Mongo
db = db.getSiblingDB('admin')

// Log as root admin if you decided to authenticate in your docker-compose file...
// You need to be logged on your admin base to create new users.
const rootUserName = process.env.MONGO_ROOT_USERNAME
const rootUserPwd = process.env.MONGO_ROOT_PASSWORD
//db.auth(rootUserName, rootUserPwd)

// Send shutdown command and wait for it completes
// Connection will be closed, and it triggers connection error.
try {
  //db.adminCommand({ shutdown: 1 })
  db.shutdownServer()
}
catch (ex) {
  if (ex.name === 'MongoNetworkError' && ex.message.match(/^connection.+closed$/)) {
    // It is ok
    // MongoNetworkError: connection 1 to 127.0.0.1:27017 closed
  }
  else throw ex
}

log('Shutdown completed')



function log(str) { console.log(`INFO>>>> ${str} { file: 03-rs-shutdown.js }`) }