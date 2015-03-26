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

function dataStored() {
// Return a flag to indicate if backed up data exists for a previous game
	if (localStorage.getItem("currPlayer")) {
		return true;
	} else {
		return false;
	}
}

function setStorage() {
// Back up data for the game in progress
	localStorage.setItem("currPlayer",game.currentPlayer);
	localStorage.setItem("winningRow",JSON.stringify(game.winningRow));
	localStorage.setItem("winningCol",JSON.stringify(game.winningCol));

	$.each(game.board, function (index,value) {
		var row = "boardIndex-" + index;
		localStorage.setItem(row,JSON.stringify(value));
	})

	var classes = [];
	$(".square").each(function (index,value) {
		classes.push($(this).attr("class"));
	});
	localStorage.setItem("classes",JSON.stringify(classes));
}

function getStorage() {
// Retrieve backed up data
	game.currentPlayer = localStorage.getItem("currPlayer");
	game.winningRow = JSON.parse(localStorage.getItem("winningRow"));
	game.winningCol = JSON.parse(localStorage.getItem("winningCol"));

	$.each(game.board, function (index,value) {
		var row = "boardIndex-" + index;
		game.board[index] = JSON.parse(localStorage.getItem(row));
	})

	var classes = JSON.parse(localStorage.getItem("classes"));
	$(".square").each(function (index,value) {
		($(this).attr("class",classes[index]));
	});
}

function removeStorage() {
// Delete the existing backed up data
	localStorage.removeItem("currPlayer");
	localStorage.removeItem("winningRow");
	localStorage.removeItem("winningCol");
	localStorage.removeItem("classes");
	
	$.each(game.board, function (index,value) {
		var row = "boardIndex-" + index;
		localStorage.removeItem(row);
	})
}

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

function winHorizontal() {
// Determine if the game has been won with squares situated horizontally
	var winningRow = false;

	// Loop through each row on the board
	$.each(game.board, function (index,value) {
		var matches = 0;

		// Loop through each square in the current row
		$.each(value, function (idx,val) {
			if (game.currentPlayer === val) {
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
			if (game.currentPlayer === game.board[r][c]) {
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
		if (game.currentPlayer === game.board[r][c]) {
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
		var matches = 0;

		for (var r = 0, c = game.board.length - 1, exit = false; r < game.board.length && !exit; r++, c--) {
			if (game.currentPlayer === game.board[r][c]) {
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
		displayWin();

	} else if (allSquaresChosen()) {
		console.log("Game is a draw");

	} else {
		toggleCurrentPlayer();
	}
}

function displayWin () {
	console.log(game.currentPlayer + " has won!");
	// Make all squares unclickable
	$(".square").addClass("selected");
	
	for (var i = 0; i < game.winningRow.length; i++) {
		var selector = "#row-" + (game.winningRow[i] + 1) + " #col-" + (game.winningCol[i] + 1);
		$(selector).addClass("win");
	};
}

function toggleCurrentPlayer () {
	if (game.currentPlayer === game.PLAYER_1) {
		game.currentPlayer = game.PLAYER_2;
	} else {
		game.currentPlayer = game.PLAYER_1;
	}
}

function updateScreen (element) {
	// Make clicked square unclickable
	$(element).addClass("selected");
	
	if (game.currentPlayer === game.PLAYER_1) {
		$(element).addClass("player1");
	} else {
		$(element).addClass("player2");
	}	
}

function updateGameBoard (element) {
	var elId = element.id.slice(-1);
	var parentId = $(element).parent()[0].id.slice(-1);
	
	// Update game.board to indicate current player has clicked this square 
	game.board[parseInt(parentId) - 1][parseInt(elId) - 1] = game.currentPlayer;	
}

function newGame () {
	resetBoard();
	removeStorage();

	game.winningRow = [];
	game.winningCol = [];
	
	$(".square").removeClass("selected");
	$(".square").removeClass("player1");
	$(".square").removeClass("player2");
	$(".square").removeClass("win");

	if (game.currentPlayer === game.PLAYER_1) {
		game.currentPlayer = game.PLAYER_2;
	} else {
		game.currentPlayer = game.PLAYER_1;
	}	
}

$(document).ready(function () {

	if (dataStored()) {
	// Recover previous game in progress
		getStorage();
	} else {
	// New game
		game.currentPlayer = game.PLAYER_1;
	}

	$(".square").on("click",function () {
		updateScreen(this);
		updateGameBoard(this);		
		playGame();
		setStorage();
	})

	$(".reset").on("click",function () {
		newGame();
	})
})
