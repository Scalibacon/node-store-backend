module.exports = [
  {
    "type": "sqlite",
    "database": "./src/database/database.sqlite",
    "synchronize": false,
    "logging": false,
    "entities": [
      "./src/models/**/*.ts"
    ],
    "migrations": [
      "./src/database/migrations/**/*.ts"
    ],
    "cli": {
      "entitiesDir": "./src/models",
      "migrationsDir": "./src/database/migrations",
      "subscribersDir": "./src/subscribers"
    }
  },
  {
    "name": "test",
    "type": "sqlite",
    "database": "./src/database/test.sqlite",
    "dropSchema": true,
    "synchronize": false,
    "logging": false,
    "migrationsRun": true,
    "entities": [
      "./src/models/**/*.ts"
    ],
    "migrations": [
      "./src/database/migrations/**/*.ts"
    ],
    "cli": {
      "entitiesDir": "./src/models",
      "migrationsDir": "./src/database/migrations",
      "subscribersDir": "./src/subscribers"
    }
  },
]