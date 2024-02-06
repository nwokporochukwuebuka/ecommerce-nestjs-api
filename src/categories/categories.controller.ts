import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Get,
  Param,
  Patch,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { AuthentcationGuard } from 'src/utitlity/guards/authentication.guards';
import { AuthorizeGuard } from 'src/utitlity/guards/authorization.guards';
import { Roles } from 'src/utitlity/common/user-roles.enum';
import { CurrentUser } from 'src/utitlity/decorators/current-user.decorator';
import { UserEntity } from 'src/users/entities/user.entity';
import { CategoryEntity } from './entities/category.entity';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthentcationGuard, AuthorizeGuard([Roles.ADMIN]))
  @Post()
  async createCategory(
    @Body() category: CreateCategoryDto,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<CategoryEntity> {
    return await this.categoriesService.create(category, currentUser);
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  async findAllCategory(): Promise<CategoryEntity[]> {
    return await this.categoriesService.findAll();
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async findOneCategory(@Param('id') id: string): Promise<CategoryEntity> {
    return this.categoriesService.findOne(+id);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthentcationGuard, AuthorizeGuard([Roles.ADMIN]))
  @Patch(':id')
  async updateCategory(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryEntity> {
    return await this.categoriesService.update(+id, updateCategoryDto);
  }
}
