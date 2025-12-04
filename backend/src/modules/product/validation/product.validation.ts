import { CreateProductDto } from "../dto/create-product.dto";

export function validateProductCreate(body: any): {
  ok: boolean;
  errors?: string[];
  value?: CreateProductDto;
} {
  const errors: string[] = [];

  if (typeof body.article !== "string" || body.article.trim().length === 0) {
    errors.push("article is required and must be a non-empty string");
  }

  if (typeof body.name !== "string" || body.name.trim().length === 0) {
    errors.push("name is required and must be a non-empty string");
  }

  if (typeof body.price !== "number" || Number.isNaN(body.price)) {
    errors.push("price must be a number");
  } else if (body.price < 0) {
    errors.push("price must be >= 0");
  }

  if (typeof body.quantity !== "number" || !Number.isInteger(body.quantity)) {
    errors.push("quantity must be an integer");
  } else if (body.quantity < 0) {
    errors.push("quantity must be >= 0");
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    value: {
      article: body.article,
      name: body.name,
      price: body.price,
      quantity: body.quantity,
    },
  };
}

export function validateProductUpdate(body: any): {
  ok: boolean;
  errors?: string[];
  value?: Partial<CreateProductDto>;
} {
  const errors: string[] = [];

  if (
    body.article === undefined &&
    body.name === undefined &&
    body.price === undefined &&
    body.quantity === undefined
  ) {
    return { ok: false, errors: ["At least one field must be provided"] };
  }

  const value: Partial<CreateProductDto> = {};

  if (body.article) {
    if (typeof body.article !== "string" || body.article.trim().length === 0) {
      errors.push("article must be a non-empty string");
    } else {
      value.article = body.article;
    }
  }

  if (body.name) {
    if (typeof body.name !== "string" || body.name.trim().length === 0) {
      errors.push("name must be a non-empty string");
    } else {
      value.name = body.name;
    }
  }

  if (body.price !== undefined) {
    if (typeof body.price !== "number" || Number.isNaN(body.price)) {
      errors.push("price must be a number");
    } else if (body.price < 0) {
      errors.push("price must be >= 0");
    } else {
      value.price = body.price;
    }
  }

  if (body.quantity !== undefined) {
    if (typeof body.quantity !== "number" || !Number.isInteger(body.quantity)) {
      errors.push("quantity must be an integer");
    } else if (body.quantity < 0) {
      errors.push("quantity must be >= 0");
    } else {
      value.quantity = body.quantity;
    }
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  return { ok: true, value };
}
