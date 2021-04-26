import * as React from 'react';
import { Editor, EditorState, ContentState, RichUtils, CompositeDecorator, convertToRaw, convertFromRaw } from 'draft-js';
import Ribbon from './Ribbon';
import './styles/TextEditor.css';

interface TextEditorProbs {
    contentState: ContentState,
    updateContent(content: ContentState): void
}

interface TextEditorState {
    editorState: EditorState
}

class TextEditor extends React.Component<TextEditorProbs, TextEditorState> {

    constructor(probs: TextEditorProbs) {
        super(probs);
        this.state = { editorState: EditorState.createWithContent(this.props.contentState, decorator) };
        this.toggleInlineStyle = this.toggleInlineStyle.bind(this);
        this.onChange = this.onChange.bind(this);
        this.handleKeyCommand = this.handleKeyCommand.bind(this);
        this.setLink = this.setLink.bind(this);
        this.getEditorState = this.getEditorState.bind(this);
        this.changeFontSize = this.changeFontSize.bind(this);

    }

    componentDidMount() {
    }

    onChange(editorState: EditorState) {
        this.setState({ editorState });
        this.props.updateContent(editorState.getCurrentContent());
    }

    getEditorState() {
        return this.state.editorState;
    }

    handleKeyCommand(command: any) {
        const { editorState } = this.state;
        const newState = RichUtils.handleKeyCommand(editorState, command);

        if (newState) {
            this.onChange(newState);
            return true;
        }

        return false;
    }

    changeFontSize(fontSize: number) {
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
        this.onChange(
            RichUtils.toggleInlineStyle(
                this.state.editorState,
                inlineStyle
            )
        );
        const content = convertToRaw(this.state.editorState.getCurrentContent());
        console.log(content);
    }

    render() {
        return (
            <div className='text-editor'>
                <Ribbon
                    editorState={this.state.editorState}
                    onToggle={this.toggleInlineStyle}
                    setLink={this.setLink}
                />
                <Editor
                    editorState={this.state.editorState}
                    onChange={this.onChange}
                    handleKeyCommand={this.handleKeyCommand}
                    customStyleMap={customStyleMap}
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

const customStyleMap = {
    FONT_SIZE_8: {
        fontSize: '8pt'
    },
    FONT_SIZE_10: {
        fontSize: '10pt'
    },
    FONT_SIZE_12: {
        fontSize: '12pt'
    },
    FONT_SIZE_14: {
        fontSize: '14pt'
    },
    FONT_SIZE_16: {
        fontSize: '16pt'
    },
    FONT_SIZE_18: {
        fontSize: '18pt'
    },
    FONT_SIZE_20: {
        fontSize: '20pt'
    },
    FONT_SIZE_24: {
        fontSize: '24pt'
    },
    FONT_SIZE_28: {
        fontSize: '28pt'
    },
    FONT_SIZE_32: {
        fontSize: '32pt'
    },
    FONT_SIZE_48: {
        fontSize: '48pt'
    },
    FONT_SIZE_72: {
        fontSize: '72pt'
    }

}

export default TextEditor