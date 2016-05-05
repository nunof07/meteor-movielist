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