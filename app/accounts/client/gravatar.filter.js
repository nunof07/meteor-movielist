angular
    .module('movielist')
    .filter('mlGravatar', gravatarFilter);

function gravatarFilter() {
    return filter;
    
    function filter(user) {
        let hash = '3eda6fcd3204ef285fa52176c28c4d3e'; // same as Gravatar.hash('none@none.com');
        
        if (user && user.gravatarHash) {
            hash = user.gravatarHash;
        }
        const options = {
            secure: true,
            size: 25,
            d: 'mm',
            rating: 'pg'
        };
        
        return Gravatar.imageUrl(hash, options);
    }
}