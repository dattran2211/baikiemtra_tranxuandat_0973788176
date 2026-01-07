/**
 * Tests for Line98Logic
 * - `spawnRandomBalls()` should place 3 random balls on an empty board
 * - `moveBall()` should move a ball from source to destination
 */
import { Line98Logic } from './line98.logic';

describe('Line98Logic', ()=>{
  it('should spawn 3 balls', ()=>{
    const g = new Line98Logic();
    g.spawnRandomBalls();
    const count = g.board.flat().filter(x=>x>0).length;
    expect(count).toBe(3);
  });

  it('should move ball', ()=>{
    const g = new Line98Logic();
    g.board[0][0]=1;
    g.moveBall([0,0],[1,1]);
    expect(g.board[1][1]).toBe(1);
    expect(g.board[0][0]).toBe(0);
  });
});
