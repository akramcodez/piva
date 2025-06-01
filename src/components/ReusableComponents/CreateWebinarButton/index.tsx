'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useWebinarStore } from '@/store/useWebinarStore';
import { Plus } from 'lucide-react';
import MultiStepForm from './MultiStepForm';
import BasicInfoStep from './BasicInfoStep';

type props = {};

const CreateWebinarButton = (props: props) => {
  const { isModelOpen, setIsModelOpen, isComplete, setIsComplete } =
    useWebinarStore();

  const [webinarLink, setWebinarLink] = useState('');

  const steps = [
    {
      id: 'basicInfo',
      title: 'Basic Information',
      description: 'Please fill out the standard info needed for your webinar',
      component: <BasicInfoStep />,
    },
  ];

  const handleComplete = (webinarId: string) => {
    setIsComplete(true);
    setWebinarLink(
      `${process.env.NEXT_PUBLIC_BASE_URL}/live-webinar/${webinarId}`,
    );
  };
  return (
    <Dialog open={isModelOpen} onOpenChange={setIsModelOpen}>
      <DialogTrigger asChild>
        <button
          className="rounded-xl flex gap-2 items-center hover:cursor-pointer px-3 py-1.5
        border border-border bg-primary/10 backdrop-blur-sm text-sm font-normal text-primary
        hover:bg-primary-20"
          onClick={() => setIsModelOpen(true)}
        >
          <Plus />
          <span className="text-sm lg:text-md lg:font-semibold">
            Create Webinar
          </span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px] p-0 bg-transparent border-none">
        {isComplete ? (
          <div className="bg-muted text-primary rounded-lg overflow-y-hidden">
            <DialogTitle className="sr-only">Webinar Created</DialogTitle>
            {/* <SucessStep/> */}
          </div>
        ) : (
          <>
            <DialogTitle className="sr-only"></DialogTitle>
            <MultiStepForm steps={steps} onComplete={handleComplete} />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreateWebinarButton;
