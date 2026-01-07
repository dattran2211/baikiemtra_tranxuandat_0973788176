import { WebSocketGateway, WebSocketServer, SubscribeMessage } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Line98Logic } from './line98.logic';
import { Line98Service } from './line98.service';

@WebSocketGateway()
export class Line98Gateway {
  @WebSocketServer()
  server: Server;

  logic: Line98Logic;

  constructor(private readonly line98Service: Line98Service) {
    this.logic = new Line98Logic();
    // load persisted board if present
    this.line98Service.getLatestBoard().then(board => {
      if (board) this.logic.board = board;
    }).catch(() => {});
  }

  @SubscribeMessage('move')
  async handleMove(client: any, payload: any) {
    this.logic.moveBall(payload.from, payload.to);
    const removed = this.logic.checkLine();
    if (removed.length === 0) {
      this.logic.spawnRandomBalls();
      this.logic.checkLine();
    }

    const board = this.logic.board;
    try {
      await this.line98Service.saveBoard(board);
    } catch (e) {
      // ignore persistence errors, still broadcast
    }
    this.server.emit('update', board);
  }

  @SubscribeMessage('hint')
  handleHint(client: any) {
    const hint = this.logic.getHint();
    client.emit('hint', hint);
  }
}
