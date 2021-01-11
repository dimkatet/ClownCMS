import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import { ApplicationState } from '../store';
import * as ProjectsStore from '../store/Projects';
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
                        <h4>������� ���������: </h4>
                        {this.renderProjectsList()}
                    </div>
                    <div className='startPageActions'>
                        <h4> ������ ������ </h4>
                        {this.renderButtons()}
                    </div>
                </div>
            </React.Fragment>
        )
    }

    public renderButtons() {
        return (
            <div>
                <StartPagesAction text='�������' action={() => { }} />
                <StartPagesAction text='�������' action={() => { }} />
                <StartPagesAction text='�������' action={() => { }} />
            </div>
        )
    }

    public renderProjectsList() {
        return (
            <div>
                {this.props.projects.map((projects: ProjectsStore.Project) => <div className= 'projectPreview'>{projects.projectName}</div>)}
            </div>
        )
    }
}

const StartPagesAction = (props: any) => {
    return (
        <div>
            <button className='startPageAction' onClick={props.action} >
                {props.text}
            </button>
        </div>
    )
}

export default connect(
    (state: ApplicationState) => state.projects, // Selects which state properties are merged into the component's props
    ProjectsStore.actionCreators // Selects which action creators are merged into the component's props
)(Home as any);
