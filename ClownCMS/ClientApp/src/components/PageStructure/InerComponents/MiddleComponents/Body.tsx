import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import { ApplicationState } from '../../../../store';
import * as BodyStore from '../../../../store/BodyStore';
import TextEditor from '../../../Elements/TextEditor';
import { EditorState, ContentState, convertFromRaw } from 'draft-js';
import convertToHTML from '../../../Elements/HTMLConverter';
import IconSave from '@material-ui/icons/Save';
import IconEdit from '@material-ui/icons/Edit';
import './styles/Body.css';

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
    }

    public componentDidMount() {
        this.props.requestContent();
    }

    public componentDidUpdate() {
        //
    }

    updateContent(content: ContentState) {
        this.props.updateContent(content);
    }


    public render() {
        return (
            <div className='body-container'>
                <div
                    className='edit-button'
                    onMouseDown={(e) => {
                        if (this.state.isEditing)
                            this.props.saveContent(this.props.content);
                        this.setState({ isEditing: !this.state.isEditing })
                    }}
                > {this.state.isEditing ? <IconSave /> : <IconEdit />}</div>
                {this.state.isEditing ?
                    <div className='body-content'>
                        <TextEditor
                            contentState={this.props.content}
                            updateContent={this.updateContent}
                        />
                    </div> :
                    < div
                        className='body-content'
                        dangerouslySetInnerHTML={{ __html: convertToHTML(this.props.content) }}
                    />}
            </div>
        )
    }

}


export default connect(
    (state: ApplicationState) => state.body,
    BodyStore.actionCreators 
)(Body as any);