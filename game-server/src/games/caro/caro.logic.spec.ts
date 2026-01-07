import { CaroLogic } from './caro.logic';

describe('CaroLogic', ()=>{
  it('should win horizontal', ()=>{
    const g = new CaroLogic();
    for(let i=0;i<5;i++) g.makeMove(0,i,'X');
    expect(g.checkWin(0,4)).toBe(true);
  });

  it('should win vertical', ()=>{
    const g = new CaroLogic();
    for(let i=0;i<5;i++) g.makeMove(i,0,'O');
    expect(g.checkWin(4,0)).toBe(true);
  });

  it('should win diagonal', ()=>{
    const g = new CaroLogic();
    for(let i=0;i<5;i++) g.makeMove(i,i,'X');
    expect(g.checkWin(4,4)).toBe(true);
  });
/**
 * Tests for CaroLogic
 * - verifies horizontal/vertical/diagonal win detection
 * - ensures makeMove prevents moves on occupied cells
 */
  it('prevents move on occupied cell', ()=>{
    const g = new CaroLogic();
    g.board[2][2] = 'O';
    const ok = g.makeMove(2,2,'X');
    expect(ok).toBe(false);
  });
});
