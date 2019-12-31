class Piece {

  constructor(color, x, y) {
    this.color = color;
    this.taken = false;
    this.x = x;
    this.y = y;
    this.worth;
    this.possibleMoves = [];
  }

  render(i, o, owner) {
    // ctx.beginPath();
    // ctx.fillStyle = this.color;
    // ctx.rect(i*50+20, o*50+20, 10, 10);

    switch (this.text) {
      case "K":
        ctx.drawImage(pieces, 0, (this.color == "white") ? 0 : 65, 65, 65, i, o, owner.tileSpace, owner.tileSpace);
        break;
      case "Q":
        ctx.drawImage(pieces, 65, (this.color == "white") ? 0 : 65, 65, 65, i, o, owner.tileSpace, owner.tileSpace);
        break;
      case "B":
        ctx.drawImage(pieces, 130, (this.color == "white") ? 0 : 65, 65, 65, i, o, owner.tileSpace, owner.tileSpace);
        break;
      case "Kn":
        ctx.drawImage(pieces, 195, (this.color == "white") ? 0 : 65, 65, 65, i, o, owner.tileSpace, owner.tileSpace);
        break;
      case "R":
        ctx.drawImage(pieces, 260, (this.color == "white") ? 0 : 65, 65, 65, i, o, owner.tileSpace, owner.tileSpace);
        break;
      case "P":
        ctx.drawImage(pieces, 325, (this.color == "white") ? 0 : 65, 65, 65, i, o, owner.tileSpace, owner.tileSpace);
        break;
    }

    //text("40px Times", this.color, "center", this.text, i+25, o+38);
  }

  canDoMove(x, y, owner, real) {
    if (typeof (real) == 'undefined') real = true;

    if (owner.tiles[x][y].color == this.color || !owner.turn && this.color == "white" || owner.turn && this.color == "black") {
      return false;
    }
    else {

      if (real) {

        var clone = owner.copy();
        clone.sp = [this.x, this.y];
        clone.swapPieces(x, y, false);
        return !clone.isInCheck();

      }

      return true;
    }
  }

  makeMove(x, y) {

    this.x = x;
    this.y = y;

  }



}

class King extends Piece {
  constructor(color, x, y) {
    super(color, x, y);
    this.text = "K";
    this.name = "king";
    this.worth = 1000;
    this.castleAllowed = true;
    this.hasMoved = false;

  }

  canDoMove(x, y, owner, real) {
    if (typeof (real) == 'undefined') real = true;
    // all piece logic
    var bool = super.canDoMove(x, y, owner, real);
    if (bool == false) return false;
    bool = Math.abs(this.x - x) <= 2 && Math.abs(this.y - y) <= 1;

    if (bool) {

      // Castle Logic
      this.castleAllowed = false;
      if (!this.hasMoved) {
        if (y == 0 && this.color == "black") {
          var mult = (x > 4) ? -1 : 1;
          var side = (x > 4) ? 7 : 0;
          if (!owner.tiles[side][0].hasMoved && owner.tiles[side][0].name == "rook" && owner.tiles[side + mult][0].name == "" && owner.tiles[side + mult * 2][0].name == "" && (owner.tiles[side + mult * 3][0].name == "" || mult == -1)) {
            this.castleAllowed = true;
            if (real) {
              mult *= -1;
              var moves = owner.getPossibleMoves("white", false);
              for (let i = 0; i < moves.length; i++) {
                if ((moves[i][2] == 4 || moves[i][2] == 4 + mult || moves[i][2] == 4 + mult * 2) && moves[i][3] == 0) {
                  this.castleAllowed = false;
                }
              }
            }

          }
        }
        else if (y == 7 && this.color == "white") {
          var mult = (x > 4) ? -1 : 1;
          var side = (x > 4) ? 7 : 0;
          if (!owner.tiles[side][7].hasMoved && owner.tiles[side + mult][7].name == "" && owner.tiles[side + mult * 2][7].name == "" && (owner.tiles[side + mult * 3][7].name == "" || mult == -1)) {
            this.castleAllowed = true;
            if (real) {
              mult *= -1;
              var moves = owner.getPossibleMoves("black", false);
              for (let i = 0; i < moves.length; i++) {
                if ((moves[i][2] == 4 || moves[i][2] == 4 + mult || moves[i][2] == 4 + mult * 2) && moves[i][3] == 7) {
                  this.castleAllowed = false;
                }
              }
            }
          }

        }
      }

      if (Math.abs(this.x - x) <= 1 || this.castleAllowed && x == (x > 4 ? 6 : 2)) {

        return true;
      }
      else {
        return false;
      }

    }
    else {
      return false;
    }


  }

  // Only use this if you've already tested canDoMove

  makeMove(x, y, owner) {

    this.x = x;
    this.y = y;

    if (this.color == "white") {
      owner.whiteKing.x = this.x;
      owner.whiteKing.y = this.y;
      owner.whiteKing.hasMoved = true;
    }
    if (this.color == "black") {
      owner.blackKing.x = this.x;
      owner.blackKing.y = this.y;
      owner.blackKing.hasMoved = true;
    }

    if (this.castleAllowed && x == (x > 4 ? 6 : 2)) {

      owner.tiles[(x > 4) ? this.x - 1 : this.x + 1][y] = owner.tiles[(x > 4) ? 7 : 0][y];

      owner.tiles[(x > 4) ? 7 : 0][y] = new Blank();

      owner.tiles[(x > 4) ? this.x - 1 : this.x + 1][y].x = ((x > 4) ? this.x - 1 : this.x + 1);

    }

    this.hasMoved = true;
  }

  getPossibleMoves(owner, real) {

    if (typeof (real) == 'undefined') real == false;
    var possibleMoves = [];

    // Check moves in a square

    for (let i = this.x - 1; i <= this.x + 1; i++) {
      for (let j = this.y - 1; j <= this.y + 1; j++) {

        if (i < 0 || i >= owner.rows || j < 0 || j >= owner.columns) continue;
        if (i == this.x && j == this.y) continue;

        if (this.canDoMove(i, j, owner, real)) {
          possibleMoves.push([this.x, this.y, i, j]);
        }

      }
    }

    // Check Castles

    if (!this.hasMoved) {
      if (this.canDoMove(this.x + 2, this.y, owner, real)) {
        possibleMoves.push([this.x, this.y, this.x + 2, this.y]);
      }
      if (this.canDoMove(this.x - 2, this.y, owner, real)) {
        possibleMoves.push([this.x, this.y, this.x - 2, this.y]);
      }
    }

    this.possibleMoves = possibleMoves;

    return possibleMoves;

  }

  copy() {

    var clone = new King(this.color, this.x, this.y);
    clone.taken = this.taken;
    clone.hasMoved = this.hasMoved;

    return clone;

  }

}

class Queen extends Piece {
  constructor(color, x, y) {
    super(color, x, y);
    this.text = "Q";
    this.name = "queen";
    this.worth = 9;
  }
  canDoMove(x, y, owner, real) {
    // all piece logic
    var bool = super.canDoMove(x, y, owner, real);
    if (!bool) return false;
    // Check if move is diagonal or horizontal
    bool = (this.x - x == 0 || this.y - y == 0) || (Math.abs(this.x - x) == Math.abs(this.y - y));
    if (bool) {
      // Check if they are jumping pieces diagonal

      // With Ternary Operators Busted Noises

      if (Math.abs(this.x - x) == Math.abs(this.y - y)) {
        for (let i = this.x + ((x - this.x > 0) ? 1 : -1); ((x - this.x > 0) ? i < x : i > x); ((x - this.x > 0) ? i++ : i--)) {

          if (owner.tiles[i][this.y + (i - this.x) * ((y - this.y < 0) ? -1 : 1) * ((x - this.x > 0) ? 1 : -1)].name != "") {
            return false;
          }

        }
      }

      // Without Ternary Operators Busted Noises

      // if (Math.abs(this.x - x) == Math.abs(this.y - y) && x - this.x > 0) {
      //   for (var i = this.x + 1; i < x; i++) {

      //     if (owner.tiles[i][this.y + (i - this.x)*((y-this.y<0)?-1:1)].name != "") {
      //       return false;
      //     }

      //   }
      // }
      // if (Math.abs(this.x - x) == Math.abs(this.y - y) && x - this.x < 0) {
      //   for (var i = this.x - 1; i > x; i--) {

      //     if (owner.tiles[i][this.y + (i - this.x)*((y-this.y<0)?1:-1)].name != "") {
      //       return false;
      //     }

      //   }
      // }

      // Check if they are jumping pieces in a line

      // With Ternary Operator Busted Noise

      // if (this.x - x == 0 || this.y - y == 0) {

      //   var a = this.x - x == 0;
      //   var b = x - this.x > 0;



      // }

      if (this.x - x == 0 || this.y - y == 0) {

        // Without Ternary Operated Busted Noise

        // Vertical

        if (this.x - x == 0 && y - this.y > 0) {
          for (let i = this.y + 1; i < y; i++) {

            if (owner.tiles[this.x][i].name != "") {
              return false;
            }

          }
        }

        else if (this.x - x == 0 && y - this.y < 0) {
          for (let i = this.y - 1; i > y; i--) {

            if (owner.tiles[this.x][i].name != "") {
              return false;
            }

          }
        }

        // Horizontal

        else if (this.y - y == 0 && x - this.x > 0) {
          for (let i = this.x + 1; i < x; i++) {

            if (owner.tiles[i][this.y].name != "") {
              return false;
            }

          }
        }

        else if (this.y - y == 0 && x - this.x < 0) {
          for (let i = this.x - 1; i > x; i--) {

            if (owner.tiles[i][this.y].name != "") {
              return false;
            }

          }
        }

      }

      return true;


    }
    else {
      return false;
    }


  }

  getPossibleMoves(owner, real) {

    if (typeof (real) == 'undefined') real == false;
    var possibleMoves = [];



    for (let i = 0; i < owner.columns; i++) {

      // Check moves in horizontal

      if (this.canDoMove(i, this.y, owner, real)) {
        possibleMoves.push([this.x, this.y, i, this.y]);
      }

      if (this.canDoMove(this.x, i, owner, real)) {
        possibleMoves.push([this.x, this.y, this.x, i]);
      }

      // Check moves in diagonal

      if (i - this.x + this.y < owner.columns && i - this.x + this.y >= 0) {

        if (this.canDoMove(i, i - this.x + this.y, owner, real)) {
          possibleMoves.push([this.x, this.y, i, i - this.x + this.y]);
        }

      }
      if (((owner.columns - 1) - i) + this.x - ((owner.columns - 1) - this.y) < owner.columns && ((owner.columns - 1) - i) + this.x - ((owner.columns - 1) - this.y) >= 0) {

        if (this.canDoMove(i, ((owner.columns - 1) - i) + this.x - ((owner.columns - 1) - this.y), owner, real)) {
          possibleMoves.push([this.x, this.y, i, ((owner.columns - 1) - i) + this.x - ((owner.columns - 1) - this.y)]);
        }

      }


    }

    this.possibleMoves = possibleMoves;

    return possibleMoves;

  }

  copy() {

    var clone = new Queen(this.color, this.x, this.y);
    clone.taken = this.taken;

    return clone;

  }
}
class Bishop extends Piece {

  constructor(color, x, y) {
    super(color, x, y);
    this.text = "B";
    this.name = "bishop";
    this.worth = 3;
  }

  canDoMove(x, y, owner, real) {
    // all piece logic
    var bool = super.canDoMove(x, y, owner, real);
    if (!bool) return false;
    bool = Math.abs(this.x - x) == Math.abs(this.y - y);
    if (bool) {

      for (let i = this.x + ((x - this.x > 0) ? 1 : -1); ((x - this.x > 0) ? i < x : i > x); ((x - this.x > 0) ? i++ : i--)) {

        if (owner.tiles[i][this.y + (i - this.x) * ((y - this.y < 0) ? -1 : 1) * ((x - this.x > 0) ? 1 : -1)].name != "") {
          return false;
        }

      }


      return true;


    }
    else {
      return false;
    }
  }

  getPossibleMoves(owner, real) {

    if (typeof (real) == 'undefined') real == false;
    var possibleMoves = [];

    // Check moves in diagonal

    for (let i = 0; i < owner.columns; i++) {
      if (i - this.x + this.y < owner.columns && i - this.x + this.y >= 0) {
        //console.log(i + " | " + (i - this.x + this.y));
        if (this.canDoMove(i, i - this.x + this.y, owner, real)) {
          possibleMoves.push([this.x, this.y, i, i - this.x + this.y]);
        }
      }
      if (((owner.columns - 1) - i) + this.x - ((owner.columns - 1) - this.y) < owner.columns && ((owner.columns - 1) - i) + this.x - ((owner.columns - 1) - this.y) >= 0) {
        //console.log(i + " | " + (((owner.columns-1) - i) + this.x - ((owner.columns-1)-this.y)));
        if (this.canDoMove(i, ((owner.columns - 1) - i) + this.x - ((owner.columns - 1) - this.y), owner, real)) {
          possibleMoves.push([this.x, this.y, i, ((owner.columns - 1) - i) + this.x - ((owner.columns - 1) - this.y)]);
        }
      }

    }
    this.possibleMoves = possibleMoves;

    return possibleMoves;

  }

  copy() {

    var clone = new Bishop(this.color, this.x, this.y);
    clone.taken = this.taken;

    return clone;

  }
}
class Knight extends Piece {
  constructor(color, x, y) {
    super(color, x, y);
    this.text = "Kn";
    this.name = "knight";
    this.worth = 3;
  }

  canDoMove(x, y, owner, real) {
    // all piece logic
    var bool = super.canDoMove(x, y, owner, real);
    if (!bool) return false;
    let X = Math.abs(this.x - x);
    let Y = Math.abs(this.y - y);
    bool = (X <= 2 && Y <= 2) && X > 0 && Y > 0 && X != Y;

    return bool;


  }

  getPossibleMoves(owner, real) {

    if (typeof (real) == 'undefined') real == false;
    var possibleMoves = [];

    for (let i = this.x - 2; i <= this.x + 2; i++) {
      for (let j = this.y - 2; j <= this.y + 2; j++) {

        if (Math.abs(i - this.x) == Math.abs(j - this.y)) continue;
        if (i == this.x || j == this.y) continue;
        if (i < 0 || i >= owner.rows || j < 0 || j >= owner.columns) continue;


        if (this.canDoMove(i, j, owner, real)) {
          possibleMoves.push([this.x, this.y, i, j]);
        }

      }
    }
    this.possibleMoves = possibleMoves;

    return possibleMoves;

  }

  copy() {

    var clone = new Knight(this.color, this.x, this.y);
    clone.taken = this.taken;

    return clone;

  }

}
class Rook extends Piece {
  constructor(color, x, y) {
    super(color, x, y);
    this.text = "R";
    this.name = "rook";
    this.worth = 5;
    this.hasMoved = false;
  }
  canDoMove(x, y, owner, real) {
    // all piece logic
    var bool = super.canDoMove(x, y, owner, real);
    if (!bool) return false;
    bool = this.x - x == 0 || this.y - y == 0;
    if (bool) {

      // Vertical

      if (this.x - x == 0 && y - this.y > 0) {
        for (let i = this.y + 1; i < y; i++) {

          if (owner.tiles[this.x][i].name != "") {
            return false;
          }

        }
      }

      else if (this.x - x == 0 && y - this.y < 0) {
        for (let i = this.y - 1; i > y; i--) {

          if (owner.tiles[this.x][i].name != "") {
            return false;
          }

        }
      }

      // Horizontal

      else if (this.y - y == 0 && x - this.x > 0) {
        for (let i = this.x + 1; i < x; i++) {

          if (owner.tiles[i][this.y].name != "") {
            return false;
          }

        }
      }

      else if (this.y - y == 0 && x - this.x < 0) {
        for (let i = this.x - 1; i > x; i--) {

          if (owner.tiles[i][this.y].name != "") {
            return false;
          }

        }
      }

      return true;
    }
    else {
      return false;
    }

  }

  makeMove(x, y) {
    this.x = x;
    this.y = y;

    this.hasMoved = true;
  }

  getPossibleMoves(owner, real) {

    if (typeof (real) == 'undefined') real == false;
    var possibleMoves = [];

    // Check moves in horizontal

    for (let i = 0; i < owner.columns; i++) {

      if (this.canDoMove(i, this.y, owner, real)) {
        possibleMoves.push([this.x, this.y, i, this.y]);
      }

      if (this.canDoMove(this.x, i, owner, real)) {
        possibleMoves.push([this.x, this.y, this.x, i]);
      }

    }
    this.possibleMoves = possibleMoves;

    return possibleMoves;

  }

  copy() {

    var clone = new Rook(this.color, this.x, this.y);
    clone.taken = this.taken;
    clone.hasMoved = this.hasMoved;

    return clone;

  }


}
class Pawn extends Piece {
  constructor(color, x, y) {
    super(color, x, y);
    this.text = "P";
    this.first = true;
    this.name = "pawn";
    this.worth = 1;
    this.empassantAllowed = false;

  }
  canDoMove(x, y, owner, real) {
    // all piece logic
    var bool = super.canDoMove(x, y, owner, real);
    if (!bool) return false;
    bool = Math.abs(this.x - x) <= 1 && Math.abs(this.y - y) <= 2;
    // if (this.color == "white")
    //   bool = Math.abs(this.x-x)<=1 && y < this.y;
    // else
    //   bool = Math.abs(this.x-x)<= 1 && y > this.y;
    if (bool) {

      if (this.color === "white") {
        if ((((this.x === x && owner.tiles[x][y].name == "" || (this.x + 1 === x && owner.tiles[x][y].color == "black") || (this.x - 1 === x && owner.tiles[x][y].color == "black"))) && ((this.y - 1 == y) || (this.y - 2 == y && this.first && this.x == x && owner.tiles[x][y + 1].name == ""))) || (this.x + 1 == x || this.x - 1 == x) && this.y - 1 == y && owner.tiles[x][y + 1].empassantAllowed) {

          return true;
        }
        else {
          return false;
        }
      }
      else {
        if ((((this.x === x && owner.tiles[x][y].name == "" || (this.x + 1 === x && owner.tiles[x][y].color == "white") || (this.x - 1 === x && owner.tiles[x][y].color == "white"))) && ((this.y + 1 == y) || (this.y + 2 == y && this.first && this.x == x && owner.tiles[x][y - 1].name == ""))) || (this.x + 1 == x || this.x - 1 == x) && this.y + 1 == y && owner.tiles[x][y - 1].empassantAllowed) {

          return true;
        }
        else {
          return false;
        }
      }
    }
    else {
      return false;
    }

  }

  makeMove(x, y, owner) {

    if (this.color == "white") {

      this.first = false;

      if (this.y - 2 == y) {
        this.empassantAllowed = true;
      }
      if (owner.tiles[x][y + 1].empassantAllowed && (this.x + 1 == x || this.x - 1 == x)) {

        owner.deadPieces.push(owner.tiles[x][y + 1]);

        //document.getElementById("dead").innerHTML += " | A " + owner.tiles[x][y+1].color + " " + owner.tiles[x][y+1].name;
        owner.tiles[x][y + 1] = new Blank();
      }

      if (y == 0) {
        var piecesIndex = owner.whitePieces.indexOf(this);
        owner.tiles[this.x][this.y] = new Queen(this.color, x, y);
        owner.whitePieces[piecesIndex] = owner.tiles[this.x][this.y];
      }
      this.x = x;
      this.y = y;
    }

    // If Black

    else {

      this.first = false;

      if (this.y + 2 == y) {
        this.empassantAllowed = true;


      }
      if (owner.tiles[x][y - 1].empassantAllowed && (this.x + 1 == x || this.x - 1 == x)) {

        owner.deadPieces.push(owner.tiles[x][y - 1]);

        //document.getElementById("dead").innerHTML += " | A " + owner.tiles[x][y-1].color + " " + owner.tiles[x][y-1].name;
        owner.tiles[x][y - 1] = new Blank();
      }
      if (y == 7) {
        var piecesIndex = owner.blackPieces.indexOf(this);
        owner.tiles[this.x][this.y] = new Queen(this.color, x, y);
        owner.blackPieces[piecesIndex] = owner.tiles[this.x][this.y];
      }
      this.x = x;
      this.y = y;
    }

  }

  getPossibleMoves(owner, real) {

    if (typeof (real) == 'undefined') real == false;
    var possibleMoves = [];
    if (this.canDoMove(this.x, (this.y + ((this.color == "black") ? 1 : -1)), owner, real)) {
      possibleMoves.push([this.x, this.y, this.x, (this.y + ((this.color == "black") ? 1 : -1))]);
    }

    if (this.first) {
      if (this.canDoMove(this.x, (this.y + ((this.color == "black") ? 2 : -2)), owner, real)) {
        possibleMoves.push([this.x, this.y, this.x, (this.y + ((this.color == "black") ? 2 : -2))]);
      }
    }

    if (this.x + 1 < owner.columns) {
      if (this.canDoMove(this.x + 1, (this.y + ((this.color == "black") ? 1 : -1)), owner, real)) {
        possibleMoves.push([this.x, this.y, this.x + 1, (this.y + ((this.color == "black") ? 1 : -1))]);
      }
    }

    if (this.x - 1 > 0) {
      if (this.canDoMove(this.x - 1, (this.y + ((this.color == "black") ? 1 : -1)), owner, real)) {
        possibleMoves.push([this.x, this.y, this.x - 1, (this.y + ((this.color == "black") ? 1 : -1))]);
      }
    }
    this.possibleMoves = possibleMoves;

    return possibleMoves;

  }

  copy() {

    var clone = new Pawn(this.color, this.x, this.y);
    clone.taken = this.taken;
    clone.first = this.first;
    clone.empassantAllowed = this.empassantAllowed;

    return clone;

  }

}
class Blank extends Piece {
  constructor(color) {
    super(color);
    this.text = "";
    this.color = "";
    this.name = "";
  }

  copy() {

    var clone = new Blank(this.color, this.x, this.y);
    clone.taken = this.taken;

    return clone;

  }

  canDoMove(x, y, owner) {
    return false;
  }

  makeMove() {

  }

}
