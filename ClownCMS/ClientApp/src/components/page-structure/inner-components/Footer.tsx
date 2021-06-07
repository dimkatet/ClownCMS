import * as React from 'react';
import { connect } from 'react-redux';
import * as ProjectStore from '../../../store/ProjectStore';
import { ApplicationState } from '../../../store';
import FooterEditor from '../../elements/FooterEditor';
import IconSave from '@material-ui/icons/Save';
import IconEdit from '@material-ui/icons/Edit';
import convertToHTML from '../../elements/utils/HTMLConverter';
import './styles/Footer.css';


type ProjectProps = ProjectStore.ProjectState 
    & typeof ProjectStore.actionCreators 

interface FooterState {
    isAuth: boolean,
    isEditing: boolean,
}
class Footer extends React.Component<ProjectProps, FooterState>{

    constructor(props: any) {
        super(props);

        this.state = {
            isEditing: false,
            isAuth: localStorage.getItem('access_token') ? true : false
        }

        this.insertContent = this.insertContent.bind(this);
    }

    public componentDidMount() {
        //
    }

    public componentDidUpdate() {
        if (!this.state.isEditing) {
            this.insertContent();
        }
    }

    insertContent() {
        const content = document.getElementById('footer-content-id');
        if (!content)
            return;

        content.innerHTML = convertToHTML(this.props.projectData.footerContent);
    }


    public render() {
        return <div className='wrapper_Footer'>
            {
                this.state.isAuth && <div>
                    <div
                        className='footer-edit-button'
                        onMouseDown={(e) => {
                            if (this.state.isEditing) {
                               this.props.saveFooter(this.props.projectData.footerContent);
                            } else {
                                const content = document.getElementById('footer-content-id');
                                if (content)
                                    content.innerHTML = '';
                            }
                            this.setState({ isEditing: !this.state.isEditing })
                        }}
                    >
                        {this.state.isEditing ? <IconSave /> : <IconEdit />}
                    </div>
                    <div className='footer-content'>
                        {this.state.isEditing && <FooterEditor
                            contentState={this.props.projectData.footerContent}
                            updateContent={this.props.updateFooter}
                        />}
                    </div>
                </div>
            }
            <div className='footer-content' id='footer-content-id' />
        </div>
    }

}

export default connect(
    (state: ApplicationState) => state.project,
    ProjectStore.actionCreators 
)(Footer as any);