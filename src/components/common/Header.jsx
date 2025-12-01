'use client'

import React, { useState, useEffect } from "react";
import { useTranslation } from '../../app/i18n/client'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import mainLogo from '@/../public/assets/main-logo.svg'
import ArabicFlag from '@/../public/assets/arabic-flag.svg'
import { IoIosArrowDown } from "react-icons/io";
import { FaCheck } from "react-icons/fa6";
import Button from "../ui/Button";
import { languages as supportedLanguages } from '../../app/i18n/settings';
const Header = ({ lng }) => {
  const { t } = useTranslation(lng);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lng;
  }, [lng]);

  // prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isMobileMenuOpen]);

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'ar', label: 'العربية' }
  ];

  const currentLanguage = languages.find(lang => lang.code === lng) || languages[0];

  const switchLanguage = (newLng) => {
    const segments = pathname.split('/').filter(Boolean);
    const pathWithoutLang = segments.filter(seg => !supportedLanguages.includes(seg)).join(' ');
    const newPath = `/${newLng}${pathWithoutLang ? '/' + pathWithoutLang : ''}`;
    router.push(newPath);
    setIsLanguageDropdownOpen(false);
  };

  // get name of page from path name and check to make this as active link
  const isActive = (path) => {
    const currentPath = pathname.replace(`/${lng}`, '') || '/';
    return currentPath === path;
  };

  const navItems = [
    { label: t('nav.home'), href: `/${lng}`, active: isActive('/') },
    { label: t('nav.services'), href: `/${lng}/#services-section`, active: isActive('/services') },
    { label: t('nav.projects'), href: `/${lng}/#projects-section`, active: isActive('/projects') },
    { label: t('nav.about'), href: `/${lng}/#about-section`, active: isActive('/about') },
    { label: t('nav.blog'), href: `/${lng}/blog`, active: isActive('/blog') },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header
    className="header-section relative w-full h-[90px] md:h-[118px] bg-[linear-gradient(273deg,rgba(255,255,255,1)_0%,rgba(255,246,217,1)_100%)]
    before:content-[''] before:absolute before:left-0 before:bottom-0 before:w-full before:h-[3px] before:bg-gray-500/10"
    >
      <div className="h-full ">
        <div className="container lg:max-w-[1150px] h-full mx-auto flex items-center justify-between flex-row-reverse ">
          {/* Desktop: Left section: Button-Contact /  Switich-Language */}
          <div className="hidden md:flex items-center gap-4 flex-row-reverse ">
            <Link href={`/${lng}/contact`}>
              <Button className="cursor-pointer md:w-[160px] lg:w-[179px] h-12 rounded-[18px] bg-gradient-button hover:opacity-90 transition-opacity">
                <div className=" font-bold text-white md:tex-[16px] lg:text-xl text-center tracking-[0] leading-[normal] whitespace-nowrap ">
                  {t('header.contact')}
                </div>
              </Button>
            </Link>

            <div className="relative">
              <button
                onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                className=" h-[45px]  bg-white rounded-xl flex items-center justify-between gap-1  hover:opacity-90 transition-opacity cursor-pointer"
              >
                <div className="inline-flex items-center justify-center gap-2 lg:px-4 lg:px-3">
                <IoIosArrowDown className={`text-lg text-gray-400 transition-transform duration-200 ${isLanguageDropdownOpen ? 'rotate-180' : ''}`} />

                  <div className="font-medium text-[#7f7f7f] text-lg tracking-[0] leading-[normal] whitespace-nowrap ">
                    {currentLanguage.label}
                  </div>
                  {lng === 'ar' ? (
                    <Image
                      className="w-5 h-5"
                      alt="Arabic"
                      src={ArabicFlag}
                      width={20}
                      height={20}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw)"

                    />
                  ) : null}
                </div>
               
              </button>

              {isLanguageDropdownOpen && (
                <div className="absolute top-full mt-2 right-0 w-[140px] bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => switchLanguage(lang.code)}
                      className={`w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer ${
                        lang.code === lng ? 'bg-[#FAB000]/10 text-[#FAB000] font-bold' : 'text-[#7f7f7f]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {lang.code === 'ar' && (
                          <Image  
                            className="w-5 h-5"
                            alt="Arabic "
                            src={ArabicFlag}
                            width={20}
                            height={20}
                          />
                        )}
                        <div className=" font-medium text-base text-start">
                          {lang.label}
                        </div>
                      </div>
                      {lang.code === lng && (
                        <FaCheck/>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Desktop: Right section: Logo / navigation  */}
          <div className="hidden md:flex navigation flex-row-reverse">
            {/* Navigation */}
            <nav className="flex items-center  lg:mr-9">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className={`flex items-center justify-center h-10 px-4 ${item.active
                    ? "rounded-xl bg-[#FAB000] text-white"
                    : "text-[#868686]"
                    } cursor-pointer hover:opacity-80 transition-opacity`}
                >
                  <div className=" font-medium md:text-[13px] lg:text-lg tracking-[0] leading-[normal] ">
                    {item.label}
                  </div>
                </Link>
              ))}
            </nav>
            {/*  Logo */}
            <div className="flex items-center gap-4 relative -top-[6px]">
              <Image
                className=" w-auto h-auto sm:w-[111px] sm:h-[111px] lg:w-[121px] lg:h-[121px] "
                alt="Al qoba"
                src={mainLogo}
                width={111}
                height={111}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw)"
              />
            </div>
          </div>

          {/* Mobile: Logo  */}
          <div className={`md:hidden w-full flex items-center ${lng === 'ar' ? 'flex-row-reverse' : 'flex-row'} justify-between px-4`}>
            <div className="flex items-center">
              <Image
                className="w-[85px] h-[93px] relative -top-[6px]"
                alt="Al qoba"
                src={mainLogo}
                width={0}
                height={73}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>

            {/* custtom menu button toggle */}
            <button
              onClick={toggleMobileMenu}
              className="cursor-pointer flex flex-col justify-center items-center w-8 h-8 space-y-1.5 focus:outline-none z-50"
              aria-label="Toggle mobile menu"
            >
              <span className={`block w-6 h-0.5 bg-[#585858] transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
              <span className={`block w-6 h-0.5 bg-[#585858] transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`block w-6 h-0.5 bg-[#585858] transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay when user click outside the menu close it */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Sidebar */}
      <div
        className={`md:hidden fixed top-0 right-0 h-full w-80 bg-[linear-gradient(273deg,rgba(255,255,255,1)_0%,rgba(255,246,217,1)_100%)] z-[50] shadow-2xl transition-transform duration-300 ease-out ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header with close button */}
          <div className="flex items-center justify-between p-4 border-b border-[#585858]/20">
            <div>
              <Image
                className="w-[86px] h-[83px]"
                alt="Al qoba"
                src={mainLogo}
                width={80}
                height={73}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw)"

              />
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close mobile menu"
              className="text-3xl text-[#585858] cursor-pointer hover:opacity-80 transition-opacity"
            >
              ×
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 px-6 py-8 overflow-y-auto">
            <ul className="space-y-4">
              {/* Contact Button */}
              <li>
                <Link
                  href={`/${lng}/contact`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="cursor-pointer w-full h-12 rounded-[18px] bg-gradient-button hover:opacity-90 transition-opacity mb-6 flex items-center justify-center"
                >
                  <div className=" font-bold text-white text-xl text-center tracking-[0] leading-[normal] whitespace-nowrap ">
                    {t('header.contact')}
                  </div>
                </Link>
              </li>

              {/* Language Switcher */}
              <li className="mb-6">
                <div className="relative">
                  <button
                    onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                    className="w-full h-[45px] bg-white rounded-xl flex items-center justify-between gap-1 px-2.5 hover:opacity-90 transition-opacity cursor-pointer"
                  >
                    <div className="inline-flex items-center gap-1">
                      {lng === 'ar' ? (
                        <Image
                          className="w-5 h-5"
                          alt="Arabic"
                            src={ArabicFlag}
                            width={20}
                            height={20}
                        />
                      ) : null}
                      <div className=" font-medium text-[#7f7f7f] text-lg tracking-[0] leading-[normal] whitespace-nowrap ">
                        {currentLanguage.label}
                      </div>
                    </div>
                    <IoIosArrowDown className={`text-lg text-gray-400 transition-transform duration-200 ${isLanguageDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isLanguageDropdownOpen && (
                    <div className="absolute top-full mt-2 left-0 right-0 w-full bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50">
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            switchLanguage(lang.code);
                            setIsMobileMenuOpen(false);
                          }}
                          className={`w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer ${
                            lang.code === lng ? 'bg-[#FAB000]/10 text-[#FAB000] font-bold' : 'text-[#7f7f7f]'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {lang.code === 'ar' && (
                              <Image
                                className="w-5 h-5"
                                alt="Arabic"
                                src={ArabicFlag}
                                width={20}
                                height={20}
                              />
                            )}
                            <div className=" font-medium text-base text-start">
                              {lang.label}
                            </div>
                          </div>
                          {lang.code === lng && (
                            <FaCheck/>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </li>

              {/* Navigation Items */}
              {navItems.map((item, index) => (
                <li key={index} className="mb-0">
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block  font-medium text-xl py-3 px-4 rounded-lg transition-all duration-200 cursor-pointer ${
                      item.active
                        ? 'bg-[linear-gradient(90deg,rgba(255,248,236,1)_0%,rgba(255,237,209,1)_100%)] text-[#585858]'
                        : 'text-[#868686] hover:bg-white/50'
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;

