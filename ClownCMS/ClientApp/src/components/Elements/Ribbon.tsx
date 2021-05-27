import * as React from 'react';
import { EditorState } from 'draft-js';
import IconLink from '@material-ui/icons/Link';
import UnorderedListIcon from '@material-ui/icons/FormatListBulleted';
import OrderedListIcon from '@material-ui/icons/FormatListNumbered';
import ImageIcon from '@material-ui/icons/Image';
import { fontSizes, fontFamilies } from './utils/EditorStyles';
import './styles/Ribbon.css';

interface RibbonProbs {
    editorState: EditorState
    onToggle(type: string): void
    setLink(): void
    setList(listType: string): void
    setImages(e: React.ChangeEvent<HTMLInputElement>): void
}

interface RibbonState {
    isShowingFontSizeMenu: boolean,
    isShowingFontFamilyMenu: boolean
}

const INLINE_STYLES = [
    { label: 'B', style: 'BOLD' },
    { label: 'I', style: 'ITALIC' },
    { label: 'U', style: 'UNDERLINE' },
]

class Ribbon extends React.Component<RibbonProbs, RibbonState> {

    constructor(probs: RibbonProbs) {
        super(probs);
        this.state = { isShowingFontSizeMenu: false, isShowingFontFamilyMenu: false };
    }

    render() {
        const currentStyle = this.props.editorState.getCurrentInlineStyle();
        var currentFontSize = '12';
        var currentFontFamily = 'Arial';

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

        const fontFamilyOption = fontFamilies.map(fontFamily => {
            currentFontFamily = currentStyle.has(`FONT_FAMILY_${fontFamily.toUpperCase().replace(/\s/g, '_')}`) ? fontFamily : currentFontFamily;
            return (
                <div
                    key={`font-family-${fontFamily}`}
                    className='font-family-option'
                    onMouseDown={e => {
                        e.preventDefault();
                        this.props.onToggle(`FONT_FAMILY_${fontFamily.toUpperCase().replace(/\s/g, '_')}`);
                    }}
                >{fontFamily}</div>
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
                        <div className='font-size-button'> 
                            {currentFontSize}
                        </div>
                        {this.state.isShowingFontSizeMenu ?
                            <div className="selector-menu">
                                {fontSizeOptions}
                            </div> : null
                        }
                    </li>
                    <li
                        className={`ribbon-item ${this.state.isShowingFontFamilyMenu ? 'active' : ''}`}
                        onMouseDown={e => {
                            e.preventDefault();
                            this.setState({ isShowingFontFamilyMenu: !this.state.isShowingFontFamilyMenu })
                        }}
                    >
                        <div className='selector'>
                            <div className='font-family-button'>
                                {currentFontFamily}
                            </div>
                            {this.state.isShowingFontFamilyMenu ?
                                <div className="selector-menu">
                                    {fontFamilyOption}
                                </div> : null
                            }
                        </div>
                    </li>
                    <li
                        className='ribbon-item'
                        onMouseDown={e => {
                            e.preventDefault();
                            this.props.setList('unordered-list-item');
                        }}
                    >
                        <UnorderedListIcon />
                    </li>
                    <li
                        className='ribbon-item'
                        onMouseDown={e => {
                            e.preventDefault();
                            this.props.setList('ordered-list-item');
                        }}
                    >
                        <OrderedListIcon />
                    </li>
                    <li className='ribbon-item'>
                        <label htmlFor='file'>
                            <ImageIcon />
                        </label>
                        <input
                            type='file'
                            id='file'
                            multiple
                            onChange={this.props.setImages}
                        />
                    </li>
                </ul>
            </div>
        )
    }
}

export default Ribbon;