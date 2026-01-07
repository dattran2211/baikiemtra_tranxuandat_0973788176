import { 
  WebSocketGateway, WebSocketServer, SubscribeMessage, 
  OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect 
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CaroService } from './caro.service';

@WebSocketGateway({ cors: { origin: '*' } }) // ⚠️ enable CORS
export class CaroGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  waitingQueue: Socket[] = [];
  games: Record<string, any> = {};

  constructor(private readonly caroService: CaroService) {}

  afterInit(server: Server) {
    console.log('CaroGateway initialized');
  }

  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
  }

  @SubscribeMessage('join')
  handleJoin(client: Socket) {
    this.waitingQueue.push(client);
    if (this.waitingQueue.length >= 2) {
      const p1 = this.waitingQueue.shift();
      const p2 = this.waitingQueue.shift();
      if (!p1 || !p2) return;

      const room = `room_${Date.now()}`;
      p1.join(room);
      p2.join(room);

      const emptyBoard = Array(15).fill(0).map(()=>Array(15).fill(''));
      this.games[room] = { board: emptyBoard, players:[p1.id,p2.id], turn:'X', moves: [] };

      this.server.to(room).emit('start', { room, turn:'X', board: emptyBoard });
    }
  }

  @SubscribeMessage('move')
  async handleMove(client: Socket, payload: any) {
    const { room, x, y } = payload;
    const game = this.games[room];
    if (!game) return;
    if (game.board[x][y] !== '') return;

    const player = game.turn;
    game.board[x][y] = player;
    game.moves = game.moves || [];
    game.moves.push({ x, y, player, t: Date.now() });

    let winner = this.checkWin(game.board, x, y, player);

    // check draw (no empty cells)
    if (!winner) {
      const hasEmpty = game.board.some((row: string[]) => row.some(cell => cell === ''));
      if (!hasEmpty) winner = 'draw';
    }

    if (winner) {
      try {
        await this.caroService.saveMatch({
          playerX: game.players[0],
          playerO: game.players[1],
          winner: winner === 'draw' ? 'draw' : winner,
          moves: game.moves || [],
        });
      } catch (e) {
        console.error('Failed to save match', e);
      }

      this.server.to(room).emit('end', { winner, board: game.board });
      delete this.games[room];
      return;
    }

    game.turn = player === 'X' ? 'O' : 'X';
    this.server.to(room).emit('update', { board: game.board, turn: game.turn });
  }

  checkWin(board: string[][], x: number, y: number, player: string) {
    const N = 15;
    const countLine = (dx: number, dy: number) => {
      let count = 1;
      for (let dir=-1; dir<=1; dir+=2) {
        let nx = x + dx*dir;
        let ny = y + dy*dir;
        while(nx>=0 && nx<N && ny>=0 && ny<N && board[nx][ny]===player){
          count++;
          nx += dx*dir; ny += dy*dir;
        }
      }
      return count;
    }
    if(countLine(1,0)>=5||countLine(0,1)>=5||countLine(1,1)>=5||countLine(1,-1)>=5){
      return player;
    }
    return null;
  }
}
