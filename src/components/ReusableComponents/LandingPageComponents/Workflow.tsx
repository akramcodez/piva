import React from 'react';
import {
  FiUserPlus,
  FiCreditCard,
  FiBox,
  FiCalendar,
  FiVideo,
} from 'react-icons/fi';
import { RiRobot3Line } from 'react-icons/ri';
import Link from 'next/link';

const Workflow = () => {
  const workflowSteps = [
    {
      id: 1,
      icon: <FiUserPlus size={20} className="themeColor" />,
      title: 'Sign Up',
      description: 'Create a free account in seconds',
    },
    {
      id: 2,
      icon: <FiCreditCard size={20} className="themeColor" />,
      title: 'Connect Demo Stripe',
      description:
        'Link your Demo Stripe account (It is not real stripe integration)',
    },
    {
      id: 3,
      icon: <FiBox size={20} className="themeColor" />,
      title: 'Create Products',
      description: 'Add products or services to sell',
    },
    {
      id: 4,
      icon: <FiCalendar size={20} className="themeColor" />,
      title: 'Schedule Webinar',
      description: 'Set up "Buy Now" or "Book a Call" webinars',
    },
    {
      id: 5,
      icon: <FiVideo size={20} className="themeColor" />,
      title: 'Webinar Starts',
      description: 'Automated session guides to purchase',
    },
    {
      id: 6,
      icon: <RiRobot3Line size={20} className="themeColor" />,
      title: 'AI Agent',
      description: 'Personalized interaction for bookings',
    },
  ];

  return (
    <div className="flex flex-col items-center py-16 px-4">
      <div className="text-center mb-6 max-w-2xl">
        <h2 className="text-3xl font-bold text-white mb-2 ubuntu-medium">
          How It Works
        </h2>
        <p className="text-gray-300 text-sm opacity-70">
          Transform your business with our streamlined workflow
        </p>
      </div>

      <div className="max-w-5xl w-full flex-1 flex items-center justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
          {workflowSteps.map((step) => (
            <div key={step.id} className="group h-full">
              <div className="relative glassBackground themeBorderBig border rounded-lg p-4 h-full transition-all duration-300 group-hover:transform group-hover:scale-105 group-hover:shadow-xl">
                <div className="absolute top-[1px] right-[1px] w-8 h-8 rounded-full themeColor flex items-center justify-center shadow-lg">
                  <span className="themeColor font-bold text-sm">
                    {step.id}
                  </span>
                </div>

                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 rounded-lg themeBgLight themeBorderBig border flex items-center justify-center mr-3 transition-all duration-300 group-hover:scale-110">
                    {step.icon}
                  </div>
                  <h3 className="text-base font-bold text-white ubuntu-medium">
                    {step.title}
                  </h3>
                </div>

                <p className="text-gray-300 text-sm leading-relaxed opacity-70">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Link
        href="https://x.com/akramcodez/status/1948605620090720565"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center px-20 py-1 sm:py-1.5 2xl:py-2 mt-8 border-[0.1rem] border-[#2c8c88] rounded-lg themeBg hoverthemeBg cursor-pointer"
      >
        Watch Tutorial
      </Link>
    </div>
  );
};

export default Workflow;
