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
var NavMenuEditor_1 = require("../../Elements/NavMenuEditor");
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
        return (React.createElement("div", null,
            React.createElement(NavMenuEditor_1.default, null)));
    };
    return Header;
}(React.PureComponent));
exports.default = Header;
//# sourceMappingURL=Header.js.map