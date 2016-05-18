angular
    .module('movielist')
    .service('titleService', titleService);

function titleService($document) {
    this.setTitle = setTitle;
    return;
    
    function setTitle(title) {
        const defaultTitle = i18n('siteName');
        $document[0].title = (title ? title + ' | ' : '') + defaultTitle;
    }
}