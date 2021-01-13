"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
//import * as ProjectStore from '../../store/ProjectConfig';
/*type ProjectProps =
    ProjectsStore.ProjectsState // ... state we've requested from the Redux store
    & typeof ProjectsStore.actionCreators // ... plus action creators we've requested
    & RouteComponentProps<{ startDateIndex: string }>;*/
/*similar to every page in project*/
var Header = /** @class */ (function (_super) {
    __extends(Header, _super); //<ProjectsProps>
    function Header() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Header.prototype.componentDidMount = function () {
        //
    };
    Header.prototype.componentDidUpdate = function () {
        //
    };
    Header.prototype.render = function () {
        return (React.createElement(React.Fragment, null,
            React.createElement("div", null, "i'm header")));
    };
    return Header;
}(React.PureComponent //<ProjectsProps>
));
exports.default = Header;
/*
export default connect(
    (state: ApplicationState) => state.projects, // Selects which state properties are merged into the component's props
    ProjectsStore.actionCreators // Selects which action creators are merged into the component's props
)(NavigationEditor as any);*/ 
//# sourceMappingURL=Header.js.map