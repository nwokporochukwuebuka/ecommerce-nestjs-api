import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedTBLReviewsUpdate1707292915931 implements MigrationInterface {
    name = 'AddedTBLReviewsUpdate1707292915931'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "FK_66c0ec0805afe33fe629eaa5da6"`);
        await queryRunner.query(`ALTER TABLE "reviews" RENAME COLUMN "productsId" TO "productId"`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "FK_a6b3c434392f5d10ec171043666" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "FK_a6b3c434392f5d10ec171043666"`);
        await queryRunner.query(`ALTER TABLE "reviews" RENAME COLUMN "productId" TO "productsId"`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "FK_66c0ec0805afe33fe629eaa5da6" FOREIGN KEY ("productsId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
