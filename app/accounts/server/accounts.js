Meteor.startup(setupAccountsEmails);
Meteor.startup(updateGravatarHashes);
Accounts.onCreateUser(onCreateUser);

function setupAccountsEmails() {
    Accounts.emailTemplates.siteName = i18n('siteName');
}
function getGravatarHash(user) {
    if (user && user.emails && _.isArray(user.emails) && user.emails.length >= 1) {
        return Gravatar.hash(Email.normalize(user.emails[0].address));
    }
}
function onCreateUser(options, user) {
    user.gravatarHash = getGravatarHash(user);
    
    return user;
}
function updateGravatarHashes() {
    const users = Meteor.users.find({ gravatarHash: null });
    users.forEach(updateUser);
    return;
    
    function updateUser(user) {
        Meteor.users.update(user._id, { 
            $set: { gravatarHash: getGravatarHash(user) } 
        });
    }
}