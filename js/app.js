var game = {
	PLAYER_2: "Bob",
	PLAYER_1: "Mike",
	currentPlayer: "",
	board: [
		// [null,null,null],
		// [null,null,null],
		// [null,null,null]
		["Mike","Mike","Bob"],
		["Mike","Bob","Bob"],
		["Mike","Bob","Mike"]
		// [10,20,30],
		// [40,50,60],
		// [70,80,90]
	],
	winnerFound: false,
	draw: false,
	winningRow: [],
	winningCol: []
};

function resetBoard() {
// set all squares to blank
	$.each(game.board, function (index,value) {
		$.each(value, function (idx,val) {
			game.board[index][idx] = null;
		})
	})
}

function allSquaresChosen() {
// determine if every square has been chosen; if yes, return true
	var allSquares = true;

	$.each(game.board, function (index,value) {
		$.each(value, function (idx,val) {
			if (val === null) {
				allSquares = false;
				// exit the inner loop
				return false;
			}
		});
		if (!allSquares) {
			// exit the outer loop
			return false; 
		}
	});

	return allSquares;
}

function squareMatch(player,square) {
	return (player === square) ? true : false;
}

function winAcross() {

	var winningRow = false;

	$.each(game.board, function (index,value) {
		var matches = 0;

		$.each(value, function (idx,val) {
			if (squareMatch(game.currentPlayer,val)) {
				game.winningRow.push(index);
				game.winningCol.push(idx);
				matches++;
			} else {
				game.winningRow = [];
				game.winningCol = [];

				// current row is a dead-end, so exit inner array
				return false;
			}
		})

		if (matches === game.board.length) {
			winningRow = true;

			// winning row found, so exit outer array
			return false;
		}
	})

	return winningRow;
}

function winDown() {
	var winningColumn = false;

	for (var c = 0; c < game.board.length && !winningColumn; c++) {
		var matches = 0;
		var exitColumn = false;

		for (var r = 0; r < game.board[c].length && !exitColumn; r++) {
			// console.log(r + "," + c);
			// console.log(game.board[r][c]);
			if (squareMatch(game.currentPlayer,game.board[r][c])) {
				// console.log("square match");
				game.winningRow.push(r);
				game.winningCol.push(c);
				matches++;
			} else {
				// console.log("square no match");
				game.winningRow = [];
				game.winningCol = [];

				// current column is a dead-end, so exit inner array
				exitColumn = true;
			}
		};

		if (matches === game.board.length) {
			// console.log("3 squares match");
			// winning column found, so exit outer array
			winningColumn = true;
		}
	};
	// console.log(game.winningRow);
	// console.log(game.winningCol);

	return winningColumn;
}

function winDiagonal() {
	var winningDiagonal = false;
	var matches = 0;

	// console.log("first diag");
	for (var r = 0, c = 0, exit = false; r < game.board.length && !exit; r++, c++) {
			// console.log(r + "," + c);
			// console.log(game.board[r][c]);
		if (squareMatch(game.currentPlayer,game.board[r][c])) {
			// console.log("square match");
			game.winningRow.push(r);
			game.winningCol.push(c);
			matches++;
		} else {
			// console.log("square no match");
			game.winningRow = [];
			game.winningCol = [];

			// current diagonal is a dead-end, so exit loop
			exit = true;
		}

	}

	if (matches === game.board.length) {
		// console.log("3 squares match");
		winningDiagonal = true;
	} else {
		// console.log("other diag");
		for (var r = 0, c = game.board.length - 1, exit = false; r < game.board.length && !exit; r++, c--) {
			// console.log(r + "," + c);
			// console.log(game.board[r][c]);
			if (squareMatch(game.currentPlayer,game.board[r][c])) {
				// console.log("square match");
				game.winningRow.push(r);
				game.winningCol.push(c);
				matches++;
			} else {
				// console.log("square no match");
				game.winningRow = [];
				game.winningCol = [];

				// current diagonal is a dead-end, so exit loop
				exit = true;
			}
	
			if (matches === game.board.length) {
				// console.log("3 squares match");
				winningDiagonal = true;
			}
		}
	}

	return winningDiagonal;
}

function playGame() {
	if (winAcross() || winDown() || winDiagonal()) {
		game.winnerFound = true;
		console.log(game.currentPlayer + " has won!");
	} else if (allSquaresChosen()) {
		game.draw = true;
		console.log("Game is a draw");
	} else if (game.currentPlayer === game.PLAYER_1) {
		game.currentPlayer = game.PLAYER_2;
		console.log(game.currentPlayer + "'s turn");
	} else {
		game.currentPlayer = game.PLAYER_1;
		console.log(game.currentPlayer + "'s turn");
	}
}


$(document).ready(function () {

	game.currentPlayer = game.PLAYER_1;

	$("#square").on("click",function () {
		playGame();
		// if (winAcross() || winDown() || winDiagonal()) {
		// 	game.winnerFound = true;
		// 	console.log(game.currentPlayer + " has won!");
		// } else if (allSquaresChosen()) {
		// 	game.draw = true;
		// 	console.log("Game is a draw");
		// } else if (game.currentPlayer === game.PLAYER_1) {
		// 	game.currentPlayer = game.PLAYER_2;
		// 	console.log(game.currentPlayer + "'s turn");
		// } else {
		// 	game.currentPlayer = game.PLAYER_1;
		// 	console.log(game.currentPlayer + "'s turn");
		// }
	})
})
