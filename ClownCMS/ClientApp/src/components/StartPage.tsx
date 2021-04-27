import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from "react-router-dom";
import PopUp from './PopUp';
import { ApplicationState } from '../store';
import * as StartPageStore from '../store/StartPageStore';
import * as ProjectStore from '../store/ProjectStore';
import * as StartPageAssets from '../assets/StartPageAssets';
import './StartPage.css';

type ProjectsProps =
    StartPageStore.StartPageState
    & RouteComponentProps
    & typeof StartPageStore.actionCreators
    & typeof ProjectStore.actionCreators;

type StartPageState = {
    selectedProjectID: number,
    renderPopUp: boolean,
    newProjectName: string
};

class StartPage extends React.PureComponent<ProjectsProps, StartPageState>
{

    constructor(props: any) {
        super(props);
        this.state = { selectedProjectID: -1, renderPopUp: false, newProjectName: '' };
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
                    {this.state.renderPopUp && <PopUp onClose={() => { this.setState({ renderPopUp: false, newProjectName: '' }) }}>
                        <div className='popUpContent'>
                            <div>Введите название проекта:</div>
                            <div>
                                <input 
                                    value={this.state.newProjectName}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            this.props.createProject(this.state.newProjectName);
                                            this.setState({ renderPopUp: false, newProjectName: '' });
                                        }
                                    }}
                                    onChange={(e) => {
                                        this.setState({ newProjectName: e.target.value })
                                    }} />
                            </div>
                            <div>
                                <button 
                                    onClick={() => {
                                        this.props.createProject(this.state.newProjectName);
                                        this.setState({ renderPopUp: false, newProjectName: '' });
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
        const buttons = this.state.selectedProjectID !== -1 ?
            <div>
                <StartPagesAction text='Открыть'
                    action={() => {
                        if (this.state.selectedProjectID !== -1) {
                            this.props.selectProject(this.state.selectedProjectID);
                            this.props.history.push('/index');
                        }
                    }}
                    img={StartPageAssets.OpenProject} />
                <StartPagesAction text='Удалить'
                    action={() => {
                        this.props.deleteProject(this.state.selectedProjectID);
                        this.setState({ selectedProjectID: -1 });
                    }}
                    img={StartPageAssets.DeleteProject} />
            </div> : null;
        return (
            <div>
                <StartPagesAction
                    text='Создать'
                    action={() => {
                        this.setState({ renderPopUp: true });
                    }}
                    img={StartPageAssets.CreateProject} />
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
                    }} />)}
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
        <div>
            <button className='startPageAction' onClick={props.action}>
                <div><props.img /></div>
                <p>{props.text}</p>
            </button>
        </div>
    )
}

export default connect(
    (state: ApplicationState) => state.startPage,
    { ...StartPageStore.actionCreators, ...ProjectStore.actionCreators }
)(StartPage as any);
