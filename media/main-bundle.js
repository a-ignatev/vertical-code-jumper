/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

document.getElementById("hello")?.addEventListener("click", hello);
function hello() {
    const div = document.createElement("div");
    div.innerHTML = "i'm going to jump!!!";
    document.body.appendChild(div);
}

self.codeJumperGame = __webpack_exports__;
/******/ })()
;