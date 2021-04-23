import * as React from 'react'
import { Editor, EditorState, RichUtils } from 'draft-js'
import Ribbon from './Ribbon'
import './styles/TextEditor.css'

interface TextEditorProbs {
    
}

interface TextEditorState {
    editorState: EditorState
}

class TextEditor extends React.Component<TextEditorProbs, TextEditorState> {
    constructor(probs: TextEditorProbs) {
        super(probs);
        this.state = { editorState: EditorState.createEmpty() };
        this.toggleInlineStyle = this.toggleInlineStyle.bind(this);
        this.onChange = this.onChange.bind(this);
        this.handleKeyCommand = this.handleKeyCommand.bind(this);
    }

    onChange(editorState) {
        this.setState({ editorState });
    }

    handleKeyCommand(command) {
        const { editorState } = this.state;
        const newState = RichUtils.handleKeyCommand(editorState, command);

        if (newState) {
            this.onChange(newState);
            return true;
        }

        return false;
    }

    toggleInlineStyle(inlineStyle: string) {
        this.onChange(
            RichUtils.toggleInlineStyle(
                this.state.editorState,
                inlineStyle
            )
        );
    }

    render() {
        return (
            <div className='textEditor'>
                <Ribbon editorState={this.state.editorState} onToggle={this.toggleInlineStyle} />
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

const customStyleMap = {
    HIGHLIGHT: {
        textDecoration: 'underline'
    },
};

export default TextEditor