import React from 'react';
import { RiRobot3Line } from 'react-icons/ri';
import { LuZap } from 'react-icons/lu';
import { CiEdit } from 'react-icons/ci';
import { MdOutlineAddShoppingCart } from 'react-icons/md';
import Link from 'next/link';

type Props = {};

const Features = (props: Props) => {
  const coreFeatures = [
    {
      id: 1,
      icon: <RiRobot3Line className="themeColor text-[30px] sm:text-[40px]" />,
      title: 'AI Sales Agents',
      description:
        'Deploy intelligent AI agents to conduct dynamic sales conversations and qualify leads automatically.',
    },
    {
      id: 2,
      icon: <LuZap className="themeColor text-[30px] sm:text-[40px]" />,
      title: 'Automated Webinars',
      description:
        'Host engaging, pre-recorded or AI-driven webinars that run on autopilot, anytime, anywhere.',
    },
    {
      id: 3,
      icon: (
        <MdOutlineAddShoppingCart className="themeColor text-[30px] sm:text-[40px]" />
      ),
      title: 'Sell Products Directly',
      description:
        'Seamlessly integrate and sell your products directly within your automated webinars.',
    },
    {
      id: 4,
      icon: <CiEdit className="themeColor text-[30px] sm:text-[40px]" />,
      title: 'Customizable AI',
      description:
        "Tailor your AI agents' scripts and behavior with easy-to-use prompt customization.",
    },
  ];

  return (
    <div className="flex flex-col items-center py-16 px-4">
      <div className="text-center mb-6 max-w-2xl">
        <h2 className="text-3xl font-bold text-white mb-2 ubuntu-medium">
          Features
        </h2>
        <p className="text-gray-300 text-sm opacity-70">
          Discover the powerful capabilities that drive your sales forward
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl">
        {coreFeatures.map((feature) => (
          <div key={feature.id} className="animated-border-wrapper">
            <div className="bg-[#000000ce] flex flex-col h-full items-center text-center p-4 sm:p-6 rounded-lg">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-md sm:text-xl font-semibold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-300 text-md sm:text-sm">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
      <Link
        href="/#workflow"
        className="flex items-center px-20 py-1 sm:py-1.5 2xl:py-2 mt-8 border-[0.1rem] border-[#2c8c88] rounded-lg themeBg hoverthemeBg cursor-pointer"
      >
        How to Use
      </Link>
    </div>
  );
};

export default Features;
