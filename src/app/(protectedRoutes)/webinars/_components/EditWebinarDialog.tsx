'use client';

import React, { useState, useMemo } from 'react';
import { Webinar } from '@prisma/client';
import { format } from 'date-fns';
import { X, Calendar, Clock, Search, Info, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ClientProduct } from '@/lib/type';
import { Assistant } from '@vapi-ai/server-sdk/api';
import Link from 'next/link';
import { updateWebinar } from '@/actions/webinar';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

type Props = {
  webinar: Webinar;
  isOpen: boolean;
  onClose: () => void;
  products: ClientProduct[] | [];
  assistants: Assistant[] | [];
};

const EditWebinarDialog = ({
  webinar,
  isOpen,
  onClose,
  products,
  assistants,
}: Props) => {
  const [formData, setFormData] = useState({
    basicInfo: {
      webinarName: webinar?.title || '',
      description: webinar?.description || '',
      thumbnail: webinar?.thumbnail || '',
      date: webinar?.startTime ? new Date(webinar.startTime) : new Date(),
      time: webinar?.startTime
        ? format(new Date(webinar.startTime), 'HH:mm')
        : '',
      timeFormat: webinar?.startTime
        ? ((new Date(webinar.startTime).getHours() >= 12 ? 'PM' : 'AM') as
            | 'AM'
            | 'PM')
        : ('AM' as 'AM' | 'PM'),
    },
    cta: {
      ctaLabel: webinar?.ctaLabel || '',
      tags: webinar?.tags || [],
      ctaType: webinar?.ctaType || 'BOOK_A_CALL',
      aiAgent: webinar?.aiAgentId || '',
      priceId: webinar?.priceId || '',
    },
    additionalInfo: {
      lockChat: webinar?.lockChat || false,
      couponEnabled: webinar?.couponEnabled || false,
      couponCode: webinar?.couponCode || '',
    },
  });

  const [agentSearch, setAgentSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showGeneralError, setShowGeneralError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const filteredProducts = useMemo(() => {
    if (!productSearch.trim()) return products;
    return products.filter((product) =>
      product.name.toLowerCase().includes(productSearch.toLowerCase()),
    );
  }, [products, productSearch]);

  const filteredAssistants = useMemo(() => {
    if (!agentSearch.trim()) return assistants;
    return assistants.filter((assistant) =>
      assistant?.name
        ?.toString()
        .toLowerCase()
        .includes(agentSearch.toLowerCase()),
    );
  }, [assistants, agentSearch]);

  const handleInputChange = (
    section: string,
    field: string,
    value: string | boolean | Date,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value,
      },
    }));

    const errorKey = `${section}.${field}`;
    if (errors[errorKey]) {
      setErrors((prev) => ({
        ...prev,
        [errorKey]: '',
      }));
    }

    if (showGeneralError) {
      setShowGeneralError(false);
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.basicInfo.webinarName.trim()) {
      newErrors['basicInfo.webinarName'] = 'Webinar name is required';
    }

    if (!formData.basicInfo.description.trim()) {
      newErrors['basicInfo.description'] = 'Description is required';
    }

    if (!formData.basicInfo.date) {
      newErrors['basicInfo.date'] = 'Webinar date is required';
    }

    if (!formData.basicInfo.time) {
      newErrors['basicInfo.time'] = 'Webinar time is required';
    }

    if (!formData.cta.ctaLabel.trim()) {
      newErrors['cta.ctaLabel'] = 'CTA label is required';
    }

    if (
      !formData.cta.tags ||
      (Array.isArray(formData.cta.tags) && formData.cta.tags.length === 0) ||
      formData.cta.tags.toString().trim() === ''
    ) {
      newErrors['cta.tags'] = 'CTA tags are required';
    }

    if (!formData.cta.ctaType) {
      newErrors['cta.ctaType'] = 'CTA type is required';
    }

    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;

    if (!isValid) {
      setShowGeneralError(true);
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    try {
      setIsSubmitting(true);
      const result = await updateWebinar(webinar.id, formData);
      if (result.status === 200 && result.webinarId) {
        toast.success('Webinar updated successfully');
      } else {
        toast.error(result.message || 'Failed to update webinar');
      }
      router.refresh();
    } catch (error) {
      console.error('Error updating webinar:', error);
      toast.error('An error occurred while updating the webinar');
    } finally {
      setIsSubmitting(false);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[100vh] sm:max-h-[90vh] overflow-y-auto bg-black text-white border-gray-800">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-semibold">
            Edit{' '}
            <Link
              href={`/live-webinar/${webinar?.id}`}
              className="underline themeColor"
            >{`${formData.basicInfo.webinarName}`}</Link>{' '}
            webinar
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-sm sm:text-lg font-medium">
              Basic Information
            </h3>

            <div className="space-y-4">
              <div>
                <Label htmlFor="webinarName" className="text-sm font-medium">
                  Webinar Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="webinarName"
                  value={formData.basicInfo.webinarName}
                  onChange={(e) =>
                    handleInputChange(
                      'basicInfo',
                      'webinarName',
                      e.target.value,
                    )
                  }
                  className={`mt-1 bg-gray-900 border-gray-700 text-white ${
                    errors['basicInfo.webinarName'] ? 'border-red-500' : ''
                  }`}
                  placeholder="Enter webinar name"
                />
                {errors['basicInfo.webinarName'] && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors['basicInfo.webinarName']}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="description" className="text-sm font-medium">
                  Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  value={formData.basicInfo.description}
                  onChange={(e) =>
                    handleInputChange(
                      'basicInfo',
                      'description',
                      e.target.value,
                    )
                  }
                  className={`mt-1 bg-gray-900 border-gray-700 text-white min-h-[100px] ${
                    errors['basicInfo.description'] ? 'border-red-500' : ''
                  }`}
                  placeholder="Enter description"
                />
                {errors['basicInfo.description'] && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors['basicInfo.description']}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="thumbnail" className="text-sm font-medium">
                  Thumbnail <span>*</span>
                </Label>
                <Input
                  id="thumbnail"
                  value={formData.basicInfo.thumbnail}
                  onChange={(e) =>
                    handleInputChange('basicInfo', 'thumbnail', e.target.value)
                  }
                  placeholder="Enter Img URL"
                />
              </div>

              <div>
                <Label htmlFor="date" className="text-sm font-medium">
                  Webinar Date <span className="text-red-500">*</span>
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="date"
                    type="date"
                    value={
                      formData.basicInfo.date
                        ? format(formData.basicInfo.date, 'yyyy-MM-dd')
                        : ''
                    }
                    onChange={(e) =>
                      handleInputChange(
                        'basicInfo',
                        'date',
                        new Date(e.target.value),
                      )
                    }
                    className={`bg-background border border-border text-white pl-10 ${
                      errors['basicInfo.date'] ? 'border-red-500' : ''
                    }`}
                  />
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
                {errors['basicInfo.date'] && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors['basicInfo.date']}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="time" className="text-sm font-medium">
                  Webinar Time <span className="text-red-500">*</span>
                </Label>
                <div className="flex gap-2 mt-1">
                  <div className="relative flex-1">
                    <Input
                      id="time"
                      type="time"
                      value={formData.basicInfo.time}
                      onChange={(e) =>
                        handleInputChange('basicInfo', 'time', e.target.value)
                      }
                      className={`bg-background border border-border text-white pl-10 ${
                        errors['basicInfo.time'] ? 'border-red-500' : ''
                      }`}
                    />
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                  <Select
                    value={formData.basicInfo.timeFormat}
                    onValueChange={(value) =>
                      handleInputChange('basicInfo', 'timeFormat', value)
                    }
                  >
                    <SelectTrigger className="w-20 bg-gray-900 border-gray-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-700">
                      <SelectItem value="AM">AM</SelectItem>
                      <SelectItem value="PM">PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {errors['basicInfo.time'] && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors['basicInfo.time']}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="space-y-4">
            <h3 className="text-sm sm:text-lg font-medium mb-5">CTA</h3>

            <div className="space-y-4">
              <div>
                <Label htmlFor="ctaLabel" className="text-sm font-medium">
                  CTA Label <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="ctaLabel"
                  value={formData.cta.ctaLabel}
                  onChange={(e) =>
                    handleInputChange('cta', 'ctaLabel', e.target.value)
                  }
                  className={`mt-1 bg-gray-900 border-gray-700 text-white ${
                    errors['cta.ctaLabel'] ? 'border-red-500' : ''
                  }`}
                  placeholder="Enter CTA label"
                />
                {errors['cta.ctaLabel'] && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors['cta.ctaLabel']}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="ctaTags" className="text-sm font-medium">
                  CTA Tags <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="ctaTags"
                  value={formData.cta.tags}
                  onChange={(e) =>
                    handleInputChange('cta', 'tags', e.target.value)
                  }
                  className={`mt-1 bg-gray-900 border-gray-700 text-white ${
                    errors['cta.tags'] ? 'border-red-500' : ''
                  }`}
                  placeholder="Add Tags and press Enter"
                />
                {errors['cta.tags'] && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors['cta.tags']}
                  </p>
                )}
              </div>

              <div>
                <Label className="text-sm font-medium">
                  CTA Type <span className="text-red-500">*</span>
                </Label>
                <div className="flex gap-2 mt-1">
                  <Button
                    type="button"
                    variant={
                      formData.cta.ctaType === 'BOOK_A_CALL'
                        ? 'default'
                        : 'outline'
                    }
                    className={`flex-1 ${
                      formData.cta.ctaType === 'BOOK_A_CALL'
                        ? 'bg-white text-black'
                        : 'bg-gray-900 border-gray-700 text-white hover:bg-gray-800'
                    }`}
                    onClick={() =>
                      handleInputChange('cta', 'ctaType', 'BOOK_A_CALL')
                    }
                  >
                    Book a Call
                  </Button>
                  <Button
                    type="button"
                    variant={
                      formData.cta.ctaType === 'BUY_NOW' ? 'default' : 'outline'
                    }
                    className={`flex-1 ${
                      formData.cta.ctaType === 'BUY_NOW'
                        ? 'bg-white text-black'
                        : 'bg-gray-900 border-gray-700 text-gray-400 hover:bg-gray-800'
                    }`}
                    onClick={() =>
                      handleInputChange('cta', 'ctaType', 'BUY_NOW')
                    }
                  >
                    Buy Now
                  </Button>
                </div>
                {errors['cta.ctaType'] && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors['cta.ctaType']}
                  </p>
                )}
              </div>

              {formData.cta.ctaType === 'BOOK_A_CALL' && (
                <div>
                  <Label className="text-sm font-medium">
                    Attach an AI Agent
                  </Label>

                  <div className="space-y-2 mt-2">
                    <Select
                      value={formData.cta.aiAgent}
                      onValueChange={(value) =>
                        handleInputChange('cta', 'aiAgent', value)
                      }
                    >
                      <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                        <SelectValue placeholder="Select an Agent" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border border-input max-h-40">
                        {filteredAssistants?.length > 0 ? (
                          filteredAssistants.map((assistant) => (
                            <SelectItem
                              key={assistant.id}
                              value={assistant.id}
                              className="!bg-background/50 hover:!bg-white/10"
                            >
                              {assistant.name}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="No Agent Available" disabled>
                            No Agents Available
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              <div>
                <Label className="text-sm font-medium">Attach a Product</Label>

                <div className="space-y-2 mt-2">
                  <Select
                    value={formData.cta.priceId}
                    onValueChange={(value) =>
                      handleInputChange('cta', 'priceId', value)
                    }
                  >
                    <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                      <SelectValue placeholder="Select a product" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border border-input max-h-48">
                      {filteredProducts?.length > 0 ? (
                        filteredProducts.map((product) => (
                          <SelectItem
                            key={product.id}
                            value={product.id}
                            className="!bg-background/50 hover:!bg-white/10"
                          >
                            {product.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-products" disabled>
                          <Link href={'/products'}>Create product</Link>
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm sm:text-lg font-medium mb-5">
              Additional Information
            </h3>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Lock Chat</Label>
                  <p className="text-xs text-gray-400">
                    Turn it on to make chat visible to your user at all time
                  </p>
                </div>
                <Switch
                  checked={formData.additionalInfo.lockChat}
                  onCheckedChange={(checked) =>
                    handleInputChange('additionalInfo', 'lockChat', checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Coupon Code</Label>
                  <p className="text-xs text-gray-400">
                    Turn it on to offer discount to your viewers
                  </p>
                </div>
                <Switch
                  checked={formData.additionalInfo.couponEnabled}
                  onCheckedChange={(checked) =>
                    handleInputChange(
                      'additionalInfo',
                      'couponEnabled',
                      checked,
                    )
                  }
                />
              </div>

              {formData.additionalInfo.couponEnabled && (
                <div className="space-y-2">
                  <Input
                    id="couponCode"
                    value={formData.additionalInfo.couponCode || ''}
                    onChange={(e) =>
                      handleInputChange(
                        'additionalInfo',
                        'couponCode',
                        e.target.value,
                      )
                    }
                    placeholder="Paste the code here"
                    className="!bg-background/50 border border-input"
                  />
                  <div className="flex items-start gap-2 text-sm text-gray-400 mt-2">
                    <Info className="h-5 w-5 mt-1" />
                    <p>
                      This coupon code can be used to promote a sale. Users can
                      use it for the buy now CTA
                    </p>
                  </div>
                </div>
              )}
            </div>
            {showGeneralError && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                <p className="text-red-500 text-sm font-medium">
                  Please fill in all required fields to continue.
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-end pt-6">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-card hover:bg-gray-800 border border-border text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin mr-0.5" />
                  updating...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditWebinarDialog;
