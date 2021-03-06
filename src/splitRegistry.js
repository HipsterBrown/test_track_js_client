var SplitRegistry = function(splitArray) {
  this._splitArray = splitArray;
  this._loaded = splitArray !== null;
};

SplitRegistry.prototype.getSplit = function(splitName) {
  return this.getSplits()[splitName];
};

SplitRegistry.prototype.isLoaded = function() {
  return this._loaded;
};

SplitRegistry.prototype.asV1Hash = function() {
  var v1Hash = {};
  for (var splitName in this.getSplits()) {
    var split = this._splits[splitName];
    v1Hash[splitName] = split.getWeighting();
  }

  return v1Hash;
};

SplitRegistry.prototype.getSplits = function() {
  if (!this._loaded) {
    return {};
  }

  if (!this._splits) {
    this._splits = {};
    this._splitArray.forEach(
      function(split) {
        this._splits[split.getName()] = split;
      }.bind(this)
    );
  }

  return this._splits;
};

export default SplitRegistry;
