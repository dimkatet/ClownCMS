import * as React from 'react';
import { convertToHTML } from 'draft-convert';
import { fontFamilies } from './EditorStyles';
import '../styles/ImageBlock.css';
import config from '../../../store/project_config.json';
import { ContentState } from 'draft-js';

const styleToHTML = (style: string) => {
    if (style.includes('FONT_SIZE_')) {
        var r = /\d+/;
        var fSize = style.match(r) + '';
        return <span style={{ fontSize: parseInt(fSize) / 12 + 'em' }} />;
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
            return <div className='govno'/>;
    }
}

const blockToHTML = (block: any) => {
    switch (block.type) {
        case 'unstyled':
            if (block.text === ' ' || block.text === '')
                return <br />;
            return <div className='content-text' />
        case 'IMAGE':
            const src = block.data.image.src;
            return <img
                className='image-block'
                src={config.URL.slice(0, -1) + src}
                alt='Content'
            />
        case 'SLIDER':
            const slides = block.data.slides;
            return {
                start: `<div class="slider js-slider" data-slides="${JSON.stringify(slides).replace(/"/g, "'")}"><div>`,
                end: `</div></div>`
            }
        case 'ALIGN_CENTER':
            if (block.text === ' ' || block.text === '')
                return <br />;
            return <div className='content-text center' />
        case 'ALIGN_RIGHT':
            if (block.text === ' ' || block.text === '')
                return <br />;
            return <div className='content-text right' />
        case 'ALIGN_LEFT':
            if (block.text === ' ' || block.text === '')
                return <br />;
            return <div className='content-text left' />

        default:
            return null;
    }
}
const entityToHTML = (entity: any, originalText: string) => {
    if (entity.type === 'LINK') {
        return <a
            href={entity.data.url}
            target="_blank"
            rel='noopener noreferrer'
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

