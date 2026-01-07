import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CaroMatch } from './caro.entity';


@Injectable()
export class CaroService {
	constructor(
		@InjectRepository(CaroMatch)
		private readonly repo: Repository<CaroMatch>,
	) {}

	async saveMatch(data: {
		playerX: string;
		playerO: string;
		winner: string | null;
		moves: any;
	}) {
		const rec = this.repo.create({
			playerX: data.playerX,
			playerO: data.playerO,
			winner: data.winner,
			moves: JSON.stringify(data.moves || []),
		});
		return this.repo.save(rec);
	}
}
