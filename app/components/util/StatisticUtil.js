(function() {
  'use strict';

  /**
   * Utility method for handling $resource.statistic
   *
   * StatisticUtil.js
   * @ngInject
   *
   */

  function StatisticUtil() {

    function getStyles(statistic) {
      var styles = {};

      var widthApproved = statistic.approved / statistic.total * 100;

      var widthTranslated = statistic.translated / statistic.total * 100;
      var marginLeftTranslated = widthApproved;

      var widthNeedsWork = statistic.needsWork / statistic.total * 100;
      var marginLeftNeedsWork = widthApproved + widthTranslated;

      var widthUntranslated = statistic.untranslated / statistic.total * 100;
      var marginLeftUntranslated = widthApproved +
        widthTranslated + widthNeedsWork;

      styles.approved = {
        'width' : widthApproved + '%',
        'marginLeft' : 0
      };
      styles.translated = {
        'width' : widthTranslated + '%',
        'marginLeft' : marginLeftTranslated + '%'
      };
      styles.needsWork = {
        'width' : widthNeedsWork + '%',
        'marginLeft' : marginLeftNeedsWork + '%'
      };
      styles.untranslated = {
        'width' : widthUntranslated + '%',
        'marginLeft' : marginLeftUntranslated + '%'
      };

      return styles;
    }

    function getWordStatistic(statistics) {
      return statistics[0].unit === 'WORD' ? statistics[0] : statistics[1];
    }

    function getMsgStatistic(statistics) {
      return statistics[0].unit === 'MESSAGE' ? statistics[0] : statistics[1];
    }

    return {
      getStyles: getStyles,
      getWordStatistic : getWordStatistic,
      getMsgStatistic : getMsgStatistic
    };
  }
  angular.module('app').factory('StatisticUtil', StatisticUtil);
})();
