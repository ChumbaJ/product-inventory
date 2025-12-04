import { AppDataSource } from "../../data-source";
import { ProductController } from "./product.controller";
import { Product } from "./product.entity";

const productRepository = AppDataSource.getRepository(Product);

export const productController = new ProductController(productRepository);
