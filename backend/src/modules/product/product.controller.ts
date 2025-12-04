import { ServerResponse } from "http";
import { Repository } from "typeorm";
import { Request } from "../../core/Request";
import { json } from "../../core/response";
import { Product } from "./product.entity";
import {
  validateProductCreate,
  validateProductUpdate,
} from "./validation/product.validation";

// Стрелочные функции необходимы для сохранения контекста this
// так как мы выдергиваем эти методы из инстанса в router.ts когда кладем их в значения routes объекта
export class ProductController {
  constructor(private productRepository: Repository<Product>) {}

  get = async (req: Request, res: ServerResponse) => {
    const searchParams = req.url.searchParams;
    const rawPage = searchParams.get("page") || "1";
    const rawLimit = searchParams.get("limit") || "10";

    const page = Number(rawPage);
    const limit = Number(rawLimit);

    const errors: string[] = [];

    if (!Number.isInteger(page) || page < 1) {
      errors.push("page must be a positive integer (>= 1)");
    }

    if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
      errors.push("limit must be an integer between 1 and 100");
    }

    if (errors.length > 0) {
      return json(res, 400, { errors });
    }

    const skip = (page - 1) * limit;

    try {
      const products = await this.productRepository.find({
        skip,
        take: limit,
      });

      const total = await this.productRepository.count();
      const count = Math.ceil(total / limit);

      return json(res, 200, {
        data: products,
        count,
      });
    } catch (error) {
      console.error(error);
      return json(res, 500, { message: "Internal server error" });
    }
  };

  create = async (req: Request, res: ServerResponse) => {
    const result = validateProductCreate(req.body);
    if (!result.ok) {
      return json(res, 400, { errors: result.errors });
    }

    const dto = result.value!;

    try {
      const product = this.productRepository.create(dto);
      const saved = await this.productRepository.save(product);

      return json(res, 201, { data: saved });
      // Тут лучше тип unknown и сузить, но так как ТЗ и проект небольшой,
      // то думаю это можно оставить пока так
    } catch (error: any) {
      if (error.code === "23505") {
        return json(res, 409, {
          message: "Product with this article already exists",
        });
      }
      console.error(error);
      return json(res, 500, { message: "Internal server error" });
    }
  };

  update = async (req: Request, res: ServerResponse) => {
    const segments = req.url.pathname.split("/");
    const id = Number(segments[segments.length - 1]);

    if (!id || Number.isNaN(id)) {
      return json(res, 400, { message: "Invalid id" });
    }

    const result = validateProductUpdate(req.body);
    if (!result.ok) {
      return json(res, 400, { errors: result.errors });
    }

    const dto = result.value!;

    const existingProduct = await this.productRepository.findOneBy({ id });
    if (!existingProduct) {
      return json(res, 404, { message: "Product not found" });
    }

    try {
      const merged = this.productRepository.merge(existingProduct, dto);
      const saved = await this.productRepository.save(merged);

      return json(res, 200, { data: saved });
      // Тут лучше тип unknown и сузить, но так как ТЗ и проект небольшой,
      // то думаю это можно оставить пока так
    } catch (error: any) {
      if (error?.code === "23505") {
        return json(res, 409, {
          message: "Product with this article already exists",
        });
      }

      console.error(error);
      return json(res, 500, { message: "Internal server error" });
    }
  };

  delete = async (req: Request, res: ServerResponse) => {
    const segments = req.url.pathname.split("/");
    const id = Number(segments[segments.length - 1]);

    if (!id || Number.isNaN(id)) {
      return json(res, 400, { message: "Invalid id" });
    }

    try {
      const existing = await this.productRepository.findOneBy({ id });

      if (!existing) {
        return json(res, 404, { message: "Product not found" });
      }

      await this.productRepository.remove(existing);

      return json(res, 200, {
        data: { id },
      });
    } catch (error) {
      console.error(error);
      return json(res, 500, { message: "Internal server error" });
    }
  };
}
