

console.log('02-rs-create-admin-user.js: INFO: creating admin user')

const rootUserName = process.env.MONGO_ROOT_USERNAME
const rootUserPwd = process.env.MONGO_ROOT_PASSWORD

const adminDb = db.getSiblingDB('admin')

const users = adminDb.getUsers()

if (users.users.find(it=>it.user===rootUserName)){
  console.log(`02-rs-create-admin-user.js: INFO: root user already exists: ${rootUserName}`)
}
else {
  adminDb.createUser({
    user: rootUserName,
    pwd: rootUserPwd,
    roles: ['root'],
  })
  console.log('02-rs-create-admin-user.js: INFO: admin user was created successfully')
}


