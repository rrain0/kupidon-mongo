

const appDbName = process.env.MONGO_APP_DB_DATABASE
const appDbUserName = process.env.MONGO_APP_DB_USERNAME
const appDbUserPwd = process.env.MONGO_APP_DB_PASSWORD

// use kupidon
db = db.getSiblingDB(appDbName)
db.auth(appDbUserName, appDbUserPwd)



db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      title: "User object validation",
      // reject non-described properties
      additionalProperties: false,
      required: [
        "id",
        "roles", "email", "pwd", "created", "updated",
        "name", "birthDate", "gender", "aboutMe", "photos",
      ],
      properties: {
        _id: { bsonType: "objectId" },
        id: {
          bsonType: "binData",
          description: "UUID",
        },
        roles: {
          bsonType: "array",
          items: {
            enum: ['ADMIN'],
            uniqueItems: true,
          },
          description: "('ADMIN')[]"
        },
        email: {
          bsonType: "string",
          maxLength: 100,
        },
        pwd: {
          bsonType: "string",
          maxLength: 200,
        },
        created: {
          bsonType: "date",
          description: "example: ISODate('2023-07-04T14:40:21.014+04:00')",
        },
        updated: {
          bsonType: "date",
          description: "example: ISODate('2023-07-04T14:40:21.014+04:00')",
        },
        name: {
          bsonType: "string",
          maxLength: 100,
        },
        birthDate: {
          bsonType: "date",
          description: "example: ISODate('2000-12-12')",
        },
        gender: {
          enum: ["MALE","FEMALE"],
          description: "'MALE' | 'FEMALE'"
        },
        aboutMe: {
          bsonType: "string",
          maxLength: 2000,
        },
        photos: {
          bsonType: "array",
          maxItems: 6,
          items: {
            bsonType: "object",
            additionalProperties: false,
            required: [
              "id", "index",
              "name", "mimeType", "binData",
            ],
            properties: {
              _id: { bsonType: "objectId" },
              id: {
                bsonType: "binData",
                description: "UUID",
              },
              index: {
                bsonType: "int",
                minimum: 0,
                maximum: 5,
              },
              name: {
                bsonType: "string",
                maxLength: 256,
              },
              mimeType: {
                bsonType: "string",
                maxLength: 100,
              },
              binData: {
                bsonType: "binData",
              }
            },
          },
        },

        transactions: {
          bsonType: "object",
          additionalProperties: true,
          properties: {
            emailInitialVerification: { bsonType: "object" }
          }
        },
      }
    }
  }
})





db.users.createIndex({ email: 1 }, { name: "email", unique: true })
db.users.createIndex({ id: 1 }, { name: "id", unique: true })


