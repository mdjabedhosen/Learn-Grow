"use client";
import React from "react";
import { FaFacebookF, FaLinkedinIn, FaInstagram, FaYoutube } from "react-icons/fa";
import { MdLocationOn, MdEmail } from "react-icons/md";
import { FaWhatsapp } from "react-icons/fa";
import Image from "next/image";
import NextLink from "next/link";
import Link from "next/link";

import Logo from "@/public/logo.png";
import { siteConfig } from "@/config/site";
import { LearnGrowBrand } from "@/components/LearnGrowBrand";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-200">
      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-10 border-b border-gray-700">
          {/* Column 1: Logo & Description */}
          <div className="lg:col-span-1 space-y-4">
            <NextLink className="inline-block group select-none" href="/" title="Learn & Grow Home">
              <LearnGrowBrand className="h-5 sm:h-7 w-auto text-white group-hover:text-blue-400 transition-colors" />
            </NextLink>
            <p className="text-sm text-gray-400">
              Empowering students with quality education in Programming, Robotics, Math, and Science.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  className="hover:text-blue-400 transition-colors"
                  href="/courses"
                >
                  All Courses
                </Link>
              </li>
              <li>
                <Link
                  className="hover:text-blue-400 transition-colors"
                  href="/blog"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  className="hover:text-blue-400 transition-colors"
                  href="/events"
                >
                  Events & Workshops
                </Link>
              </li>
              <li>
                <Link
                  className="hover:text-blue-400 transition-colors"
                  href="/faq"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: About */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              About
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  className="hover:text-blue-400 transition-colors"
                  href="/about"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  className="hover:text-blue-400 transition-colors"
                  href="/team"
                >
                  Our Team
                </Link>
              </li>
              <li>
                <Link
                  className="hover:text-blue-400 transition-colors"
                  href="/careers"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  className="hover:text-blue-400 transition-colors"
                  href="/press"
                >
                  Press & Media
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal & Policies */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              Legal & Policies
            </h3>
            <ul className="space-y-3 text-sm">
               <li>
                <Link
                  className="hover:text-blue-400 transition-colors"
                  href="/contact"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  className="hover:text-blue-400 transition-colors"
                  href="/certificate/verify"
                >
                  Verify Certificate
                </Link>
              </li>
              <li>
                <Link
                  className="hover:text-blue-400 transition-colors"
                  href="/privacy-policy"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  className="hover:text-blue-400 transition-colors"
                  href="/terms-of-use"
                >
                  Terms and Conditions
                </Link>
              </li>
              <li>
                <Link
                  className="hover:text-blue-400 transition-colors"
                  href="/refund-policy"
                >
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Contact */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              Contact
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <MdLocationOn className="text-blue-400 text-lg mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 font-medium">Dhaka, Bangladesh</p>
                  <p className="text-gray-400 text-xs">100% Online Live Academy</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <MdEmail className="text-blue-400 text-lg mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-400 text-xs mb-0.5">Email:</p>
                  <a
                    href="mailto:info@learnandgrow.io"
                    className="hover:text-blue-400 transition-colors"
                  >
                    info@learnandgrow.io
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <FaWhatsapp className="text-green-400 text-lg mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-400 text-xs mb-0.5">WhatsApp Helpline:</p>
                  <a
                    href="https://wa.me/8801706276447"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-green-400 transition-colors font-medium"
                  >
                    +880 1706-276447
                  </a>
                  <p className="text-[11px] text-gray-400 mt-0.5">10 AM - 6 PM (Sat-Thu)</p>
                </div>
              </div>
            </div>
            {/* Social Media Icons */}
            <div className="flex gap-3 pt-2">
              <Link
                aria-label="Facebook"
                className="text-gray-400 hover:text-blue-500 transition-colors"
                href={siteConfig.links.facebook}
                rel="noopener noreferrer"
                target="_blank"
              >
                <FaFacebookF className="text-lg" />
              </Link>
              <Link
                aria-label="LinkedIn"
                className="text-gray-400 hover:text-blue-400 transition-colors"
                href={siteConfig.links.linkedin}
                rel="noopener noreferrer"
                target="_blank"
              >
                <FaLinkedinIn className="text-lg" />
              </Link>
              <Link
                aria-label="Instagram"
                className="text-gray-400 hover:text-pink-400 transition-colors"
                href={siteConfig.links.instagram}
                rel="noopener noreferrer"
                target="_blank"
              >
                <FaInstagram className="text-lg" />
              </Link>
              <Link
                aria-label="YouTube"
                className="text-gray-400 hover:text-red-500 transition-colors"
                href={siteConfig.links.youtube}
                rel="noopener noreferrer"
                target="_blank"
              >
                <FaYoutube className="text-lg" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Section - Compact */}
        <div className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-400">
          {/* Copyright */}
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>

          <div className="flex items-center gap-4 text-xs text-gray-400">
            <Link href="/privacy-policy" className="hover:text-blue-400 transition-colors">
              Privacy Policy
            </Link>
            <span className="text-gray-600">•</span>
            <Link href="/terms-of-use" className="hover:text-blue-400 transition-colors">
              Terms of Use
            </Link>
            <span className="text-gray-600">•</span>
            <Link href="/refund-policy" className="hover:text-blue-400 transition-colors">
              Refund Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
