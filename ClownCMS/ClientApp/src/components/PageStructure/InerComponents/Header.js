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
var TextEditor_1 = require("../../Elements/TextEditor");
var TestStore = require("../../../store/TestStore");
/*similar to every page in project*/
var Header = /** @class */ (function (_super) {
    __extends(Header, _super);
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
            React.createElement("div", null,
                React.createElement(TextEditor_1.TextEditor, { text: this.props.text, saveText: this.props.setValue }))));
    };
    return Header;
}(React.PureComponent));
exports.default = react_redux_1.connect(function (state) { return state.test; }, // Selects which state properties are merged into the component's props
TestStore.actionCreators // Selects which action creators are merged into the component's props
)(Header);
//# sourceMappingURL=Header.js.map