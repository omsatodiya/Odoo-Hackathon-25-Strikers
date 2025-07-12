"use client";

import { useEffect } from "react";
import { useGSAP } from "@/hooks/useGSAP";

export default function DashboardHeader() {
  const { elementRef, animateIn } = useGSAP();

  useEffect(() => {
    animateIn({ delay: 0.1 });
  }, [animateIn]);

  return (
    <div ref={elementRef}>
      <h1 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 mb-2 lg:mb-3">
        Admin Dashboard
      </h1>
      <p className="text-sm lg:text-base text-gray-600">
        Monitor and manage your SkillSwap platform
      </p>
    </div>
  );
}
