// var thinkingTime;
// var thinks;
// function think() {
//   //console.log("wow");
//   thinks = document.getElementById("thinking").innerHTML;
//   if (thinks = "" || thinks.substring(thinks.indexOf("g")).length==3) {
//     thinks = "Thinking";
//   }
//   else {
//     thinks += ".";
//   }
//   document.getElementById("thinking").innerHTML = thinks;
// }
function ai() {

  // thinkingTime = setInterval(function(){think()}, 300);
  if (board.getPossibleMoves("black", true).length == 0) {
    if (board.isInCheck()) {
      board.winner = "white";
    }
    else {
      board.winner = "stale";
    }
  }

  board.checkThreeFold();

  if (board.winner != "none") {
    document.getElementById("thinking").innerHTML = "";
    endState();
    return;
  }

  if (difficulty == 0) {

    var posMoves = board.getPossibleMoves("black");
    var index = Math.floor(Math.random() * posMoves.length);
    board.sp = [posMoves[index][0], posMoves[index][1]];
    board.swapPieces(posMoves[index][2], posMoves[index][3]);

  }
  else {
    var history = board.moveHistory;
    board.boardHistory.push(board.copy());
    var boardHistory = board.boardHistory;
    board = minimax(board.copy(), difficulty, true, -Infinity, Infinity);
    board.moveHistory = history;
    board.boardHistory = boardHistory;
    board.moveHistory.push(board.prevMove);
    board.turn = true;
  }

  document.getElementById("turn").innerHTML = "White's Turn";

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
  board.checkThreeFold();

  if (board.winner != "none") {
    endState();
  }

  document.getElementById("thinking").innerHTML = "";
  board.render();

  // clearInterval(thinkingTime);
  // thinks = "";
}

function minimax(boardState, layers, maxing, alpha, beta) {
  boardState.turn = !maxing;

  var moves = boardState.copy().getPossibleMoves((maxing) ? "black" : "white", true);
  if (moves.length == 0) {
    if (boardState.isInCheck()) {
      return (100000 * ((maxing) ? -1 : 1));
    }
    else {
      return 0;
    }
  }
  //console.log(moves.length);
  var bestValue = Infinity * ((maxing) ? -1 : 1);
  var bestIndex = 0;
  for (let i = 0; i < moves.length; i++) {
    // console.log(moves[i]);
    var clone = boardState.copy();
    clone.sp = [moves[i][0], moves[i][1]];
    //if (i == 3)console.log(clone.tiles);
    clone.swapPieces(moves[i][2], moves[i][3], false);
    //if (i == 3)console.log(clone.tiles);
    // console.log(clone.copy().evaluateState((maxing)?"black":"white"));
    

    if (layers > 1) {
      // ****** Code for if you return board state *****
      // console.log("new layer");
      var stateHolder = minimax(clone.copy(), layers - 1, !maxing, alpha, beta);
      if (typeof (stateHolder) == 'object') {
        var chosenState = stateHolder.copy().evaluateState((maxing)?"black":"white");
      }
      else {
        var chosenState = stateHolder;
      }
      // ******* Code for if you return the score ******
      // var chosenState = minimax(clone.copy(), layers - 1, !maxing, alpha, beta);


      clone.turn = !maxing;
    }
    else {
      var chosenState = clone.evaluateState((maxing)?"black":"white");
    }
    chosenState += (Math.random()/20 - 0.01);
    //console.log(chosenState + " On layer " + layers);
    if ((chosenState > bestValue && maxing || chosenState < bestValue && !maxing)) {
      // console.log(moves[i]+"wow");
      // console.log(chosenState+"wow");
      bestValue = chosenState;
      bestIndex = i;
    }
    if (chosenState > alpha && maxing) {
      alpha = chosenState;
    }
    if (chosenState < beta && !maxing) {
      beta = chosenState;
    }

    // console.log("BETA: " + beta + " | " + "ALPHA: " + alpha);
    
    // Comment this out to turn off pruning
    // if (beta < alpha) {
    //   break;
    // }

    //console.log(chosenState + "final");
    //console.log(chosen.deadPieces);


  }
  // if (layers == difficulty) {
  // console.log(moves[bestIndex]);
  // }


  // *******Return the board state*******
  boardState.sp = [moves[bestIndex][0], moves[bestIndex][1]];
  boardState.swapPieces(moves[bestIndex][2], moves[bestIndex][3], false);
  // console.log("End layer");
  return boardState;

  // ******Return the score******
  if (layers == difficulty) {

    boardState.sp = [moves[bestIndex][0], moves[bestIndex][1]];
    boardState.swapPieces(moves[bestIndex][2], moves[bestIndex][3], false);

    return boardState;

  }
  else {
    return bestValue;
  }

}





















// var OB;
// function createOpeningBook(goFirst) {
//   if (goFirst) {
//     OB = {
//       stage1Choice: 0,
//       stage2Choice: 0,
//       stage3Choice: 0,
//       stage1: [[sampleBoard.copy(), [4, 0, 4, 3]]],
//       stage2: []
//     }
//   }
//   else {
//     OB = {
//       stage1Choice: 0,
//       stage2Choice: 0,
//       stage3Choice: 0,
//       stage1: [sampleBoard.copy()]
//     }
//     OB.stage1[0].quickMove(4, 6, 4, 4);
//   }
// }
