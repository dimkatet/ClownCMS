import * as React from 'react'
import { Editor, EditorState } from 'draft-js'
import './styles/Ribbon.css'

interface RibbonProbs {
    editorState: EditorState
    onToggle(type: string): void
}

interface RibbonState {

}

const INLINE_STYLES = [
    { label: 'B', style: 'BOLD' },
    { label: 'I', style: 'ITALIC' },
    { label: 'H', style: 'HIGHLIGHT' },
]

class Ribbon extends React.Component<RibbonProbs, RibbonState> {

    constructor(probs: RibbonProbs) {
        super(probs);
    }

    render() {
        const currentStyle = this.props.editorState.getCurrentInlineStyle();

        return (
            <div className='ribbon'>
                <ul className="ribbonItems">
                    {INLINE_STYLES.map(i =>
                        <li
                            className={`ribbonItem ${i.style.toLowerCase()} ${currentStyle.has(i.style) ? 'active' : ''}`}
                            key={i.label}
                            onMouseDown={(e) => {
                                e.preventDefault();
                                this.props.onToggle(i.style);
                            }}
                        >
                            {i.label}
                        </li>
                    )}
                </ul>
            </div>
        )
    }
}

export default Ribbon;