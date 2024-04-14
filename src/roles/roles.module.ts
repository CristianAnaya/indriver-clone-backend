import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/users.entity';
import { Rol } from './rol.entity';
import { JwtStrategy } from '../auth/jwt/jwt.strategy';

@Module({
  imports: [ TypeOrmModule.forFeature([Rol, User]) ],
  providers: [RolesService, JwtStrategy],
  controllers: [RolesController]
})
export class RolesModule {}
