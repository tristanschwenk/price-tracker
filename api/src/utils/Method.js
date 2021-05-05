class Method {
  constructor(opts) {
    this.schema = opts.schema ?? {};
    this.rules = opts.rules ?? [];
    this.execute = opts.execute ?? function(){};
  }
}

module.exports = Method

