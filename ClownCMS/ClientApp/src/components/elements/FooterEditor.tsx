import * as React from 'react';
import {
    Editor,
    EditorState,
    ContentState,
    RichUtils,
} from 'draft-js';
import {
    getSelectionRange,
    getSelectionCoords
} from './utils/EditorUtils';
import './styles/FooterEditor.css';

interface FooterEditorProps {
    contentState: ContentState,
    updateContent(content: ContentState): void
}

interface FooterEditorState {
    editorState: EditorState,
    inlineToolbar: {
        show: boolean,
        position?: {
            top: number,
            left: number
        }
    }
}

export default class FooterEditor extends React.Component<FooterEditorProps, FooterEditorState>{
    constructor(props: any) {
        super(props);
        this.state = {
            editorState: EditorState.createWithContent(this.props.contentState),
            inlineToolbar: { show: false }
        };

        this.onChange = this.onChange.bind(this);
        this.handleKeyCommand = this.handleKeyCommand.bind(this);
        this.toggleInlineStyle = this.toggleInlineStyle.bind(this);
    }

    public componentDidMount() {
        //
    }

    public componentDidUpdate() {
        //
    }

    onChange(editorState: EditorState) {
        if (!editorState.getSelection().isCollapsed()) {
            const selectionRange = getSelectionRange();

            if (!selectionRange) {
                this.setState({ inlineToolbar: { show: false } });

                return;
            }

            const selectionCoords = getSelectionCoords(selectionRange);
            if (selectionCoords) {
                this.setState({
                    inlineToolbar: {
                        show: true,
                        position: selectionCoords
                    }
                });
            } else {
                this.setState({ inlineToolbar: { show: false } });
            }
        } else {
            this.setState({ inlineToolbar: { show: false } });
        }
        this.setState({ editorState: editorState });
        this.props.updateContent(editorState.getCurrentContent());
    }

    toggleInlineStyle(inlineStyle: string) {
        this.onChange(
            RichUtils.toggleInlineStyle(
                this.state.editorState,
                inlineStyle
            )
        );
    }

    handleKeyCommand(command: string, editorState: EditorState, event: number) {
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if (newState) {
            this.onChange(newState);
            return 'handled';
        }
        return 'not-handled';
    }

    render() {
        const {
            editorState,
            inlineToolbar
        } = this.state;

        return <div className='footer-editor' id='footer-editor'>
            {inlineToolbar.show && <InlineToolbar
                editorState={editorState}
                onToggle={this.toggleInlineStyle}
                position={inlineToolbar.position}
            />}
            <Editor
                editorState={this.state.editorState}
                onChange={this.onChange}
                handleKeyCommand={this.handleKeyCommand}    
            />
        </div>
    }
}


const INLINE_STYLES = [
    { label: 'B', style: 'BOLD' },
    { label: 'I', style: 'ITALIC' },
    { label: 'H', style: 'HIGHLIGHT' }
];

const InlineToolbar = (props: {
    editorState: EditorState,
    onToggle(style: string): void,
    position?: { top: number, left: number }
}) => {
    const currentStyle = props.editorState.getCurrentInlineStyle();

    return (
        <div
            className="toolbar"
            style={props.position}
        >
            <ul className="toolbar-items">
                {INLINE_STYLES.map(type =>
                    <li
                        key={type.label}
                        className={`toolbar-item ${type.style.toLowerCase()} ${currentStyle.has(type.style) ? 'active' : ''}`}
                        onMouseDown={(e) => {
                            e.preventDefault();
                            props.onToggle(type.style);
                        }}
                    >
                        {type.label}
                    </li>
                )}
            </ul>
        </div>
    );
};
