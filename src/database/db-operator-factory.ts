'use strict'

import mongoDbOperator from './mongodb/db-operator';

class DbOperatorFactory {
    _logger: any
    _dbType: any
    _dbName: any
    _connectionString: any
    constructor(logger, dbConfig) {
        this._logger = logger;
        this._dbType = dbConfig.dbType;
        this._dbName = dbConfig.dbName;
        this._connectionString = dbConfig.connectionString;
    }

    create() {
        switch(this._dbType) {
            case "mongodb":
                return new mongoDbOperator(this._logger, this._dbName, this._connectionString);
                break;
            default:
                throw new Error(`Unsupported external db type: ${this._dbType}.  mongodb is the only supported option`);
        }
    }
}

export default DbOperatorFactory;
