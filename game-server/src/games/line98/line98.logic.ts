export class Line98Logic {
  board: number[][] = Array(9).fill(0).map(() => Array(9).fill(0));

  moveBall(from: [number, number], to: [number, number]) {
    const [fx, fy] = from;
    const [tx, ty] = to;
    this.board[tx][ty] = this.board[fx][fy];
    this.board[fx][fy] = 0;
    return this.board;
  }

  spawnRandomBalls() {
    let emptyCells: [number, number][] = [];
    for (let i = 0; i < 9; i++)
      for (let j = 0; j < 9; j++)
        if (this.board[i][j] === 0) emptyCells.push([i, j]);

    for (let k = 0; k < 3 && emptyCells.length; k++) {
      const idx = Math.floor(Math.random() * emptyCells.length);
      const [x, y] = emptyCells[idx];
      this.board[x][y] = Math.floor(Math.random() * 5) + 1;
      emptyCells.splice(idx, 1);
    }
  }

  checkLine(): [number, number][] {
    const toRemove: boolean[][] = Array(9).fill(0).map(() => Array(9).fill(false));

    const dirs = [
      [0, 1], // right
      [1, 0], // down
      [1, 1], // down-right
      [-1, 1], // up-right
    ];

    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        const val = this.board[i][j];
        if (!val) continue;

        for (const [dx, dy] of dirs) {
          const cells: [number, number][] = [[i, j]];
          let x = i + dx;
          let y = j + dy;

          while (x >= 0 && x < 9 && y >= 0 && y < 9 && this.board[x][y] === val) {
            cells.push([x, y]);
            x += dx;
            y += dy;
          }

          if (cells.length >= 5) {
            for (const [cx, cy] of cells) toRemove[cx][cy] = true;
          }
        }
      }
    }

    const removed: [number, number][] = [];
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (toRemove[i][j]) {
          removed.push([i, j]);
          this.board[i][j] = 0;
        }
      }
    }

    return removed;
  }

  // helper to check lines on a provided board (pure, doesn't mutate original)
  private checkLinesOnBoard(b: number[][]): [number, number][] {
    const toRemove: boolean[][] = Array(9).fill(0).map(() => Array(9).fill(false));
    const dirs = [
      [0, 1],
      [1, 0],
      [1, 1],
      [-1, 1],
    ];

    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        const val = b[i][j];
        if (!val) continue;

        for (const [dx, dy] of dirs) {
          const cells: [number, number][] = [[i, j]];
          let x = i + dx;
          let y = j + dy;
          while (x >= 0 && x < 9 && y >= 0 && y < 9 && b[x][y] === val) {
            cells.push([x, y]);
            x += dx;
            y += dy;
          }
          if (cells.length >= 5) for (const [cx, cy] of cells) toRemove[cx][cy] = true;
        }
      }
    }

    const removed: [number, number][] = [];
    for (let i = 0; i < 9; i++) for (let j = 0; j < 9; j++) if (toRemove[i][j]) removed.push([i, j]);
    return removed;
  }

  getHint(): [[number, number], [number, number]] {
    const possible: Array<[[number, number], [number, number]]> = [];
    const anyMoves: Array<[[number, number], [number, number]]> = [];

    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (this.board[i][j] === 0) continue;
        for (let x = 0; x < 9; x++) {
          for (let y = 0; y < 9; y++) {
            if (this.board[x][y] !== 0) continue;
            // simulate move
            const copy = this.board.map(row => row.slice());
            copy[x][y] = copy[i][j];
            copy[i][j] = 0;
            const removed = this.checkLinesOnBoard(copy);
            if (removed.length) possible.push([[i, j], [x, y]]);
            else anyMoves.push([[i, j], [x, y]]);
          }
        }
      }
    }

    if (possible.length) return possible[Math.floor(Math.random() * possible.length)];
    if (anyMoves.length) return anyMoves[Math.floor(Math.random() * anyMoves.length)];
    return [[0, 0], [0, 1]];
  }
}
