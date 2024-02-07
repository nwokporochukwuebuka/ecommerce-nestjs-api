import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthentcationGuard } from 'src/utitlity/guards/authentication.guards';
import { AuthorizeGuard } from 'src/utitlity/guards/authorization.guards';
import { Roles } from 'src/utitlity/common/user-roles.enum';
import { CurrentUser } from 'src/utitlity/decorators/current-user.decorator';
import { UserEntity } from 'src/users/entities/user.entity';
import { ProductEntity } from './entities/product.entity';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthentcationGuard, AuthorizeGuard([Roles.ADMIN]))
  @Post()
  create(
    @Body() createProductDto: CreateProductDto,
    @CurrentUser() user: UserEntity,
  ): Promise<ProductEntity> {
    return this.productsService.create(createProductDto, user);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthentcationGuard)
  @Get()
  findAll(): Promise<ProductEntity[]> {
    return this.productsService.findAll();
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthentcationGuard)
  @Get(':id')
  findOne(@Param('id') id: string): Promise<ProductEntity> {
    return this.productsService.findOne(+id);
  }

  @UseGuards(AuthentcationGuard, AuthorizeGuard([Roles.ADMIN]))
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @CurrentUser() user: UserEntity,
  ): Promise<ProductEntity> {
    return this.productsService.update(+id, updateProductDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
