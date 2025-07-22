'use client';

import React, { useState } from 'react';
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
import { createProduct } from '@/actions/product';
import { CurrencyEnum, ProductStatusEnum } from '@prisma/client';
import { validateImageUrl } from '@/lib/utils/validateImageUrl';

type Props = {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  userId: string;
  onProductCreated?: () => void;
};

const ProductDialog = ({
  open,
  onOpenChange,
  userId,
  onProductCreated,
}: Props) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState<CurrencyEnum>(CurrencyEnum.USD);
  const [status, setStatus] = useState<ProductStatusEnum>(
    ProductStatusEnum.ACTIVE,
  );
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (imageUrl) {
        const imageValidation = validateImageUrl(imageUrl);
        if (!imageValidation.isValid) {
          toast.error(imageValidation.message);
          setIsSubmitting(false);
          return;
        }
      }

      const productData = {
        name,
        description: description || undefined,
        price: parseFloat(price),
        currency,
        status,
        imageUrl: imageUrl || undefined,
        ownerId: userId,
      };

      if (
        !productData.name ||
        isNaN(productData.price) ||
        productData.price <= 0
      ) {
        toast.error('Please fill in required fields (Name, valid Price).');
        setIsSubmitting(false);
        return;
      }

      const result = await createProduct(productData);

      if (result.success) {
        toast.success('Product created successfully!');
        setName('');
        setDescription('');
        setPrice('');
        setCurrency(CurrencyEnum.USD);
        setStatus(ProductStatusEnum.ACTIVE);
        setImageUrl('');
        if (onOpenChange) {
          onOpenChange(false);
        }
        if (onProductCreated) {
          onProductCreated();
        }
      } else {
        toast.error(result.message || 'Failed to create product.');
      }
    } catch (error: unknown) {
      console.error('Error creating product:', error);
      toast.error('An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    const validation = validateImageUrl(url);

    if (url && !validation.isValid) {
      toast.error(validation.message);
    }

    setImageUrl(url);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Product</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
              value={price}
              onChange={(e) => setPrice(e.target.value)}
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
              value={currency}
              onValueChange={(value: CurrencyEnum) => setCurrency(value)}
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
              value={status}
              onValueChange={(value: ProductStatusEnum) => setStatus(value)}
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
            <Label htmlFor="imageUrl" className="text-right">
              Img URL
            </Label>
            <Input
              id="imageUrl"
              type="url"
              value={imageUrl}
              onChange={handleImageUrlChange}
              className="col-span-3"
              placeholder="Image URL only"
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
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Product'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDialog;
