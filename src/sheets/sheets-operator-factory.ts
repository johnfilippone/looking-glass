'use strict'

import SheetsOperator from './sheets-operator';

class SheetsOperatorFactory {
    _credentialsPath: any
    constructor(credentialsPath) {
        this._credentialsPath = credentialsPath;
    }

    create() {
        return new SheetsOperator(this._credentialsPath);
    }
}

export default SheetsOperatorFactory;

