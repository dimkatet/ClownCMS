import { Action, Reducer } from 'redux';
import { EditorState, ContentState, convertFromRaw, convertToRaw, EditorBlock, RawDraftContentBlock, RawDraftContentState } from 'draft-js'
import { AppThunkAction } from './';
import { Update } from '@material-ui/icons';
import { render } from 'react-dom';

export interface BodyState {
    isLoading: boolean,
    content: ContentState
};

interface RequestContentsAction {
    type: 'REQUEST_CONTENT'
};

interface ReceiveContentAction {
    type: 'RECEIVE_CONTENT',
    content: ContentState
};

interface UpdateContentAction {
    type: 'UPDATE_CONTENT',
    content: ContentState
};

interface SaveContentAction {
    type: 'SAVE_CONTENT',
    status: boolean
};

type ContentAction = RequestContentsAction | ReceiveContentAction | UpdateContentAction | SaveContentAction;

const requestContent = (dispatch, getState) => {
    const appState = getState();
    if (appState && appState.body) {
        fetch('pages/1', { method: 'GET' })
            .then(response => {
                if (response.ok)
                    return response.json();
                return null;
            })
            .then(data => {
                if (data !== null) {
                    const content = convertFromRaw(JSON.parse(data));
                    dispatch({ type: 'RECEIVE_CONTENT', content: content });;
                }
            });
        dispatch({ type: 'REQUEST_CONTENT' });
    }
};

const postImage = async (url: string) => {
    if (!url.includes('blob'))
        return url;
    let res: string = '';
    await fetch(url)
        .then(r => r.blob())
        .then(async blob => {
            const formData = new FormData();
            formData.append('data', blob);
            await fetch('image', {
                method: 'POST',
                body: formData
            })
                .then(r => r.text())
                .then(data => {
                    res = data
                })
        });
    return res;
}

const findBlocks = async (content: RawDraftContentState) => {
    const blocks = content['blocks'];
    for(let block of blocks) {
        if (block['type'] == 'IMAGE') {
            if (!block['data'])
                return
            await postImage(block['data']['image']['src']).then(url => {
                block['data']['image']['src'] = url;
            }) 
        }
        if (block['type'] == 'SLIDER') {
            if (!block['data'])
                return
            const slides = block['data']['slides']
            for (let slide of slides) {
                await postImage(slide['src']).then(url => {
                    slide['src'] = url;
                })
            }
        }
    }
}

export const actionCreators = {
    requestContent: (): AppThunkAction<ContentAction> => requestContent,

    updateContent: (content: ContentState): AppThunkAction<ContentAction> => (dispatch, getState) => {
        const appState = getState();
        if (appState && appState.body) {
            const c = convertToRaw(content);
            dispatch({ type: 'UPDATE_CONTENT', content: content });
        }
    },

    saveContent: (content: ContentState): AppThunkAction<ContentAction> => (dispatch, getState) => {
        const appState = getState();
        if (appState && appState.body) {
            const c = convertToRaw(content);
            findBlocks(c).then(() => {
                const item = {
                    pageId: 1,
                    content: JSON.stringify(c)
                }
                fetch('pages', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(item)
                })
                    .then(response => response.ok)
                    .then(status => dispatch({ type: 'SAVE_CONTENT', status }));
            })
        }
    }

};

const unloadedState: BodyState = { isLoading: false, content: EditorState.createEmpty().getCurrentContent() };

export const reducer: Reducer<BodyState> = (state: BodyState | undefined, incomingAction: Action): BodyState => {
    if (state === undefined) {
        return unloadedState;
    }

    const action = incomingAction as ContentAction;
    switch (action.type) {
        case 'RECEIVE_CONTENT':
            return {
                isLoading: false,
                content: action.content
            }
        case 'REQUEST_CONTENT':
            return {
                isLoading: true,
                content: state.content
            }
        case 'UPDATE_CONTENT':
            return {
                isLoading: false,
                content: action.content
            }
        case 'SAVE_CONTENT':
            console.log(action.status);
            return state;
        default:
            break;
    }
    return state;
}