angular
    .module('movielist')
    .service('titleService', titleService);

function titleService() {
    this.setTitle = setTitle;
    return;
    
    function setTitle(title) {
        const defaultTitle = i18n('siteName');
        document.title = (title ? title + ' | ' : '') + defaultTitle;
    }
}