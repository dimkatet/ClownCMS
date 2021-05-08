import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import { ApplicationState } from '../../../../store';
import * as BodyStore from '../../../../store/BodyStore';
import TextEditor from '../../../Elements/TextEditor';
import SliderBlock from '../../../Elements/SliderBlock';
import ImageBlock from '../../../Elements/ImageBlock';
import { EditorState, ContentState, convertFromRaw, convertToRaw, EditorBlock } from 'draft-js';
import convertToHTML from '../../../Elements/utils/HTMLConverter';
import IconSave from '@material-ui/icons/Save';
import IconEdit from '@material-ui/icons/Edit';
import './styles/Body.css';
import '../../../Elements/styles/SliderBlock.css';
import * as ReactDOM from 'react-dom';

type BodyProps = BodyStore.BodyState & typeof BodyStore.actionCreators;

interface BodyState {
    contentState: ContentState,
    isEditing: boolean
}

class Body extends React.PureComponent<BodyProps, BodyState>
{
    constructor(props: BodyProps) {
        super(props);
        this.state = { contentState: EditorState.createEmpty().getCurrentContent(), isEditing: false};
        this.updateContent = this.updateContent.bind(this);
        this.insertContent = this.insertContent.bind(this);
    }

    public componentDidMount() {
        this.props.requestContent();
    }

    public componentDidUpdate() {
        if (!this.state.isEditing)
            this.insertContent();
    }

    updateContent(content: ContentState) {
        this.props.updateContent(content);
    }

    insertContent() {
        const content = document.getElementById('body-content-id');
        if (!content)
            return;

        content.innerHTML = convertToHTML(this.props.content);
        const sliders = content.querySelectorAll('.js-slider');
        sliders.forEach((slider, index) => {
            const data = slider.getAttribute('data-slides');
            if (data === null)
                return;
            ReactDOM.render<{}>(
                <SliderBlock
                    slides={JSON.parse(data.replace(/'/g, '"'))}
                />, slider);
        });
    }



    public render() {
        return (
            <div className='body-container'>
                <div
                    className='edit-button'
                    onMouseDown={(e) => {
                        if (this.state.isEditing) {
                            this.props.saveContent(this.props.content);
                            //this.insertContent();
                        } else {
                            const content = document.getElementById('body-content-id');
                            console.log(convertToRaw(this.props.content));
                            if (content)
                                content.innerHTML = '';
                        }
                        this.setState({ isEditing: !this.state.isEditing })
                    }}
                > {this.state.isEditing ? <IconSave /> : <IconEdit />}</div>
                <div className='body-content'>
                    {this.state.isEditing ?
                        <TextEditor
                            contentState={this.props.content}
                            updateContent={this.updateContent}
                        /> : null}
                    <div className='body-content' id='body-content-id' />
                </div>
            </div>
        )
    }

}


export default connect(
    (state: ApplicationState) => state.body,
    BodyStore.actionCreators 
)(Body as any);