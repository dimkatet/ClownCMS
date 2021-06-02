import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from "react-router-dom";
import PopUp from './elements/PopUp';
import { ApplicationState } from '../store';
import * as StartPageStore from '../store/StartPageStore';
import * as ProjectStore from '../store/ProjectStore';
import * as AuthStore from '../store/AuthStore';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import DescriptionIcon from '@material-ui/icons/Description';
import EditIcon from '@material-ui/icons/Edit';
import Auth from './elements/Auth';
import './styles/StartPage.css';
import DownloadProject from '../store/Download';

type ProjectsProps =
    StartPageStore.StartPageState
    & RouteComponentProps
    & typeof StartPageStore.actionCreators
    & typeof ProjectStore.actionCreators
    & typeof AuthStore.actionCreators;

type StartPageState = {
    selectedProjectID: number,
    creatingProject: boolean,
    editingProject: boolean,
    newProjectName: string
};

class StartPage extends React.PureComponent<ProjectsProps, StartPageState>
{

    constructor(props: any) {
        super(props);
        this.state = { selectedProjectID: -1, creatingProject: false, editingProject: false, newProjectName: '' };
    }

    public componentDidMount() {
        this.ensureDataFetched();
    }

    public componentDidUpdate() {
    }

    private ensureDataFetched() {
        this.props.requestProjects();

    }

    public render() {
        return (
            <React.Fragment>
                <div className='startPage'>
                    <h2>ClownCMS</h2>
                    <div className='header'>
                        <Auth />
                    </div>
                    <div className='projectsPreviewList'>
                        <h4>Открыть последние: </h4>
                        <div className='projectsList'>
                            {this.renderProjectsList()}
                        </div>
                    </div>
                    <div className='startPageActions'>
                        <h4> Начало работы </h4>
                        {this.renderButtons()}
                    </div>
                    {(this.state.creatingProject || this.state.editingProject) && <PopUp onClose={() => {
                        this.setState({
                            creatingProject: false,
                            editingProject: false,
                            newProjectName: ''
                        })
                    }}>
                        <div className='pop-up-content'>
                            <div>Введите название проекта:</div>
                            <div>
                                <input
                                    value={this.state.newProjectName}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            if (this.state.creatingProject) {
                                                this.props.createProject(this.state.newProjectName);
                                            } else {
                                                this.props.editProject(this.state.newProjectName, this.state.selectedProjectID);
                                            }
                                            this.setState({
                                                creatingProject: false,
                                                editingProject: false,
                                                newProjectName: ''
                                            });
                                        }
                                    }}
                                    onChange={(e) => {
                                        this.setState({ newProjectName: e.target.value })
                                    }} />
                            </div>
                            <div>
                                <button
                                    onClick={() => {
                                        if (this.state.creatingProject) {
                                            this.props.createProject(this.state.newProjectName);
                                        } else {
                                            this.props.editProject(this.state.newProjectName, this.state.selectedProjectID);
                                        }
                                        this.setState({
                                            creatingProject: false,
                                            editingProject: false,
                                            newProjectName: ''
                                        });
                                    }}>
                                    Создать
                                </button>
                            </div>
                        </div>
                    </PopUp>}
                </div>
            </React.Fragment>
        )
    }

    public renderButtons() {
        const buttons = this.state.selectedProjectID !== -1 && <div>
            <StartPagesAction text='Open'
                action={() => {
                    if (this.state.selectedProjectID !== -1) {
                        this.props.selectProject(this.state.selectedProjectID);
                        this.props.history.push('/index');
                    }
                }}
            >
                <div className='start-page-action-logo'>
                    <DescriptionIcon fontSize='inherit' />
                </div>
            </StartPagesAction>   
            <StartPagesAction text='Edit'
                action={() => {
                    this.setState({
                        newProjectName: this.props.projects.find(p => {
                            if (p.projectID === this.state.selectedProjectID)
                                return true;
                            return false;
                        }).projectName,
                        editingProject: true
                    });
                }}
            >
                <div id='edit-project' className='start-page-action-logo'>
                    <EditIcon fontSize='inherit' />
                </div>
            </StartPagesAction>
            <StartPagesAction text='Delete'
                action={() => {
                    this.props.deleteProject(this.state.selectedProjectID);
                    this.setState({ selectedProjectID: -1 });
                }}
            >
                <div className='start-page-action-logo'>
                    <DeleteForeverIcon fontSize='inherit' />
                </div>
            </StartPagesAction>
            <StartPagesAction text='Скачать'
                action={() => {
                    DownloadProject(this.state.selectedProjectID);}}>
                <div className='start-page-action-logo'>
                    <DescriptionIcon fontSize='inherit' />
                </div>
            </StartPagesAction>
        </div>
        return (
            <div>
                <StartPagesAction
                    text='Create'
                    action={() => {
                        this.setState({ creatingProject: true });
                    }}
                >
                    <div className='start-page-action-logo'>
                        <NoteAddIcon fontSize='inherit' />
                    </div>
                </StartPagesAction>
                {buttons}
            </div>
        )
    }

    public renderProjectsList() {
        return (
            <div>
                {this.props.projects.map((project: StartPageStore.Project, i: number) => <ProjectPreview key={i}
                    projectName={project.projectName}
                    action={() => {
                        this.setState({ selectedProjectID: project.projectID });
                    }}
                />)}
            </div>
        )
    }
}


const ProjectPreview = (props: any) => {
    return (
        <div className='projectPreview'>
            <button onFocus={props.action}>
                {props.projectName}
            </button>
        </div>
    )
}

const StartPagesAction = (props: any) => {
    return (
        <div
            className='start-page-action'
            onClick={props.action}
        >
            {props.children}
            <p>{props.text}</p>
        </div>
    )
}

export default connect(
    (state: ApplicationState) => state.startPage,
    { ...StartPageStore.actionCreators, ...ProjectStore.actionCreators, ...AuthStore.actionCreators }
)(StartPage as any);
