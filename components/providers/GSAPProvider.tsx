"use client";

import { useEffect } from "react";

interface GSAPProviderProps {
  children: React.ReactNode;
}

export default function GSAPProvider({ children }: GSAPProviderProps) {
  useEffect(() => {
    // Load GSAP dynamically
    const loadGSAP = async () => {
      if (typeof window !== "undefined" && !window.gsap) {
        try {
          // You can either use CDN or npm package
          // For CDN approach:
          const script = document.createElement("script");
          script.src =
            "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js";
          script.async = true;
          script.onload = () => {
            console.log("GSAP loaded successfully");
          };
          document.head.appendChild(script);
        } catch (error) {
          console.error("Failed to load GSAP:", error);
        }
      }
    };

    loadGSAP();
  }, []);

  return <>{children}</>;
}
