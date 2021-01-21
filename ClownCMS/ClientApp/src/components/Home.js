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
var PopUp_1 = require("./PopUp");
var ProjectsStore = require("../store/StartStageStore");
var StartPageAssets = require("../assets/StartPageAssets");
require("./Home.css");
var Home = /** @class */ (function (_super) {
    __extends(Home, _super);
    function Home(props) {
        var _this = _super.call(this, props) || this;
        _this.state = { selectedProjectID: -1, renderPopUp: false, newProjectName: '' };
        return _this;
    }
    Home.prototype.componentDidMount = function () {
        this.ensureDataFetched();
    };
    Home.prototype.componentDidUpdate = function () {
    };
    Home.prototype.ensureDataFetched = function () {
        this.props.requestProjects();
    };
    Home.prototype.render = function () {
        var _this = this;
        return (React.createElement(React.Fragment, null,
            React.createElement("div", { className: 'startPage' },
                React.createElement("h2", null, "ClownCMS"),
                React.createElement("div", { className: 'projectsPreviewList' },
                    React.createElement("h4", null, "\u041E\u0442\u043A\u0440\u044B\u0442\u044C \u043F\u043E\u0441\u043B\u0435\u0434\u043D\u0438\u0435: "),
                    React.createElement("div", { className: 'projectsList' }, this.renderProjectsList())),
                React.createElement("div", { className: 'startPageActions' },
                    React.createElement("h4", null, " \u041D\u0430\u0447\u0430\u043B\u043E \u0440\u0430\u0431\u043E\u0442\u044B "),
                    this.renderButtons()),
                this.state.renderPopUp && React.createElement(PopUp_1.default, { onClose: function () { _this.setState({ renderPopUp: false, newProjectName: '' }); } },
                    React.createElement("div", { className: 'popUpContent' },
                        React.createElement("div", null, "\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u043F\u0440\u043E\u0435\u043A\u0442\u0430:"),
                        React.createElement("div", null,
                            React.createElement("input", { className: 'projectNameInput', value: this.state.newProjectName, onChange: function (e) {
                                    _this.setState({ newProjectName: e.target.value });
                                } })),
                        React.createElement("div", null,
                            React.createElement("button", { className: 'submitNameButton', onClick: function () {
                                    _this.props.createProject(_this.state.newProjectName, _this.props.requestProjects);
                                    _this.setState({ renderPopUp: false, newProjectName: '' });
                                } }, "\u0421\u043E\u0437\u0434\u0430\u0442\u044C")))))));
    };
    Home.prototype.callbackCreator = function (id) {
        var _this = this;
        return function () {
            _this.setState({ selectedProjectID: id });
        };
    };
    Home.prototype.renderButtons = function () {
        var _this = this;
        var buttons = this.state.selectedProjectID !== -1 ?
            React.createElement("div", null,
                React.createElement(StartPagesAction, { text: '\u041E\u0442\u043A\u0440\u044B\u0442\u044C', action: function () { }, img: StartPageAssets.OpenProject }),
                React.createElement(StartPagesAction, { text: '\u0423\u0434\u0430\u043B\u0438\u0442\u044C', action: function () {
                        _this.props.deleteProject(_this.state.selectedProjectID, _this.props.requestProjects);
                        _this.setState({ selectedProjectID: -1 });
                    }, img: StartPageAssets.DeleteProject })) : null;
        return (React.createElement("div", null,
            React.createElement(StartPagesAction, { text: '\u0421\u043E\u0437\u0434\u0430\u0442\u044C', action: function () { _this.setState({ renderPopUp: true }); }, img: StartPageAssets.CreateProject }),
            buttons));
    };
    Home.prototype.renderProjectsList = function () {
        var _this = this;
        return (React.createElement("div", null, this.props.projects.map(function (project, i) { return React.createElement(ProjectPreview, { key: i, projectName: project.projectName, action: function () { _this.setState({ selectedProjectID: project.projectID }); } }); })));
    };
    return Home;
}(React.PureComponent));
var ProjectPreview = function (props) {
    return (React.createElement("div", { className: 'projectPreview' },
        React.createElement("button", { onClick: props.action }, props.projectName)));
};
var StartPagesAction = function (props) {
    return (React.createElement("div", null,
        React.createElement("button", { className: 'startPageAction', onClick: props.action },
            React.createElement("div", null,
                React.createElement(props.img, null)),
            React.createElement("p", null, props.text))));
};
exports.default = react_redux_1.connect(function (state) { return state.startPage; }, ProjectsStore.actionCreators)(Home);
//# sourceMappingURL=Home.js.map