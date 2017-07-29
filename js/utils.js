export function parseBoardData(data) {
  const board = new Array(10);
  for (let i = 0; i < 10; i++) {
    board[i] = new Array(10);
    for (let j = 0; j < 10; j++) {
      board[i][j] = {
        position: {x: j, y: i},
        text: null,
        userInput: null,
        horizontalNote: null,
        verticalNote: null,
        selected: false,
        active: false
      }
    }
  }

  data.board.map(word => {
    let x = word.x;
    let y = word.y;
    for (let i = 0; i < word.text.length; i++) {
      const grid = board[y][x];
      if (grid.text !== null && grid.text !== word.text[i]) {
        console.error(`error in board json file， x:${x},y:${y}, word:${word.text}, i:${i}`);
      } else {
        grid.text = word.text[i];
      }
      if (word.direction) {
        if (grid.horizontalNote) {
          throw `conflict horizontal note in ${JSON.stringify(word)}`
        }
        grid.horizontalNote = word.note;
        grid.horizontalStart = x - i;
        grid.horizontalWord = word.text;
        x++;
      } else {
        if (grid.verticalNote) {
          throw `conflict vertical note in ${JSON.stringify(word)}`;
        }
        grid.verticalNote = word.note;
        grid.verticalStart = y - i;
        grid.verticalWord = word.text;
        y++;
      }
    }
  });

  return board;
}
