import * as React from 'react';
import { ContentBlock, ContentState } from 'draft-js';
import './styles/ImageBlock.css';

interface ImageBlockProps {
    block: ContentBlock,
    contentState: ContentState
}

export default class ImageBlock extends React.Component<ImageBlockProps, {}> {

    constructor(props: ImageBlockProps) {
        super(props);
    }

    render() {
        const src = this.props.block.getData().get('image').src;
        return (
            <img className='image-block' src={src} />
        );
    }

}