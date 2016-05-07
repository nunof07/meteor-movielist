MLAccounts = {};
MLAccounts.getAvatarUrl = getAvatarUrl;
Meteor.startup(accountsStartup);
Meteor.users.deny({ update: usersDenyUpdate });

function accountsStartup() {
    Accounts.config({
        forbidClientAccountCreation: getForbidClientAccountCreation(),
        loginExpirationInDays: 90
    });
    return;
    
    function getForbidClientAccountCreation() {
        const forbidClientAccountCreation = Meteor.settings.public.forbidClientAccountCreation;
        
        if (forbidClientAccountCreation) {
            return ('true' === forbidClientAccountCreation.toLowerCase());
        } else {
            return false;
        }
    }
}
function usersDenyUpdate() {
    return true;
}
function getAvatarUrl({ user, size }) {
    let hash = '3eda6fcd3204ef285fa52176c28c4d3e'; // same as Gravatar.hash('none@none.com');
    
    if (user && user.gravatarHash) {
        hash = user.gravatarHash;
    }
    const options = {
        secure: true,
        size: size,
        d: 'mm',
        rating: 'pg'
    };
    
    return Gravatar.imageUrl(hash, options);
}