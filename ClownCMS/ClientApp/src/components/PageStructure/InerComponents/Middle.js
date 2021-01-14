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
var Body_1 = require("./MiddleComponents/Body");
var LeftMenu_1 = require("./MiddleComponents/LeftMenu");
var RightMenu_1 = require("./MiddleComponents/RightMenu");
require("./Middle.css");
/*type ProjectProps =
    ProjectsStore.ProjectsState // ... state we've requested from the Redux store
    & typeof ProjectsStore.actionCreators // ... plus action creators we've requested
    & RouteComponentProps<{ startDateIndex: string }>;*/
/*
 * Content part
 * setting dimensions for components
 */
var Middle = /** @class */ (function (_super) {
    __extends(Middle, _super); //<ProjectsProps>
    function Middle() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Middle.prototype.componentDidMount = function () {
        //
    };
    Middle.prototype.componentDidUpdate = function () {
        //
    };
    Middle.prototype.render = function () {
        return (React.createElement(React.Fragment, null,
            React.createElement("div", { className: 'wrapper_Middle' },
                React.createElement("div", null,
                    React.createElement(LeftMenu_1.default, null)),
                React.createElement("div", null,
                    React.createElement(Body_1.default, null)),
                React.createElement("div", null,
                    React.createElement(RightMenu_1.default, null)))));
    };
    return Middle;
}(React.PureComponent //<ProjectsProps>
));
exports.default = Middle;
/*
export default connect(
    (state: ApplicationState) => state.projects, // Selects which state properties are merged into the component's props
    ProjectsStore.actionCreators // Selects which action creators are merged into the component's props
)(NavigationEditor as any);*/ 
//# sourceMappingURL=Middle.js.map