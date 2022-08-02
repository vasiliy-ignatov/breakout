'use strict'

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var q = 0;

function draw() {
// код отрисовки
q++
console.log(q)
}
setInterval(draw, 10);