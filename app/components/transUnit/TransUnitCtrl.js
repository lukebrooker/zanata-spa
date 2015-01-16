(function () {
  'use strict';

  /**
   * TransUnitCtrl.js
   * @ngInject
   */
  function TransUnitCtrl($scope, $element, $stateParams, _, TransUnitService,
    EventService, LocaleService, focus, EditorShortcuts, EditorService,
    PhraseUtil) {

    var transUnitCtrl = this;

    transUnitCtrl.selected = false;
    transUnitCtrl.focused = false;
    transUnitCtrl.focusedTranslationIndex = 0;

    transUnitCtrl.isTranslationModified =
      TransUnitService.isTranslationModified;

    transUnitCtrl.focusTranslation = function() {
      focus('phrase-' + $scope.phrase.id + '-' +
      transUnitCtrl.focusedTranslationIndex);
    };

    transUnitCtrl.onTextAreaFocus = function(phrase, index) {
      transUnitCtrl.focused = true;
      transUnitCtrl.selectTransUnit(phrase);
      if (index !== undefined) {
        transUnitCtrl.focusedTranslationIndex = index;
      }
    };

    transUnitCtrl.translationTextModified = function(phrase) {
      EventService.emitEvent(EventService.EVENT.TRANSLATION_TEXT_MODIFIED,
          phrase);
    };

    transUnitCtrl.getPhrase = function() {
      return $scope.phrase;
    };

    transUnitCtrl.init = function() {
      TransUnitService.addController($scope.phrase.id, transUnitCtrl);
      if($stateParams.id && parseInt($stateParams.id) === $scope.phrase.id) {
        EventService.emitEvent(EventService.EVENT.SELECT_TRANS_UNIT,
          {'id': $stateParams.id,
            'updateURL': false,
            'focus' : $stateParams.selected});
      }
    };

    transUnitCtrl.copySource = function($event, phrase, sourceIndex) {
      $event.stopPropagation(); //prevent click event of TU
      if(!transUnitCtrl.isReadOnly) {
        EventService.emitEvent(EventService.EVENT.COPY_FROM_SOURCE,
          {'phrase': phrase, 'sourceIndex': sourceIndex}, $scope);
      }
    };

    transUnitCtrl.undoEdit = function($event, phrase) {
      if(!transUnitCtrl.isReadOnly) {
        $event.stopPropagation(); //prevent click event of TU
        EventService.emitEvent(EventService.EVENT.UNDO_EDIT,
          phrase, $scope);
      }
    };

    transUnitCtrl.isReadOnly = function() {
      return !EditorService.context.permission.write_translation;
    };

    transUnitCtrl.isReviewAllowed = function() {
      return EditorService.context.permission.review_translation;
    };

    transUnitCtrl.cancelEdit = function($event, phrase) {
      $event.stopPropagation(); //prevent click event of TU
      EventService.emitEvent(EventService.EVENT.CANCEL_EDIT,
        phrase, $scope);
    };

    transUnitCtrl.saveAs = function($event, phrase, status) {
      if(!transUnitCtrl.isReadOnly) {
        EditorShortcuts.saveTranslationCallBack($event, phrase, status);
      }
    };

    transUnitCtrl.getLocaleName = function(localeId) {
      return LocaleService.getName(localeId);
    };

    transUnitCtrl.toggleSaveAsOptions = function(open) {
      EventService.broadcastEvent( open ? 'openDropdown': 'closeDropdown',
        {}, $scope);
      if (open) {
        // focus on the first dropdown option
        focus($scope.phrase.id + '-saveAsOption-0');
      }
    };

    transUnitCtrl.cancelSaveAsMode = function() {
      EditorShortcuts.cancelSaveAsModeIfOn();
    };

    $scope.$on('$destroy', function () {
      $element.unbind('click', onTransUnitClick);
      $element.unbind('focus', onTransUnitClick);
    });

    transUnitCtrl.updateSaveButton = function (phrase) {
      transUnitCtrl.saveButtonStatus =
        PhraseUtil.getSaveButtonStatus($scope.phrase);
      transUnitCtrl.saveButtonOptions =
        TransUnitService.getSaveButtonOptions(transUnitCtrl.saveButtonStatus);
      transUnitCtrl.saveButtonText = transUnitCtrl.saveButtonStatus.NAME;
      transUnitCtrl.saveButtonDisabled =
        !TransUnitService.isTranslationModified(phrase);
      transUnitCtrl.loadingClass = '';
      transUnitCtrl.savingStatus = '';
    };

    transUnitCtrl.phraseSaving = function (data) {
      transUnitCtrl.loadingClass = 'is-loading';
      transUnitCtrl.saveButtonStatus =
        transUnitCtrl.savingStatus = data.status;
      transUnitCtrl.saveButtonOptions =
        TransUnitService.getSaveButtonOptions(transUnitCtrl.saveButtonStatus);
      transUnitCtrl.saveButtonText = 'Saving…';
      transUnitCtrl.saveButtonDisabled = true;
    };

    transUnitCtrl.saveButtonOptionsAvailable = function() {
      return !_.isEmpty(transUnitCtrl.saveButtonOptions);
    };

    transUnitCtrl.selectTransUnit = function(phrase) {
      if (!transUnitCtrl.selected) {
        EventService.emitEvent(EventService.EVENT.SELECT_TRANS_UNIT,
                               {'id': phrase.id,
                                 'updateURL': true,
                                 'focus': true
                               }, $scope);
      }
    };

    function onTransUnitClick() {
      if(!transUnitCtrl.selected) {
        $scope.$apply(function () {
          EventService.emitEvent(EventService.EVENT.SELECT_TRANS_UNIT,
            {'id': $scope.phrase.id,
              'updateURL': true,
              'focus': true}, $scope);
        });
      }
    }

    return transUnitCtrl;
  }

  angular
    .module('app')
    .controller('TransUnitCtrl', TransUnitCtrl);
})();

