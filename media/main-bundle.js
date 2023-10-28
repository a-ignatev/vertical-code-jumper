/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

let canvas, ctx;
let interval;
class BallState {
    constructor(cx, cy) {
        this.cx = cx;
        this.cy = cy;
    }
}
function initCanvas() {
    canvas = document.getElementById("gameCanvas");
    if (!canvas) {
        console.log("Canvas not ready");
        return;
    }
    ctx = canvas.getContext("2d");
    if (!ctx) {
        console.log("Canvas context not ready");
        return;
    }
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    let ballRadius = 20;
    let ballState = { x: 0, y: 0 };
    clearInterval(interval);
    interval = setInterval(() => {
        ballState.y += 1;
        drawBall();
    }, 10);
    function drawBall() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.arc(ballState.x, ballState.y, ballRadius, 0, 2 * Math.PI, false);
        ctx.fillStyle = "#2ed851";
        ctx.fill();
    }
    window.onmousemove = (ev) => {
        ev.preventDefault();
        ballState = { x: ev.clientX, y: ev.clientY };
    };
}
window.addEventListener("resize", function () {
    initCanvas();
});
initCanvas();

self.codeJumperGame = __webpack_exports__;
/******/ })()
;