import { FaFacebookF } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import Image from "next/image";
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
    <footer className="bg-[#4B381E] text-white ">
      <div className="container mx-auto lg:max-w-[1100px] px-4 sm:px-2 py-4 gap-10 grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 ">
        <div className=" lg:col-span-2 items-center">
          <div className="space-y-4">
            <div className="logo-footer mb-0">
              <Image
                className="w-[111px] h-[111px]"
                alt="Al qoba"
                src={mainLogo}
                width={111}
                height={111}
                quality={90}
              />
            </div>
            <p className="text-sm md:text-[18px] text-white bg-opacity-60 rounded-lg py-3 leading-7">
              {t('footer.description')}
            </p>
            <h2 className="text-2xl font-semibold pb-5 text-white">
              {t('footer.newsletterTitle')}
            </h2>
          </div>

          <form className="flex flex-col md:gap-3 md:w-[600px]">
            <div className="flex flex-col gap-3 sm:flex-row relative">
              <input
                id="newsletter-email"
                type="email"
                placeholder={t('footer.newsletterPlaceholder')}
                className="w-full rounded-xl border border-white/30 bg-transparent px-4 py-3 text-sm text-white placeholder:text-white/60 focus:border-white focus:outline-none"
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
            const links = section.links ??[];
            return (
            <div key={section.title} className="  sm:min-w-[250px] lg:min-w-[150px] space-y-4">
              <p className="text-lg font-semibold">{section.title}</p>
              <ul className="space-y-2 text-sm text-white/80">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="transition hover:text-white">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )})}

          <div className="ml-auto flex flex-col gap-4 text-sm text-white/80 hidden">
            <p>{t('footer.copyright')}</p>
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href="#"
                  className="rounded-full border border-white/30 p-2 transition hover:border-white hover:bg-white/10"
                >
                  <span className="sr-only">{social.label}</span>
                 {social.icon}
                </a>
              ))}
            </div>
          </div>
          </div>

        </div>
      </div>
      <div className="border-b border-white/10">  
      </div>
      <div className="container mx-auto lg:max-w-[1100px] px-4 sm:px-2 py-4">
      <div className="ml-auto flex justify-between items-center gap-4 text-sm text-white/80 ">
            <p className={`${lng === 'ar' ? '-order-8' : ''}`}>{t('footer.copyright')}</p>
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href="#"
                  className="rounded-full border bg-[#F0A647] border-white/30 p-2 transition hover:border-white hover:bg-white/10"
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
  