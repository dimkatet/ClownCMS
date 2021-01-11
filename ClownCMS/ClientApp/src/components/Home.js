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
require("./Home.css");
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
            React.createElement("div", { className: 'startPage' },
                React.createElement("h2", null, "ClownCMS"),
                React.createElement("div", { className: 'projectsPreviewList' },
                    React.createElement("h4", null, "\u041E\u0442\u043A\u0440\u044B\u0442\u044C \u043F\u043E\u0441\u043B\u0435\u0434\u043D\u0438\u0435: "),
                    this.renderProjectsList()),
                React.createElement("div", { className: 'startPageActions' },
                    React.createElement("h4", null, " \u041D\u0430\u0447\u0430\u043B\u043E \u0440\u0430\u0431\u043E\u0442\u044B "),
                    this.renderButtons()))));
    };
    Home.prototype.renderButtons = function () {
        return (React.createElement("div", null,
            React.createElement(StartPagesAction, { text: '\u0421\u043E\u0437\u0434\u0430\u0442\u044C', action: function () { } }),
            React.createElement(StartPagesAction, { text: '\u041E\u0442\u043A\u0440\u044B\u0442\u044C', action: function () { } }),
            React.createElement(StartPagesAction, { text: '\u0423\u0434\u0430\u043B\u0438\u0442\u044C', action: function () { } })));
    };
    Home.prototype.renderProjectsList = function () {
        return (React.createElement("div", null, this.props.projects.map(function (projects) { return React.createElement("div", { className: 'projectPreview' }, projects.projectName); })));
    };
    return Home;
}(React.PureComponent));
var StartPagesAction = function (props) {
    return (React.createElement("div", null,
        React.createElement("button", { className: 'startPageAction', onClick: props.action }, props.text)));
};
exports.default = react_redux_1.connect(function (state) { return state.projects; }, // Selects which state properties are merged into the component's props
ProjectsStore.actionCreators // Selects which action creators are merged into the component's props
)(Home);
//# sourceMappingURL=Home.js.map