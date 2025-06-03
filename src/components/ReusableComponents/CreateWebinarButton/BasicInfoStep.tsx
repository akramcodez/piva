import React from 'react';
import { useWebinarStore } from '@/store/useWebinarStore';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type Props = {};

const BasicInfoStep = (props: Props) => {
  const { formData, updateBasicInfo, getStepvalidationError } =
    useWebinarStore();

  const { webinarName, description, date, time, timeFormet } =
    formData.basicInfo;

  const errors = getStepvalidationError('basicInfo');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    updateBasicInfo(name as keyof typeof formData.basicInfo, value);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label
          htmlFor="webinarName"
          className={errors.webinarName ? 'text-red-400' : ''}
        >
          Webinar Name <span className="text-red-400">*</span>
        </Label>
        <Input
          id="webinarName"
          name="webinarName"
          value={webinarName}
          onChange={handleChange}
          placeholder="Webinar Title"
          className={cn(
            '!bg-background/50 border border-input',
            errors.webinarName && 'border-red-400 focus-visible:ring-red-400',
          )}
        />
        {errors.webinarName && (
          <p className="text-sm text-red-400">{errors.webinarName}</p>
        )}
      </div>
    </div>
  );
};

export default BasicInfoStep;
