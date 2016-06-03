Meteor.startup(i18nHomeStartup);

function i18nHomeStartup() {
    i18n.map('en', {
        home: {
            title: 'Home',
            notLoggedIn: 'Please login to manage your lists.',
            signIn: 'Sign in',
            signUp: 'Sign up',
            accountCreationDisabled: '* New accounts are not accepted at this time',
            features: {
                header: {
                    title: 'MovieList',
                    description: 'An open source web app for managing movie lists'
                },
                manageLists: {
                    title: 'Manage lists',
                    content: '<ul class="list-unstyled">' +
                        '<li>Create private or public lists.</li>' +
                        '<li>Add movies from <a href="https://www.themoviedb.org/">TMDb</a>.</li>' +
                        '</ul>'
                },
                multipleViews: {
                    title: 'Multiple views',
                    content: '<ul class="list-unstyled">' +
                        '<li>Switch between list and grid view.</li>' +
                        '<li>Sort and filter movies on different criteria.</li>' +
                        '</ul>'
                },
                recomendations: {
                    title: 'Movie recomendations',
                    content: '<ul class="list-unstyled">' +
                        '<li>Vote and see movie votes.</li>' +
                        '<li>Get suggestions for what to watch.</li>' +
                        '</ul>'
                }
            }
        }
    });
}