import { Entity, PrimaryGeneratedColumn, Column, Check } from "typeorm";

// typeorm ругается на ColumnTypeUndefinedError, необходимо явно указать тип колонки в БД
@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", unique: true })
  article: string;

  @Column({ type: "varchar" })
  name: string;

  @Column({ type: "decimal" })
  @Check("price > 0")
  price: number;

  @Column({ type: "int" })
  @Check("quantity >= 0")
  quantity: number;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    name: "createdat",
  })
  createdAt: Date;
}
