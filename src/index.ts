'use strict'

import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';
import SheetsOperatorFactory from './sheets/sheets-operator-factory';

const sheetsOperatorFactory = new SheetsOperatorFactory('config/credentials.json');
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
        connecting: async () => {return await sheetsOperator.getSheet('1DRXq0Uo_eVzgnT4bwo202XAU9YWltCa_8W26jhEaaxQ', 'Connecting Volume');},
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

app.listen({ port: 4000 }, () =>
  console.log('Now browse to http://localhost:4000' + server.graphqlPath)
);

