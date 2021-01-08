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
var react_redux_1 = require("react-redux");
var ProjectsStore = require("../store/Projects");
var Home = /** @class */ (function (_super) {
    __extends(Home, _super);
    function Home() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Home.prototype.componentDidMount = function () {
        this.ensureDataFetched();
    };
    // This method is called when the route parameters change
    Home.prototype.componentDidUpdate = function () {
        this.ensureDataFetched();
    };
    Home.prototype.ensureDataFetched = function () {
        var startDateIndex = parseInt(this.props.match.params.startDateIndex, 10) || 0;
        this.props.requestProjects(startDateIndex);
    };
    Home.prototype.render = function () {
        return (React.createElement(React.Fragment, null,
            React.createElement("div", null,
                React.createElement("h1", null, "\u0412\u044B\u0431\u0435\u0440\u0435\u0442\u0435 \u043F\u0440\u043E\u0435\u043A\u0442:")),
            this.renderProjectsList()));
    };
    Home.prototype.renderProjectsList = function () {
        return (React.createElement("table", { className: 'table table-striped', "aria-labelledby": "tabelLabel" },
            React.createElement("thead", null,
                React.createElement("tr", null,
                    React.createElement("th", null, "ID"),
                    React.createElement("th", null, "Name"))),
            React.createElement("tbody", null, this.props.projects.map(function (projects) {
                return React.createElement("tr", { key: projects.projectID },
                    React.createElement("td", null, projects.projectID),
                    React.createElement("td", null, projects.projectName));
            }))));
    };
    return Home;
}(React.PureComponent));
exports.default = react_redux_1.connect(function (state) { return state.projects; }, // Selects which state properties are merged into the component's props
ProjectsStore.actionCreators // Selects which action creators are merged into the component's props
)(Home);
//# sourceMappingURL=Home.js.map