import * as React from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from '../../store';
import Header from './inner-components/Header'
import Footer from './inner-components/Footer'
import Middle from './inner-components/Middle'
import './styles/Base.css'
import { RouteComponentProps } from 'react-router';
import { actionCreators as navigationActions, Match, NavigatinonState } from '../../store/NavigationStore';
import { BodyState } from '../../store/BodyStore';
import { ProjectState } from '../../store/ProjectStore'
import { actionCreators as projectActions}  from '../../store/ProjectStore';


type BaseProps = NavigatinonState
    & BodyState
    & ProjectState
    & RouteComponentProps<Match>
    & typeof projectActions
    & typeof navigationActions

class Base extends React.PureComponent<BaseProps>
{
    constructor(props: BaseProps) {
        super(props);

        this.props.setMatch(this.props.match.params || {} as Match);
    }

    public componentDidMount() {
        this.props.requestProjectData();
        this.props.requestMenu();
    }

    public componentDidUpdate() {
        if (this.props.match.params !== this.props.matchState) {
            this.props.setMatch(this.props.match.params || {} as Match);
        }
        /*const urn = this.createURN();
        *//*this.props.history.push(urn);*/
    }

    private createURN = (): string => {
        let result = '/index';
        if (this.props.menuItem.menuItemId === undefined || this.props.menuItem.menuItemId === -1)
            return result;
        result += `/${this.props.menuItem.menuItemId}`;
        if (this.props.currentCategory.sectionId === undefined || this.props.currentCategory.sectionId === -1)
            return result;
        result += `/${this.props.currentCategory.sectionId}`;
        if (this.props.currentCategory.categoryId === undefined || this.props.currentCategory.categoryId === -1)
            return result;
        result += `/${this.props.currentCategory.categoryId}`;
        if (this.props.previewId === undefined || this.props.previewId === -1 || !this.props.isShowContent)
            return result;
        result += `/${this.props.previewId}`;
        return result;
    }

    private checkMatch = (): boolean => {
        if (this.props.menuItem.menuItemId !== parseInt(this.props.matchState.menuItemId) && parseInt(this.props.matchState.menuItemId) !== undefined)
            return false;
        if (this.props.currentCategory.sectionId !== parseInt(this.props.matchState.sectionId) && parseInt(this.props.matchState.sectionId) !== undefined)
            return false;
        if (this.props.currentCategory.categoryId !== parseInt(this.props.matchState.categoryId) && parseInt(this.props.matchState.categoryId) !== undefined)
            return false;
        if (this.props.previewId !== parseInt(this.props.matchState.previewId) && parseInt(this.props.matchState.previewId) !== undefined)
            return false;
        return true;
    }

    public render() {
        return (
            <React.Fragment>
                <div className='wrapper_Base' >
                    <Header />
                    <Middle />
                    <Footer />
                </div>
            </React.Fragment>
        )
    }

}


export default connect(
    (state: ApplicationState) => ({ ...state.navigation, ...state.body, ...state.project }),
    { ...navigationActions, ...projectActions }
)(Base as any);