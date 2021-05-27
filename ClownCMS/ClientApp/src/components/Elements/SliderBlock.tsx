import * as React from 'react';
import { ContentBlock, ContentState } from 'draft-js';
import './styles/SliderBlock.css';

interface SliderBlockProps {
    block?: ContentBlock,
    contentState?: ContentState
    slides?: Array<{ srs: string }>
}

interface SliderBlockState {
    currentSlideIndex: number
}

export default class SliderBlock extends React.Component<SliderBlockProps, SliderBlockState> {

    constructor(props: SliderBlockProps) {
        super(props);
        this.state = { currentSlideIndex: 0 };

        this.setCurrentIndex = this.setCurrentIndex.bind(this);
        this.slideBack = this.slideBack.bind(this);
        this.slideForward = this.slideForward.bind(this);
    }

    setCurrentIndex(currentSlideIndex: number) {
        this.setState({
            currentSlideIndex
        });
    }

    slideBack() {
        const slides = this.props.slides ? this.props.slides : this.props.block ? this.props.block.getData().get('slides') : [];
        const slidesLength = slides.length;
        const { currentSlideIndex } = this.state;
        const newActiveIndex = (currentSlideIndex + slidesLength - 1) % slidesLength;
        this.setCurrentIndex(newActiveIndex);
    }

    slideForward() {
        const slides = this.props.slides ? this.props.slides : this.props.block ? this.props.block.getData().get('slides') : [];
        const slidesLength = slides.length;
        const { currentSlideIndex } = this.state;
        const newActiveIndex = (currentSlideIndex + slidesLength + 1) % slidesLength;
        this.setCurrentIndex(newActiveIndex);
    }

    render() {
        let { currentSlideIndex } = this.state;
        const slides = this.props.slides ? this.props.slides : this.props.block ? this.props.block.getData().get('slides') : [];
        return (
            <div className="c-image-slider">
                <div>
                    <div className="slides-container">
                        <div
                            className="slides"
                            style={{ left: `-${currentSlideIndex * 100}%` }}
                        >
                            {
                                slides.map((slide: { src: string }, index: number) => (
                                    <div
                                        key={index}
                                        className="slide"
                                    >
                                        <div className="slide-inner">
                                            <img src={slide.src} alt="" />
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                        <div
                            className="arrow left"
                            onClick={this.slideBack}
                        >
                            <div className="chevron-arrow-left" />
                        </div>
                        <div
                            className="arrow right"
                            onClick={this.slideForward}
                        >
                            <div className="chevron-arrow-right" />
                        </div> 
                    </div>
                </div>
            </div>
        )
    }

}