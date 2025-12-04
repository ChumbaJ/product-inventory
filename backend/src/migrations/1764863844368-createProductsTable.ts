import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProductsTable1764863844368 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
              CREATE TABLE product (
                id SERIAL PRIMARY KEY,
                article VARCHAR UNIQUE NOT NULL,
                name VARCHAR NOT NULL,
                price DECIMAL CHECK (price >= 0) NOT NULL,
                quantity INT CHECK (quantity >= 0) NOT NULL,
                createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
              );
            `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
              DROP TABLE IF EXISTS product;
            `);
  }
}
