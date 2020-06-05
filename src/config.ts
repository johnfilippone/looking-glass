'use strict'

import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const configPath = path.resolve(process.cwd(), 'config/config.yaml');

function loadConfig() {
    const configYaml = fs.readFileSync(configPath, 'utf8');
    let config = yaml.safeLoad(configYaml);
    config = overwriteConfigWithEnv(config, process.env, 'LKG_');
    return config;
}

// Takes a config object and an environment variable prefix and overwrites the config with
// values from environment variables with the proper prefix and naming convention
// property names in config are case sensitive and nested properties are separated by _
//
// Examples:
// ENVPREFIX_enableAuth -> { enableAuth: value }
// ENVPREFIX_server_port -> { server: { port: value } }
// ENVPREFIX_server_enableSwagger -> { server: { enableSwagger: value } }
function overwriteConfigWithEnv(config, environment, envPrefix) {
    const configVars = Object.keys(environment).filter((configVar) => configVar.startsWith(envPrefix));
    for (let i = 0; i < configVars.length; i++) {
        const configValue = parseType(environment[configVars[i]]);
        const configVar = configVars[i].substring(envPrefix.length);
        const varComponents = configVar.split('_');
        let configProperty = config;
        for (let j = 0; j < varComponents.length; j++) {
            // if the property does not exist in the config, create it
            if (!configProperty.hasOwnProperty(varComponents[j])) {
                configProperty[varComponents[j]] = {};
            }
            if (j == varComponents.length -1) {
                configProperty[varComponents[j]] = configValue;
            } else {
                configProperty = configProperty[varComponents[j]];
            }
        }
    }
    return config;
}
// Expects a string and returns a string, number, or boolean if the string can be parsed into one
function parseType(item) {
    if (!isNaN(item)) {
        return parseFloat(item);
    } else if (item.toLowerCase() === 'false') {
        return false;
    } else if (item.toLowerCase() === 'true') {
        return true;
    }
    return item;
}

export default loadConfig;
