import { Action, Reducer } from 'redux';
import { AppThunkAction } from './';

export interface StartPageState {
    isLoading: boolean;
    projects: Project[];
}

export interface Project {
    projectID: number;
    projectName: string;
}

interface RequestProjectsAction {
    type: 'REQUEST_PROJECTS';
}

interface ReceiveProjectsAction {
    type: 'RECEIVE_PROJECTS';
    projects: Project[];
}


type KnownAction = RequestProjectsAction | ReceiveProjectsAction;

const requestProjects = (dispatch: any, getState: any) => {
    const appState = getState();
    if (appState && appState.startPage) {
        fetch('projects', { method: 'GET' })
            .then(response => response.json() as Promise<Project[]>)
            .then(data => {
                dispatch({ type: 'RECEIVE_PROJECTS', projects: data });
            });
        dispatch({ type: 'REQUEST_PROJECTS' });
    }
}

export const actionCreators = {
    requestProjects: (): AppThunkAction<KnownAction> => requestProjects,

    createProject: (projectName: string): AppThunkAction<Action> => (dispath, getState) => {
        var appState = getState();
        if (appState && appState.startPage) {
            fetch('projects', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                },
                body: JSON.stringify(projectName)
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    requestProjects(dispath, getState);
                });
        }
    },

    deleteProject: (projectID: number): AppThunkAction<Action> => (dispath, getState) => {
        var appState = getState();
        if (appState && appState.startPage) {
            fetch('projects', {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                },
                body: JSON.stringify(projectID)
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    requestProjects(dispath, getState);
                });
        }
    }
};

const unloadedState: StartPageState = { projects: [], isLoading: false };

export const reducer: Reducer<StartPageState> = (state: StartPageState | undefined, incomingAction: Action): StartPageState => {
    if (state === undefined) {
        return unloadedState;
    }

    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'REQUEST_PROJECTS':
            return {
                projects: state.projects,
                isLoading: true
            };
        case 'RECEIVE_PROJECTS':
            return {
                projects: action.projects,
                isLoading: false
            };
        default:
            break;
    }

    return state;
};