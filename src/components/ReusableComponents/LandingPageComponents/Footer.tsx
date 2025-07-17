import React from 'react';
import Link from 'next/link';
import { FaXTwitter, FaLinkedinIn, FaGithub } from 'react-icons/fa6'; // Assuming you have these icons installed

type Props = {};

const Footer = (props: Props) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="glassBackground text-gray-300 py-5 px-4 border-t-[1px] border-t-gray-700">
      <div className="container mx-auto flex flex-col items-center text-center">
        {/* Logo or Site Title */}
        <div className="mb-6">
          <Link
            href="/"
            className="text-2xl font-bold text-white ubuntu-medium"
          >
            PIVA
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="mb-6">
          <ul className="flex flex-wrap justify-center gap-x-3 sm:gap-x-6 sm:gap-y-3 text-sm sm:text-base">
            <li>
              <Link
                href="/#home"
                className="hover:text-white transition-colors"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/#features"
                className="hover:text-white transition-colors"
              >
                Features
              </Link>
            </li>
            <li>
              <Link
                href="/#workflow"
                className="hover:text-white transition-colors"
              >
                Workflow
              </Link>
            </li>
            <li>
              <Link
                href="/#about"
                className="hover:text-white transition-colors"
              >
                About
              </Link>
            </li>
          </ul>
        </nav>

        {/* Social Media Links */}
        <div className="flex gap-6 mb-6">
          {/* Replace href with your actual profile links */}
          <Link
            href="https://x.com/akramcodez"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors"
          >
            <FaXTwitter size={24} />
          </Link>
          <Link
            href="https://www.linkedin.com/in/akramcodez/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors"
          >
            <FaLinkedinIn size={24} />
          </Link>
          <Link
            href="https://github.com/akramcodez"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors"
          >
            <FaGithub size={24} />
          </Link>
        </div>

        {/* Copyright */}
        <p className="text-sm opacity-70">
          &copy; {currentYear} Piva. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
