import { Body, Controller, FileTypeValidator, Get, MaxFileSizeValidator, Param, ParseFilePipe, ParseIntPipe, Post, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { JwtRolesGuard } from '../auth/jwt/jwt-roles.guard';
import { HasRoles } from 'src/auth/jwt/has-role';
import { JwtRole } from 'src/auth/jwt/jwt-role';

@Controller('users')
export class UsersController {

    constructor(private usersService: UsersService) {}

    @HasRoles(JwtRole.ADMIN)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Get()
    findAll() {
        return this.usersService.findAll();
    }

    @Post() // http://localhost/users -> POST
    create(@Body() user: CreateUserDto) {
        return this.usersService.create(user);
    }

    @HasRoles(JwtRole.ADMIN, JwtRole.CLIENT)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Put(':id') // http://localhost/users/:id -> PUT
    update(@Param('id', ParseIntPipe) id: number, @Body() user: UpdateUserDto) {
        return this.usersService.update(id, user);
    }

    @HasRoles(JwtRole.ADMIN, JwtRole.CLIENT)
    @Put('upload/:id')
    @UseInterceptors(FileInterceptor('file'))
    updateWithImage(
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                  new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 10 }),
                  new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
                ],
              }),
        )
        file: Express.Multer.File,
        @Param('id', ParseIntPipe) id: number,
         @Body() user: UpdateUserDto
        ) {
        return this.usersService.updaWithImage(file, id, user);
    }
}
