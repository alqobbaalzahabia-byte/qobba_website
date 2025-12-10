"use client";

import React from "react";
import Link from "next/link";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-yellow-100 flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-1/4 w-2 h-2 bg-yellow-200 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-1/3 w-1.5 h-1.5 bg-yellow-300 rounded-full animate-pulse"></div>
        <div className="absolute bottom-32 left-1/3 w-2 h-2 bg-orange-200 rounded-full animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-yellow-200 rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/3 w-1.5 h-1.5 bg-orange-300 rounded-full animate-pulse"></div>

        <svg
          className="absolute top-32 left-1/4 w-8 h-8 text-yellow-400 animate-pulse"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 0l2.5 9.5L24 12l-9.5 2.5L12 24l-2.5-9.5L0 12l9.5-2.5z" />
        </svg>
        <svg
          className="absolute top-24 right-1/4 w-6 h-6 text-yellow-300 animate-pulse"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 0l2.5 9.5L24 12l-9.5 2.5L12 24l-2.5-9.5L0 12l9.5-2.5z" />
        </svg>
        <svg
          className="absolute bottom-1/3 left-1/4 w-7 h-7 text-yellow-400 animate-pulse"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 0l2.5 9.5L24 12l-9.5 2.5L12 24l-2.5-9.5L0 12l9.5-2.5z" />
        </svg>
        <svg
          className="absolute top-1/2 right-1/3 w-5 h-5 text-orange-300 animate-pulse"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 0l2.5 9.5L24 12l-9.5 2.5L12 24l-2.5-9.5L0 12l9.5-2.5z" />
        </svg>
      </div>

      <div className="text-center z-10 px-4">
        <div className="mb-8">
          <svg className="w-52 h-64 mx-auto" viewBox="0 0 220 300" fill="none">
            <circle cx="80" cy="15" r="9" fill="#E17D3A" />
            <line x1="80" y1="24" x2="80" y2="48" stroke="#4A4A4A" strokeWidth="4" />
            
            <circle cx="140" cy="15" r="9" fill="#E17D3A" />
            <line x1="140" y1="24" x2="140" y2="48" stroke="#4A4A4A" strokeWidth="4" />

            <ellipse cx="110" cy="70" rx="55" ry="50" fill="#E2D9EC" />
            
            <path d="M 65 55 L 155 55 Q 160 55 160 60 L 160 80 Q 160 88 152 88 L 68 88 Q 60 88 60 80 L 60 60 Q 60 55 65 55 Z" fill="#3FBBCE" />
            
            <ellipse cx="90" cy="69" rx="13" ry="17" fill="white" />
            <ellipse cx="130" cy="69" rx="13" ry="17" fill="white" />

            <rect x="95" y="97" width="30" height="12" fill="#E17D3A" rx="2" />

            <rect x="70" y="109" width="80" height="75" rx="12" fill="#E2D9EC" />
            
            <rect x="95" y="125" width="30" height="45" rx="10" fill="#E17D3A" />
            
            <circle cx="65" cy="118" r="11" fill="#5A5A5A" />
            <circle cx="155" cy="118" r="11" fill="#5A5A5A" />

            <rect x="42" y="118" width="22" height="48" rx="11" fill="#5A5A5A" />
            <rect x="156" y="118" width="22" height="48" rx="11" fill="#5A5A5A" />

            <ellipse cx="53" cy="172" rx="16" ry="12" fill="#3FBBCE" />
            <ellipse cx="167" cy="172" rx="16" ry="12" fill="#3FBBCE" />

            <line x1="43" y1="180" x2="43" y2="190" stroke="#3A3A3A" strokeWidth="3" strokeLinecap="round" />
            <line x1="50" y1="180" x2="50" y2="194" stroke="#3A3A3A" strokeWidth="3" strokeLinecap="round" />
            <line x1="57" y1="180" x2="57" y2="190" stroke="#3A3A3A" strokeWidth="3" strokeLinecap="round" />
            
            <line x1="157" y1="180" x2="157" y2="190" stroke="#3A3A3A" strokeWidth="3" strokeLinecap="round" />
            <line x1="164" y1="180" x2="164" y2="194" stroke="#3A3A3A" strokeWidth="3" strokeLinecap="round" />
            <line x1="171" y1="180" x2="171" y2="190" stroke="#3A3A3A" strokeWidth="3" strokeLinecap="round" />

            <circle cx="90" cy="186" r="9" fill="#5A5A5A" />
            <circle cx="130" cy="186" r="9" fill="#5A5A5A" />

            <rect x="74" y="186" width="32" height="70" rx="16" fill="#D8D0E8" />
            <rect x="114" y="186" width="32" height="70" rx="16" fill="#D8D0E8" />

            <ellipse cx="90" cy="262" rx="22" ry="12" fill="#3FBBCE" />
            <ellipse cx="130" cy="262" rx="22" ry="12" fill="#3FBBCE" />
            
            <path d="M 72 262 Q 70 262 70 265 L 70 272 Q 70 275 73 275 L 107 275 Q 110 275 110 272 L 110 265 Q 110 262 107 262 Z" fill="#3FBBCE" />
            
            <path d="M 112 262 Q 110 262 110 265 L 110 272 Q 110 275 113 275 L 147 275 Q 150 275 150 272 L 150 265 Q 150 262 147 262 Z" fill="#3FBBCE" />
          </svg>
        </div>

        <div className="flex items-center justify-center gap-4 mb-6">
          <span className="text-9xl font-bold" style={{ color: "#FAB000" }}>
            4
          </span>
          <div className="relative">
            <svg className="w-28 h-28" viewBox="0 0 117 95" fill="none">
              <path
                d="M115.154 54.7874C113.226 69.7994 86.1312 78.692 54.6406 74.6446C23.1484 70.5989 -0.817544 55.1475 1.10923 40.1355"
                stroke="#1497B9"
                strokeWidth="2"
                strokeMiterlimit="10"
              >
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0 58.5 47.5"
                  to="360 58.5 47.5"
                  dur="4s"
                  repeatCount="indefinite"
                />
              </path>
              <path
                d="M15.4673 8.93082C25.6131 -2.30359 52.9385 5.84443 76.5023 27.1213C100.066 48.4031 110.944 74.7577 100.801 85.9921"
                stroke="#1497B9"
                strokeWidth="2"
                strokeMiterlimit="10"
              >
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0 58.5 47.5"
                  to="360 58.5 47.5"
                  dur="4s"
                  repeatCount="indefinite"
                />
              </path>
              <path
                d="M19.6033 90.1299C8.37051 79.984 16.5137 52.6587 37.7954 29.0933C59.0755 5.53106 85.4318 -5.34642 96.6662 4.79782"
                stroke="#1497B9"
                strokeWidth="2"
                strokeMiterlimit="10"
              >
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0 58.5 47.5"
                  to="360 58.5 47.5"
                  dur="4s"
                  repeatCount="indefinite"
                />
              </path>
              <circle
                cx="58.1359"
                cy="47.4628"
                r="45"
                fill="url(#paint0_linear)"
              />
              <path
                d="M96.6662 4.79785C107.899 14.9421 99.7526 42.2674 78.4741 65.8313C57.1923 89.3951 30.8377 100.273 19.6033 90.1299"
                stroke="#1497B9"
                strokeWidth="2"
                strokeMiterlimit="10"
              >
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0 58.5 47.5"
                  to="360 58.5 47.5"
                  dur="4s"
                  repeatCount="indefinite"
                />
              </path>
              <path
                d="M1.11084 40.1354C3.04085 25.1234 30.1352 16.2356 61.6258 20.2798C93.1196 24.3255 117.082 39.7753 115.154 54.7889"
                stroke="#1497B9"
                strokeWidth="2"
                strokeMiterlimit="10"
              >
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0 58.5 47.5"
                  to="360 58.5 47.5"
                  dur="4s"
                  repeatCount="indefinite"
                />
              </path>
              <path
                d="M100.801 85.992C90.6567 97.2264 63.3298 89.0816 39.7659 67.7999C16.2005 46.5197 5.32462 20.1635 15.4672 8.93066"
                stroke="#1497B9"
                strokeWidth="2"
                strokeMiterlimit="10"
              >
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0 58.5 47.5"
                  to="360 58.5 47.5"
                  dur="4s"
                  repeatCount="indefinite"
                />
              </path>
              <circle
                opacity="0.2"
                cx="38.5108"
                cy="37.9179"
                r="4.15"
                fill="white"
              />
              <circle
                opacity="0.2"
                cx="62.07"
                cy="61.4786"
                r="4.15"
                fill="white"
              />
              <circle
                opacity="0.2"
                cx="71.1336"
                cy="21.6074"
                r="6.4"
                fill="white"
              />
              <defs>
                <linearGradient
                  id="paint0_linear"
                  x1="39.7988"
                  y1="15.2511"
                  x2="73.4354"
                  y2="81.5704"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#FFCE8A" />
                  <stop offset="1" stopColor="#FFA742" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className="text-9xl font-bold" style={{ color: "#FAB000" }}>
            4
          </span>
        </div>

        <h1
          className="text-4xl font-bold mb-4 italic"
          style={{ color: "#222222" }}
        >
          PAGE NOT FOUND
        </h1>

        <p className="text-xl italic mb-8" style={{ color: "#797979" }}>
          Oops! This robot couldn't find your page
        </p>
        
        <Link
          href="/"
          className="px-8 py-3 inline-block bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-white font-semibold rounded-full hover:from-yellow-500 hover:to-yellow-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;