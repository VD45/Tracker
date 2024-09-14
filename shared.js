//shared.js 1.3
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
