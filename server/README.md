# events-server

## status

[![Build Status](https://travis-ci.org/trivalleycoders-org/rotary-server.svg?branch=master)](https://travis-ci.org/trivalleycoders-org/rotary-server)

## Notes
*See the complete setup instructions at https://github.com/trivalleycoders-org/events-client/edit/master/README.md*

CI is using the yarn.lock file. Therefore, use Yarn and NOT NPM.

## Use

### Start MongoDB server

### Create the users collection
use EventsDev
db.createCollection( "users", {
   validator: { $jsonSchema: {
      bsonType: "object",
      required: [ "email", "hash" ],
      properties: {
          email: {
            bsonType : "string",
            pattern : "@mongodb\.com$",
            description: "must be a string and match the regular expression pattern"
         },
         hash: {
            bsonType: "string",
            description: "must be a string and is required"
         },
         salt: {
            bsonType: "string",
            description: "salt to transform hash"
         }
      }
   } }
} )

### Run server
```
$ yarn start
```
### Run tests
#### once
```
$ yarn test
```
#### or with nodemon
```
$ yarn test-watch
```

### Setup

1) Clone this project
2) Install MongoDB
3) Start MongoDB with
```
$ [path to mongo]/mongod 
```
4) Create the events database (EventsDev) using instructions from [events-client project](https://github.com/trivalleycoders-org/events-client/edit/master/README.md)
5) Start the events-server. It will run on port 3030
```
$ cd [projects path]/events-server
$ yarn install
$ yarn start
```

*Find the complete setup instructions at https://github.com/trivalleycoders-org/events-client/edit/master/README.md*
