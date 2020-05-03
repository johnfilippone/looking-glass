'use strict'

// Logger
import getLogger from './logger';
const logger = getLogger();

// Config
import loadConfig from './config';
const config = loadConfig();

// Google Sheets API interface
import SheetsOperatorFactory from './sheets/sheets-operator-factory';
const sheetsOperatorFactory = new SheetsOperatorFactory(logger, config.sheets);
const sheetsOperator = sheetsOperatorFactory.create();

// Web Server
import GraphQLServiceFactory from './graphql/graphql-service-factory';
const graphQLServiceFactory = new GraphQLServiceFactory(logger, config.graphql, sheetsOperator);
const graphQLService = graphQLServiceFactory.create();
graphQLService.start();

/*
// Graphql
import { ApolloServer, gql } from 'apollo-server-express';
const typeDefs = gql`
    type Query {
        sheets(spreadsheetId: String!, range: String!): [[String!]!]
    }
`;
const resolvers = {
    Query: {
        sheets: async (obj, args) => {
            return await sheetsOperator.getSheet(args.spreadsheetId, args.range);
        }
    },
};
const graphQLServer = new ApolloServer({ typeDefs, resolvers });

// Web Server
import express from 'express';
import morgan from 'morgan';
const app = express();
app.use(morgan('combined'));
graphQLServer.applyMiddleware({ app });
app.listen({ port: 4000 }, () => {
    logger.info('Now browse to http://localhost:4000' + graphQLServer.graphqlPath)
    sheetsOperator.connect();
});
*/
