


log('Creating admin user...')



/*
const rootUserName = process.env.MONGO_ROOT_USERNAME
const rootUserPwd = process.env.MONGO_ROOT_PASSWORD

{
  const adminDb = db.getSiblingDB('admin')
  const users = adminDb.getUsers()
  
  if (users.users.find(it => it.user === rootUserName)) {
    console.log(`02-rs-create-admin-user.js --INFO-- admin user already exists: ${rootUserName}`)
  } else {
    adminDb.createUser({
      user: rootUserName,
      pwd: rootUserPwd,
      roles: ['root'],
    })
    console.log('02-rs-create-admin-user.js --INFO-- admin user was created successfully')
  }
}
*/



/*
{
  const mongoNodeCertRootUserName = 'CN=kupidon.dev.rraindev,OU=MongoDB Server,O=MongoDB'
  
  const externalDb = db.getSiblingDB('$external')
  const users = externalDb.getUsers()
  
  if (users.users.find(it => it.user === mongoNodeCertRootUserName)) {
    console.log(`02-rs-create-admin-user.js --INFO-- mongoNodeCertRootUser already exists: ${mongoNodeCertRootUserName}`)
  } else {
    externalDb.runCommand({
      createUser: mongoNodeCertRootUserName,
      roles: [{ role: "userAdminAnyDatabase", db: "admin" }],
    })
    console.log('02-rs-create-admin-user.js --INFO-- mongoNodeCertRootUser was created successfully')
  }
}
*/


{
  const mongoAdminRootCertClientUserName = process.env.MONGO_ROOT_USERNAME
  
  const externalDb = db.getSiblingDB('$external')
  const users = externalDb.getUsers()
  
  if (users.users.find(it => it.user === mongoAdminRootCertClientUserName)) {
    log(`User mongoAdminRootCertClientUserName already exists: ${mongoAdminRootCertClientUserName}`)
  } else {
    externalDb.runCommand({
      createUser: mongoAdminRootCertClientUserName,
      roles: [{ role: 'root', db: 'admin' }],
    })
    log(`User mongoAdminRootCertClientUserName was created successfully: ${mongoAdminRootCertClientUserName}`)
  }
}



function log(str) { console.log(`INFO>>>> ${str} { file: 02-rs-create-admin-user.js }`) }