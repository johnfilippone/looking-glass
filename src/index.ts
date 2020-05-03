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

// Graphql
import { ApolloServer, gql } from 'apollo-server-express';
const typeDefs = gql`
    type Query {
        connecting: [[String!]!]
        weight: [[String!]!]
        tables: [[String!]!]
    }
`;
const resolvers = {
    Query: {
        connecting: async () => {
            return await sheetsOperator.getSheet('1ucWB8jjQIYJa_K4K0NsDA9owCeWYs1buClTVvE2JqJw', 'Connecting Volume');
        },
        weight: async () => {
            return await sheetsOperator.getSheet('1DRXq0Uo_eVzgnT4bwo202XAU9YWltCa_8W26jhEaaxQ', 'Metrics');
        },
        tables: () => [
            ['Body Weight', '1DRXq0Uo_eVzgnT4bwo202XAU9YWltCa_8W26jhEaaxQ', 'Weight'],
            ['Body Measurments', '1DRXq0Uo_eVzgnT4bwo202XAU9YWltCa_8W26jhEaaxQ', 'Girth']
        ]
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
