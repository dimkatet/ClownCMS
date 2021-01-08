import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import { ApplicationState } from '../store';
import * as ProjectsStore from '../store/Projects';


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
                <div>
                    <h1>Выберете проект:</h1>
                </div>
                {this.renderProjectsList()}
            </React.Fragment>
        )
    }

    public renderProjectsList() {
        return (
             <table className='table table-striped' aria-labelledby="tabelLabel">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                  </tr>
                </thead>
                <tbody>
                  {this.props.projects.map((projects: ProjectsStore.Project) =>
                    <tr key={projects.projectID}>
                      <td>{projects.projectID}</td>
                      <td>{projects.projectName}</td>
                    </tr>
                  )}
                </tbody>
            </table>
        )
    }
}

export default connect(
    (state: ApplicationState) => state.projects, // Selects which state properties are merged into the component's props
    ProjectsStore.actionCreators // Selects which action creators are merged into the component's props
)(Home as any);
