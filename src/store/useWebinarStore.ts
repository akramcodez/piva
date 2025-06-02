import {
  validateAdditionalInfo,
  validateBasicInfo,
  validateCTA,
  validationError,
} from '@/lib/type';
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
    errors: validationError;
  };
  cta: {
    valid: boolean;
    errors: validationError;
  };
  additionalInfo: {
    valid: boolean;
    errors: validationError;
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

  updateBasicInfo: <K extends keyof WebinarFormState['basicInfo']>(
    field: K,
    value: WebinarFormState['basicInfo'][K],
  ) => void;

  updateCTAField: <K extends keyof WebinarFormState['cta']>(
    field: K,
    value: WebinarFormState['cta'][K],
  ) => void;

  updateAdditionalInfo: <K extends keyof WebinarFormState['additionalInfo']>(
    field: K,
    value: WebinarFormState['additionalInfo'][K],
  ) => void;

  validateStep: (step: keyof WebinarFormState) => void;

  getStepvalidationError: (step: keyof WebinarFormState) => validationError;

  resetForm: () => void;
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

const initialValidation: ValidationState = {
  basicInfo: {
    valid: false,
    errors: {},
  },
  cta: {
    valid: false,
    errors: {},
  },
  additionalInfo: {
    valid: false,
    errors: {},
  },
};

export const useWebinarStore = create<WebinarStore>((set, get) => ({
  isModelOpen: false,
  isComplete: false,
  isSubmitting: false,
  formData: initialFormData,
  validation: initialValidation,

  setIsModelOpen: (isOpen: boolean) => set({ isModelOpen: isOpen }),
  setIsComplete: (isComplete: boolean) => set({ isComplete: isComplete }),
  setIsSubmitting: (isSubmitting: boolean) =>
    set({ isSubmitting: isSubmitting }),

  updateBasicInfo: (field, value) => {
    set((state) => {
      const newBasicInfo = { ...state.formData.basicInfo, [field]: value };

      const validationResult = validateBasicInfo(newBasicInfo);

      return {
        formData: {
          ...state.formData,
          basicInfo: newBasicInfo,
        },
        validation: {
          ...state.validation,
          basicInfo: validationResult,
        },
      };
    });
  },

  updateCTAField: (field, value) => {
    set((state) => {
      const newCTA = { ...state.formData.cta, [field]: value };

      const validationResult = validateCTA(newCTA);

      return {
        formData: {
          ...state.formData,
          cta: newCTA,
        },
        validation: {
          ...state.validation,
          cta: validationResult,
        },
      };
    });
  },

  updateAdditionalInfo: (field, value) => {
    set((state) => {
      const newAdditionalInfo = {
        ...state.formData.additionalInfo,
        [field]: value,
      };

      const validationResult = validateAdditionalInfo(newAdditionalInfo);

      return {
        formData: {
          ...state.formData,
          addionalInfo: newAdditionalInfo,
        },
        validation: {
          ...state.validation,
          addionalInfo: validationResult,
        },
      };
    });
  },

  validateStep: (stepId: keyof WebinarFormState) => {
    const { formData } = get();
    let validationResult;

    switch (stepId) {
      case 'basicInfo':
        validationResult = validateBasicInfo(formData.basicInfo);
        break;
      case 'cta':
        validationResult = validateCTA(formData.cta);
        break;
      case 'additionalInfo':
        validationResult = validateAdditionalInfo(formData.additionalInfo);
        break;
    }

    set((state) => {
      return {
        validation: {
          ...state.validation,
          [stepId]: validationResult,
        },
      };
    });
    return validationResult.valid;
  },

  getStepvalidationError: (stepId: keyof WebinarFormState) => {
    return get().validation[stepId].errors;
  },

  resetForm: () => {
    set({
      isComplete: false,
      isSubmitting: false,
      formData: initialFormData,
      validation: initialValidation,
    });
  },
}));
