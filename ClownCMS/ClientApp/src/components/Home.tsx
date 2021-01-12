import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import { ApplicationState } from '../store';
import * as ProjectsStore from '../store/Projects';
import * as StartPageAssets from '../assets/StartPageAssets';
import './Home.css';


type ProjectsProps =
    ProjectsStore.ProjectsState // ... state we've requested from the Redux store
    & typeof ProjectsStore.actionCreators // ... plus action creators we've requested
    & RouteComponentProps<{ startDateIndex: string }>;

class Home extends React.PureComponent<ProjectsProps>
{

    public componentDidMount() {
        this.ensureDataFetched();
    }

    // This method is called when the route parameters change
    public componentDidUpdate() {
        this.ensureDataFetched();
    }

    private ensureDataFetched() {
        const startDateIndex = parseInt(this.props.match.params.startDateIndex, 10) || 0;
        this.props.requestProjects(startDateIndex);
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

    public renderButtons() {
        return (
            <div>
                <StartPagesAction text='Создать' action={() => { }} img={StartPageAssets.CreateProject} />
                <StartPagesAction text='Открыть' action={() => { }} img={StartPageAssets.OpenProject} />
                <StartPagesAction text='Удалить' action={() => { }} img={StartPageAssets.DeleteProject} />
            </div>
        )
    }

    public renderProjectsList() {
        return (
            <div>
                {this.props.projects.map((projects: ProjectsStore.Project) => <ProjectPreview projectName={projects.projectName} />)}
            </div>
        )
    }
}

const ProjectPreview = (props: any) => {
    return (
        <div className='projectPreview'>
            <p>{props.projectName}</p>
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
    (state: ApplicationState) => state.projects, // Selects which state properties are merged into the component's props
    ProjectsStore.actionCreators // Selects which action creators are merged into the component's props
)(Home as any);
