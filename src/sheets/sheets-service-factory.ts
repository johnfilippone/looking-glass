'use strict'

import SheetsService from './sheets-service';

class SheetsServiceFactory {
    _logger: any
    _config: any
    constructor(logger, config) {
        this._logger = logger;
        this._config = config;
    }

    create(logger=this._logger, config=this._config) {
        return new SheetsService(logger, config);
    }
}

export default SheetsServiceFactory;

