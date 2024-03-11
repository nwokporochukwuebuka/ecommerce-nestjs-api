import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Put,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { AuthentcationGuard } from 'src/utitlity/guards/authentication.guards';
import { CurrentUser } from 'src/utitlity/decorators/current-user.decorator';
import { UserEntity } from 'src/users/entities/user.entity';
import { OrderEntity } from './entities/order.entity';
import { AuthorizeGuard } from 'src/utitlity/guards/authorization.guards';
import { Roles } from 'src/utitlity/common/user-roles.enum';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthentcationGuard)
  @Post()
  async create(
    @Body() createOrderDto: CreateOrderDto,
    @CurrentUser() user: UserEntity,
  ): Promise<OrderEntity> {
    return this.ordersService.create(createOrderDto, user);
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  findAll(): Promise<OrderEntity[]> {
    return this.ordersService.findAll();
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.ordersService.findOne(+id);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthentcationGuard, AuthorizeGuard([Roles.ADMIN]))
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
    @CurrentUser() user: UserEntity,
  ): Promise<OrderEntity> {
    return this.ordersService.update(+id, updateOrderStatusDto, user);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthentcationGuard, AuthorizeGuard([Roles.ADMIN]))
  @Put('cancel/:id')
  async cancelOrder(
    @CurrentUser() user: UserEntity,
    @Param('id') id: number,
  ): Promise<OrderEntity> {
    return await this.ordersService.cancel(+id, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }
}
