const PATH = require('path');
const fs = require('fs-extra');
const utils = require('../utils/');

class Service {
  constructor() {
    this.cacheFolder = PATH.join(__dirname, '../cache/');
    this.cache = null;
    this.serviceName = "Unnamed service";
  }

  readCacheFile(...fragment) {
    const path = PATH.join(this.cacheFolder, ...fragment);
    fs.ensureFileSync(path);
    let data = fs.readJsonSync(path, {
      throws: false
    });

    if (data === null) data = {};

    this.cache = data;
    return data;
  }

  writeCacheFile(data, ...fragment) {
    const path = PATH.join(this.cacheFolder, ...fragment);
    fs.ensureFileSync(path);
    fs.writeJsonSync(path, data);

    this.cache = data;
    return data;
  }

  logger(...messages) {
    return utils.logger({
      method: this.serviceName
    }, ...messages);
  }
}

module.exports = Service;