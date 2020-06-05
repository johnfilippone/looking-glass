'use strict'

import mongodb from 'mongodb';
const mongoClient = mongodb.MongoClient;
import AbstractDbOperator from '../abstract-db-operator';

class DbOperator extends AbstractDbOperator {
    constructor(logger, dbName, connectionString) {
        super(logger, dbName, connectionString);
    }

    async connect() {
        if (this._db) return;

        let connectionOptions = {
            useNewUrlParser: true,
            useUnifiedTopology: true
        };
        this._client = await mongoClient.connect(this._connectionString, connectionOptions);
        this._db = this._client.db(this._dbName);
    }

    async disconnect() {
        if (this._client) await this._client.close()
        this._db = null;
    }

    async destroy() {
        await this._db.dropDatabase();
    }
}

export default DbOperator;
