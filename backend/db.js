import  { MongoClient } from 'mongodb'

let dbConnection

export function connectToDb (uri, cb) {
    MongoClient.connect(uri)
    .then((client) => {
        dbConnection = client.db()
        return cb()
    })
    .catch(err => {
        console.log(err)
        return cb(err)
    })
}

export function getDb() {
    return dbConnection
}
