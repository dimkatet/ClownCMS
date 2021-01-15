"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var react_router_1 = require("react-router");
var Home_1 = require("./components/Home");
var Base_1 = require("./components/PageStructure/Base");
require("./custom.css");
exports.default = (function () { return (React.createElement(react_router_1.Switch, null,
    React.createElement(react_router_1.Route, { path: '/', component: Base_1.default }),
    React.createElement(react_router_1.Route, { exact: true, path: '/', component: Home_1.default }))); });
//# sourceMappingURL=App.js.map