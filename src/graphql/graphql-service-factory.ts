'use strict'

import GraphQLService from './graphql-service';

class GraphQLServiceFactory {
    _logger: any
    _config: any
    _sheetsOperator: any
    constructor(logger, config, sheetsOperator) {
        this._logger = logger;
        this._config = config;
        this._sheetsOperator = sheetsOperator;
    }

    create(logger=this._logger, config=this._config, sheetsOperator=this._sheetsOperator) {
        return new GraphQLService(logger, config, sheetsOperator);
    }
}

export default GraphQLServiceFactory;


