'use strict';

const fs = require('fs');
const Path = require('path');
const userService = require('./../Users/UserService');

const env = process.env.NODE_ENV ? process.env.NODE_ENV : 'dev';
const isDev = env === 'dev';

const getSettingsObject = (settings) => {
  try {
    return JSON.parse(settings);
  } catch (e) {
    return null;
  }
};

const getSettingsFromFile = (settingsPath) => {
  if (fs.existsSync(settingsPath)) {
    const file = fs.readFileSync(settingsPath, 'utf8');
    try {
      return JSON.parse(file);
    } catch (e) {
      return null;
    }
  }
  return null;
};

const fetchConfig = () => {
  if (process.env.settings) {
    const settings = process.env.settings;
    let settingsObject = getSettingsObject(settings);
    if (settingsObject !== null) {
      return settingsObject;
    }
    const settingsPath = Path.resolve(settings);
    if (fs.existsSync(settingsPath)) {
      settingsObject = getSettingsFromFile(settingsPath);
      if (settingsObject !== null) {
        return settingsObject;
      }
    }
  }

  return null;
};

const fetchConfigWithServices = () => {
  const config = fetchConfig();
  if (config == null) {
    return null;
  }

  config['services'] = {
    user: new userService()
  };

  return config;
}

module.exports = fetchConfigWithServices();