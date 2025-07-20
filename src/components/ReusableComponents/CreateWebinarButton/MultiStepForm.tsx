'use client';

import { useWebinarStore } from '@/store/useWebinarStore';
import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, Check, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { createWebinar } from '@/actions/webinar';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

type Step = {
  id: string;
  title: string;
  description: string;
  component: React.ReactNode;
};

type Props = {
  steps: Step[];
  onComplete: (id: string) => void;
};

const MultiStepForm = ({ steps, onComplete }: Props) => {
  const {
    formData,
    validateStep,
    isSubmitting,
    setIsSubmitting,
    setIsModelOpen,
  } = useWebinarStore();

  const router = useRouter();

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [validationError, setValidationError] = useState<string | null>(null);

  const currentStep = steps[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;

  const handleBack = () => {
    if (isFirstStep) {
      setIsModelOpen(false);
    } else {
      setCurrentStepIndex(currentStepIndex - 1);
      setValidationError(null);
    }
  };

  const handleNext = async () => {
    setValidationError(null);
    const isValid = validateStep(currentStep.id as keyof typeof formData);

    if (!isValid) {
      setValidationError('Please fill in all required fields');
      return;
    }

    if (!completedSteps.includes(currentStep.id)) {
      setCompletedSteps([...completedSteps, currentStep.id]);
    }

    if (isLastStep) {
      try {
        setIsSubmitting(true);
        const result = await createWebinar(formData);
        if (result.status === 200 && result.webinarId) {
          toast.success('Webinar created successfully');
          onComplete(result.webinarId);
        } else {
          toast.error(result.message || 'Failed to create webinar');
          setValidationError(result.message);
        }
        router.refresh();
      } catch (error: unknown) {
        console.error('Error creating webinar:', error);
        toast.error('An error occurred while creating the webinar');
        setValidationError('An error occurred while creating the webinar');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        {/* Left side - Steps */}
        <div className="w-full md:max-w-[200px] p-4 border-b md:border-b-0 md:border-r border-border bg-background/50">
          <div className="space-y-4">
            {steps.map((step, index) => {
              const isCompleted = completedSteps.includes(step.id);
              const isCurrent = index === currentStepIndex;
              const isPast = index < currentStepIndex;

              return (
                <div key={step.id} className="relative">
                  <div className="flex items-start gap-4">
                    <div className="relavite">
                      <motion.div
                        initial={false}
                        animate={{
                          backgroundColor:
                            isCurrent || isCompleted
                              ? 'rgb(44, 140, 136)'
                              : 'rgb(31, 41, 55)',
                          scale: [isCurrent && !isCompleted ? 0.8 : 1, 1],
                          transition: { duration: 0.3 },
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '2rem',
                          height: '2rem',
                          borderRadius: '9999px',
                          zIndex: 10,
                        }}
                      >
                        <AnimatePresence mode="wait">
                          {isCompleted ? (
                            <motion.div
                              key="check"
                              initial={{ opacity: 0, scale: 0.5 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.5 }}
                              transition={{ duration: 0.2 }}
                            >
                              <Check className="w-5 h-5 text-white" />
                            </motion.div>
                          ) : (
                            <motion.div
                              key="number"
                              initial={{ opacity: 0, scale: 0.5 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.5 }}
                              transition={{ duration: 0.2 }}
                              style={{ color: 'white' }}
                            >
                              <Check className="w-5 h-5 text-white/50" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                      {index < steps.length - 1 && (
                        <div
                          className="absolute top-8 left-4 w-0.5 h-16 
                        bg-gray-700 overflow-hidden"
                        >
                          <motion.div
                            initial={{
                              height: isPast || isCompleted ? '100%' : '0%',
                            }}
                            animate={{
                              height: isPast || isCompleted ? '100%' : '0%',
                              backgroundColor: 'rgb(44, 140, 136)',
                            }}
                            transition={{ duration: 0.5, ease: 'easeInOut' }}
                            style={{ width: '100%', height: '100%' }}
                          />
                        </div>
                      )}
                    </div>
                    <div>
                      <motion.h3
                        animate={{
                          color:
                            isCurrent || isCompleted
                              ? 'rgb(255, 255, 255)'
                              : 'rgb(156, 163, 175)',
                        }}
                        transition={{ duration: 0.3 }}
                        style={{
                          fontWeight: 500,
                          fontSize: '0.875rem',
                          lineHeight: '1.25rem',
                          marginBottom: '0.5rem',
                        }}
                      >
                        {step.title}
                      </motion.h3>
                      <p className="text-xs text-gray-500">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="w-full md:w-3/3 p-4 overflow-y-auto max-h-[50vh] sm:max-h-[75vh]">
          <div className="max-w-5xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep.id}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-4">
                  <h2 className="text-base  font-semibold mb-1">
                    {currentStep.title}
                  </h2>
                  <p className="text-gray-400 text-xs ">
                    {currentStep.description}
                  </p>
                </div>

                {currentStep.component}

                {validationError && (
                  <div className="mt-4 p-3 bg-red-900/30 border border-red-800 rounded-md flex items-start gap-2 text-red-300">
                    <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <p className="text-sm">{validationError}</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Bottom buttons */}
      <div className="flex items-center justify-between gap-4 p-2 border-t border-border bg-background/50">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={isSubmitting}
          className={cn(
            'border-gray-700 text-white hover:bg-gray-800 px-4 py-2',
            isFirstStep ? 'opacity-50 cursor-not-allowed' : '',
          )}
        >
          <span className="text-sm">{isFirstStep ? 'Cancel' : 'Back'}</span>
        </Button>
        <Button
          onClick={handleNext}
          disabled={isSubmitting}
          className="px-4 py-2"
        >
          <span className="flex items-center text-sm">
            {isLastStep ? (
              isSubmitting ? (
                <>
                  <Loader2 className="animate-spin mr-0.5" />
                  Creating...
                </>
              ) : (
                'Completed'
              )
            ) : (
              'Next'
            )}
            {!isLastStep && <ChevronRight className="ml-1 h-4 w-4" />}
          </span>
        </Button>
      </div>
    </div>
  );
};

export default MultiStepForm;
