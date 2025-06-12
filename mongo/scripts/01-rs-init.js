


log('Start initializing replica set')

const mongoHostname = process.env.MONGO_HOSTNAME
const mongoPort = process.env.MONGO_PORT
const mongoRsName = process.env.MONGO_RS

const rsConfig = {
  _id: mongoRsName,
  version: 1, // must be >= 1
  members: [
    {
      _id: 0,
      // you can access mongo only from this hostname
      host: `${mongoHostname}:${mongoPort}`,
      //host: 'mongo:27017',
      priority: 1,
    },
  ]
}

try {
  rs.status()
  // Apply new config to rs if it was changed
  rs.reconfig(rsConfig)
  log('Replica set was already initialized')
}
catch (ex) {
  rs.initiate(rsConfig)
  log('Replica set was initialized successfully')
}


function log(str) { console.log(`INFO>>>> ${str} { file: 01-rs-init.js }`) }

