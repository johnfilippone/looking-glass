'use strict'

import SheetsOperator from './sheets-operator';

class SheetsOperatorFactory {
    _logger: any
    _config: any
    constructor(logger, config) {
        this._logger = logger;
        this._config = config;
    }

    create(logger=this._logger, config=this._config) {
        return new SheetsOperator(logger, config);
    }
}

export default SheetsOperatorFactory;

