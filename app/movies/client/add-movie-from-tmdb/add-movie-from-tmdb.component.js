angular
    .module('movielist')
    .directive('mlAddMovieFromTmdb', addMovieFromTmdbDirective);

function addMovieFromTmdbDirective() {
    return {
        restrict: 'E',
        templateUrl: 'app/movies/client/add-movie-from-tmdb/add-movie-from-tmdb.html',
        controllerAs: 'addMovieFromTmdbCtrl',
        controller: AddMovieFromTmdbController
    };
}

function AddMovieFromTmdbController($scope, $reactive, $q, logger) {
    const ctrl = this;
    $reactive(ctrl).attach($scope);
    
    ctrl.isLoading = false;
    ctrl.noResults = false;
    ctrl.error = false;
    ctrl.errorMessage = false;
    ctrl.query = '';
    
    ctrl.search = search;
    return;
    
    function search(query) {
        const defer = $q.defer();
        ctrl.error = false;
        ctrl.errorMessage = false;
        Movies.methods.searchTmdb.call({ query }, searchResult);
        return defer.promise;
        
        function searchResult(err, res) {
            if (err) {
                logger.error('Error searching TMDb', err);
                ctrl.error = {searchFailed: true};
                ctrl.errorMessage = err.reason;
                defer.reject(err);
            } else {
                defer.resolve(res);
            }
        }
    }
}