"use strict";
(() => {
var exports = {};
exports.id = "pages/three";
exports.ids = ["pages/three"];
exports.modules = {

/***/ "./pages/three.tsx":
/*!*************************!*\
  !*** ./pages/three.tsx ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _react_three_fiber__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @react-three/fiber */ "@react-three/fiber");
/* harmony import */ var _react_three_fiber__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_react_three_fiber__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-dev-runtime */ "react/jsx-dev-runtime");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__);
var _jsxFileName = "/home/kuroy/src/github.com/yCroma/next-fiber/pages/three.tsx";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }





const Box = props => {
  const mesh = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)();
  const {
    0: hovered,
    1: setHover
  } = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const {
    0: active,
    1: setActive
  } = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  (0,_react_three_fiber__WEBPACK_IMPORTED_MODULE_1__.useFrame)((state, delta) => mesh.current.rotation.x += 0.01);
  return /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("mesh", _objectSpread(_objectSpread({}, props), {}, {
    ref: mesh,
    scale: active ? 1.5 : 1,
    onClick: event => setActive(!active),
    onPointerOver: event => setHover(true),
    onPointerOut: event => setHover(false),
    children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("boxGeometry", {
      args: [1, 1, 1]
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 20,
      columnNumber: 7
    }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("meshStandardMaterial", {
      color: hovered ? "hotpink" : "orange"
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 21,
      columnNumber: 7
    }, undefined)]
  }), void 0, true, {
    fileName: _jsxFileName,
    lineNumber: 12,
    columnNumber: 5
  }, undefined);
};

const Three = () => {
  return /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)(_react_three_fiber__WEBPACK_IMPORTED_MODULE_1__.Canvas, {
    children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("ambientLight", {}, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 29,
      columnNumber: 7
    }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("pointLight", {
      position: [10, 10, 10]
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 30,
      columnNumber: 7
    }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)(Box, {
      position: [-1.2, 0, 0]
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 31,
      columnNumber: 7
    }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)(Box, {
      position: [1.2, 0, 0]
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 32,
      columnNumber: 7
    }, undefined)]
  }, void 0, true, {
    fileName: _jsxFileName,
    lineNumber: 28,
    columnNumber: 5
  }, undefined);
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Three);

/***/ }),

/***/ "@react-three/fiber":
/*!*************************************!*\
  !*** external "@react-three/fiber" ***!
  \*************************************/
/***/ ((module) => {

module.exports = require("@react-three/fiber");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

module.exports = require("react");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

module.exports = require("react/jsx-dev-runtime");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("./pages/three.tsx"));
module.exports = __webpack_exports__;

})();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnZXMvdGhyZWUuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVBO0FBQ0E7OztBQUVBLE1BQU1LLEdBQUcsR0FBSUMsS0FBRCxJQUFXO0FBQ3JCLFFBQU1DLElBQUksR0FBR04sNkNBQU0sRUFBbkI7QUFDQSxRQUFNO0FBQUEsT0FBQ08sT0FBRDtBQUFBLE9BQVVDO0FBQVYsTUFBc0JQLCtDQUFRLENBQUMsS0FBRCxDQUFwQztBQUNBLFFBQU07QUFBQSxPQUFDUSxNQUFEO0FBQUEsT0FBU0M7QUFBVCxNQUFzQlQsK0NBQVEsQ0FBQyxLQUFELENBQXBDO0FBQ0FFLEVBQUFBLDREQUFRLENBQUMsQ0FBQ1EsS0FBRCxFQUFRQyxLQUFSLEtBQW1CTixJQUFJLENBQUNPLE9BQUwsQ0FBYUMsUUFBYixDQUFzQkMsQ0FBdEIsSUFBMkIsSUFBL0MsQ0FBUjtBQUNBLHNCQUNFLHNHQUNNVixLQUROO0FBRUUsT0FBRyxFQUFFQyxJQUZQO0FBR0UsU0FBSyxFQUFFRyxNQUFNLEdBQUcsR0FBSCxHQUFTLENBSHhCO0FBSUUsV0FBTyxFQUFHTyxLQUFELElBQVdOLFNBQVMsQ0FBQyxDQUFDRCxNQUFGLENBSi9CO0FBS0UsaUJBQWEsRUFBR08sS0FBRCxJQUFXUixRQUFRLENBQUMsSUFBRCxDQUxwQztBQU1FLGdCQUFZLEVBQUdRLEtBQUQsSUFBV1IsUUFBUSxDQUFDLEtBQUQsQ0FObkM7QUFBQSw0QkFRRTtBQUFhLFVBQUksRUFBRSxDQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sQ0FBUDtBQUFuQjtBQUFBO0FBQUE7QUFBQTtBQUFBLGlCQVJGLGVBU0U7QUFBc0IsV0FBSyxFQUFFRCxPQUFPLEdBQUcsU0FBSCxHQUFlO0FBQW5EO0FBQUE7QUFBQTtBQUFBO0FBQUEsaUJBVEY7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLGVBREY7QUFhRCxDQWxCRDs7QUFvQkEsTUFBTVUsS0FBZSxHQUFHLE1BQU07QUFDNUIsc0JBQ0UsOERBQUMsc0RBQUQ7QUFBQSw0QkFDRTtBQUFBO0FBQUE7QUFBQTtBQUFBLGlCQURGLGVBRUU7QUFBWSxjQUFRLEVBQUUsQ0FBQyxFQUFELEVBQUssRUFBTCxFQUFTLEVBQVQ7QUFBdEI7QUFBQTtBQUFBO0FBQUE7QUFBQSxpQkFGRixlQUdFLDhEQUFDLEdBQUQ7QUFBSyxjQUFRLEVBQUUsQ0FBQyxDQUFDLEdBQUYsRUFBTyxDQUFQLEVBQVUsQ0FBVjtBQUFmO0FBQUE7QUFBQTtBQUFBO0FBQUEsaUJBSEYsZUFJRSw4REFBQyxHQUFEO0FBQUssY0FBUSxFQUFFLENBQUMsR0FBRCxFQUFNLENBQU4sRUFBUyxDQUFUO0FBQWY7QUFBQTtBQUFBO0FBQUE7QUFBQSxpQkFKRjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsZUFERjtBQVFELENBVEQ7O0FBV0EsaUVBQWVBLEtBQWY7Ozs7Ozs7Ozs7QUNwQ0E7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7OztBQ0FBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vbmV4dC1maWJlci8uL3BhZ2VzL3RocmVlLnRzeCIsIndlYnBhY2s6Ly9uZXh0LWZpYmVyL2V4dGVybmFsIFwiQHJlYWN0LXRocmVlL2ZpYmVyXCIiLCJ3ZWJwYWNrOi8vbmV4dC1maWJlci9leHRlcm5hbCBcInJlYWN0XCIiLCJ3ZWJwYWNrOi8vbmV4dC1maWJlci9leHRlcm5hbCBcInJlYWN0L2pzeC1kZXYtcnVudGltZVwiIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgTmV4dFBhZ2UgfSBmcm9tIFwibmV4dFwiO1xuaW1wb3J0IFJlYWN0RE9NIGZyb20gXCJyZWFjdC1kb21cIjtcbmltcG9ydCBSZWFjdCwgeyB1c2VSZWYsIHVzZVN0YXRlIH0gZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgeyBDYW52YXMsIHVzZUZyYW1lIH0gZnJvbSBcIkByZWFjdC10aHJlZS9maWJlclwiO1xuXG5jb25zdCBCb3ggPSAocHJvcHMpID0+IHtcbiAgY29uc3QgbWVzaCA9IHVzZVJlZigpO1xuICBjb25zdCBbaG92ZXJlZCwgc2V0SG92ZXJdID0gdXNlU3RhdGUoZmFsc2UpO1xuICBjb25zdCBbYWN0aXZlLCBzZXRBY3RpdmVdID0gdXNlU3RhdGUoZmFsc2UpO1xuICB1c2VGcmFtZSgoc3RhdGUsIGRlbHRhKSA9PiAobWVzaC5jdXJyZW50LnJvdGF0aW9uLnggKz0gMC4wMSkpO1xuICByZXR1cm4gKFxuICAgIDxtZXNoXG4gICAgICB7Li4ucHJvcHN9XG4gICAgICByZWY9e21lc2h9XG4gICAgICBzY2FsZT17YWN0aXZlID8gMS41IDogMX1cbiAgICAgIG9uQ2xpY2s9eyhldmVudCkgPT4gc2V0QWN0aXZlKCFhY3RpdmUpfVxuICAgICAgb25Qb2ludGVyT3Zlcj17KGV2ZW50KSA9PiBzZXRIb3Zlcih0cnVlKX1cbiAgICAgIG9uUG9pbnRlck91dD17KGV2ZW50KSA9PiBzZXRIb3ZlcihmYWxzZSl9XG4gICAgPlxuICAgICAgPGJveEdlb21ldHJ5IGFyZ3M9e1sxLCAxLCAxXX0gLz5cbiAgICAgIDxtZXNoU3RhbmRhcmRNYXRlcmlhbCBjb2xvcj17aG92ZXJlZCA/IFwiaG90cGlua1wiIDogXCJvcmFuZ2VcIn0gLz5cbiAgICA8L21lc2g+XG4gICk7XG59O1xuXG5jb25zdCBUaHJlZTogTmV4dFBhZ2UgPSAoKSA9PiB7XG4gIHJldHVybiAoXG4gICAgPENhbnZhcz5cbiAgICAgIDxhbWJpZW50TGlnaHQgLz5cbiAgICAgIDxwb2ludExpZ2h0IHBvc2l0aW9uPXtbMTAsIDEwLCAxMF19IC8+XG4gICAgICA8Qm94IHBvc2l0aW9uPXtbLTEuMiwgMCwgMF19IC8+XG4gICAgICA8Qm94IHBvc2l0aW9uPXtbMS4yLCAwLCAwXX0gLz5cbiAgICA8L0NhbnZhcz5cbiAgKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IFRocmVlO1xuIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiQHJlYWN0LXRocmVlL2ZpYmVyXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInJlYWN0XCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInJlYWN0L2pzeC1kZXYtcnVudGltZVwiKTsiXSwibmFtZXMiOlsiUmVhY3QiLCJ1c2VSZWYiLCJ1c2VTdGF0ZSIsIkNhbnZhcyIsInVzZUZyYW1lIiwiQm94IiwicHJvcHMiLCJtZXNoIiwiaG92ZXJlZCIsInNldEhvdmVyIiwiYWN0aXZlIiwic2V0QWN0aXZlIiwic3RhdGUiLCJkZWx0YSIsImN1cnJlbnQiLCJyb3RhdGlvbiIsIngiLCJldmVudCIsIlRocmVlIl0sInNvdXJjZVJvb3QiOiIifQ==