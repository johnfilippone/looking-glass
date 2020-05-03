'use strict'

import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const configPath = path.resolve(process.cwd(), 'config/config.yaml');

function loadConfig() {
    const configYaml = fs.readFileSync(configPath, 'utf8');
    let config = yaml.safeLoad(configYaml);
    return config;
}

export default loadConfig;
