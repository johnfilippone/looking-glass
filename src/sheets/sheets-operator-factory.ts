'use strict'

import SheetsOperator from './sheets-operator';

class SheetsOperatorFactory {
    _logger: any
    _credentialsPath: any
    constructor(logger, credentialsPath) {
        this._logger = logger;
        this._credentialsPath = credentialsPath;
    }

    create() {
        return new SheetsOperator(this._logger, this._credentialsPath);
    }
}

export default SheetsOperatorFactory;

