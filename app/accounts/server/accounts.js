Meteor.startup(setupAccountsEmails);

function setupAccountsEmails() {
    Accounts.emailTemplates.siteName = i18n('siteName');
}