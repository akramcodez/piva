'use server';

import { prismaClient } from '@/lib/prismaClient';
import {
  Product,
  CurrencyEnum,
  ProductStatusEnum,
  AttendedTypeEnum,
} from '@prisma/client'; // Import AttendedTypeEnum

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
        updatedAt: new Date(),
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
  } catch (error) {
    console.error('Error changing product status:', error);
    return { success: false, message: 'Failed to change product status.' };
  }
};

export const findOneProduct = async (
  productId: string,
): Promise<Product | null> => {
  try {
    if (!productId) {
      console.error('Product ID is required to find a product.');
      return null;
    }

    const product = await prismaClient.product.findUnique({
      where: { id: productId },
    });

    return product;
  } catch (error) {
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

    const attendance = await prismaClient.attendance.upsert({
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
  } catch (error) {
    console.error('Error recording purchase intent:', error);
    return { success: false, message: 'Failed to record purchase intent.' };
  }
};
