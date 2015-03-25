var game = {
	PLAYER_1: "Mike",
	PLAYER_2: "Bob",
	currentPlayer: "",
	board: [
		[null,null,null],
		[null,null,null],
		[null,null,null]
	],
	winningRow: [],
	winningCol: []
};

function resetBoard() {
// Set all squares to blank
	$.each(game.board, function (index,value) {
		$.each(value, function (idx,val) {
			game.board[index][idx] = null;
		})
	})
}

function allSquaresChosen() {
// Determine if every square has been chosen; if yes, return true
	var allSquares = true;

	$.each(game.board, function (index,value) {
		$.each(value, function (idx,val) {
			if (val === null) {
				allSquares = false;
				
				// Exit the inner loop
				return false;
			}
		});
		if (!allSquares) {
			// Exit the outer loop
			return false; 
		}
	});

	return allSquares;
}

function squareMatch(player,square) {
// Determine whether the current player chose the current square
	return (player === square) ? true : false;
}

function winHorizontal() {
// Determine if the game has been won with squares situated horizontally
	var winningRow = false;

	// Loop through each row on the board
	$.each(game.board, function (index,value) {
		var matches = 0;

		// Loop through each square in the current row
		$.each(value, function (idx,val) {
			if (squareMatch(game.currentPlayer,val)) {
				game.winningRow.push(index);
				game.winningCol.push(idx);
				matches++;
			} else {
				game.winningRow = [];
				game.winningCol = [];

				// Current row is a dead-end, so exit inner array
				return false;
			}
		})

		if (matches === game.board.length) {
			winningRow = true;

			// Winning row already found, so exit outer array
			return false;
		}
	})

	return winningRow;
}

function winVertical() {
// Determine if the game has been won with squares situated vertically
	var winningColumn = false;

	// Loop through each column on the board
	for (var c = 0; c < game.board.length && !winningColumn; c++) {
		var matches = 0;
		var exitColumn = false;

		// Loop through each square in the current column
		for (var r = 0; r < game.board[c].length && !exitColumn; r++) {
			if (squareMatch(game.currentPlayer,game.board[r][c])) {
				game.winningRow.push(r);
				game.winningCol.push(c);
				matches++;
			} else {
				game.winningRow = [];
				game.winningCol = [];

				// Current column is a dead-end, so exit inner array
				exitColumn = true;
			}
		};

		if (matches === game.board.length) {
			// Winning column already found, so exit outer array
			winningColumn = true;
		}
	};

	return winningColumn;
}

function winDiagonal() {
// Determine if the game has been won with squares situated horizontally
	var winningDiagonal = false;
	var matches = 0;

	// Loop through each square in the top-left to bottom-right line
	for (var r = 0, c = 0, exit = false; r < game.board.length && !exit; r++, c++) {
		if (squareMatch(game.currentPlayer,game.board[r][c])) {
			game.winningRow.push(r);
			game.winningCol.push(c);
			matches++;
		} else {
			game.winningRow = [];
			game.winningCol = [];

			// Current diagonal is a dead-end, so exit loop
			exit = true;
		}
	}

	if (matches === game.board.length) {
		winningDiagonal = true;
	} else {
		// Loop through each square in the top-right to bottom-left line
		for (var r = 0, c = game.board.length - 1, exit = false; r < game.board.length && !exit; r++, c--) {
			if (squareMatch(game.currentPlayer,game.board[r][c])) {
				game.winningRow.push(r);
				game.winningCol.push(c);
				matches++;
			} else {
				game.winningRow = [];
				game.winningCol = [];

				// current diagonal is a dead-end, so exit loop
				exit = true;
			}
	
			if (matches === game.board.length) {
				winningDiagonal = true;
			}
		}
	}

	return winningDiagonal;
}

function playGame() {
	if (winHorizontal() || winVertical() || winDiagonal()) {
		console.log(game.currentPlayer + " has won!");

	} else if (allSquaresChosen()) {
		console.log("Game is a draw");

	} else if (game.currentPlayer === game.PLAYER_1) {
		game.currentPlayer = game.PLAYER_2;

	} else {
		game.currentPlayer = game.PLAYER_1;
	}
}


$(document).ready(function () {

	game.currentPlayer = game.PLAYER_1;

	$(".square").on("click",function () {
		var elId = this.id.slice(-1);
		var parentId = $(this).parent()[0].id.slice(-1);
		
		$(this).addClass("selected");
		
		if (game.currentPlayer === game.PLAYER_1) {
			$(this).addClass("player1");
		} else {
			$(this).addClass("player2");
		}
		
		game.board[parseInt(parentId) - 1][parseInt(elId) - 1] = game.currentPlayer;
		
		playGame();

	})

	$(".reset").on("click",function () {
		resetBoard();
		game.currentPlayer = "";
		game.winningRow = [];
		game.winningCol = [];
		$(".square").removeClass("selected");
		$(".square").removeClass("player1");
		$(".square").removeClass("player2");
	})
})
