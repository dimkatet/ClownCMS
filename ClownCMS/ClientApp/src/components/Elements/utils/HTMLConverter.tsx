﻿import * as React from 'react';
import { convertToHTML } from 'draft-convert';
import { fontFamilies, fontSizes } from './EditorStyles';
import SliderBlock from '../SliderBlock';
import '../styles/ImageBlock.css';
import { ContentBlock, ContentState } from 'draft-js';

const styleToHTML = (style: string) => {
    if (style.includes('FONT_SIZE_')) {
        var r = /\d+/;
        var fSize = style.match(r);
        return <span style={{ fontSize: fSize + 'pt' }} />;
    }
    if (style.includes('FONT_FAMILY_')) {
        var fFamily = 'Arial';
        fontFamilies.forEach(font => {
            if (style.includes(font.toUpperCase().replace(/\s/g, '_')))
                fFamily = font;
        })
        return <span style={{ fontFamily: fFamily }} />;
    }
    switch (style) {
        case 'ITALIC':
            return <em className="italic" />;
        case 'BOLD':
            return <strong className="bold" />;
        case 'UNDERLINE':
            return <span className="underline" style={{ textDecoration: 'underline' }}/>;
        default:
            return null;
    }
}

const blockToHTML = (block: any) => {
    switch (block.type) {
        case 'IMAGE':
            const src = block.data.image.src;
            return <img className='image-block' src={src} />
        case 'SLIDER':
            const slides = block.data.slides;
            return {
                start: `<div class="slider js-slider" data-slides="${JSON.stringify(slides).replace(/"/g, "'")}"><div>`,
                end: `</div></div>`
            }
        default:
            return null;
    }
}
const entityToHTML = (entity: any, originalText: string) => {
    if (entity.type === 'LINK') {
        return <a
            href={entity.data.url}
            target="_blank"
        >
            {originalText}
        </a>;
    }
    return originalText;
}

export const options = {
    styleToHTML,
    blockToHTML,
    entityToHTML,
};

const converterFunction = convertToHTML(options);

export default (contentState: ContentState) => converterFunction(contentState);
