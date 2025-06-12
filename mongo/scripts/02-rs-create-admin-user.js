

console.log('02-rs-create-admin-user.js --INFO-- creating admin user')

const rootUserName = process.env.MONGO_ROOT_USERNAME
const rootUserPwd = process.env.MONGO_ROOT_PASSWORD
/*

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
  const mongoAdminClientCertRootUserName = 'CN=mongoAdminClient,OU=MongoDB Server,O=MongoDB'
  
  const externalDb = db.getSiblingDB('$external')
  const users = externalDb.getUsers()
  
  if (users.users.find(it => it.user === mongoAdminClientCertRootUserName)) {
    console.log(`02-rs-create-admin-user.js --INFO--mongoAdminClientCertRootUser already exists: ${mongoAdminClientCertRootUserName}`)
  } else {
    externalDb.runCommand({
      createUser: mongoAdminClientCertRootUserName,
      roles: [{ role: "userAdminAnyDatabase", db: "admin" }],
    })
    console.log('02-rs-create-admin-user.js --INFO-- mongoAdminClientCertRootUser was created successfully')
  }
}


