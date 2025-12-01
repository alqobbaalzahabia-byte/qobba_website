import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { languages, fallbackLng } from "./i18n/settings";
import { headers } from "next/headers";
import { Suspense } from "react";
import localFont from 'next/font/local'
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
// fonts (cairo and expo arabic )
const cairoFont = localFont({
  src: [
    {
      path: '../../public/fonts/Cairo-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Cairo-Bold.ttf',
      weight: '700',
      style: 'bold',
    },
  ],
  variable: '--font-cairo',
})

const exoFont = localFont({
  src: [
    {
      path: '../../public/fonts/Expo Arabic Bold.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Expo Arabic Medium.ttf',
      weight: '500',
      style: 'medium',
    },
  ],
  variable: '--font-exo',
})


export async function generateStaticParams() {
  return languages.map((lng) => ({ lng }))
}

export const metadata = {
  title: "Alqoba Alzahabia",
  description: "Alqoba Alzahabia",
};

export default async function RootLayout({ children }) {
  const headersList = await headers();
  const lng = headersList.get('x-language') || fallbackLng;
  return (
    <html lang={lng} dir={lng === 'ar' ? 'rtl' : 'ltr'} data-scroll-behavior="smooth">
      <body className={`${cairoFont.variable} ${exoFont.variable}  antialiased`}>
        <Suspense fallback={
          <div className=" absolute z-[500] top-0 left-0 w-full h-full flex items-center justify-center min-h-screen bg-[#fdfef9]">
            <div className="text-center">
              <img
                className="w-[199px] h-[189px] mx-auto animate-pulse mb-8"
                alt="Al qoba logo-middel"
                src="https://c.animaapp.com/mi7na5mt3eLZ3h/img/al-qoba-2-2.png"
              />
              <div className="flex justify-center gap-2">
                <div className="w-3 h-3 bg-[#f0a647] rounded-full animate-pulse"></div>
                <div className="w-3 h-3 bg-[#f0a647] rounded-full animate-pulse"></div>
                <div className="w-3 h-3 bg-[#f0a647] rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        }> 
         {/* <Header lng={lng} /> */}
          {children}
          {/* <Footer lng={lng} /> */}
        </Suspense>
      </body>
    </html>
  );
}


