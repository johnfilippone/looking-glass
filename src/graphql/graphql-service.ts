'use strict'

import { ApolloServer, gql } from 'apollo-server-express';
import express from 'express';
import morgan from 'morgan';

class GraphQLService {
    _logger: any
    _config: any
    _sheetsOperator: any
    constructor(logger, config, sheetsOperator) {
        this._logger = logger;
        this._config = config;
        this._sheetsOperator = sheetsOperator;
    }

    start() {
        const typeDefs = gql`
            type Query {
                sheets(spreadsheetId: String!, range: String!): [[String!]!]
            }
        `;
        const resolvers = {
            Query: {
                sheets: async (obj, args) => {
                    return await this._sheetsOperator.getSheet(args.spreadsheetId, args.range);
                }
            },
        };
        const graphQLServer = new ApolloServer({ typeDefs, resolvers });

        const app = express();
        app.use(morgan('combined'));
        graphQLServer.applyMiddleware({ app });
        app.listen({ port: this._config.port }, () => {
            this._logger.info('Serving graphql at http://localhost:4000' + graphQLServer.graphqlPath)
            this._sheetsOperator.connect();
        });
    }
}

export default GraphQLService;
