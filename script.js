var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var width = ctx.canvas.width;
var height = ctx.canvas.height;
var players = 1;
var difficulty = 3;
var letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
var numbers = ['8', '7', '6', '5', '4', '3', '2', '1'];


function text(font, color, align, TEXT, x, y) {
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.strokeStyle = (color === "white") ? "black" : "white";
  ctx.lineWidth = 1;
  ctx.textAlign = align;
  ctx.fillText(TEXT, x, y);
  ctx.strokeText(TEXT, x, y);
}
function reset() {
  board = new Board(false);
  players = Number(document.getElementById("players").value);
  board.render();
  board.getPossibleMoves();
  document.getElementById("dead").innerHTML = "";
  document.getElementById("turn").innerHTML = "White's Turn";
}



var board = new Board(false);
var sampleBoard = new Board();
//createOpeningBook();
var pieces = new Image();
pieces.src = 'ChessPieces.png';

window.onload = function () {
  board.getPossibleMoves();
  board.render();
}