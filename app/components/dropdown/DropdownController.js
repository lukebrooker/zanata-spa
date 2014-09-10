(function() {

'use strict';

  /**
   * @name DropdownCtrl
   *
   * @description
   * Handle dropdown events between directives
   *
   * @ngInject
   */

  function DropdownCtrl($scope, $attrs, $parse, dropdownConfig,
    DropdownService, $animate) {
    var dropdownCtrl = this,
        // create a child scope so we are not polluting original one
        scope = $scope.$new(),
        openClass = dropdownConfig.openClass,
        getIsOpen,
        setIsOpen = angular.noop,
        toggleInvoker = $attrs.onToggle ?
          $parse($attrs.onToggle) : angular.noop;

    this.init = function(element) {
      dropdownCtrl.$element = element;

      if ($attrs.isOpen) {
        getIsOpen = $parse($attrs.isOpen);
        setIsOpen = getIsOpen.assign;

        $scope.$watch(getIsOpen, function(value) {
          scope.isOpen = !!value;
        });
      }
    };

    this.toggle = function(open) {
      scope.isOpen = arguments.length ? !!open : !scope.isOpen;
      return scope.isOpen;
    };

    // Allow other directives to watch status
    this.isOpen = function() {
      return scope.isOpen;
    };

    scope.getToggleElement = function() {
      return dropdownCtrl.toggleElement;
    };

    scope.focusToggleElement = function() {
      if (dropdownCtrl.toggleElement) {
        dropdownCtrl.toggleElement[0].focus();
      }
    };

    scope.$watch('isOpen', function(isOpen, wasOpen) {
      $animate[isOpen ? 'addClass' : 'removeClass']
        (dropdownCtrl.$element, openClass);

      if (isOpen) {
        scope.focusToggleElement();
        DropdownService.open(scope);
      } else {
        DropdownService.close(scope);
      }

      setIsOpen($scope, isOpen);
      if (angular.isDefined(isOpen) && isOpen !== wasOpen) {
        toggleInvoker($scope, { open: !!isOpen });
      }
    });

    $scope.$on('$locationChangeSuccess', function() {
      scope.isOpen = false;
    });

    $scope.$on('$destroy', function() {
      scope.$destroy();
    });
  }

  angular
    .module('app')
    .controller('DropdownCtrl', DropdownCtrl);

})();
