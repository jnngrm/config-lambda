'use strict';
const async = require('async');
let configuration;
let factories;

module.exports = function(config) {
  if (!config || !config.file || !config.stage) {
    console.log(!config, !config.file, !config.stage);
    throw new Error(`You must provide a configuration file and stage.`);
  }
  configuration = require(config.file)[config.stage];
  return {
    load: (factoryList, next) => {
      factories = factoryList;
      async.each(factories, function(factory, callback) {
        factory.load(callback);
      }, next);
    },
    get: key => {
      if (configuration[key]) {
        return configuration[key];
      }
      for (let factory of factories) {
        let value = factory.get(key);
        if (value) {
          return value;
        }
      }
      return null;
    }
  };
};