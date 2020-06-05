'use strict'

class AbstractDbOperator {
    _db: any
    _client: any
    _logger: any
    _dbName: any
    _connectionString: any
    constructor(logger, dbName, connectionString) {
        this._db = null;
        this._client = null;
        this._logger = logger;
        this._dbName = dbName;
        this._connectionString = connectionString;
    }

    async getRecords(collection) { return; }

    async getRecord(collection, id) { return; }

    async putRecord(collection, id, record) { return; }

    // Sets this._client and this._db
    // Must be implemented by classes that extend this one
    // Must be able to handle being called when already connected
    async connect() { return; }

    // Close database connections
    // Must be implemented by classes that extend this one
    async disconnect() { return; }

    // Used only for dev purposes
    async destroy() { return; }
}

export default AbstractDbOperator;


