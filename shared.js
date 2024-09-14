//shared.js 2222.9
window.sharedState = window.sharedState || {};

window.addEventListener('message', function(event) {
    if (event.data.type === 'updateState') {
        sharedState = {...sharedState, ...event.data.state};
        broadcastState();
    }
});

function broadcastState() {
    const modules = ['demandModule', 'availabilityModule', 'opexCapexModule'];
    modules.forEach(moduleId => {
        const moduleObject = document.getElementById(moduleId);
        if (moduleObject && moduleObject.contentWindow) {
            moduleObject.contentWindow.postMessage({type: 'stateUpdate', state: sharedState}, '*');
        }
    });
}

function updateSharedState(newState) {
    sharedState = {...sharedState, ...newState};
    broadcastState();
}
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBCKiUJVo3pzEs9V2uldKTWddxXwahmwIk",
  authDomain: "tracker-calcu.firebaseapp.com",
  projectId: "tracker-calcu",
  storageBucket: "tracker-calcu.appspot.com",
  messagingSenderId: "532092190959",
  appId: "1:532092190959:web:345857d766c18bb91edb1a",
  measurementId: "G-DYX46QYFE5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Register the service worker when the page loads
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
            console.log('Service Worker registered with scope:', registration.scope);
        }).catch(error => {
            console.log('Service Worker registration failed:', error);
        });
    });
}

let deferredPrompt;  // Variable to store the install prompt event

// Listen for the `beforeinstallprompt` event, which triggers when the app is installable
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();  // Prevent the default mini-infobar from appearing on mobile
    deferredPrompt = e;  // Save the event for later use

    // Show the install button when the app is installable
    const installButton = document.getElementById('installApp');
    installButton.style.display = 'block';

    // Handle the click event for the install button
    installButton.addEventListener('click', () => {
        installButton.style.display = 'none';  // Hide the button after it's clicked
        deferredPrompt.prompt();  // Show the install prompt
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the install prompt');
            } else {
                console.log('User dismissed the install prompt');
            }
            deferredPrompt = null;  // Clear the deferred prompt event after handling
        });
    });
});

// Listen for the `appinstalled` event, which triggers when the app is installed
window.addEventListener('appinstalled', (event) => {
    console.log('PWA installed successfully');
