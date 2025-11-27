// 'use client'
import React from "react";
import Button from '@/components/ui/Button'
import Image from 'next/image'
import MainLogo from '@/../public/assets/main-logo.svg'
import appStoreIcon from '@/../public/assets/app-store-icon.svg'
import playStoreIcon from '@/../public/assets/play-store-icon.svg'
import QrCodeIcon from '@/../public/assets/qr-code.svg'
import OverlayRight from '@/../public/assets/overlay-right.png'
import ArrowIcon from '@/../public/assets/arrow-icon.png'
import ProtectIcon from '@/../public/assets/protect-icon.png'
import overlayEarth from '@/../public/assets/overlay-earth1.png'
import femaleRobotHead from '@/../public/assets/female-robot.svg'
import phoneIcon from '@/../public/assets/phone.svg'
import downloadArrow from '@/../public/assets/download-arrow.svg'
const HeroSection = ({ t, lng }) => {
  const appStoreButtons = [
    {
      type: "appstore",
      topText: t('app.appStore.available'),
      bottomText: t('app.appStore.name'),
      icon: appStoreIcon,
      iconClasses: "top-2 left-1.5 w-[35px] h-[35px]",
    },
    {
      type: "playstore",
      topText: t('app.playStore.available'),
      bottomText: t('app.playStore.name'),
      icon: playStoreIcon,
      iconClasses: "w-[18.67%] h-[64.35%] top-[17.83%] left-[5.46%]",
    },
  ];

  return (
    <div className="hero-section relative  w-full  h-[800px]  overflow-hidden ">
      <section className="relative w-full h-full">
        <div className="overlay-clip-path w-full flex absolute top-0 left-0">
          <Image src={OverlayRight} alt="Overlay right" className="w-1/2 h-[727px] object-cover scale-x-[-1] opacity-[0.1]" />
          <Image src={OverlayRight} alt="Overlay right" className="w-1/2 h-[727px] object-cover opacity-[0.1]" />
        </div>
        <div className="hero-content gap-5 sm:gap-20 md:gap-30 px-2 md:px-0 z-20 container mx-auto h-full flex flex-col items-center  relative pt-10 ">
          <div className="box-1 sticky z-9">
            <div className="logo-icons">
              <Image
                className="absolute top-[15%] right-[10%] sm:top-[15%] sm:right-[5%] w-[60px] sm:w-[99px] h-[90px]  sm:h-[99px] translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:400ms]"
                alt="Group"
                src={ArrowIcon}
                width={60}
                height={50}
              />

              <Image
                className="absolute top-[18%] left-[1%] sm:top-[20%] sm:left-[5%] w-[80px] sm:w-[130px] h-[70px] sm:h-[120px] translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:400ms]"
                alt="Group"
                src={ProtectIcon}
                width={80}
                height={70}
              />
            </div>

            <div className="main-logo flex justify-center mb-3">
              <Image
                className=" w-[199px] h-[189px] translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:200ms]"
                alt="Al qoba logo-middel"
                src={MainLogo}
              />
            </div>

            <h1 className="hero-title md:w-[680px] h-[59px] pb-2  flex items-end justify-center  font-normal text-transparent text-[32px] text-center tracking-[0] leading-[normal]  translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:600ms]">
              <span className="font-bold text-[#572b0a]">
                {(() => {
                  const title = t('hero.title');
                  const parts = title.split(' ');
                  return parts.map((word, index) => (
                    <React.Fragment key={index}>
                      {index == 1 ? (
                        <span className="text-[#f0a647]">{word}</span>
                      ) : (
                        word
                      )}
                      <span> </span>
                    </React.Fragment>
                  ));
                })()}
              </span>
            </h1>

            <p className="hero-subtitle pb-5 sm:pb-0 md:w-[680px] font-blod text-[#636363] text-[20px] text-center tracking-[0] leading-[2]  translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:800ms]">
              {t('hero.subtitle')}
            </p>
          </div>
          <div className="box-2 w-full">
            <div className="download-app h-[199px] px-5 sm:px-0 lg:px-3 [-55px] left-0 w-full opacity-0 translate-y-[-1rem] animate-fade-in [--animation-delay:400ms]">
              <div className="relative container lg:max-w-[1150px] mx-auto">
                {/* Overlay earth */}
                <div className="overlay-earth">
                  <Image
                    className="absolute top-[-60%] sm:top-[-80%] lg:top-[-80%] left-1/2 -translate-x-1/2 sm:w-[80%] md:w-[100%] lg:w-[100%] h-[100%] object-contain md:object-cover"
                    alt="Overlay earth"
                    src={overlayEarth}
                  
                  />
                </div>
                {/* Background gradient overlay  */}
                <div className="absolute left-0 w-full h-[175px] sm:h-[199px]  rounded-[28px] bg-[radial-gradient(circle_at_center,#FFF8EC_0%,#FAC675_100%)]"></div>
                {/* Clip path arrow */}
                <div className="clip-path-arrow h-full">
                  <Image
                    className="absolute w-[19.88%] h-full right-0 object-cover"
                    alt="Decorative element"
                    src={downloadArrow}
                    width={100}
                    height={100}
                  />

                  <Image
                    className="absolute w-[19.88%] h-full left-0 object-cover rotate-180"
                      alt="Decorative element"
                    src={downloadArrow}
                    width={100}
                    height={100}
                  />
                </div>

                {/* Download app content */}
                <div className="relative sm:h-[199px] flex items-center justify-around flex-row-reverse gap-2 px-4 sm:pt-[25px] ">
                  {/* Left Box */}
                  <div className=" hidden md:flex items-center justify-center  relative top-3 flex-1 max-w-[490px] sm:h-[150px]  h-[175px] rounded-[28px] ">
                    <div className="w-full h-full flex items-center justify-center ">
                      <p className={`relative flex-1 z-10 font-exo font-medium text-[#585858] text-base lg:text-xl leading-7 tracking-[0]  ${lng === 'ar' ? 'text-right -left-1 ' : 'text-left'}`}>
                        {t('app.title')}
                      </p>
                      <div className="feature-image flex-1 relative h-full lg:min-w-[220px]">
                        <Image  src={phoneIcon}
                          className={`absolute z-5 -top-[67px]  sm:w-[240px] md:w-[178px] h-[218px] object-cover ${lng === 'ar' ? 'scale-x-100 sm:left-[-40%] md lg:-left-[15%]' : 'scale-x-[-1] md:left-[45%] lg:left-[55%]'}`}
                          alt="Phone icon"
                          width={240}
                          height={218}
                        />
                        <Image  src={femaleRobotHead}
                          className={`absolute z-0 bottom-0 right-[9px] w-[164px] h-[164px] object-cover scale-x-[-1] ${lng === 'ar' ? 'scale-x-[1]' : 'scale-x-[-1]'}`}
                          alt="Female robot head"
                          width={164}
                          height={164}
                        />


                   
                      </div>

                    </div>
                  </div>

                  {/* Middle - QR Code */}
                  <div className="hidden md:flex items-center justify-center px-0 ">
                    <Image
                      className="w-[118px] h-[118px]"
                      alt="Qr code"
                      src={QrCodeIcon}
                      width={118}
                      height={118}
                    />
                  </div>

                  {/* Right Box */}
                  <div className="relative flex-1 max-w-[490px] sm:h-[150px] h-[175px] rounded-[28px] flex flex-col items-center justify-center gap-4">
                    <h2 className="font-exo font-bold text-[#172436] text-[24px] sm:text-[30px] md:text-[24px] lg:text-[34px] leading-[normal] tracking-[0]  text-center">
                      {t('app.download')}
                    </h2>

                    <div className="w-full max-w-[334px] h-[54px] flex gap-2 pt-2">
                      {appStoreButtons.map((button, index) => (
                        <Button
                          key={button.type}
                          variant="ghost"
                          className="cursor-pointer flex gap-3 bg-[#4F4F4F] rounded-[15px] relative h-[54px] p-0 flex-1 hover:opacity-80 transition-opacity overflow-hidden"
                        >
                          <div className="app-text flex flex-col ">
                            <div
                              className={`font-normal flex ${lng === 'ar' ? 'justify-end' : 'justify-start'} text-white  text-[8px] tracking-[0] leading-[normal]`}
                            >
                              {button.topText}
                            </div>

                            <div
                              className={` [font-family:'Poppins',Helvetica] font-normal text-white tracking-[0] leading-[normal]`}
                            >
                              {button.bottomText}
                            </div>
                          </div>
                          <Image
                            className={`${lng === 'ar' ? '' : 'order-[-5]'} ${button.iconClasses}`}
                            alt={`${button.type} icon`}
                            src={button.icon}
                            width={100}
                            height={100}
                          />
                        </Button>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>

        </div>

      </section>


    </div>
  );
};

export default HeroSection;

