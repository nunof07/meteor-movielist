angular
    .module('movielist')
    .directive('mlToggleAccountsDropdown', toggleAccountsDropdownDirective);

function toggleAccountsDropdownDirective($timeout, toggleAccountsDropdownService) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.bind('click', onClick);
            return;
            
            function onClick(event) {
                const flow = attrs.mlToggleAccountsDropdown;
                const dropdown = angular.element('#login-dropdown-list');
                
                event.stopPropagation();
                resetFlow(flow);
                
                if (toggleAccountsDropdownService.previousFlow === flow || !dropdown.hasClass('open')) {
                    // avoid closing dropdown when it's already open
                    // and we're toggling for a different flow
                    dropdown.toggleClass('open');
                }
                $timeout(() => angular.element('#login-email').focus(), 0);
                
                if (dropdown.hasClass('open')) {
                    openNavBarCollapse();
                } else {
                    closeNavBarCollapse();
                }
                toggleAccountsDropdownService.previousFlow = flow;
            }
            function openNavBarCollapse() {
                angular.element('.header .navbar-collapse')
                        .addClass('in')
                        .css('height', 'auto')
                        .attr('aria-expanded', 'true');
            }
            function closeNavBarCollapse() {
                angular.element('.header .navbar-collapse')
                    .removeClass('in')
                    .css('height', 0)
                    .attr('aria-expanded', 'false');
            }
            function sessionSet(key, value) {
                Session.set('Meteor.loginButtons.' + key, value);
            }
            function resetFlow(flow) {
                sessionSet('inSignupFlow', false);
                sessionSet('inForgotPasswordFlow', false);
                sessionSet('inChangePasswordFlow', false);
                sessionSet('inMessageOnlyFlow', false);
                
                if (flow) {
                    sessionSet(flow, true);
                }
            }
        }
    };
}