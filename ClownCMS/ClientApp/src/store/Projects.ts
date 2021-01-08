import { Console } from 'console';
import { Action, Reducer } from 'redux';
import { AppThunkAction } from './';

export interface ProjectsState {
    isLoading: boolean;
    startDateIndex?: number;
    projects: Project[];
}

export interface Project {
    projectID: number;
    projectName: string;
}

interface RequestProjectsAction {
    type: 'REQUEST_PROJECTS';
    startDateIndex: number;
}

interface ReceiveProjectsAction {
    type: 'RECEIVE_PROJECTS';
    startDateIndex: number;
    projects: Project[];
}

type KnownAction = RequestProjectsAction | ReceiveProjectsAction;

export const actionCreators = {
    requestProjects: (startDateIndex: number): AppThunkAction<KnownAction> => (dispatch, getState) => {
        // Only load data if it's something we don't already have (and are not already loading)
        const appState = getState();
        if (appState && appState.projects && startDateIndex !== appState.projects.startDateIndex) {
            fetch('projects', { method: 'GET' })
                .then(response => response.json() as Promise<Project[]>)
                .then(data => {
                    dispatch({ type: 'RECEIVE_PROJECTS', startDateIndex: startDateIndex, projects: data });
                });
            dispatch({ type: 'REQUEST_PROJECTS', startDateIndex: startDateIndex });
        }
    }
};

const unloadedState: ProjectsState = { projects: [], isLoading: false };

export const reducer: Reducer<ProjectsState> = (state: ProjectsState | undefined, incomingAction: Action): ProjectsState => {
    if (state === undefined) {
        return unloadedState;
    }

    const action = incomingAction as KnownAction;
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