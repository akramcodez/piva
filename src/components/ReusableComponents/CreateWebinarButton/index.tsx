'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useWebinarStore } from '@/store/useWebinarStore';
import { Plus } from 'lucide-react';
import MultiStepForm from './MultiStepForm';
import BasicInfoStep from './BasicInfoStep';
import CTAStep from './CTAStep';
import AdditionalInformation from './AdditionalInformation';
import SucessStep from './SucessStep';
import { ClientProduct } from '@/lib/type';
import { Assistant } from '@vapi-ai/server-sdk/api';

type Props = {
  stripeProducts: ClientProduct[] | [];
  assistants: Assistant[] | [];
};

const CreateWebinarButton = ({ stripeProducts, assistants }: Props) => {
  const { isModelOpen, setIsModelOpen, isComplete, setIsComplete, resetForm } =
    useWebinarStore();

  const [webinarLink, setWebinarLink] = useState('');

  const steps = [
    {
      id: 'basicInfo',
      title: 'Basic Information',
      description: 'Standard webinar details',
      component: <BasicInfoStep />,
    },
    {
      id: 'cta',
      title: 'CTA',
      description: "Webinar's customer endpoint",
      component: (
        <CTAStep
          stripeProducts={stripeProducts}
          assistants={assistants}
          isModelOpen={isModelOpen}
          setIsModelOpen={setIsModelOpen}
        />
      ),
    },
    {
      id: 'additionalInfo',
      title: 'Additional Information',
      description: 'Fill Additional Information',
      component: <AdditionalInformation />,
    },
  ];

  const handleComplete = (webinarId: string) => {
    setIsComplete(true);
    setWebinarLink(
      `${process.env.NEXT_PUBLIC_BASE_URL}/live-webinar/${webinarId}`,
    );
  };

  const handleCreateNew = () => {
    resetForm();
  };

  return (
    <Dialog open={isModelOpen} onOpenChange={setIsModelOpen}>
      <DialogTrigger asChild>
        <button
          className="rounded-xl flex gap-2 items-center hover:cursor-pointer px-2 py-1
          border border-border animated-gradient-bg backdrop-blur-sm text-primary
          "
          onClick={() => setIsModelOpen(true)}
        >
          <Plus className="h-4 w-4" />
          <span className="text-base">Webinar</span>
        </button>
      </DialogTrigger>
      <DialogContent className="p-0 bg-transparent border-none w-[95vw] sm:w-[90vw] md:w-[85vw] lg:w-[85vw] xl:w-[85vw] overflow-hidden">
        {isComplete ? (
          <div className="bg-muted text-primary rounded-lg h-full">
            <DialogTitle className="sr-only">Webinar Created</DialogTitle>
            <SucessStep
              webinarLink={webinarLink}
              onCreateNew={handleCreateNew}
            />
          </div>
        ) : (
          <>
            <DialogTitle className="sr-only">Create Webinar</DialogTitle>
            <div className="bg-[#27272A]/20 border border-border rounded-xl h-full backdrop-blur-[106px]">
              <MultiStepForm steps={steps} onComplete={handleComplete} />
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreateWebinarButton;
