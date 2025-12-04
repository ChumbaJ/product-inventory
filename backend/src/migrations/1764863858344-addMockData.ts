import { MigrationInterface, QueryRunner } from "typeorm";
import { Product } from "../modules/product/product.entity";

export class AddMockData1764863858344 implements MigrationInterface {
  name?: string | undefined;
  transaction?: boolean | undefined;
  public async up(queryRunner: QueryRunner): Promise<void> {
    const mockProducts: Omit<Product, "id" | "createdAt">[] = [];

    for (let i = 0; i < 300; i++) {
      mockProducts.push({
        article: `A${i + 1}`,
        name: `Product ${i + 1}`,
        price: Math.floor(Math.random() * 1000) + 1,
        quantity: Math.floor(Math.random() * 100) + 1,
      });
    }

    const values = mockProducts
      .map((p) => `('${p.article}', '${p.name}', ${p.price}, ${p.quantity})`)
      .join(", ");

    await queryRunner.query(`
            INSERT INTO "product" ("article", "name", "price", "quantity")
            VALUES ${values};
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "product";`);
  }
}
