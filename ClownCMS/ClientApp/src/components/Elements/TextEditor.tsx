import * as React from 'react';
import {
    Editor,
    EditorState,
    ContentState,
    RichUtils,
    CompositeDecorator,
    Modifier,
    ContentBlock,
    DefaultDraftBlockRenderMap,
    DraftHandleValue,
    KeyBindingUtil
} from 'draft-js';
import Ribbon from './Ribbon';
import ImageBlock from './ImageBlock';
import SliderBlock from './SliderBlock';
import customStyleMap from './utils/EditorStyles';
import { addNewBlockAt, getCurrentBlock } from './utils/EditorUtils';
import { getCrossingStyles, isCrossingStyle } from './utils/EditorStyles';
import { Map } from 'immutable';
import './styles/TextEditor.css';

const urlCreator = window.URL || window.webkitURL;

interface TextEditorProbs {
    contentState: ContentState,
    updateContent(content: ContentState): void
}

interface TextEditorState {
    editorState: EditorState
}

type SyntheticKeyboardEvent = React.KeyboardEvent<{}>;

class TextEditor extends React.Component<TextEditorProbs, TextEditorState> {


    constructor(probs: TextEditorProbs) {
        super(probs);
        this.state = { editorState: EditorState.createWithContent(this.props.contentState, decorator) };
        this.getEditorState = this.getEditorState.bind(this);
        this.setEditorState = this.setEditorState.bind(this);
        this.toggleInlineStyle = this.toggleInlineStyle.bind(this);
        this.toggleCustomStyle = this.toggleCustomStyle.bind(this);
        this.toggleList = this.toggleList.bind(this);
        this.handleKeyCommand = this.handleKeyCommand.bind(this);
        this.handleInputFiles = this.handleInputFiles.bind(this);
        this.handleReturn = this.handleReturn.bind(this);
        this.setLink = this.setLink.bind(this);
        this.onChange = this.onChange.bind(this);

        this.blockRendererFn = customBlockRenderer(this.setEditorState, this.getEditorState);
    }

    onChange(editorState: EditorState) {
        this.setState({ editorState: editorState });
        this.props.updateContent(editorState.getCurrentContent());
    }

    getEditorState() {
        return this.state.editorState;
    }

    setEditorState(editorState: EditorState) {
        this.setState({ editorState });
    }

    blockRendererFn(block: ContentBlock): Object | null {
        return null;
    }

    handleKeyCommand(command: string, editorState: EditorState, event: number) {

        const newState = RichUtils.handleKeyCommand(editorState, command);

        if (newState) {
            this.onChange(newState);
            return 'handled';
        }
        return 'not-handled';
    }

    handleReturn(e: SyntheticKeyboardEvent, editorState: EditorState): DraftHandleValue {

        if (KeyBindingUtil.isSoftNewlineEvent(e)) {
            this.onChange(RichUtils.insertSoftNewline(editorState));
            return 'handled';
        } else if (!e.altKey && !e.metaKey && !e.ctrlKey) {
            const currentBlock = getCurrentBlock(editorState);
            const blockType = currentBlock.getType();

            if (blockType === 'SLIDER') {
                this.onChange(addNewBlockAt(editorState, currentBlock.getKey()));
                return 'handled';
            }
        }
        return 'not-handled';
    }

    setLink() {
        const urlValue = prompt('Введите ссылку', '');
        const { editorState } = this.state;
        const contentState = editorState.getCurrentContent();
        const contentStateWithEntity = contentState.createEntity(
            'LINK',
            'SEGMENTED',
            { url: urlValue }
        );

        const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
        const newEditorState = EditorState.set(editorState, { currentContent: contentStateWithEntity });

        this.setState({
            editorState: RichUtils.toggleLink(
                newEditorState,
                newEditorState.getSelection(),
                entityKey
            )
        });
    }

    toggleInlineStyle(inlineStyle: string) {
        if (isCrossingStyle(inlineStyle)) {
            this.toggleCustomStyle(inlineStyle, getCrossingStyles(inlineStyle, this.getEditorState().getCurrentInlineStyle()));
        }
        else {
            this.onChange(
                RichUtils.toggleInlineStyle(
                    this.state.editorState,
                    inlineStyle
                )
            );
        }
    }

    toggleCustomStyle(inlineStyle: string, crossingStyles: string[]) {
        const selection = this.state.editorState.getSelection();
        if (selection.isCollapsed()) {
            this.onChange(
                RichUtils.toggleInlineStyle(
                    this.state.editorState,
                    inlineStyle
                )
            );
            return;
        }
        const contentState = this.state.editorState.getCurrentContent();
        const contentWithoutStyles = crossingStyles.reduce(
            (newContentState, crossingStyle) => {
                if (crossingStyle === inlineStyle)
                    return Modifier.applyInlineStyle(
                        newContentState,
                        selection,
                        inlineStyle
                    )
                return Modifier.removeInlineStyle(
                    newContentState,
                    selection,
                    crossingStyle
                )
            },
            contentState
        );

        const newEditorState = EditorState.push(
            this.state.editorState,
            contentWithoutStyles,
            'change-inline-style'
        );

        this.onChange(newEditorState);
    }

    toggleList(listType: string) {
        this.onChange(RichUtils.toggleBlockType(
            this.state.editorState,
            listType
        ));
    }

    handleInputFiles(e: React.ChangeEvent<HTMLInputElement>) {
        const files = e.target.files;
        if (files === null)
            return;

        const filteredFiles: Array<File> = [];
        for (var i = 0; i < files.length; i++) {
            if (files[i].type.indexOf('image/') === 0)
                filteredFiles.push(files[i]);
        }
        if (filteredFiles.length === 0)
            return;

        const selection = this.state.editorState.getSelection();
        if (filteredFiles.length === 1) {
            this.onChange(addNewBlockAt(
                this.getEditorState(),
                selection.getAnchorKey(),
                'IMAGE',
                Map({
                    'image': {
                        src: urlCreator.createObjectURL(filteredFiles[0])
                    }
                })
            ));
            return;
        }

        const res: Array<{ src: string }> = [];
        filteredFiles.forEach(f => {
            res.push({ src: urlCreator.createObjectURL(f) });
        });
        this.onChange(addNewBlockAt(
            this.getEditorState(),
            selection.getAnchorKey(),
            'SLIDER',
            Map({
                'slides': res
            })
        ));

        //this.onChange(RichUtils.insertSoftNewline(this.getEditorState()));
        
    }

    render() {
        return (
            <div className='text-editor'>
                <Ribbon
                    editorState={this.state.editorState}
                    onToggle={this.toggleInlineStyle}
                    setLink={this.setLink}
                    setList={this.toggleList}
                    setImages={this.handleInputFiles}
                />
                <Editor
                    editorState={this.state.editorState}
                    onChange={this.onChange}
                    handleKeyCommand={this.handleKeyCommand}
                    customStyleMap={customStyleMap}
                    blockRendererFn={this.blockRendererFn}
                    blockRenderMap={RenderMap}
                    handleReturn={this.handleReturn}
                    ref='editor'
                />
            </div>
        );
    }
}

function findLinkEntities(contentBlock: any, callback: any, contentState: any) {
    contentBlock.findEntityRanges(
        (character: any) => {
            const entityKey = character.getEntity();
            return (
                entityKey !== null &&
                contentState.getEntity(entityKey).getType() === 'LINK'
            );
        },
        callback
    );
}

const Link = (props: any) => {
    const { url } = props.contentState.getEntity(props.entityKey).getData();

    return (
        <a href={url} title={url} className="ed-link">
            {props.children}
        </a>
    );
};

const decorator: CompositeDecorator = new CompositeDecorator([
    {
        strategy: findLinkEntities,
        component: Link
    }
]);

const customBlockRenderer = (setEditorState: Function, getEditorState: Function) => (contentBlock: ContentBlock) => {
    const type = contentBlock.getType();
    switch (type) {
        case 'IMAGE':
            return {
                component: ImageBlock,
                editable: false
            };
        case 'SLIDER':
            return {
                component: SliderBlock,
                editable: false
            }
        default: return null;
    }
};

const RenderMap = Map<string, { element: string }>({
    'IMAGE': {
        element: 'div'
    },
    'SLIDER': {
        element: 'div'
    }
}).merge(DefaultDraftBlockRenderMap);

export default TextEditor