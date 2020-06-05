'use strict'

import { ApolloServer, gql } from 'apollo-server-express';
import express from 'express';
import morgan from 'morgan';

class GraphQLService {
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

    async start() {
        try {
            await this._dbOperator.connect();
            await this._sheetsService.connect();
        } catch(err) {
            this._logger.error(err);
            process.exit(1);
        }

        const typeDefs = gql`
            type Query {
                sheets(spreadsheetId: String!, range: String!): [[String!]!]
            }
        `;
        const resolvers = {
            Query: {
                sheets: async (obj, args) => {
                    return await this._sheetsService.getSheet(args.spreadsheetId, args.range);
                }
            },
        };
        const graphQLServer = new ApolloServer({ typeDefs, resolvers });

        const app = express();
        app.use(morgan('combined'));
        graphQLServer.applyMiddleware({ app });
        app.listen({ port: this._config.port }, () => {
            this._logger.info('Serving graphql at http://localhost:' + this._config.port + graphQLServer.graphqlPath)
        });
    }
}

export default GraphQLService;
