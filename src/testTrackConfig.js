import Assignment from './assignment';
import ConfigParser from './configParser';
import Split from './split';
import SplitRegistry from './splitRegistry';

var DEFAULT_VISITOR_COOKIE_NAME = 'tt_visitor_id',
  config,
  assignments,
  registry,
  getConfig = function() {
    if (!config) {
      var parser = new ConfigParser();
      config = parser.getConfig();
    }
    return config;
  };

var TestTrackConfig = {
  _clear: function() {
    config = null;
  },

  getUrl: function() {
    return getConfig().url;
  },

  getCookieDomain: function() {
    return getConfig().cookieDomain;
  },

  getCookieName: function() {
    return getConfig().cookieName || DEFAULT_VISITOR_COOKIE_NAME;
  },

  getExperienceSamplingWeight: function() {
    return getConfig().experienceSamplingWeight;
  },

  getSplitRegistry: function() {
    var rawRegistry = getConfig().splits;

    if (!rawRegistry) {
      return new SplitRegistry(null);
    }

    if (!registry) {
      var splits = Object.keys(rawRegistry).map(function(splitName) {
        var rawSplit = rawRegistry[splitName];
        return new Split(splitName, rawSplit['feature_gate'], rawSplit['weights']);
      });

      registry = new SplitRegistry(splits);
    }

    return registry;
  },

  getAssignments: function() {
    var rawAssignments = getConfig().assignments;

    if (!rawAssignments) {
      return null;
    }

    if (!assignments) {
      assignments = [];
      for (var splitName in rawAssignments) {
        assignments.push(
          new Assignment({
            splitName: splitName,
            variant: rawAssignments[splitName],
            isUnsynced: false
          })
        );
      }
    }

    return assignments;
  }
};

export default TestTrackConfig;
