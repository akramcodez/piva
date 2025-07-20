import React from 'react';
import Link from 'next/link';
import { FaXTwitter, FaLinkedinIn, FaGithub } from 'react-icons/fa6';
import Image from 'next/image';

const About = () => {
  return (
    <div className="flex flex-col items-center py-16 px-4">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-white ubuntu-medium">
          About Us
        </h2>
      </div>

      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12 lg:gap-16 max-w-6xl w-full">
        <div className="text-center lg:text-left lg:w-1/2 rounded-lg glassBackground themeBorderBig p-5 sm:p-8 sm:py-10">
          <h3 className="text-xl font-semibold text-white mb-2 sm:mb-4 ubuntu-medium">
            About Piva
          </h3>

          <div className="space-y-4">
            <p className="text-gray-300 text-md sm:text-[17px] leading-relaxed">
              Piva is an AI-powered platform for sales webinars. It automates
              your webinars and uses AI agents to engage prospects effectively.
            </p>
            <p className="text-gray-400 text-md leading-relaxed">
              If you appreciate the work behind this project, consider giving it
              a ⭐ on GitHub:{' '}
              <a
                href="https://github.com/akramcodez/piva"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 underline hover:text-blue-300"
              >
                github.com/akramcodez/piva
              </a>
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center text-center lg:w-1/2">
          <div className="p-5 sm:p-8 rounded-lg glassBackground themeBorderBig w-full">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
              <div className="w-20 h-20  sm:w-24 sm:h-24 rounded-full bg-gray-700 flex items-center justify-center text-gray-400 text-sm overflow-hidden flex-shrink-0">
                <Image
                  src="/profilePic.jpg"
                  alt="SK AKRAM"
                  objectFit="cover"
                  width={96}
                  height={96}
                />
              </div>

              <div className="flex-1 text-center sm:text-left">
                <h4 className="text-xl font-medium text-white mb-2">
                  SK AKRAM
                </h4>
                <p className="text-blue-400 text-sm mb-4">
                  Full-Stack Developer
                </p>

                <p className="text-gray-300 text-xs sm:text-sm leading-relaxed mb-6 opacity-90">
                  18-year-old Full-Stack Web Developer and Computer Science
                  student at Amity University. Specializing in MERN stack
                  development with expertise in backend systems and modern web
                  technologies.
                </p>

                <div className="flex justify-center sm:justify-start gap-4">
                  <Link
                    href="https://x.com/akramcodez"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <FaXTwitter className="text-[20px] sm:text-[24px] " />
                  </Link>

                  <Link
                    href="https://www.linkedin.com/in/akramcodez"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <FaLinkedinIn className="text-[20px] sm:text-[24px] " />
                  </Link>

                  <Link
                    href="https://github.com/akramcodez"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <FaGithub className="text-[20px] sm:text-[24px] " />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
