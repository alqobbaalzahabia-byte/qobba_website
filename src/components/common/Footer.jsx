import { FaFacebookF } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import Image from "next/image";
import Link from "next/link";
import mainLogo from '@/../public/assets/main-logo.svg';

const socialLinks = [
  { label: 'facebook', icon: <FaFacebookF /> },
  { label: 'instagram', icon: <FaInstagram /> },
  { label: 'twitter', icon: <FaXTwitter /> },
];

const Footer = ({ t = (key) => key, lng = 'ar' }) => {
  const sections = t('footer.sections', { returnObjects: true });  
  const footerSections = Array.isArray(sections) ? sections : [];
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
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw)"
              />
            </div>
            <p className="text-sm md:text-[18px] text-[#585858] bg-opacity-60 rounded-lg py-3 leading-7">
              {t('footer.description')}
            </p>
            <h2 className="text-2xl font-semibold pb-5 text-[#585858]">
              {t('footer.newsletterTitle')}
            </h2>
          </div>

          <form className="flex flex-col md:gap-3 md:w-[600px]">
            <div className="flex flex-col gap-3 sm:flex-row relative">
              <input
                id="newsletter-email"
                type="email"
                placeholder={t('footer.newsletterPlaceholder')}
                className="w-full rounded-xl border border-white/30 bg-[#FFFFFF] px-4 py-3 text-sm text-[#585858] placeholder:text-[#585858]/60 focus:border-white focus:outline-none"
              />
              <button
                type="submit"
                className={`${lng === 'ar' ? 'left-0' : 'right-0'} cursor-pointer absolute rounded-xl bg-[#F0A647] px-6 h-full text-sm font-semibold text-white transition hover:bg-[#e8952f]`}
              >
                {t('footer.newsletterButton')}
              </button>
            </div>
          </form>
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
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href="#"
                className="rounded-full border bg-[#F0A647] text-white border-white/30 p-2 transition hover:border-white hover:text-[#F0A647] hover:bg-gray-200"
              >
                <span className="sr-only">{social.label}</span>
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
