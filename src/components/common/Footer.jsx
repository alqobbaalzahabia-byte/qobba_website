'use client'

import { useState, useEffect } from "react";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from '@/app/i18n/client'
import { supabase } from '@/lib/supabase'
import mainLogo from '@/../public/assets/main-logo.svg';
import { toast } from 'react-toastify';

const icons = { facebook: <FaFacebookF />, instagram: <FaInstagram />, twitter: <FaXTwitter /> };

const Footer = ({ lng = 'ar' }) => {
  const { t } = useTranslation(lng)
  const sections = t('footer.sections', { returnObjects: true });  
  const footerSections = Array.isArray(sections) ? sections : [];
  const [socialLinks, setSocialLinks] = useState([]);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('social_links').select('*').limit(1).single();
      if (data) {
        setSocialLinks(
          Object.keys(data)
            .filter(k => k !== 'id' && k !== 'created_at' && data[k])
            .map(platform => ({ platform, url: data[platform], icon: icons[platform] }))
        );
      }
    })();
  }, []);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    
    // Validate email
    if (!email || !email.includes('@')) {
      toast.error(lng === 'ar' ? 'الرجاء إدخال بريد إلكتروني صحيح' : 'Please enter a valid email');
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase
        .from('subscribers')
        .insert([
          { 
            email: email,
            subscribed_at: new Date().toISOString(),
            is_active : true,
          }
        ])
        .select();

      if (error) {
        if (error.code === '23505') {
          toast.error(lng === 'ar' ? 'هذا البريد الإلكتروني مسجل بالفعل' : 'This email is already subscribed');
        } else {
          throw error;
        }
      } else {
        toast.success(lng === 'ar' ? 'تم الاشتراك بنجاح!' : 'Successfully subscribed!');
        setEmail('');
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      toast.error(lng === 'ar' ? 'حدث خطأ، يرجى المحاولة مرة أخرى' : 'An error occurred, please try again');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-[linear-gradient(180deg,rgba(243,243,243,1)_0%,rgba(255,249,236,1)_100%)]  overflow-hidden">
      <div className="container mx-auto lg:max-w-[1100px] px-4 sm:px-2 py-4 gap-10 grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 ">
        <div className=" lg:col-span-2 items-center">
          <div className="space-y-4">
            <div className="logo-footer mb-0">
              <Image
                className="w-[111px] h-[111px] object-contain"
                alt="Al qoba"
                src={mainLogo}
                width={111}
                height={111}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <p className="text-sm md:text-[18px] text-[#585858] bg-opacity-60 rounded-lg py-3 leading-7">
              {t('footer.description')}
            </p>
            <h2 className="text-2xl font-semibold pb-5 text-[#585858]">
              {t('footer.newsletterTitle')}
            </h2>
          </div>

          <div className="flex flex-col md:gap-3 md:w-[600px]">
            <div className="flex flex-col gap-3 sm:flex-row relative">
              <input
                id="newsletter-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('footer.newsletterPlaceholder')}
                disabled={isSubmitting}
                className="w-full rounded-xl border border-white/30 bg-[#FFFFFF] px-4 py-3 text-sm text-[#585858] placeholder:text-[#585858]/60 focus:border-white focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                required
              />
              <button
                type="button"
                onClick={handleNewsletterSubmit}
                disabled={isSubmitting}
                className={`${lng === 'ar' ? 'left-0' : 'right-0'} cursor-pointer absolute rounded-xl bg-[#F0A647] px-6 h-full text-sm font-semibold text-white transition hover:bg-[#e8952f] disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isSubmitting ? (lng === 'ar' ? 'جاري الإرسال...' : 'Sending...') : t('footer.newsletterButton')}
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-10  lg:pt-[100px] ">
          <div className="links flex gap-9 w-full ">
            {footerSections.map((section) => {
              const links = section.links ?? [];
              return (
                <div key={section.title} className="  sm:min-w-[250px] lg:min-w-[150px] space-y-4">
                  <p className="text-[20px] font-semibold">{section.title}</p>
                  <ul className="space-y-2 text-[18px] text-[#585858]/80">
                    {links.map((link, index) => (
                      <li key={index}>
                        <Link href={section.href[index]} scroll={true} className="transition hover:text-[#585858]">
                          {link}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>

        </div>
      </div>
      <div className="border-b border-white/10">
      </div>
      <div className="container mx-auto lg:max-w-[1100px] px-4 sm:px-2 py-4">
        <div className="ml-auto flex justify-between items-center gap-4 text-sm  ">
          <p className={`${lng === 'ar' ? '-order-8' : ''}`}>{t('footer.copyright')}</p>
          <div className="flex items-center gap-4">
            {socialLinks.map(({ platform, url, icon }) => (
              <a
                key={platform}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border bg-[#F0A647] text-white border-white/30 p-2 transition hover:border-white hover:text-[#F0A647] hover:bg-gray-200"
              >
                <span className="sr-only">{platform}</span>
                {icon}
              </a>
            ))}
          </div>
        </div>
      </div>

    </footer>
  );
};

export default Footer;