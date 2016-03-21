Meteor.startup(accountsStartup);

function accountsStartup() {
    Accounts.config({
        forbidClientAccountCreation: getForbidClientAccountCreation()
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