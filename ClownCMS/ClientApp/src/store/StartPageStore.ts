import { Action, Reducer } from 'redux';
import { AppThunkAction } from './';
import config from './project_config.json';

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
        fetch(config.URL + 'projects', { method: 'GET' })
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
                .then(response => { if (response.status == 200) requestProjects(dispath, getState); });
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
                .then(response => { if (response.status == 200) requestProjects(dispath, getState);});
        }
    },

    editProject: (projectName: string, projectId: number): AppThunkAction<Action> => (dispath, getState) => {
        var appState = getState();
        if (appState && appState.startPage) {
            const item = {
                projectName: projectName,
                projectId: projectId
            }
            fetch('projects/name', {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                },
                body: JSON.stringify(item)
            })
                .then(response => response.ok)
                .then(data => {
                    requestProjects(dispath, getState);
                    console.log(data);
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