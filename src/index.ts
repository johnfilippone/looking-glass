'use strict'

// Logger
import getLogger from './logger';
const logger = getLogger();

// Config
import loadConfig from './config';
const config = loadConfig();

// Graphql
import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';

// Google Sheets API interface
import SheetsOperatorFactory from './sheets/sheets-operator-factory';
const sheetsOperatorFactory = new SheetsOperatorFactory(logger, config.sheets);
const sheetsOperator = sheetsOperatorFactory.create();

const typeDefs = gql`
    type Query {
        connecting: [[String!]!]
        weight: [[String!]!]
        tables: [[String!]!]
    }
`;
const resolvers = {
    Query: {
        connecting: async () => {return await sheetsOperator.getSheet('1ucWB8jjQIYJa_K4K0NsDA9owCeWYs1buClTVvE2JqJw', 'Connecting Volume');},
        weight: async () => {return await sheetsOperator.getSheet('1DRXq0Uo_eVzgnT4bwo202XAU9YWltCa_8W26jhEaaxQ', 'Metrics');},
        //connecting: () => {return getConnectingData(auth);},
        //weight: () => {return getBodyWeight(auth);},
        tables: () => [
            ['Body Weight', '1DRXq0Uo_eVzgnT4bwo202XAU9YWltCa_8W26jhEaaxQ', 'Weight'],
            ['Body Measurments', '1DRXq0Uo_eVzgnT4bwo202XAU9YWltCa_8W26jhEaaxQ', 'Girth']
        ]
    },
};
const server = new ApolloServer({ typeDefs, resolvers });
const app = express();
server.applyMiddleware({ app });

app.listen({ port: 4000 }, () => {
    logger.info('Now browse to http://localhost:4000' + server.graphqlPath)
    sheetsOperator.connect();
});
