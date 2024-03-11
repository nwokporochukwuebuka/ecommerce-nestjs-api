import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { Repository } from 'typeorm';
import { OrderProductsEntity } from './entities/order-products.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { ShippingEntity } from './entities/shipping.entity';
import { ProductEntity } from 'src/products/entities/product.entity';
import { ProductsService } from 'src/products/products.service';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderStatus } from './enums/order-status.enum';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepo: Repository<OrderEntity>,

    @InjectRepository(OrderProductsEntity)
    private readonly orderProductsRepo: Repository<OrderProductsEntity>,

    @InjectRepository(ShippingEntity)
    private readonly shippingRepo: Repository<ShippingEntity>,

    private readonly productService: ProductsService,
  ) {}
  async create(createOrderDto: CreateOrderDto, currentUser: UserEntity) {
    const shippingEntity = this.shippingRepo.create({
      ...createOrderDto.shippingAddress,
    });

    await this.shippingRepo.save(shippingEntity);

    const orderEntity = this.orderRepo.create({
      shippingAddress: shippingEntity,
      user: currentUser,
    });

    const orderTbl = await this.orderRepo.save(orderEntity);

    let orderProductEntity: {
      order: OrderEntity;
      product: ProductEntity;
      product_quantity: number;
      product_unit_price: number;
    }[] = [];

    for (let i = 0; i < createOrderDto.orderedProducts.length; i++) {
      const order = orderTbl;
      const product = await this.productService.findOne(
        createOrderDto.orderedProducts[i].id,
      );
      const product_quantity =
        createOrderDto.orderedProducts[i].product_quantity;
      const product_unit_price =
        createOrderDto.orderedProducts[i].product_unit_price;

      orderProductEntity.push({
        order,
        product,
        product_quantity,
        product_unit_price,
      });
    }

    const orderedProduct = this.orderProductsRepo.create(orderProductEntity);

    await this.orderProductsRepo.save(orderedProduct);
    return await this.findOne(orderTbl.id);
  }

  async findAll(): Promise<OrderEntity[]> {
    return await this.orderRepo.find({
      relations: {
        products: { product: true },
        user: true,
        shippingAddress: true,
      },
    });
  }

  async findOne(id: number) {
    return await this.orderRepo.findOne({
      where: { id },
      relations: {
        products: { product: true },
        user: true,
        shippingAddress: true,
      },
    });
  }

  async update(
    id: number,
    updateOrderStatusDto: UpdateOrderStatusDto,
    currentUser: UserEntity,
  ) {
    let order = await this.findOne(id);

    if (!order) throw new NotFoundException('Order Not Found');

    if (
      (order.status === OrderStatus.DELIVERED &&
        updateOrderStatusDto.status === OrderStatus.DELIVERED) ||
      order.status === OrderStatus.CANCELLED
    ) {
      throw new BadRequestException(`Order Already ${order.status}`);
    }

    if (
      order.status === OrderStatus.PROCESSING &&
      updateOrderStatusDto.status === OrderStatus.SHIPPED
    ) {
      throw new BadRequestException(`Delivery Must Be Made Before Shipping!!!`);
    }

    if (
      updateOrderStatusDto.status === OrderStatus.SHIPPED &&
      order.status === OrderStatus.SHIPPED
    ) {
      return order;
    }

    if (updateOrderStatusDto.status === OrderStatus.SHIPPED) {
      order.shippedAt = new Date();
    }

    if (updateOrderStatusDto.status === OrderStatus.DELIVERED) {
      order.deliveredAt = new Date();
    }

    order.status = updateOrderStatusDto.status;

    order.updatedBy = currentUser;

    order = await this.orderRepo.save(order);

    if (updateOrderStatusDto.status === OrderStatus.DELIVERED) {
      await this.stockUpdate(order, OrderStatus.DELIVERED);
    }
    return order;
  }

  async stockUpdate(order: OrderEntity, status: string) {
    for (const op of order.products) {
      await this.productService.updateProductStock(
        op.product.id,
        op.product_quantity,
        status,
      );
    }
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }

  async cancel(id: number, currentUser: UserEntity) {
    let order = await this.findOne(id);

    if (!order) throw new NotFoundException('Order Not Found');

    if (order.status === OrderStatus.CANCELLED) return order;

    order.updatedBy = currentUser;

    order.status = OrderStatus.CANCELLED;

    order = await this.orderRepo.save(order);

    await this.stockUpdate(order, OrderStatus.CANCELLED);
    return order;
  }
}
