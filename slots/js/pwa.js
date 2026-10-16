if('serviceWorker' in navigator) {
    navigator.serviceWorker
        .register('serviceWorker.js')
        .then( registration => {
            console.log('Registration successful, scope is:', registration.scope);
        })
        .catch ( error=> {
            console.log('ServiceWorker registration failed, error:', error);
        });
}