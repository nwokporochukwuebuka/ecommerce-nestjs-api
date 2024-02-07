import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { Repository } from 'typeorm';
import { CategoriesService } from 'src/categories/categories.service';
import { UserEntity } from 'src/users/entities/user.entity';

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

  async findAll(): Promise<ProductEntity[]> {
    return this.productRepo.find({
      relations: { addedBy: true, category: true },
      select: {
        addedBy: { id: true, name: true, email: true },
        category: { id: true, title: true },
      },
    });
  }

  async findOne(id: number): Promise<ProductEntity> {
    const product = await this.productRepo.findOne({
      where: { id: id },
      relations: { addedBy: true, category: true },
      select: {
        addedBy: { id: true, name: true, email: true },
        category: { id: true, title: true },
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
}
