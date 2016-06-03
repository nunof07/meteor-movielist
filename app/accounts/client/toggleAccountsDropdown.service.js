angular
    .module('movielist')
    .service('toggleAccountsDropdownService', toggleAccountsDropdownService);

function toggleAccountsDropdownService() {
    this.previousFlow = void 0;
    return; 
}