'use strict'

// Logger
import getLogger from './logger';
const logger = getLogger();

// Config
import loadConfig from './config';
const config = loadConfig();

// Google Sheets API interface
import SheetsServiceFactory from './sheets/sheets-service-factory';
const sheetsServiceFactory = new SheetsServiceFactory(logger, config.sheets);
const sheetsService = sheetsServiceFactory.create();

// Web Server
import GraphQLServiceFactory from './graphql/graphql-service-factory';
const graphQLServiceFactory = new GraphQLServiceFactory(logger, config.graphql, sheetsService);
const graphQLService = graphQLServiceFactory.create();
graphQLService.start();
