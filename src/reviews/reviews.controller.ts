import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { AuthentcationGuard } from 'src/utitlity/guards/authentication.guards';
import { CurrentUser } from 'src/utitlity/decorators/current-user.decorator';
import { UserEntity } from 'src/users/entities/user.entity';
import { AuthorizeGuard } from 'src/utitlity/guards/authorization.guards';
import { Roles } from 'src/utitlity/common/user-roles.enum';
import { ReviewEntity } from './entities/review.entity';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthentcationGuard)
  @Post()
  async create(
    @Body() createReviewDto: CreateReviewDto,
    @CurrentUser() user: UserEntity,
  ): Promise<ReviewEntity> {
    return this.reviewsService.create(createReviewDto, user);
  }

  // @HttpCode(HttpStatus.OK)
  // @UseGuards(AuthentcationGuard, AuthorizeGuard([Roles.ADMIN]))
  @Get('/all')
  async findAll(): Promise<ReviewEntity[]> {
    return this.reviewsService.findAll();
  }

  // @HttpCode(HttpStatus.OK)
  // @UseGuards(AuthentcationGuard)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ReviewEntity> {
    return this.reviewsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto) {
    return this.reviewsService.update(+id, updateReviewDto);
  }

  @UseGuards(AuthentcationGuard, AuthorizeGuard([Roles.ADMIN]))
  @Delete(':id')
  remove(@Param('id') id: string): Promise<ReviewEntity> {
    return this.reviewsService.remove(+id);
  }

  @HttpCode(HttpStatus.OK)
  @Get(':productId')
  async findAllByProduct(@Param('productId') productId: number) {
    return this.reviewsService.findAllByProduct(productId);
  }
}
