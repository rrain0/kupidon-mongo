

console.log('01-rs-init.js: INFO: start initializing replica set')

const mongoHostname = process.env.MONGO_HOSTNAME
const mongoPort = process.env.MONGO_PORT

try {
  rs.status()
  console.log('01-rs-init.js: INFO: replica set was already initialized')
}
catch (ex){
  const config = {
    _id: 'rs0',
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
  rs.initiate(config)
  console.log('01-rs-init.js: INFO: replica set was initialized successfully')
}



