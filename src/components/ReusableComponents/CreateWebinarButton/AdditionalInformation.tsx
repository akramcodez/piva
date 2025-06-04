'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useWebinarStore } from '@/store/useWebinarStore';
import { cn } from '@/lib/utils';
import React, { useState } from 'react';
import { Info, X } from 'lucide-react';
import { CtaTypeEnum } from '@prisma/client';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';

type Props = {};

const AdditionalInformation = (props: Props) => {
  const { formData, updateAdditionalInfo, getStepvalidationError } =
    useWebinarStore();
  const { lockChat, couponCode, couponEnabled } = formData.additionalInfo;

  const errors = getStepvalidationError('additionalInfo');

  const handleToggleLockChat = (checked: boolean) => {
    updateAdditionalInfo('lockChat', checked);
  };

  const handleToggleCoupon = (checked: boolean) => {
    updateAdditionalInfo('couponEnabled', checked);
  };

  const handleCouponCodeChnage = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateAdditionalInfo('couponCode', e.target.value);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <Label htmlFor="lock-chat" className="text-base font-medium">
            Lock Chat
          </Label>
          <p className="text-sm text-gray-400">
            Turn it on to make chat visible to your user at all time
          </p>
        </div>
        <Switch
          id="lock-chat"
          checked={lockChat || false}
          onCheckedChange={handleToggleLockChat}
        />
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="coupon-enabled" className="text-base font-medium">
              Coupon Code
            </Label>
            <p className="text-sm text-gray-400">
              Turn it on to offer discount to your viewers
            </p>
          </div>
          <Switch
            id="coupon-enabled"
            checked={couponEnabled || false}
            onCheckedChange={handleToggleCoupon}
          />
        </div>
        {couponEnabled && (
          <div className="space-y-2">
            <Input
              id="couponeCode"
              value={couponCode || ''}
              onChange={handleCouponCodeChnage}
              placeholder="Paste the code here"
              className={cn(
                '!bg-backround/50 border border-input',
                errors.couponCode &&
                  'border-red-400 focus-visible:ring-red-400',
              )}
            />
            {errors.couponCode && (
              <p className="text-xs text-red-400">{errors.couponCode}</p>
            )}
            <div className="flex items-center gap-2 text-sm text-gray-400 mt-2">
              <Info className="h-8 w-8" />
              <p>
                This coupon code can be to promote a sale. Users can use it for
                the buy now CTA
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdditionalInformation;
