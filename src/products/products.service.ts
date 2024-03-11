import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { Repository } from 'typeorm';
import { CategoriesService } from 'src/categories/categories.service';
import { UserEntity } from 'src/users/entities/user.entity';
import { OrderStatus } from 'src/orders/enums/order-status.enum';
import dataSource from 'db/data-source';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepo: Repository<ProductEntity>,
    private readonly categoryService: CategoriesService,
  ) {}

  async create(
    createProductDto: CreateProductDto,
    user: UserEntity,
  ): Promise<ProductEntity> {
    const category = await this.categoryService.findOne(
      +createProductDto.category,
    );
    const product = this.productRepo.create({
      ...createProductDto,
      category: category,
      addedBy: user,
    });

    return await this.productRepo.save(product);
  }

  // async findAll(): Promise<ProductEntity[]> {
  //   return this.productRepo.find({
  //     relations: { addedBy: true, category: true },
  //     select: {
  //       addedBy: { id: true, name: true, email: true },
  //       category: { id: true, title: true },
  //     },
  //   });
  // }

  async findAll(query: any): Promise<any> {
    let filteredTotalProducts: number;
    let limit: number;

    if (!query.limit) {
      limit = 4;
    } else {
      limit = query.limit;
    }

    const queryBuilder = dataSource
      .getRepository(ProductEntity)
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoin('product.reviews', 'review')
      .addSelect([
        'COUNT (review.id) AS reviewCount',
        'AVG(review.ratings)::numeric(10,2) AS avgRating',
      ])
      .groupBy('product.id,category.id');

    const totalProducts = await queryBuilder.getCount();

    if (query.search) {
      const search = query.search;

      queryBuilder.andWhere('product.title like :title', {
        title: `%${search}%`,
      });
    }

    if (query.category) {
      queryBuilder.andWhere('category.id=:id', { id: query.category });
    }

    if (query.minPrice) {
      queryBuilder.andWhere('product.price>=:minPrice', {
        minPrice: query.minPrice,
      });
    }

    if (query.maxPrice) {
      queryBuilder.andWhere('product.price<=:maxPrice', {
        maxPrice: query.maxPrice,
      });
    }

    if (query.minRating) {
      queryBuilder.andHaving('AVG(review.ratings)>=:minRating', {
        minRating: query.minRating,
      });
    }
    if (query.maxRating) {
      queryBuilder.andHaving('AVG(review.ratings)<=:maxRating', {
        maxRating: query.maxRating,
      });
    }

    if (query.offset) {
      queryBuilder.offset(query.offset);
    }

    queryBuilder.limit(limit);
    const products = await queryBuilder.getRawMany();
    return products;
  }

  async findOne(id: number): Promise<ProductEntity> {
    const product = await this.productRepo.findOne({
      where: { id: id },
      relations: { addedBy: true, category: true, reviews: true },
      select: {
        addedBy: { id: true, name: true, email: true },
        category: { id: true, title: true },
        reviews: { id: true, ratings: true, comment: true },
      },
    });
    if (!product) throw new NotFoundException('This Product Does Not Exist');
    return product;
  }

  async update(
    id: number,
    updateProductDto: Partial<UpdateProductDto>,
    user: UserEntity,
  ): Promise<ProductEntity> {
    const product = await this.findOne(+id);

    if (!product) throw new NotFoundException('Product Does Not Exist');

    Object.assign(product, updateProductDto);
    product.addedBy = user;
    if (updateProductDto.category) {
      const category = await this.categoryService.findOne(
        +updateProductDto.category,
      );

      if (!category) throw new NotFoundException('Category Does Not Exist');

      product.category = category;
    }
    return await this.productRepo.save(product);
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }

  async updateProductStock(id: number, stock: number, status: string) {
    let product = await this.findOne(id);

    if (status === OrderStatus.DELIVERED) {
      product.stock -= stock;
    } else if (status === OrderStatus.CANCELLED) {
      product.stock += stock;
    }

    product = await this.productRepo.save(product);
    return product;
  }
}
