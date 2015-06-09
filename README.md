# GA WDI Project 1

## Tic Tac Toe game

[Project requirements](https://gist.github.com/epoch/fa926c32b366044093f8) 

[Play](http://goodo73.github.io/project1/)

### How To Play
Each of the two players chooses a side - Rebels or Empire - and enters their name into the appropriate text box. Only once both players have 'reported for duty' is the game playable.

Gameplay is divided into skirmishes (a single game) and conflicts (a series of games). The winnner of each skirmish is awarded one point. At the end of a skirmish, the next one can be played by clicking `Next Skirmish`. Clicking `New Conflict` will reset player scores to zero, and allow new players to 'report'.

Rebels always go first in a conflict ... those scum! The loser of each skirmish gets the first turn in the next skirmish.

### End-of-project thoughts

#### Sad
- Not completely satisfied with the way I structured the code. Have a nagging feeling there's a better way to determine if a player has 3 squares in a row, but did what I could in the time available.
- As per an article I read on [Design Shack](http://designshack.net/articles/css/how-to-center-anything-with-css/), too often I just fiddled with the CSS until it worked ... or it didn't and I go to our old friend Google; MUST take note of when this happens and record the solution for future reference.

#### Happy
- Gave the page a look/styling that I was pleased with (as opposed to thinking "Looks crap but works").
- Followed the DRY principle well.
- Successfully stored, retrieved and removed data from localStorage (including using JSON for arrays)
- Implemented some positioning techniques and z-indexing (eg. game result message and scores).

#### Future improvements
- Improve page responsiveness.
- Allow players to choose the board size (beyond the default 3 x 3 layout).
- Improved stylng of victory/standoff message
- Sound upon display of victory/standoff message (with ability to mute within game)
- Keep score of conflict wins (and allow score to be reset)

### Initial plan

#### Main algorithm
- assign the controlling player
- player chooses square; initiates process:
  - have they won?
    - yes: declare winner
    - no: have all squares been chosen?
      - yes: declare a draw
      - no: toggle controlling player
- ability to initiate new game once current one ends

#### Data
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

#### Theme
- Star Wars
- Noughts and crosses represented by Rebels and Empire logos

