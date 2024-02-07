import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepo: Repository<CategoryEntity>,
  ) {}

  async create(
    body: CreateCategoryDto,
    user: UserEntity,
  ): Promise<CategoryEntity> {
    const category = this.categoryRepo.create({ ...body, addedBy: user });
    return await this.categoryRepo.save(category);
  }

  async findOne(id: number): Promise<CategoryEntity> {
    const category = await this.categoryRepo.findOne({
      where: { id },
      relations: { addedBy: true },
      select: { addedBy: { id: true, name: true, email: true } },
    });

    if (!category) throw new NotFoundException('Category Does Not Exists');

    return category;
  }

  async findAll(): Promise<CategoryEntity[]> {
    return await this.categoryRepo.find({
      relations: { addedBy: true },
      select: { addedBy: { id: true, name: true, email: true } },
    });
  }

  async update(id: number, fields: Partial<UpdateCategoryDto>) {
    const category = await this.findOne(id);

    if (!category) throw new NotFoundException('This Category Does Not Exist');

    Object.assign(category, fields);
    return await this.categoryRepo.save(category);
  }
}
