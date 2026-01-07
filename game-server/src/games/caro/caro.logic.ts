export class CaroLogic {
  board: string[][] = Array(15).fill(0).map(() => Array(15).fill(''));

  // đánh 1 ô
  makeMove(x: number, y: number, player: 'X'|'O'): boolean {
    if(this.board[x][y] !== '') return false;
    this.board[x][y] = player;
    return true;
  }

  // check thắng sau khi đánh
  checkWin(x: number, y: number): boolean {
    const player = this.board[x][y];
    if(!player) return false;

    const directions = [
      [0,1], [1,0], [1,1], [1,-1]
    ];

    for(const [dx,dy] of directions){
      let count = 1;
      // check forward
      let nx = x + dx, ny = y + dy;
      while(this.inBoard(nx, ny) && this.board[nx][ny] === player){
        count++; nx+=dx; ny+=dy;
      }
      // check backward
      nx = x - dx; ny = y - dy;
      while(this.inBoard(nx, ny) && this.board[nx][ny] === player){
        count++; nx-=dx; ny-=dy;
      }
      if(count>=5) return true;
    }
    return false;
  }

  private inBoard(x:number, y:number): boolean {
    return x>=0 && x<15 && y>=0 && y<15;
  }
}
