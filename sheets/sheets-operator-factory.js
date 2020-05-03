'use strict'

import SheetsOperator from './sheets-operator';

class SheetsOperatorFactory {
    constructor(credentialsPath) {
        this._credentialsPath = credentialsPath;
    }

    create() {
        return new SheetsOperator(this._credentialsPath);
    }
}

export default SheetsOperatorFactory;

