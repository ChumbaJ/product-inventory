import { DataSource } from "typeorm";
import { config } from "./config";
import { AddMockDataToProduct1624866202511 } from "./migrations/1764770976317-AddMockData";
import { CreateProductTable1764860185525 } from "./migrations/1764860185525-CreateProductTable";
import { Product } from "./modules/product/product.entity";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: config.db.host,
  port: config.db.port,
  username: config.db.user,
  password: config.db.password,
  database: config.db.name,
  logging: config.db.logging,
  entities: [Product],
  synchronize: false,
  migrations: [
    CreateProductTable1764860185525,
    AddMockDataToProduct1624866202511,
  ],
  migrationsRun: true,
});

export async function initDB() {
  const maxRetries = 5;
  const delay = 2000;
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      console.log(
        `Attempting to connect to the database, attempt #${attempt + 1}`
      );
      await AppDataSource.initialize();
      console.log("Database connected successfully!");
      return;
    } catch (error: any) {
      attempt++;
      console.log(`Database connection failed: ${error?.message}`);
      if (attempt >= maxRetries) {
        console.log("Max retries reached. Could not connect to the database.");
        throw error;
      }
      console.log(`Retrying in ${delay / 1000} seconds...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}
