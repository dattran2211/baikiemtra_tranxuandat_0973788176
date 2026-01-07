import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Line98Game } from './line98.entity';

@Injectable()
export class Line98Service {
	constructor(
		@InjectRepository(Line98Game)
		private readonly repo: Repository<Line98Game>,
	) {}

	async saveBoard(board: number[][]) {
		// clear previous saved states and persist current board as JSON
		await this.repo.clear();
		const rec = this.repo.create({ boardState: JSON.stringify(board) });
		await this.repo.save(rec);
	}

	async getLatestBoard(): Promise<number[][] | null> {
		const rec = await this.repo.findOne({ order: { id: 'DESC' } });
		if (!rec) return null;
		try {
			return JSON.parse(rec.boardState);
		} catch (e) {
			return null;
		}
	}
}
