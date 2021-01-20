import { Console } from 'console';
import { Action, Reducer } from 'redux';
import { AppThunkAction } from './';

export interface StartPageState {
    isLoading: boolean;
    projects: Project[];
    selectedProjectID: number;
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

interface SelectProjectAction {
    type: 'SELECT_PROJECT',
    projectID: number
}

type KnownAction = RequestProjectsAction | ReceiveProjectsAction | SelectProjectAction;

export const actionCreators = {
    requestProjects: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const appState = getState();
        if (appState && appState.startPage) {
            fetch('projects', { method: 'GET' })
                .then(response => response.json() as Promise<Project[]>)
                .then(data => {
                    dispatch({ type: 'RECEIVE_PROJECTS', projects: data });
                });
            dispatch({ type: 'REQUEST_PROJECTS' });
        }
    },

    selectProject: (id: number): AppThunkAction<KnownAction> => (dispatch, getState) => {
        dispatch({ type: 'SELECT_PROJECT', projectID: id });
    }
};

const unloadedState: StartPageState = { projects: [], isLoading: false, selectedProjectID: -1 };

export const reducer: Reducer<StartPageState> = (state: StartPageState | undefined, incomingAction: Action): StartPageState => {
    if (state === undefined) {
        return unloadedState;
    }

    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'REQUEST_PROJECTS':
            return {
                projects: state.projects,
                isLoading: true,
                selectedProjectID: -1
            };
        case 'RECEIVE_PROJECTS':
            return {
                projects: action.projects,
                isLoading: false,
                selectedProjectID: -1
            };
        case 'SELECT_PROJECT':
            return {
                projects: state.projects,
                isLoading: state.isLoading,
                selectedProjectID: action.projectID
            }
        default:
            break;
    }

    return state;
};