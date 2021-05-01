import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import { ApplicationState } from '../../../store';
import * as NavigationStore from '../../../store/NavigationStore';
import Body from './MiddleComponents/Body';
import LeftMenu from './MiddleComponents/LeftMenu';
import RightMenu from './MiddleComponents/RightMenu';
import './Middle.css';
import { type } from 'os';
import { Button } from 'reactstrap';


type Props =
    NavigationStore.NavigatinonState 
    & typeof NavigationStore.actionCreators;


type State = {
    CurrentCategory: NavigationStore.Category;
    SelectedID: number;
}

/*
 * Content part
 * setting dimensions for components
 */
class Middle extends React.PureComponent<Props, State>
{

    constructor(props: any) {
        super(props);
        this.state = { CurrentCategory: {} as NavigationStore.Category, SelectedID: -1}
    }

    public componentDidMount() {
        //
    }

    public componentDidUpdate() {
        //
    }

    private navitem = (props: any) => {
        return (
            <div>
                <button onClick={props.execute}>
                    {props.Name}
                </button>
                {props.children}
            </div>
        )
    }

    private BodyPreview = (props: any) => {
        return (
            <div onClick={props.execute}>
                <h3>
                    {props.Name}
                </h3>
                <p>Coctent</p>
            </div>
        )
    }

    private leftMenuPreviews(props: NavigationStore.Preview[]){
        return (
            <div>
                {props.map(item => {
                    <button onClick={() => { }}>{item.previewName}</button>
                })}
                <button onClick={() => { }}>add</button>
            </div>
        )
    }
    private leftMenuCategories = (props: NavigationStore.Category[]) => {
        return (
            <div>
                
            </div>
        )
    }
    private renderLeftMenu = () => {
        if (this.props.sections.length > 0)
            switch (this.props.menuItem.menuItemType) {
                case 4: return <div>
                        {this.props.sections[0].categories.map(item => <this.navitem execute={() => { this.setState({ CurrentCategory: item, SelectedID: item.categoryId }); this.props.updated(); }} Name={item.categoryName}>
                            {
                                (this.state.SelectedID == item.categoryId) && (item.previews.length > 0) && item.previews.map(prev => <this.navitem execute={() => { }} Name={prev.previewName} />)
                            }
                            
                        </this.navitem>)}
                    </div>;
                case 5: return <div>
                    {this.props.sections.map(item => <this.navitem execute={() => this.setState({ SelectedID: item.sectionId }) } Name={item.sectionName}>
                        {
                            (this.state.SelectedID == item.sectionId) && (item.categories.length > 0) && item.categories.map(categor => <this.navitem execute={() => { this.setState({ CurrentCategory: categor }); this.props.updated() }} Name={categor.categoryName} />)
                        }
                    </this.navitem>)}
                </div>;
                default: return null;
            }
        return null;
    }
    private renderRightMenu = () => {
        if (this.props.sections.length > 0)
            switch (this.props.menuItem.menuItemType) {
                case 2:
                    if (this.props.sections[0].categories.length > 0)
                        return <div> {this.props.sections[0].categories[0].previews.map(item => < this.navitem execute={() => { }} Name={item.previewName} />)} </div>;
                    return null;
                case 3: return <div>{this.props.sections[0].categories.map(item => < this.navitem execute={() => { this.setState({ CurrentCategory: item }); this.props.updated(); }} Name={item.categoryName} />)} </div>;
                default: return null;
            }
        return null;
    }

    private renderBodyPreview = () => {
        if (this.props.menuItem.menuItemType == 1 || this.props.menuItem.menuItemType == 3 || this.props.menuItem.menuItemType == 5) {
            return <div>{this.state.CurrentCategory.previews.map(item => < this.BodyPreview execute={() => { }} Name={item.previewName} />)} </div>;
        }
        return null;
    }
    private prepare = () => {
        switch (this.props.menuItem.menuItemType) {
            case 1: if (this.props.sections.length > 0 && this.props.sections[0].categories.length > 0) { this.setState({ CurrentCategory: this.props.sections[0].categories[0] }); this.props.updated(); } break;
            default: return null;
        }
    }
    public render() {
        this.prepare();
        return (
            <React.Fragment>
                <div className='wrapper_Middle'>
                    <div>
                        <this.renderLeftMenu />
                    </div>
                    <div>
                        <Body />
                        {this.props.isActual && <this.renderBodyPreview />}
                    </div>
                    <div>
                        <this.renderRightMenu />
                    </div>
                </div>
            </React.Fragment>
        )
    }

}


export default connect(
    (state: ApplicationState) => state.navigation, // Selects which state properties are merged into the component's props
    NavigationStore.actionCreators // Selects which action creators are merged into the component's props
)(Middle as any);