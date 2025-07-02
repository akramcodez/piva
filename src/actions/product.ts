'use server';

import { prismaClient } from '@/lib/prismaClient';
import { Product, CurrencyEnum, ProductStatusEnum } from '@prisma/client';

type CreateProductInput = {
  name: string;
  description?: string;
  price: number;
  currency: CurrencyEnum;
  status: ProductStatusEnum;
  imageUrl?: string;
  webinarId?: string;
  ownerId: string;
};

type CreateProductResponse = {
  success: boolean;
  status: number;
  message?: string;
  product?: Product;
  error?: any;
};

export const createProduct = async (
  data: CreateProductInput,
): Promise<CreateProductResponse> => {
  try {
    if (!data.name || data.price <= 0 || !data.ownerId) {
      return {
        success: false,
        status: 400,
        message: 'Missing required fields or invalid price.',
      };
    }

    const newProduct = await prismaClient.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        currency: data.currency,
        status: data.status,
        image: data.imageUrl,
        ownerId: data.ownerId,
      },
    });

    return {
      success: true,
      status: 200,
      message: 'Product created successfully',
      product: newProduct,
    };
  } catch (error) {
    console.error('Error creating product:', error);
    return {
      success: false,
      status: 500,
      message: 'Failed to create product.',
      error: error,
    };
  }
};

export const getProductsByOwnerId = async (
  ownerId: string,
): Promise<Product[]> => {
  try {
    if (!ownerId) {
      console.error('Owner ID is required to fetch products.');
      return [];
    }

    const products = await prismaClient.product.findMany({
      where: {
        ownerId: ownerId,
      },
    });

    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};
