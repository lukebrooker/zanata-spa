(function () {
  'use strict'

  /**
   * EditorService.js
   * //TODO: parse editorContext in functions
   * @ngInject
   */
  function EditorService ($rootScope, $resource, _, UrlService,
    EventService, PhraseService, PhraseUtil, DocumentService, MessageHandler,
    TransStatusService) {
    var editorService = this
    var queue = {}

    editorService.context = {}

    editorService.currentPageIndex = 0
    // null when max index has not yet been calculated
    editorService.maxPageIndex = null

    editorService.initContext =
      function (projectSlug, versionSlug, docId, srcLocale, localeId, mode) {
        editorService.context = {
          projectSlug: projectSlug,
          versionSlug: versionSlug,
          docId: docId,
          srcLocale: srcLocale,
          localeId: localeId,
          mode: mode // READ_WRITE, READ_ONLY, REVIEW
        }
        return editorService.context
      }

    editorService.updateContext = function (projectSlug, versionSlug, docId,
                                           localeId) {
      if (editorService.context.projectSlug !== projectSlug) {
        editorService.context.projectSlug = projectSlug
      }
      if (editorService.context.versionSlug !== versionSlug) {
        editorService.context.versionSlug = versionSlug
      }
      if (editorService.context.docId !== docId) {
        editorService.context.docId = docId
      }
      if (editorService.context.localeId !== localeId) {
        editorService.context.localeId = localeId
      }
    }

    /**
     * EventService.EVENT.SAVE_TRANSLATION listener
     * Perform save translation with given status
     *
     * - queue save translation request (1 global queue, 1 for each TU)
     * - if queue contains request id, replace old request with new request
     */
    $rootScope.$on(EventService.EVENT.SAVE_TRANSLATION,
      function (event, data) {
        var phrase = data.phrase
        var status = data.status
        if (!needToSavePhrase(phrase, status)) {
          // nothing has changed
          return
        }

        // update pending queue if contains
        if (_.has(queue, phrase.id)) {
          var pendingRequest = queue[phrase.id]
          pendingRequest.phrase = phrase
          pendingRequest.status = status
        } else {
          status = resolveTranslationState(phrase, status)
          queue[phrase.id] = {
            'phrase': phrase,
            'status': status,
            'locale': data.locale,
            'docId': data.docId
          }
        }
        EventService.emitEvent(EventService.EVENT.SAVE_INITIATED, data)
        processSaveRequest(phrase.id)
      })

    function needToSavePhrase (phrase, status) {
      return PhraseUtil.hasTranslationChanged(phrase) ||
        phrase.status !== status
    }

    // Process save translation request
    function processSaveRequest (id) {
      var context = _.cloneDeep(editorService.context)

      var request = queue[id]

      var Translation = $resource(UrlService.TRANSLATION_URL, {}, {
        update: {
          method: 'PUT',
          params: {
            localeId: request.locale
          }
        }
      })
      var data = {
        id: request.phrase.id,
        revision: request.phrase.revision || 0,
        content: request.phrase.newTranslations[0],
        contents: request.phrase.newTranslations,
        // Return status object to PascalCase Id for the server
        status: TransStatusService.getServerId(request.status.ID),
        plural: request.phrase.plural
      }

      Translation.update(data).$promise.then(
        function (response) {
          var oldStatus = request.phrase.status.ID

          PhraseService.onTransUnitUpdated(context, data.id, request.locale,
            response.revision, response.status, request.phrase)

          DocumentService.updateStatistic(context.projectSlug,
            context.versionSlug, request.docId, request.locale,
            oldStatus, TransStatusService.getId(response.status),
            request.phrase.wordCount)

          EventService.emitEvent(EventService.EVENT.SAVE_COMPLETED,
            request.phrase)
        },
        function (response) {
          MessageHandler.displayWarning('Update translation failed for ' +
            data.id + ' -' + response)
          PhraseService.onTransUnitUpdateFailed(data.id)
          EventService.emitEvent(EventService.EVENT.SAVE_COMPLETED,
            request.phrase)
        })
      delete queue[id]
    }

    function resolveTranslationState (phrase, requestStatus) {
      if (_.isEmpty(_.compact(phrase.newTranslations))) {
        return TransStatusService.getStatusInfo('UNTRANSLATED')
      }
      // FIXME must also check if any plural is empty
      //       and enforce needs work state. Just use
      //       the same code used for the save button
      //       dropdowns.
      return requestStatus
    }

    return editorService
  }

  angular
    .module('app')
    .factory('EditorService', EditorService)
})()

