export type validationError = Record<string, string>;

export type ValidationResult = {
  valid: boolean;
  errors: validationError;
};

export const validateBasicInfo = (data: {
  webinarName?: string;
  description?: string;
  date?: Date;
  time?: string;
  timeFormet?: 'AM' | 'PM';
}): ValidationResult => {
  const errors: validationError = {};

  if (!data.webinarName?.trim()) {
    errors.webinarName = 'Webinar Name is required';
  }

  if (!data.description?.trim()) {
    errors.description = 'Description is required';
  }

  if (!data.date) {
    errors.date = 'Date is required';
  }

  if (!data.time?.trim()) {
    errors.time = 'Time is required';
  } else {
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(data.time)) {
      errors.time = 'Invalid time format. Use HH:MM';
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateCTA = (data: {
  ctaLabel?: string;
  tags?: string[];
  ctaType?: string;
  aiAgent?: string;
}): ValidationResult => {
  const errors: validationError = {};

  if (!data.ctaLabel?.trim()) {
    errors.ctaLabel = 'CTA Label is required';
  }

  if (!data.ctaType) {
    errors.aiAgent = 'AI Agent is required';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateAdditionalInfo = (data: {
  lockChat?: boolean;
  couponCode?: string;
  couponEnabled?: boolean;
}): ValidationResult => {
  const errors: validationError = {};

  if (!data.couponCode?.trim()) {
    errors.couponCode = 'Coupon Code is required';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};
