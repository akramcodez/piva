'use server';

import { prismaClient } from '@/lib/prismaClient';
import { ClientProduct } from '@/lib/type';
import {
  Product,
  CurrencyEnum,
  ProductStatusEnum,
  AttendedTypeEnum,
} from '@prisma/client';

type ProductError = {
  code?: string;
  message: string;
  details?: unknown;
};

type CreateProductInput = {
  name: string;
  description?: string;
  price: number;
  currency: CurrencyEnum;
  status: ProductStatusEnum;
  imageUrl?: string;
  ownerId: string;
};

type CreateProductResponse = {
  success: boolean;
  status: number;
  message?: string;
  product?: Product;
  error?: ProductError;
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

    await prismaClient.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        currency: data.currency,
        status: data.status,
        image: data.imageUrl,
        ownerId: data.ownerId,
        updatedAt: new Date(),
      },
    });

    return {
      success: true,
      status: 200,
      message: 'Product created successfully',
    };
  } catch (error: unknown) {
    console.error('Error creating product:', error);
    return {
      success: false,
      status: 500,
      message: 'Failed to create product.',
    };
  }
};

type UpdateProductInput = {
  name: string;
  description: string;
  price: number;
  currency: CurrencyEnum;
  status: ProductStatusEnum;
  image?: string;
};

export const updateProduct = async (
  productId: string,
  data: UpdateProductInput,
) => {
  if (!productId) {
    return {
      success: false,
      status: 400,
      message: 'Product not found',
    };
  }
  try {
    await prismaClient.product.update({
      where: { id: productId },
      data: {
        name: data.name,
        description: data.description,
        price: Number(data.price),
        currency: data.currency,
        status: data.status,
        image: data.image,
        updatedAt: new Date(),
      },
    });

    return {
      success: true,
      status: 200,
      message: 'Product updated successfully',
    };
  } catch (error: unknown) {
    console.error('Error updating product:', error);
    return {
      success: false,
      status: 500,
      message: 'Product updating failed',
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
  } catch (error: unknown) {
    console.error('Error fetching products:', error);
    return [];
  }
};

export const changeStatusOfProduct = async (productId: string) => {
  try {
    if (!productId) {
      return { success: false, message: 'Product ID is required.' };
    }

    const product = await prismaClient.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return { success: false, message: 'Product not found.' };
    }

    const newStatus =
      product.status === ProductStatusEnum.ACTIVE
        ? ProductStatusEnum.INACTIVE
        : ProductStatusEnum.ACTIVE;

    await prismaClient.product.update({
      where: { id: productId },
      data: {
        status: newStatus,
        updatedAt: new Date(),
      },
    });

    return {
      success: true,
      message: `Product status changed to ${newStatus}.`,
    };
  } catch (error: unknown) {
    console.error('Error changing product status:', error);
    return { success: false, message: 'Failed to change product status.' };
  }
};

export const findOneProduct = async (productId: string) => {
  try {
    if (!productId) {
      console.error('Product ID is required to find a product.');
      return null;
    }

    const result = await prismaClient.product.findUnique({
      where: { id: productId },
    });

    const product: ClientProduct | null = result
      ? {
          ...result,
          price: Number(result.price),
          createdAt: result.createdAt.toISOString(),
          updatedAt: result.updatedAt.toISOString(),
        }
      : null;

    return product;
  } catch (error: unknown) {
    console.error('Error finding product by ID:', error);
    return null;
  }
};

export const buyProduct = async (
  productId: string,
  userId: string,
  webinarId: string,
): Promise<{ success: boolean; message?: string }> => {
  try {
    if (!productId || !userId || !webinarId) {
      return {
        success: false,
        message: 'Product ID, User ID, and Webinar ID are required.',
      };
    }

    const product = await prismaClient.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return { success: false, message: 'Product not found.' };
    }

    const attendee = await prismaClient.attendee.findUnique({
      where: { id: userId },
    });

    if (!attendee) {
      console.error(`Attendee not found with ID: ${userId}`);
      return { success: false, message: 'Attendee not found.' };
    }

    await prismaClient.attendance.upsert({
      where: {
        attendeeId_webinarId: {
          attendeeId: attendee.id,
          webinarId: webinarId,
        },
      },
      update: {
        attendedType: AttendedTypeEnum.CONVERTED,
        updatedAt: new Date(),
      },
      create: {
        attendeeId: attendee.id,
        webinarId: webinarId,
        attendedType: AttendedTypeEnum.CONVERTED,
      },
    });

    await prismaClient.product.update({
      where: { id: productId },
      data: {
        totalSales: {
          increment: 1,
        },
        updatedAt: new Date(),
      },
    });

    return { success: true, message: 'Purchase intent recorded.' };
  } catch (error: unknown) {
    console.error('Error recording purchase intent:', error);
    return { success: false, message: 'Failed to record purchase intent.' };
  }
};

export const countProducts = async (ownerId: string) => {
  try {
    if (!ownerId) {
      console.error('Owner ID is required to fetch products.');
      return {
        status: 400,
        success: false,
        message: 'Owner ID is required to fetch products count',
        count: 0,
      };
    }

    const count = await prismaClient.product.count({
      where: {
        ownerId: ownerId,
      },
    });

    return {
      status: 200,
      success: true,
      message: 'Products counted successfully',
      count: count,
    };
  } catch (error: unknown) {
    console.error('Error counting products:', error);
    return {
      status: 500,
      success: false,
      message: 'Failed to count products',
      count: 0,
    };
  }
};

export const calculateRevenue = async (ownerId: string) => {
  try {
    if (!ownerId) {
      return {
        status: 400,
        success: false,
        message: 'Owner ID is required',
        revenue: '$0.00',
        totalProducts: 0,
      };
    }

    const products = await prismaClient.product.findMany({
      where: {
        ownerId: ownerId,
      },
      select: {
        id: true,
        name: true,
        price: true,
        currency: true,
        totalSales: true,
      },
    });

    if (products.length === 0) {
      return {
        status: 200,
        success: true,
        message: 'No products found for user',
        revenue: '$0.00',
        totalProducts: 0,
      };
    }

    let totalRevenue = 0;
    const productBreakdown = products.map((product) => {
      const productRevenue = Number(product.price) * product.totalSales;
      totalRevenue += productRevenue;

      return {
        id: product.id,
        name: product.name,
        price: Number(product.price),
        totalSales: product.totalSales,
        productRevenue: productRevenue,
        currency: product.currency,
      };
    });

    const formattedRevenue = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(totalRevenue);

    return {
      status: 200,
      success: true,
      message: 'Revenue calculated successfully',
      revenue: formattedRevenue,
      totalProducts: products.length,
      totalRevenue: totalRevenue,
      productBreakdown: productBreakdown,
    };
  } catch (error: unknown) {
    console.error('Error calculating revenue:', error);
    return {
      status: 500,
      success: false,
      message: 'Failed to calculate revenue',
      revenue: '$0.00',
      totalProducts: 0,
      error: error,
    };
  }
};

export const deleteProduct = async (id: string) => {
  try {
    const result = await prismaClient.product.delete({
      where: {
        id: id,
      },
    });

    const product: ClientProduct | null = result
      ? {
          ...result,
          price: Number(result.price),
          createdAt: result.createdAt.toISOString(),
          updatedAt: result.updatedAt.toISOString(),
        }
      : null;

    return {
      status: 200,
      success: true,
      message: 'Product deleted successfully',
      data: product,
    };
  } catch (error: unknown) {
    console.error('Error deleting product status:', error);
    return {
      status: 500,
      success: false,
      message: 'Failed to delete product',
    };
  }
};
