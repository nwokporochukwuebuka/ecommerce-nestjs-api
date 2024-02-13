import { Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ReviewEntity } from './entities/review.entity';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(ReviewEntity)
    private readonly reviewRepo: Repository<ReviewEntity>,
    private readonly productService: ProductsService,
  ) {}

  async create(createReviewDto: CreateReviewDto, user: UserEntity) {
    const product = await this.productService.findOne(+createReviewDto.product);
    let review = await this.findByOneByUserAndProduct(
      user.id,
      createReviewDto.product,
    );
    if (!review) {
      review = this.reviewRepo.create({
        user: user,
        product: product,
        comment: createReviewDto.comment,
        ratings: createReviewDto.ratings,
      });
    } else {
      review.comment = createReviewDto.comment;
      review.ratings = createReviewDto.ratings;
    }

    return await this.reviewRepo.save(review);
  }

  findAll() {
    return this.reviewRepo.find({
      relations: { user: true, product: { category: true } },
      select: {
        id: true,
        comment: true,
        ratings: true,
        user: { id: true, name: true },
        product: { id: true, title: true, category: { id: true, title: true } },
      },
    });
  }

  findOne(id: number) {
    return this.reviewRepo.findOne({
      where: { id },
      relations: { user: true, product: { category: true } },
      select: {
        user: { id: true, email: true, name: true },
        product: { id: true, title: true, category: { title: true, id: true } },
      },
    });
  }

  update(id: number, updateReviewDto: UpdateReviewDto) {
    return `This action updates a #${id} review`;
  }

  async remove(id: number): Promise<ReviewEntity> {
    const review = await this.findOne(id);
    return this.reviewRepo.remove(review);
  }

  async findByOneByUserAndProduct(userId: number, productId: number) {
    return await this.reviewRepo.findOne({
      where: { user: { id: userId }, product: { id: productId } },
      relations: { user: true, product: { category: true } },
    });
  }

  async findAllByProduct(productId: number) {
    return this.reviewRepo.find({ where: { product: { id: productId } } });
  }
}
