'use strict'

import GraphQLService from './graphql-service';

class GraphQLServiceFactory {
    _logger: any
    _config: any
    _dbOperator: any
    _sheetsService: any
    constructor(logger, config, dbOperator, sheetsService) {
        this._logger = logger;
        this._config = config;
        this._dbOperator = dbOperator;
        this._sheetsService = sheetsService;
    }

    create(logger=this._logger, config=this._config, dbOperator=this._dbOperator, sheetsService=this._sheetsService) {
        return new GraphQLService(logger, config, dbOperator, sheetsService);
    }
}

export default GraphQLServiceFactory;


