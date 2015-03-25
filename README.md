# GA WDI Melbourne - WDI2 (codyperry)

## Initial thoughts

### Theme
- Star Wars
- Noughts and crosses represented by Rebels and Empire logos

### Main driver
- assign the controlling player
- player chooses square; initiates process:
  - have they won?
    - yes: declare winner
    - no: have all squares been chosen?
      - yes: declare a draw
      - no: toggle controlling player
- ability to initiate new game once current one ends

### Data
- 3 x 3 array
- unchosen square === null
- chosen square === 1 or 2 (denotes player number)
- example of initial board:

```
board = [
	[null,null,null],
	[null,null,null],
	[null,null,null]
]
```

- example of mid-game board:

```
board = [
	[1,null,1],
	[2,1,null],
	[null,2,null]
]
```

#### Winner horizontal?
- loop [0][0] -> [0][1] -> [0][2] and save values; call checkWin function
- loop [1][0] -> [1][1] -> [1][2] and save values; call checkWin function
- loop [2][0] -> [2][1] -> [2][2] and save values; call checkWin function
- i constant, j increments
- return checkWin result

#### Winner vertical?
- loop [0][0] -> [1][0] -> [2][0] and save values; call checkWin function
- loop [0][1] -> [1][1] -> [2][1] and save values; call checkWin function
- loop [0][2] -> [1][2] -> [2][2] and save values; call checkWin function
- i increments, j constant
- return checkWin result

#### Winner diagonal?
- loop [0][0] -> [1][1] -> [2][2] and save values; call checkWin function
  - i increments & j increments
- loop [0][2] -> [1][1] -> [2][0] and save values; call checkWin function
  - i increments & j decrements
- return checkWin result

##### checkWin function
- accept player number
- accept 3 values
- return true if all 3 values === player number

#### All squares chosen
- loop [0][0] -> [0][1] -> [0][2] -> [..][..] -> [2][1] -> [2][2] until any === null; then return false
- if none are null, return true

## Possible additional funtionality
- ability to store player names and show scoreboard (keeping track of results)