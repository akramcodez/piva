'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { updateProduct } from '@/actions/product';
import { CurrencyEnum, ProductStatusEnum } from '@prisma/client';
import { ClientProduct } from '@/lib/type';
import { useRouter } from 'next/navigation';

type Props = {
  open: boolean;
  onClose: () => void;
  product: ClientProduct | null;
};

const EditProductDialog = ({ open, onClose, product }: Props) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    currency: '',
    status: '',
    image: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (open) {
      if (product) {
        setFormData({
          name: product.name || '',
          description: product.description || '',
          price: product.price?.toString() || '',
          currency: product.currency || CurrencyEnum.USD,
          status: product.status || ProductStatusEnum.ACTIVE,
          image: product.image || '',
        });
      } else {
        setFormData({
          name: '',
          description: '',
          price: '',
          currency: CurrencyEnum.USD,
          status: ProductStatusEnum.ACTIVE,
          image: '',
        });
      }
    }
  }, [open, product]);

  const updateFormData = (
    field: string,
    value: string | CurrencyEnum | ProductStatusEnum,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Product Name is required');
      return;
    }

    if (!formData.description.trim()) {
      toast.error('Product Description is required');
      return;
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast.error('Please enter a valid price');
      return;
    }

    if (!product?.id) {
      toast.error('Product not found');
      return;
    }

    try {
      setIsSubmitting(true);
      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        currency: formData.currency,
        status: formData.status,
        image: formData.image.trim() || null,
      };

      const result = await updateProduct(product.id, productData);
      if (result.status === 200) {
        toast.success('Product updated successfully');
      } else {
        toast.error(result.message || 'Failed to update product');
      }
      router.refresh();
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('An error occurred while updating the product');
    } finally {
      onClose();
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-full max-h-screen sm:max-h-auto sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {product ? 'Edit Product' : 'Create New Product'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => updateFormData('name', e.target.value)}
              className="col-span-3"
              required
              placeholder="e.g., Coaching Session"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => updateFormData('description', e.target.value)}
              className="col-span-3"
              placeholder="Describe your product..."
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price" className="text-right text-md">
              Price
            </Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => updateFormData('price', e.target.value)}
              className="col-span-3"
              required
              placeholder="e.g., 99.99"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="currency" className="text-right">
              Currency
            </Label>
            <Select
              value={formData.currency}
              onValueChange={(value: CurrencyEnum) =>
                updateFormData('currency', value)
              }
            >
              <SelectTrigger id="currency" className="col-span-3">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(CurrencyEnum).map((curr) => (
                  <SelectItem key={curr} value={curr}>
                    {curr}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Status
            </Label>
            <Select
              value={formData.status}
              onValueChange={(value: ProductStatusEnum) =>
                updateFormData('status', value)
              }
            >
              <SelectTrigger id="status" className="col-span-3">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(ProductStatusEnum).map((stat) => (
                  <SelectItem key={stat} value={stat}>
                    {stat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="image" className="text-right">
              Img URL
            </Label>
            <Input
              id="image"
              type="url"
              value={formData.image}
              onChange={(e) => updateFormData('image', e.target.value)}
              className="col-span-3"
              placeholder="Image URL"
            />
          </div>
        </form>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary" disabled={isSubmitting}>
              Close
            </Button>
          </DialogClose>
          <Button type="submit" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                {product ? 'Updating...' : 'Creating...'}
              </>
            ) : product ? (
              'Update Product'
            ) : (
              'Create Product'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditProductDialog;
