'use strict'

import GraphQLService from './graphql-service';

class GraphQLServiceFactory {
    _logger: any
    _config: any
    _sheetsService: any
    constructor(logger, config, sheetsService) {
        this._logger = logger;
        this._config = config;
        this._sheetsService = sheetsService;
    }

    create(logger=this._logger, config=this._config, sheetsService=this._sheetsService) {
        return new GraphQLService(logger, config, sheetsService);
    }
}

export default GraphQLServiceFactory;


