import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import { ApplicationState } from '../store';
import * as ProjectsStore from '../store/StartStageStore';
import * as StartPageAssets from '../assets/StartPageAssets';
import './Home.css';


type ProjectsProps =
    ProjectsStore.StartPageState
    & typeof ProjectsStore.actionCreators;

class Home extends React.PureComponent<ProjectsProps>
{

    public componentDidMount() {
        this.ensureDataFetched();
    }

    public componentDidUpdate() {
        this.ensureDataFetched();
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
                </div>
            </React.Fragment>
        )
    }

    public callbackCreator(id: number) {
        return () => {
            this.props.selectProject(id);
        }
    }

    public renderButtons() {
        console.log(this.props.selectedProjectID);
        const buttons = this.props.selectedProjectID ?
            <div>
                <StartPagesAction text='Открыть' action={() => { }} img={StartPageAssets.OpenProject} />
                <StartPagesAction text='Удалить' action={() => { }} img={StartPageAssets.DeleteProject} />
            </div> : <p> Нет </p>;
        return (
            <div>
                <StartPagesAction text='Создать' action={() => { }} img={StartPageAssets.CreateProject} />
                {buttons}
            </div>
        )
    }

    public renderProjectsList() {
        return (
            <div>
                {this.props.projects.map((project: ProjectsStore.Project) => <ProjectPreview projectName={project.projectName} action={this.callbackCreator(project.projectID)} />)}
            </div>
        )
    }
}

const ProjectPreview = (props: any) => {
    return (
        <div className='projectPreview'>
            <button onClick={props.action}>
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
    ProjectsStore.actionCreators
)(Home as any);
