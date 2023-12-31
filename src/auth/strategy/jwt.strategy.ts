import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { Constants } from '../constants';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	
	
	constructor( 
		private config: ConfigService, 
		private prisma: PrismaService
	) {	
		const consatnts = new Constants(config);
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: consatnts.SECRET_JWT,
			ignoreExpiration: false
		}) 
	}

	async validate(payload:{sub: number, email: string, role: number}){
		
		try {
			const user = await this.prisma.manager.findUnique({
				where: {
					id: payload.sub
				}
			})

			if (user) {
				delete user.hash
				return user; 
			}
		} catch (error) {
			throw new Error("User don't finded");
		}
		
	}
}