import { CtaTypeEnum } from '@prisma/client';
import { create } from 'zustand';

export type WebinarFormState = {
  basicInfo: {
    webinarName?: string;
    Description?: string;
    date?: Date;
    time?: string;
    timeFormet?: 'AM' | 'PM';
  };
  cta: {
    ctaLabel?: string;
    tags?: string[];
    ctaType?: CtaTypeEnum;
    aiAgent?: string;
    priceId?: string;
  };
  additionalInfo: {
    lockChat?: boolean;
    couponCode?: string;
    couponEnabled?: boolean;
  };
};

type ValidationState = {
  basicInfo: {
    valid: boolean;
    errors: ValidationErrors;
  };
  cta: {
    valid: boolean;
    errors: ValidationErrors;
  };
  additionalInfo: {
    valid: boolean;
    errors: ValidationErrors;
  };
};

type WebinarStore = {
  isModelOpen: boolean;
  isComplete: boolean;
  isSubmitting: boolean;
  formData: WebinarFormState;
  validation: ValidationState;

  setIsModelOpen: (isOpen: boolean) => void;
  setIsComplete: (isComplete: boolean) => void;
  setIsSubmitting: (isSubmitting: boolean) => void;
};

const initialFormData: WebinarFormState = {
  basicInfo: {
    webinarName: '',
    Description: '',
    date: undefined,
    time: '',
    timeFormet: 'AM',
  },
  cta: {
    ctaLabel: '',
    tags: [],
    ctaType: 'BOOK_A_CALL',
    aiAgent: '',
    priceId: '',
  },
  additionalInfo: {
    lockChat: false,
    couponCode: '',
    couponEnabled: false,
  },
};

export const useWebinarStore = create<WebinarStore>((set) => ({
  isModelOpen: false,
  isComplete: false,
  isSubmitting: false,
  formData: initialFormData,

  setIsModelOpen: (isOpen: boolean) => set({ isModelOpen: isOpen }),
  setIsComplete: (isComplete: boolean) => set({ isComplete: isComplete }),
  setIsSubmitting: (isSubmitting: boolean) =>
    set({ isSubmitting: isSubmitting }),
}));
