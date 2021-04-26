import * as React from 'react';
import { useState } from 'react';
import { EditorState } from 'draft-js';
import IconLink from '@material-ui/icons/Link';
import './styles/Ribbon.css';

interface RibbonProbs {
    editorState: EditorState
    onToggle(type: string): void
    setLink(): void
}

interface RibbonState {
    isShowingFontSizeMenu: boolean
}

const INLINE_STYLES = [
    { label: 'B', style: 'BOLD' },
    { label: 'I', style: 'ITALIC' },
    { label: 'U', style: 'UNDERLINE' },
]

class Ribbon extends React.Component<RibbonProbs, RibbonState> {

    constructor(probs: RibbonProbs) {
        super(probs);
        this.state = { isShowingFontSizeMenu: false};
    }

    render() {
        const currentStyle = this.props.editorState.getCurrentInlineStyle();
        var currentFontSize = 12;
        const fontSizes = [8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 48, 72];

        const fontSizeOptions = fontSizes.map(fontSize => {
            currentFontSize = currentStyle.has(`FONT_SIZE_${fontSize}`) ? fontSize : currentFontSize;
            return (
                <div
                    key={`font-size-${fontSize}`}
                    className='font-size-option'
                    onMouseDown={e => {
                        e.preventDefault();
                        this.props.onToggle(`FONT_SIZE_${fontSize}`);
                    }}
                >{fontSize}</div>
            )
        });

        return (
            <div className='ribbon'>
                <ul className="ribbon-items">
                    {INLINE_STYLES.map(i =>
                        <li
                            className={`ribbon-item ${i.style.toLowerCase()} ${currentStyle.has(i.style) ? 'active' : ''}`}
                            key={i.label}
                            onMouseDown={(e) => {
                                e.preventDefault();
                                this.props.onToggle(i.style);
                            }}
                        >
                            {i.label}
                        </li>
                    )}
                    <li
                        className='ribbon-item'
                        key='addLinkButton'
                        onMouseDown={this.props.setLink}
                    >
                        <IconLink />
                    </li>
                    <li
                        className={`ribbon-item ${this.state.isShowingFontSizeMenu ? 'active' : ''}`}
                        onMouseDown={e => {
                            e.preventDefault();
                            this.setState({ isShowingFontSizeMenu: !this.state.isShowingFontSizeMenu })
                        }}
                    >
                        {currentFontSize}
                        {this.state.isShowingFontSizeMenu ?
                            <div className="font-size-menu">
                                {fontSizeOptions}
                            </div> : null
                        }
                    </li>
                </ul>
            </div>
        )
    }
}

export default Ribbon;