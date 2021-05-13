import { Action, Reducer } from 'redux';
import { EditorState, ContentState, convertFromRaw, convertToRaw, EditorBlock, RawDraftContentBlock, RawDraftContentState } from 'draft-js'
import { AppThunkAction } from './';

export interface BodyState {
    isLoading: boolean,
    previewId: number,
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
interface SavePreviewIdAction {
    type: 'SAVE_PREVIEWID',
    previewId: number
};

type ContentAction = RequestContentsAction | ReceiveContentAction | UpdateContentAction | SaveContentAction | SavePreviewIdAction;


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
        if (block['type'] === 'IMAGE') {
            if (block['data'] === undefined)
                continue;
            await postImage(block['data']['image']['src']).then(urn => {
                if (block['data'])
                    block['data']['image']['src'] = urn;
            }) 
        }
        if (block['type'] === 'SLIDER') {
            if (block['data'] === undefined)
                continue;
            const slides = block['data']['slides']
            for (let slide of slides) {
                await postImage(slide['src']).then(urn => {
                    slide['src'] = urn;
                })
            }
        }
    }
}

export const actionCreators = {
    requestContent: (previewId: number): AppThunkAction<ContentAction> => (dispatch, getState) => {
        const appState = getState();
        if (appState && appState.body) {
            fetch('pages/' + previewId, { method: 'GET' })
                .then(response => {
                    if (response.ok) {
                        dispatch({ type: 'SAVE_PREVIEWID', previewId: previewId});
                        return response.json();
                    }
                    return null;
                })
                .then(data => {
                    if (data !== null) {
                        const content = convertFromRaw(JSON.parse(data));
                        dispatch({ type: 'RECEIVE_CONTENT', content: content });
                    }
                });
            dispatch({ type: 'REQUEST_CONTENT' });
        }
    },

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
                if (appState.body) {
                    const item = {
                        previewId: appState.body.previewId,
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
                }
            })
        }
    }

};

const unloadedState: BodyState = { isLoading: false, content: EditorState.createEmpty().getCurrentContent(), previewId: -1};

export const reducer: Reducer<BodyState> = (state: BodyState | undefined, incomingAction: Action): BodyState => {
    if (state === undefined) {
        return unloadedState;
    }
    const action = incomingAction as ContentAction;
    switch (action.type) {
        case 'RECEIVE_CONTENT':
            return {
                isLoading: false,
                content: action.content,
                previewId: state.previewId
            }
        case 'REQUEST_CONTENT':
            return {
                isLoading: true,
                content: state.content,
                previewId: state.previewId
            }
        case 'UPDATE_CONTENT':
            return {
                isLoading: false,
                content: action.content,
                previewId: state.previewId
            }
        case 'SAVE_CONTENT':
            return state;
        case 'SAVE_PREVIEWID':
            return {
                isLoading: state.isLoading,
                content: state.content,
                previewId: action.previewId
            }
        default:
            break;
    }
    return state;
}