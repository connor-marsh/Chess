var mouseX;
var mouseY;
var mousex;
var mousey;
var holdingPiece = false;

canvas.addEventListener("mousedown", function (e) {
  mousex = e.pageX - ctx.canvas.offsetLeft - board.offSetLeft;
  mousey = e.pageY - ctx.canvas.offsetTop - board.offSetTop / 2;
  mouseX = mousex;
  mouseY = mousey;
  mouseDownHandler();
});

canvas.addEventListener("mousemove", function (e) {
  mouseX = e.pageX - ctx.canvas.offsetLeft - board.offSetLeft;
  mouseY = e.pageY - ctx.canvas.offsetTop - board.offSetTop / 2;
  document.getElementById("coords").innerHTML = mouseX + " " + mouseY;
  mouseMoveHandler();
});

canvas.addEventListener("mouseup", function (e) {
  mouseX = e.pageX - ctx.canvas.offsetLeft - board.offSetLeft;
  mouseY = e.pageY - ctx.canvas.offsetTop - board.offSetTop / 2;
  mouseUpHandler();
});

canvas.addEventListener("touchstart", function (e) {
  e.preventDefault();
  mousex = e.touches[0].pageX - ctx.canvas.offsetLeft - board.offSetLeft;
  mousey = e.touches[0].pageY - ctx.canvas.offsetTop - board.offSetTop / 2;
  mouseX = mousex;
  mouseY = mousey;
  mouseDownHandler();
});

canvas.addEventListener("touchmove", function (e) {
  e.preventDefault();
  mouseX = e.touches[0].pageX - ctx.canvas.offsetLeft - board.offSetLeft;
  mouseY = e.touches[0].pageY - ctx.canvas.offsetTop - board.offSetTop / 2;
  document.getElementById("coords").innerHTML = mouseX + " | " + mouseY;
  mouseMoveHandler();
});

canvas.addEventListener("touchend", function (e) {
  e.preventDefault();
  mouseX = e.changedTouches[0].pageX - ctx.canvas.offsetLeft - board.offSetLeft;
  mouseY = e.changedTouches[0].pageY - ctx.canvas.offsetTop - board.offSetTop / 2;
  mouseUpHandler();
});

function mouseDownHandler() {
  // Make sure mouse is on board
  if (mouseX > ctx.canvas.width - board.offSetLeft || mouseY > ctx.canvas.height - board.offSetTop || mouseX < 0 || mouseY < 0) {
    return;
  }
  if (board.winner != "none") {
    return;
  }
  players = Number(document.getElementById("players").value);
  difficulty = Number(document.getElementById("difficulty").value);
  if (holdingPiece) {
    doMove();
  }
  else {
    if (players == 1) {
      if (board.turn) {
        board.getPiece(mouseX, mouseY);
        board.render();
      }
    }
    if (players == 2) {
      board.getPiece(mouseX, mouseY);
      board.render();
    }
  }
}

function mouseMoveHandler() {
  // Make sure mouse is on board
  if (mouseX > ctx.canvas.width - board.offSetLeft || mouseY > ctx.canvas.height - board.offSetTop || mouseX < 0 || mouseY < 0) {
    return;
  }
  if (board.sp[0] != -1) {

    board.render();

    board.tiles[board.sp[0]][board.sp[1]].render(mouseX - board.tileSpace / 2 + board.offSetLeft, mouseY - board.tileSpace / 2 + board.offSetTop / 2, board);

  }
}

function mouseUpHandler() {
  // Make sure mouse is on board
  if (mouseX > ctx.canvas.width - board.offSetLeft || mouseY > ctx.canvas.height - board.offSetTop || mouseX < 0 || mouseY < 0) {
    return;
  }
  if (holdingPiece) {
    holdingPiece = false;
    return;
  }
  if (Math.abs(mouseX-mousex) < 3 && Math.abs(mouseY - mousey) < 3 && board.tiles[board.sp[0]][board.sp[1]].name != "") {
    holdingPiece = true;
    board.render();
    return;
  }
  if (board.winner != "none") {
    return;
  }

  doMove();

}

function doMove() {
  if (players == 1) {
    if (board.turn) {
      if (board.swapPieces(mouseX, mouseY)) {
        document.getElementById("turn").innerHTML = "Black's Turn";
        board.turn = false;
        if (board.isInCheck()) {
          document.getElementById("turn").innerHTML = "Black's Turn (Check!)";
        }

        document.getElementById("thinking").innerHTML = "Thinking...";


        setTimeout(ai, 20);
        //ai();

      }
    }
    board.render();
  }
  if (players == 2) {

    if (board.swapPieces(mouseX, mouseY)) {
      board.render();
      if (board.turn) {

        document.getElementById("turn").innerHTML = "Black's Turn";
        board.turn = false;

        if (board.getPossibleMoves("black", true).length == 0) {
          if (board.isInCheck()) {
            board.winner = "white";
          }
          else {
            board.winner = "stale";
          }
        }
        else if (board.isInCheck()) {
          document.getElementById("turn").innerHTML = "Black's Turn (Check!)";
        }
      }
      else {

        document.getElementById("turn").innerHTML = "White's Turn";
        board.turn = true;

        if (board.getPossibleMoves("white", true).length == 0) {
          if (board.isInCheck()) {
            board.winner = "black";
          }
          else {
            board.winner = "stale";
          }
        }
        else if (board.isInCheck()) {
          document.getElementById("turn").innerHTML = "White's Turn (Check!)";
        }
      }
    }
    else {
      board.render();
    }

  }

  board.checkThreeFold();

  if (board.winner != "none") {
    endState();
  }
}

function endState() {

  if (board.winner == "stale") {
    document.getElementById("turn").innerHTML = "Stale Mate, It's a draw!";
  }
  else if (board.winner == "three") {
    document.getElementById("turn").innerHTML = "Three Fold Repetition, It's a draw!";
  }
  else {
    document.getElementById("turn").innerHTML = ((board.winner == "white") ? "White" : "Black") + " Wins!";
  }

}
