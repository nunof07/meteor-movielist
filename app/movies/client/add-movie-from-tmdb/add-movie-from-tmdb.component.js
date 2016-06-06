angular
    .module('movielist')
    .directive('mlAddMovieFromTmdb', addMovieFromTmdbDirective);

function addMovieFromTmdbDirective() {
    return {
        restrict: 'E',
        scope: {
            onAdded: '=',
        },
        bindToController: true,
        templateUrl: 'app/movies/client/add-movie-from-tmdb/add-movie-from-tmdb.html',
        controllerAs: 'addMovieFromTmdbCtrl',
        controller: AddMovieFromTmdbController
    };
}

function AddMovieFromTmdbController($scope, $reactive, $q, $timeout, $sce, logger, errorService) {
    const ctrl = this;
    $reactive(ctrl).attach($scope);
    
    ctrl.isLoading = false;
    ctrl.noResults = false;
    ctrl.error = false;
    ctrl.errorMessage = false;
    ctrl.result = '';
    ctrl.addSuccess = false;
    ctrl.isSubmitting = false;
    ctrl.showTooltip = false;
    ctrl.tooltipMessage = '';
    
    ctrl.search = search;
    ctrl.add = add;
    ctrl.dismissAddSuccess = dismissAddSuccess;
    ctrl.canSubmit = canSubmit;
    
    ctrl.autorun(updateTooltip);
    return;
    
    function updateTooltip() {
        const addSuccess = ctrl.getReactively('addSuccess');
        const noResults = ctrl.getReactively('noResults');
        const error = ctrl.getReactively('error');
        ctrl.showTooltip = false;
        
        if (addSuccess) {
            ctrl.showTooltip = true;
            ctrl.tooltipMessage = $sce.trustAsHtml(i18n('movies.addSuccess'));
        } else {
            if (noResults && !error) {
                ctrl.showTooltip = true;
                ctrl.tooltipMessage = $sce.trustAsHtml(i18n('movies.noResults'));
            }
        }
    }
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
                ctrl.errorMessage = errorService.getErrorMessage(err);
                defer.reject(err);
            } else {
                defer.resolve(res);
            }
        }
    }
    function add() {
        if (ctrl.canSubmit()) {
            ctrl.error = false;
            ctrl.errorMessage = false;
            ctrl.addSuccess = false;
            ctrl.isSubmitting = true;
            const data = {
                tmdbId: ctrl.result.id
            };
            Movies.methods.insertOrUpdateFromTmdb.call(data, insertResult);
        }
        return;
        
        function insertResult(err, res) {
            if (err) {
                logger.error('Error adding movie from TMDb', err);
                ctrl.error = {addFailed: true};
                ctrl.errorMessage = errorService.getErrorMessage(err);
            } else {
                ctrl.addSuccess = true;
                ctrl.result = '';
                $timeout(dismissAddSuccess, 4000);
                
                if (angular.isFunction(ctrl.onAdded)) {
                    ctrl.onAdded(res);
                }
            }
            ctrl.isSubmitting = false;
            $scope.$apply();
        }
    }
    function dismissAddSuccess() {
        ctrl.addSuccess = false;
    }
    function canSubmit() {
        return !ctrl.isSubmitting &&
            ctrl.result && ctrl.result.id;
    }
}