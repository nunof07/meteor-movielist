angular
    .module('movielist')
    .filter('mlAvatar', avatarFilter);

function avatarFilter() {
    return filter;
    
    function filter(user) {
        return MLAccounts.getAvatarUrl({
            user,
            size: 25
        });
    }
}