"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reducer = exports.actionCreators = void 0;
exports.actionCreators = {
    requestProjects: function (startDateIndex) { return function (dispatch, getState) {
        // Only load data if it's something we don't already have (and are not already loading)
        var appState = getState();
        if (appState && appState.projects && startDateIndex !== appState.projects.startDateIndex) {
            fetch('projects', { method: 'GET' })
                .then(function (response) { return response.json(); })
                .then(function (data) {
                dispatch({ type: 'RECEIVE_PROJECTS', startDateIndex: startDateIndex, projects: data });
            });
            dispatch({ type: 'REQUEST_PROJECTS', startDateIndex: startDateIndex });
        }
    }; }
};
var unloadedState = { projects: [], isLoading: false };
var reducer = function (state, incomingAction) {
    if (state === undefined) {
        return unloadedState;
    }
    var action = incomingAction;
    switch (action.type) {
        case 'REQUEST_PROJECTS':
            return {
                startDateIndex: action.startDateIndex,
                projects: state.projects,
                isLoading: true
            };
        case 'RECEIVE_PROJECTS':
            // Only accept the incoming data if it matches the most recent request. This ensures we correctly
            // handle out-of-order responses.
            if (action.startDateIndex === state.startDateIndex) {
                return {
                    startDateIndex: action.startDateIndex,
                    projects: action.projects,
                    isLoading: false
                };
            }
            break;
    }
    return state;
};
exports.reducer = reducer;
//# sourceMappingURL=Projects.js.map