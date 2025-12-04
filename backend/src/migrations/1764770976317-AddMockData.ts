import { MigrationInterface, QueryRunner } from "typeorm";
import { Product } from "../modules/product/product.entity";

export class AddMockDataToProduct1624866202511 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const mockProducts: Omit<Product, "id">[] = [];

    for (let i = 0; i < 300; i++) {
      mockProducts.push({
        article: `A${i + 1}`,
        name: `Product ${i + 1}`,
        price: Math.floor(Math.random() * 1000) + 1,
        quantity: Math.floor(Math.random() * 100) + 1,
        createdAt: new Date(),
      });
    }

    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into(Product)
      .values(mockProducts)
      .execute();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager
      .createQueryBuilder()
      .delete()
      .from(Product)
      .execute();
  }
}
