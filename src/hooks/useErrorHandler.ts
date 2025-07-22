'use client';

import { useCallback } from 'react';
import { toast } from 'sonner';

interface ErrorHandlerOptions {
  showToast?: boolean;
  logError?: boolean;
  fallbackMessage?: string;
  silent?: boolean;
}

export const useErrorHandler = (options: ErrorHandlerOptions = {}) => {
  const {
    showToast = true,
    logError = true,
    fallbackMessage = 'Something went wrong. Please try again.',
    silent = false,
  } = options;

  const handleError = useCallback(
    (error: unknown, context?: string) => {
      const errorId = `ERR-${Date.now().toString(36).toUpperCase()}`;

      // User-friendly error messages
      const getUserFriendlyMessage = (error: unknown): string => {
        if (error instanceof Error) {
          if (error.message.includes('fetch')) {
            return 'Connection error. Please check your internet connection.';
          }
          if (error.message.includes('timeout')) {
            return 'Request timed out. Please try again.';
          }
          if (error.message.includes('unauthorized')) {
            return 'Session expired. Please sign in again.';
          }
          if (error.message.includes('forbidden')) {
            return "You don't have permission to perform this action.";
          }
          if (error.message.includes('not found')) {
            return 'The requested resource was not found.';
          }
        }
        return fallbackMessage;
      };

      const userMessage = getUserFriendlyMessage(error);

      if (logError) {
        console.error(`[${errorId}]${context ? ` in ${context}` : ''}:`, error);
        // In production: trackError(error, { context, errorId });
      }

      if (showToast && !silent) {
        toast.error(userMessage, {
          duration: 5000,
          action: {
            label: 'Dismiss',
            onClick: () => {},
          },
        });
      }

      return { errorId, message: userMessage };
    },
    [showToast, logError, fallbackMessage, silent],
  );

  return { handleError };
};
