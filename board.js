class Board {
  constructor(copied) {
    if (typeof (copied) == 'undefined') copied = false;
    this.offSetLeft = 100;
    this.offSetTop = 100;
    this.width = width - this.offSetLeft;
    this.height = height - this.offSetTop;
    this.rows = 8;
    this.columns = 8;
    this.tileSpace = ((this.height < this.width) ? this.height : this.width) / this.rows;
    var p1 = "white";
    var p2 = "black";
    this.tiles = [];
    this.deadPieces = [];
    this.whitePieces = [];
    this.blackPieces = [];
    // Previous move is structured as [startX, startY, endX, endY, takenPiece(null if there is none), inCheck(boolean), firstMove]
    this.prevMove = [];
    this.moveHistory = [];
    this.boardHistory = [this];
    if (!copied) {
      this.tiles = [[new Rook(p2, 0, 0), new Pawn(p2, 0, 1), new Blank(), new Blank(), new Blank(), new Blank(), new Pawn(p1, 0, 6), new Rook(p1, 0, 7)], [new Knight(p2, 1, 0), new Pawn(p2, 1, 1), new Blank(), new Blank(), new Blank(), new Blank(), new Pawn(p1, 1, 6), new Knight(p1, 1, 7)], [new Bishop(p2, 2, 0), new Pawn(p2, 2, 1), new Blank(), new Blank(), new Blank(), new Blank(), new Pawn(p1, 2, 6), new Bishop(p1, 2, 7)], [new Queen(p2, 3, 0), new Pawn(p2, 3, 1), new Blank(), new Blank(), new Blank(), new Blank(), new Pawn(p1, 3, 6), new Queen(p1, 3, 7)], [new King(p2, 4, 0), new Pawn(p2, 4, 1), new Blank(), new Blank(), new Blank(), new Blank(), new Pawn(p1, 4, 6), new King(p1, 4, 7)], [new Bishop(p2, 5, 0), new Pawn(p2, 5, 1), new Blank(), new Blank(), new Blank(), new Blank(), new Pawn(p1, 5, 6), new Bishop(p1, 5, 7)], [new Knight(p2, 6, 0), new Pawn(p2, 6, 1), new Blank(), new Blank(), new Blank(), new Blank(), new Pawn(p1, 6, 6), new Knight(p1, 6, 7)], [new Rook(p2, 7, 0), new Pawn(p2, 7, 1), new Blank(), new Blank(), new Blank(), new Blank(), new Pawn(p1, 7, 6), new Rook(p1, 7, 7)]];

      for (let i = 0; i < this.tiles.length; i++) {
        this.whitePieces.push(this.tiles[i][6]);
        this.whitePieces.push(this.tiles[i][7]);
        this.blackPieces.push(this.tiles[i][0]);
        this.blackPieces.push(this.tiles[i][1]);
      }

      this.whiteKing = this.tiles[4][7];
      this.blackKing = this.tiles[4][0];
    }
    this.check = false;
    // sp is short for Selected Piece
    this.sp = [-1, -1];
    this.winner = "none";

    // True for white false for black
    this.turn = true;
  }
  render() {
    ctx.clearRect(0, 0, width, height);
    ctx.translate(this.offSetLeft, this.offSetTop / 2);
    var sign = -1;
    for (let o = 0; o < this.columns; o++) {
      text("30px Times", "black", "center", letters[o], this.tileSpace / 2 + o * this.tileSpace, -15);
      text("30px Times", "black", "center", numbers[o], -15, o * this.tileSpace + this.tileSpace * 0.75);
      for (let i = 0; i < this.rows; i++) {
        if (sign === 1) {
          ctx.fillStyle = "#555";
        }
        else {
          ctx.fillStyle = "#fff";
        }
        ctx.fillRect(i * this.tileSpace, o * this.tileSpace, this.tileSpace, this.tileSpace);
        this.tiles[i][o].render(i * this.tileSpace, o * this.tileSpace, this);
        sign *= -1;
      }
      sign *= -1;
    }
    // Highlight selected piece
    if (this.sp[0] != -1) {
      ctx.fillStyle = "rgba(255,255,153, 0.5)";
      ctx.fillRect(this.sp[0] * this.tileSpace, this.sp[1] * this.tileSpace, this.tileSpace, this.tileSpace);


      // Highlight selected pieces possible moves

      var piece = this.tiles[this.sp[0]][this.sp[1]];

      if ((piece.color == "white") == this.turn) {

        ctx.fillStyle = "rgba(30, 255, 30, 0.5)";
        for (let i = 0; i < piece.possibleMoves.length; i++) {

          ctx.fillRect(piece.possibleMoves[i][2] * this.tileSpace, piece.possibleMoves[i][3] * this.tileSpace, this.tileSpace, this.tileSpace);

        }
      }


    }

    // Show previous move
    if (this.prevMove.length > 0) {
      ctx.fillStyle = "rgba(145, 231, 255, 0.4)";
      ctx.fillRect(this.prevMove[0] * this.tileSpace, this.prevMove[1] * this.tileSpace, this.tileSpace, this.tileSpace);
      ctx.fillRect(this.prevMove[2] * this.tileSpace, this.prevMove[3] * this.tileSpace, this.tileSpace, this.tileSpace);
    }
    var fake = this.copy();
    fake.tileSpace /= 2;
    for (let i = 0; i < this.deadPieces.length; i++) {
      this.deadPieces[i].render((i % (this.columns * 2)) * fake.tileSpace, this.height + Math.floor(i / (this.columns * 2)) * fake.tileSpace, fake);
    }
    ctx.strokeStyle = "black";
    ctx.strokeRect(0, 0, this.width, this.height);
    ctx.translate(-this.offSetLeft, -this.offSetTop / 2);
  }
  getPiece(mx, my) {
    var x = Math.floor(mx / this.tileSpace);
    var y = Math.floor(my / this.tileSpace);
    document.getElementById("sp").innerHTML = x + " | " + y;
    this.sp = [x, y];
  }
  // Real defaults to true
  swapPieces(mx, my, real) {
    if (typeof (real) == 'undefined') real = true;
    if (real) {
      var x = Math.floor(mx / this.tileSpace);
      var y = Math.floor(my / this.tileSpace);
    }
    else {
      var x = mx;
      var y = my;
    }
    var whatsgonnareturn = false;
    var holdingDead = JSON.parse(JSON.stringify(this.deadPieces));
    var pieceHolder = this.tiles[this.sp[0]][this.sp[1]];
    if (this.tiles[this.sp[0]][this.sp[1]].canDoMove(x, y, this, real)) {
      this.boardHistory.push(this.copy());
      this.tiles[this.sp[0]][this.sp[1]].makeMove(x, y, this);


      var hold1 = this.tiles[this.sp[0]][this.sp[1]];
      var hold2 = this.tiles[x][y];


      if (this.tiles[x][y].color != "") {

        this.deadPieces.push(this.tiles[x][y]);
        if (this.tiles[x][y].color == "white") {
          this.whitePieces.splice(this.whitePieces.indexOf(this.tiles[x][y]), 1);
        }
        else {
          this.blackPieces.splice(this.blackPieces.indexOf(this.tiles[x][y]), 1);
        }
        hold2 = new Blank();
      }

      this.tiles[x][y] = hold1;
      this.tiles[this.sp[0]][this.sp[1]] = hold2;
      whatsgonnareturn = true;

      var pieces = (this.turn) ? this.blackPieces : this.whitePieces;
      for (var i = 0; i < pieces.length; i++) {
        if (pieces[i].name == "pawn") {
          this.tiles[pieces[i].x][pieces[i].y].empassantAllowed = false;
        }
      }

      // Set up move history and prev move

      if (holdingDead.length == this.deadPieces.length) {
        this.prevMove = [this.sp[0], this.sp[1], x, y, null];
      }
      else {
        this.prevMove = [this.sp[0], this.sp[1], x, y, this.deadPieces[this.deadPieces.length - 1]];
      }
      board.turn = !board.turn;
      this.prevMove.push(this.isInCheck());
      board.turn = !board.turn;
      if (pieceHolder.name == "rook" || pieceHolder.name == "king") {
        this.prevMove.push(true);
      }
      if (pieceHolder.name == "pawn") {
        this.prevMove.push(true);
      }

      this.moveHistory.push(this.prevMove);



    }




    this.sp = [-1, -1];

    return whatsgonnareturn

  }

  undoBoard() {
    
    if (this.boardHistory.length == 1) return;
    
    var board = this.boardHistory.pop();
    this.moveHistory = board.moveHistory;
    this.prevMove = board.prevMove;
    this.tiles = board.tiles;
    this.deadPieces = board.deadPieces;
    this.whitePieces = board.whitePieces;
    this.blackPieces = board.blackPieces;
    this.whiteKing = board.whiteKing;
    this.blackKing = board.blackKing;
    this.turn = board.turn;

    document.getElementById("turn").innerHTML = ((this.turn) ? "White's " : "Black's ") + "Turn";
    if (this.isInCheck()) {
      document.getElementById("turn").innerHTML += " (Check!)";
    }
    this.getPossibleMoves((this.turn)?"white":"black", true);
    this.render();
  }

  undoMove() {

    if (this.moveHistory.length == 0) return;

    if (this.winner == "none") {

      var hold1 = this.tiles[this.prevMove[0]][this.prevMove[1]];
      var hold2 = this.tiles[this.prevMove[2]][this.prevMove[3]];
      this.tiles[this.prevMove[0]][this.prevMove[1]] = hold2;

      if (this.prevMove[4] != null) {
        this.tiles[this.prevMove[4].x][this.prevMove[4].y] = this.prevMove[4].copy();
        this.deadPieces.pop();
        if (!(this.prevMove[4].x == this.prevMove[2] && this.prevMove[4].y == this.prevMove[3])) {
          this.tiles[this.prevMove[2]][this.prevMove[3]] = hold1;
        }
      }
      else {
        this.tiles[this.prevMove[2]][this.prevMove[3]] = hold1;
      }


      // Set back the x and y coords
      this.tiles[this.prevMove[0]][this.prevMove[1]].x = this.prevMove[0];
      this.tiles[this.prevMove[0]][this.prevMove[1]].y = this.prevMove[1];
      // Set back king and rook has moved
      if ((this.tiles[this.prevMove[0]][this.prevMove[1]].name == "rook" || this.tiles[this.prevMove[0]][this.prevMove[1]].name == "king") && this.prevMove[6]) {
        this.tiles[this.prevMove[0]][this.prevMove[1]].hasMoved = false;
      }
      // Set back pawn first
      if (this.tiles[this.prevMove[0]][this.prevMove[1]].name == "pawn" && this.prevMove[6]) {
        this.tiles[this.prevMove[0]][this.prevMove[1]].first = true;
      }

      // Move rook for castle
      if (this.tiles[this.prevMove[0]][this.prevMove[1]].name == "king" && Math.abs(this.prevMove[0] - this.prevMove[2]) > 1) {

        this.tiles[(this.prevMove[0] < this.prevMove[1]) ? 6 : 4][this.prevMove[1]].x = (this.prevMove[0] < this.prevMove[1]) ? 7 : 0;

      }

      this.turn = !this.turn;
      this.tiles[this.prevMove[0]][this.prevMove[1]].getPossibleMoves(this);
      this.turn = !this.turn;

      this.moveHistory.pop();
      this.prevMove = this.moveHistory[this.moveHistory.length - 1];
      if (this.prevMove == undefined) this.prevMove = [];

      this.turn = !this.turn;
      document.getElementById("turn").innerHTML = ((this.turn) ? "White's " : "Black's ") + "Turn";
      if (this.prevMove[5]) {
        document.getElementById("turn").innerHTML += " (Check!)";
      }

      this.render();

    }

  }

  checkThreeFold() {
    console.log(this.boardHistory.length);
  }

  canDoMove(x1, y1, x2, y2, real) {
    if (typeof (real) == 'undefined') real = false;
    var clone = this.tiles[x1][y1].copy();
    // To fix problems with checking valid moves moving the king
    var whiteKing = this.whiteKing;
    var blackKing = this.blackKing;
    this.whiteKing = whiteKing.copy();
    this.blackKing = blackKing.copy();

    var returning = clone.canDoMove(x2, y2, this, real);

    this.whiteKing = whiteKing;
    this.blackKing = blackKing;

    return returning;
  }

  getPossibleMoves(side, real) {
    if (typeof (real) == 'undefined') real = false;
    //var sum = 0;
    var prevTurn = this.turn;
    this.turn = ((typeof (side) == 'string') ? side == "white" : this.turn);
    var possibleMoves = [];
    if (typeof (side) == 'string')
      var pieces = (side == "white") ? this.whitePieces : this.blackPieces;
    else
      var pieces = (this.turn) ? this.whitePieces : this.blackPieces;

    for (let i = 0; i < pieces.length; i++) {
      possibleMoves = possibleMoves.concat(pieces[i].getPossibleMoves(this, real));
    }
    //console.log(sum);
    this.turn = prevTurn;
    return possibleMoves;
  }

  ppm() {

    var moves = this.getPossibleMoves();

    console.log("There are " + moves.length + " possible moves.");
    for (let i = 0; i < moves.length; i++) {

      moves[i][0] = letters[moves[i][0]];
      moves[i][1] = numbers[moves[i][1]];
      moves[i][2] = letters[moves[i][2]];
      moves[i][3] = numbers[moves[i][3]];

    }

    console.log(moves);

  }

  evaluateState(side) {
    var sum = 0;
    for (let i = 0; i < this.deadPieces.length; i++) {
      sum += this.deadPieces[i].worth * ((this.deadPieces[i].color == "white") ? 1 : -1);
    }
    if (side == "white") {
      sum -= (this.getPossibleMoves("white").length / 500);
      sum -= (this.closeToCenterScore("white") / 300);
    }
    else if (side == "black") {
      sum += (this.getPossibleMoves("black").length / 500);
      sum += (this.closeToCenterScore("black") / 300);
    }
    else {
      sum -= (this.getPossibleMoves("white").length / 500);
      sum -= (this.closeToCenterScore("white") / 300);
      sum += (this.getPossibleMoves("black").length / 500);
      sum += (this.closeToCenterScore("black") / 300);
    }

    return sum;
  }

  closeToCenterScore(side) {

    if (typeof (side) == 'string')
      var pieces = (side == "white") ? this.whitePieces : this.blackPieces;
    else
      var pieces = (this.turn) ? this.whitePieces : this.blackPieces;

    var sum = 0;
    for (let i = 0; i < pieces.length; i++) {
      if (/*pieces[i].name != "pawn" && */pieces[i].name != "king")
        sum += 7 - (Math.abs(pieces[i].x - 3.5) + Math.abs(pieces[i].y - 3.5));
    }

    return sum;

  }

  isInCheck(side) {

    if (typeof (side) == 'string')
      var king = ((side == "white") ? this.whiteKing : this.blackKing).copy();
    else
      var king = ((this.turn) ? this.whiteKing : this.blackKing).copy();

    var moves = this.getPossibleMoves(((this.turn) ? "black" : "white"), false);

    for (let i = 0; i < moves.length; i++) {

      if (moves[i][2] == king.x && moves[i][3] == king.y) {

        return true;

      }

    }

    return false;

  }

  copy() {

    var clone = new Board(true);

    clone.turn = this.turn;
    clone.winner = this.winner;

    clone.prevMove = this.prevMove;

    // Non JSON method ***********

    for (let i = 0; i < this.columns; i++) {
      clone.tiles.push([]);
      for (let j = 0; j < this.rows; j++) {
        clone.tiles[i].push(this.tiles[i][j].copy());
        if (clone.tiles[i][j].color == "black") {
          clone.blackPieces.push(clone.tiles[i][j]);
          if (clone.tiles[i][j].name == "king") {
            clone.blackKing = clone.tiles[i][j];
          }
        }
        else if (clone.tiles[i][j].color == "white") {
          clone.whitePieces.push(clone.tiles[i][j]);
          if (clone.tiles[i][j].name == "king") {
            clone.whiteKing = clone.tiles[i][j];
          }
        }
      }
    }

    for (let i = 0; i < this.deadPieces.length; i++) {
      clone.deadPieces.push(this.deadPieces[i]);
    }


    return clone;

  }

}
var calls = 0;