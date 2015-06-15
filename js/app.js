var game = {
	PLAYER_1: null,
	PLAYER_2: null,
	currentPlayer: "",
	board: [
		[null,null,null],
		[null,null,null],
		[null,null,null]
	],
	winningRow: [],
	winningCol: [],
	playerOneWins: 0,
	playerTwoWins: 0
};

// Declare selector variables
var $gameResult;
var $squareOnBoard;
var $playerOneName;
var $playerTwoName;
var $playerOneScore;
var $playerTwoScore;
var $rebelLogo;
var $empireLogo;

function dataStored() {
// Return a flag to indicate if backed up data exists for a previous game
	if (localStorage.getItem("currPlayer")) {
		return true;
	} else {
		return false;
	}
}

function saveData() {
// Back up data for the game in progress
	// Game object fields
	localStorage.setItem("currPlayer",game.currentPlayer);
	localStorage.setItem("p1",game.PLAYER_1);
	localStorage.setItem("p2",game.PLAYER_2);
	localStorage.setItem("p1Wins",game.playerOneWins);
	localStorage.setItem("p2Wins",game.playerTwoWins);
	localStorage.setItem("winningRow",JSON.stringify(game.winningRow));
	localStorage.setItem("winningCol",JSON.stringify(game.winningCol));

	$.each(game.board, function (index,value) {
		var row = "boardIndex-" + index;
		localStorage.setItem(row,JSON.stringify(value));
	})

	// Screen elements
	localStorage.setItem("result",$gameResult.html());
	localStorage.setItem("rsltClass",$gameResult.attr("class"));
	localStorage.setItem("rebelLogoClass",$rebelLogo.attr("class"));
	localStorage.setItem("empireLogoClass",$empireLogo.attr("class"));

	var squares = [];
	$squareOnBoard.each(function (index,value) {
		squares.push($(this).attr("class"));
	});
	localStorage.setItem("squares",JSON.stringify(squares));

	var buttons = [];
	$(".button").each(function (index,value) {
		buttons.push($(this).attr("class"));
	});
	localStorage.setItem("buttons",JSON.stringify(buttons));
}

function getSavedData() {
// Retrieve backed up data
	// Game object fields
	game.currentPlayer = localStorage.getItem("currPlayer");
	game.PLAYER_1 = localStorage.getItem("p1");
	game.PLAYER_2 = localStorage.getItem("p2");
	game.playerOneWins = localStorage.getItem("p1Wins");
	game.playerTwoWins = localStorage.getItem("p2Wins");
	game.winningRow = JSON.parse(localStorage.getItem("winningRow"));
	game.winningCol = JSON.parse(localStorage.getItem("winningCol"));

	$.each(game.board, function (index,value) {
		var row = "boardIndex-" + index;
		game.board[index] = JSON.parse(localStorage.getItem(row));
	})

	// Screen elements
	$gameResult.attr("class",localStorage.getItem("rsltClass"));
	$gameResult.html(localStorage.getItem("result"));
	$rebelLogo.attr("class",localStorage.getItem("rebelLogoClass"));
	$empireLogo.attr("class",localStorage.getItem("empireLogoClass"));

	var squares = JSON.parse(localStorage.getItem("squares"));
	$squareOnBoard.each(function (index,value) {
		($(this).attr("class",squares[index]));
	});

	var buttons = JSON.parse(localStorage.getItem("buttons"));
	$(".button").each(function (index,value) {
		($(this).attr("class",buttons[index]));
	});

	$playerOneName.val(game.PLAYER_1);
	$playerTwoName.val(game.PLAYER_2);

	$playerOneScore.html(game.playerOneWins);
	$playerTwoScore.html(game.playerTwoWins);
}

function deleteSavedData() {
// Remove all backed up data, except for the players' names and current win counts
	localStorage.removeItem("currPlayer");
	localStorage.removeItem("winningRow");
	localStorage.removeItem("winningCol");
	localStorage.removeItem("squares");
	localStorage.removeItem("buttons");
	localStorage.removeItem("result");
	localStorage.removeItem("rsltClass");
	localStorage.removeItem("rebelLogoClass");
	localStorage.removeItem("empireLogoClass");
	
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
				
				// An empty square has been found so exit the inner loop
				return false;
			}
		});
		if (!allSquares) {
			// An empty square has been found so exit the outer loop
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
	for (var col = 0; col < game.board.length && !winningColumn; col++) {
		var matches = 0;
		var exitColumn = false;

		// Loop through each square in the current column
		for (var row = 0; row < game.board[col].length && !exitColumn; row++) {
			if (game.currentPlayer === game.board[row][col]) {
				game.winningRow.push(row);
				game.winningCol.push(col);
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
	for (var row = 0, col = 0, exit = false; row < game.board.length && !exit; row++, col++) {
		if (game.currentPlayer === game.board[row][col]) {
			game.winningRow.push(row);
			game.winningCol.push(col);
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

		for (var row = 0, col = game.board.length - 1, exit = false; row < game.board.length && !exit; row++, col--) {
			if (game.currentPlayer === game.board[row][col]) {
				game.winningRow.push(row);
				game.winningCol.push(col);
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
// Determine if there's a winner, a draw or the next player
	if (winHorizontal() || winVertical() || winDiagonal()) {
		if (game.currentPlayer === game.PLAYER_1) {
			game.playerOneWins++;
		} else {
			game.playerTwoWins++;
		}

		displayWin();

	} else if (allSquaresChosen()) {
		$gameResult.html("STANDOFF!");
		$gameResult.removeClass("hidden");

	} else {
		toggleCurrentPlayer();
	}
}

function displayWin () {
// Alter screen for whan a player wins a game
	// Make all squares unclickable
	$squareOnBoard.addClass("locked");
	
	// Highlight winning squares
	for (var i = 0; i < game.winningRow.length; i++) {
		var selector = "#row-" + (game.winningRow[i] + 1) + " #col-" + (game.winningCol[i] + 1);
		$(selector).addClass("win");
	};

	// Update scores
	$playerOneScore.html(game.playerOneWins);
	$playerTwoScore.html(game.playerTwoWins);

	// Display victory message
	$gameResult.html("VICTORY to " + game.currentPlayer + "!");
	$gameResult.removeClass("hidden");
}

function toggleCurrentPlayer () {
	if (game.currentPlayer === game.PLAYER_1) {
		game.currentPlayer = game.PLAYER_2;
		$rebelLogo.removeClass('current');
		$empireLogo.addClass('current');
	} else {
		game.currentPlayer = game.PLAYER_1;
		$empireLogo.removeClass('current');
		$rebelLogo.addClass('current');
	}
}

function updateSquare (element) {
// Make screen changes to the clicked square 
	// Make clicked square unclickable
	$(element).addClass("locked");
	
	// Display appropriate logo onto square
	if (game.currentPlayer === game.PLAYER_1) {
		$(element).addClass("player1");
	} else {
		$(element).addClass("player2");
	}	
}

function updateBoardData (element) {
// Update game.board to indicate current player has clicked this square
	// Retreive the column number via the element's id; eg. "col-1" >> "1"
	var elId = element.id.slice(-1);
	// Retreive the row number via the parent element's id; eg. "row-2" >> "2"
	var parentId = $(element).parent()[0].id.slice(-1);
	
	game.board[parseInt(parentId) - 1][parseInt(elId) - 1] = game.currentPlayer;	
}

function newSkirmish () {
// Setup screen and game object for the next game
	resetBoard();
	deleteSavedData();

	game.winningRow = [];
	game.winningCol = [];
	
	$squareOnBoard.removeClass("locked player1 player2 win");
	$gameResult.addClass("hidden");

	toggleCurrentPlayer();
}

function newConflict () {
// Reset screen and game.object for new contest
	game.playerOneWins = 0;
	game.playerTwoWins = 0;
	game.PLAYER_1 = null;
	game.PLAYER_2 = null;
	game.winningRow = [];
	game.winningCol = [];
	game.currentPlayer = "";
	toggleCurrentPlayer();
	resetBoard();

	$playerOneName.val("");
	$playerTwoName.val("");
	$playerOneScore.html(game.playerOneWins);
	$playerTwoScore.html(game.playerTwoWins);
	$(".signUp1").removeClass("hidden");
	$(".signUp2").removeClass("hidden");
	$(".skirmish").addClass("locked");
	$(".conflict").addClass("locked");
	$squareOnBoard.addClass("locked").removeClass("player1 player2 win");
	$gameResult.addClass("hidden");

	// Remove all backed up data
	localStorage.clear();
}

function unlockElements () {
// Allow unclickable elements to be clicked
	$squareOnBoard.removeClass("locked");
	$(".skirmish").removeClass("locked");
	$(".conflict").removeClass("locked");
}

function setSelectors () {
// Set selector variables
	$gameResult = $("#result");
	$squareOnBoard = $(".square");
	$playerOneName = $("#p1");
	$playerTwoName = $("#p2");
	$playerOneScore = $("#score1");
	$playerTwoScore = $("#score2");
	$rebelLogo = $('.rebelLogo');
	$empireLogo = $('.empireLogo');
}

$(document).ready(function () {

	setSelectors();

	if (dataStored()) {
	// Recover previous game in progress
		getSavedData();
	}

	$(".signUp1").on("click",function () {
	// Player 1 sign up button clicked
		game.PLAYER_1 = $playerOneName.val();
		
		$(".signUp1").addClass("hidden");

		if (game.PLAYER_2 !== null) {
			unlockElements();
			toggleCurrentPlayer();
		}
	})

	$(".signUp2").on("click",function () {
	// Player 2 sign up button clicked
		game.PLAYER_2 = $playerTwoName.val();
		
		$(".signUp2").addClass("hidden");

		if (game.PLAYER_1 !== null) {
			unlockElements();
			toggleCurrentPlayer();
		}
	})

	$squareOnBoard.on("click",function () {
		updateSquare(this);
		updateBoardData(this);		
		playGame();
		saveData();
	})

	$(".skirmish").on("click",function () {
		newSkirmish();
		saveData();
	})

	$(".conflict").on("click",function () {
		newConflict();
	})
})
