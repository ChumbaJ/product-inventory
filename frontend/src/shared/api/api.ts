import type { Product } from "../../entities/Product/types/product.type";
import { config } from "../config";
import type { CreateProductDto } from "./dto/createProductDto";
import type { UpdateProductDto } from "./dto/updateProductDto";

export interface GetProductsArgs {
  page: number;
  limit: number;
}

export class API {
  private BASE_URL: string;
  private headers: HeadersInit;

  constructor(
    BASE_URL: string,
    headers: HeadersInit = { "Content-Type": "application/json" }
  ) {
    this.BASE_URL = BASE_URL;
    this.headers = headers;
  }

  async getProducts({
    page,
    limit,
  }: GetProductsArgs): Promise<{ data: Product[]; count: number }> {
    const url = `/products?page=${page}&limit=${limit}`;
    return await this.request<{ data: Product[]; count: number }>(url);
  }

  async createProduct(
    newProduct: CreateProductDto
  ): Promise<{ data: Product }> {
    const url = "/products";

    try {
      const response = await this.request<{ data: Product }>(url, {
        body: JSON.stringify(newProduct),
        method: "POST",
      });

      return response;
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  }

  async updateProduct(params: {
    id: number;
    updatedProduct: UpdateProductDto;
  }): Promise<{ data: Product }> {
    const { id, updatedProduct } = params;
    const url = `/products/${id}`;

    try {
      const response = await this.request<{ data: Product }>(url, {
        body: JSON.stringify(updatedProduct),
        method: "PUT",
      });

      return response;
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  }

  async deleteProduct(id: number): Promise<{ data: { id: number } }> {
    const url = `/products/${id}`;

    try {
      const response = await this.request<{ data: { id: number } }>(url, {
        method: "DELETE",
      });

      return response;
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  }

  private async request<T>(url: string, options?: RequestInit): Promise<T> {
    const response = await fetch(this.BASE_URL + url, {
      ...options,
      headers: {
        ...this.headers,
        ...(options?.headers || {}),
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Что-то пошло не так");
    }
    return response.json();
  }
}

export const api = new API(config.backendAddr);
