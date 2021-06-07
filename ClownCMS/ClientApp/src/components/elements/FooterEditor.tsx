import * as React from 'react';
import {
    Editor,
    EditorState,
    ContentState,
    RichUtils,
    CompositeDecorator,
    ContentBlock,
} from 'draft-js';
import {
    getSelectionRange,
    getSelectionCoords
} from './utils/EditorUtils';
import IconLink from '@material-ui/icons/Link';
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

        const decorator = new CompositeDecorator([
            {
                strategy: findLinkEntities,
                component: Link
            }
        ]);

        this.state = {
            editorState: EditorState.createWithContent(this.props.contentState, decorator),
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

    private setLink = () => {
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

        this.onChange(RichUtils.toggleLink(
            newEditorState,
            newEditorState.getSelection(),
            entityKey
        ));
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
                setLink={this.setLink}
            />}
            <Editor
                editorState={this.state.editorState}
                onChange={this.onChange}
                handleKeyCommand={this.handleKeyCommand}    
            />
        </div>
    }
}

function findLinkEntities(contentBlock: ContentBlock, callback: (start: number, end: number) => void, contentState: ContentState) {
    contentBlock.findEntityRanges(
        (character) => {
            const entityKey = character.getEntity();
            return (
                entityKey !== null &&
                contentState.getEntity(entityKey).getType() === 'LINK'
            );
        },
        callback
    );
}

const Link = (props: { contentState: ContentState, entityKey: string, children: any}) => {
    const { url } = props.contentState
        .getEntity(props.entityKey).getData();

    return (
        <a href={url} title={url} className="ed-link">
            {props.children}
        </a>
    );
};

const INLINE_STYLES = [
    { label: 'B', style: 'BOLD' },
    { label: 'I', style: 'ITALIC' },
    { label: 'U', style: 'UNDERLINE' }
];

const InlineToolbar = (props: {
    editorState: EditorState,
    onToggle(style: string): void,
    position?: { top: number, left: number },
    setLink(): void
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
                <li
                    key="add-link-button"
                    className="toolbar-item"
                    onMouseDown={props.setLink}
                >
                    <IconLink />
                </li>
            </ul>
        </div>
    );
};
