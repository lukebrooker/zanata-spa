(function() {
  'use strict';

  /**
   * Handle server communication on document related
   * information in project-version.
   *
   * DocumentService.js
   * @ngInject
   */
  function DocumentService($q, $filter, $timeout, $http,
                           $resource, UrlService) {
    var documentService = this;
    documentService.statisticMap = {};

    /**
     * Finds all documents in given project version
     *
     * @param _projectSlug
     * @param _versionSlug
     * @returns {$promise|*|N.$promise}
     */
    function findAll(_projectSlug, _versionSlug) {
      var Documents = $resource(UrlService.DOCUMENT_LIST_URL, {}, {
        query : {
          method : 'GET',
          params : {
            projectSlug : _projectSlug,
            versionSlug : _versionSlug
          },
          isArray : true
        }
      });
      return Documents.query().$promise;
    }

    /**
     * Get statistic of document in locale (word and message)
     *
     * @param _projectSlug
     * @param _versionSlug
     * @param _docId
     * @param _localeId
     * @returns {*}
     */
    function getStatistics (_projectSlug, _versionSlug,
        _docId, _localeId) {
      if (_docId && _localeId) {
        //TODO: need to hash this key
        var key = _docId + _localeId;
        if (key in documentService.statisticMap) {
          var deferred = $q.defer();
          deferred.resolve(documentService.statisticMap[key]);
          return deferred.promise;
        } else {
          var Statistics = $resource(UrlService.DOC_STATISTIC_URL, {}, {
            query : {
              method : 'GET',
              params : {
                projectSlug : _projectSlug,
                versionSlug : _versionSlug,
                docId : _docId,
                localeId : _localeId
              },
              isArray : true
            }
          });
          var result = Statistics.query();
          documentService.statisticMap[key] = result;
          return result.$promise;
        }
      }
    }

    return {
        findAll: findAll,
        getStatistics : getStatistics
    };
  }

  angular.module('app').factory('DocumentService', DocumentService);
})();
