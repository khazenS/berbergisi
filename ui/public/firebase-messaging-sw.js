importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js");

firebase.initializeApp({
    apiKey,// Your API Key,
    authDomain,// Your Auth Domain,
    projectId,// Your Project Id,
    messagingSenderId,// Your Messaging,
    appId,// Your App Id,
});

const messaging = firebase.messaging()

messaging.onBackgroundMessage(payload => {
    self.registration.showNotification(payload.notification.title, {
        body: payload.notification.body,
        icon : '/gisiLogo.png'
    });
});