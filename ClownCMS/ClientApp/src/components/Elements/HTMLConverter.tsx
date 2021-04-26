import * as React from 'react';
import { convertToHTML } from 'draft-convert';

const styleToHTML = (style: string) => {
    if (style.includes('FONT_SIZE_')) {
        var r = /\d+/;
        var fSize = style.match(r);
        return <span style={{ fontSize: fSize + 'pt' }} />;
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

const blockToHTML = (block) => {
    switch (block.type) {
        default:
            return null;
    }
}
const entityToHTML = (entity, originalText) => {
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

export default contentState => converterFunction(contentState);

