"use client";

import { useState, useEffect } from "react";
import AdminSidebar from "./AdminSidebar";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGSAP } from "@/hooks/useGSAP";

interface AdminLayoutProps {
  children: React.ReactNode;
  activePage: "dashboard" | "users" | "swaps" | "message";
}

export default function AdminLayout({
  children,
  activePage,
}: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { elementRef, animateIn } = useGSAP();

  // Animate content when component mounts
  useEffect(() => {
    animateIn({ delay: 0.2 });
  }, [animateIn]);

  // Animate sidebar when it opens/closes
  useEffect(() => {
    if (typeof window !== "undefined" && window.gsap) {
      const sidebarElement = document.querySelector(".mobile-sidebar");
      if (sidebarElement) {
        if (sidebarOpen) {
          window.gsap.fromTo(
            sidebarElement,
            {
              x: -300,
              opacity: 0,
            },
            {
              x: 0,
              opacity: 1,
              duration: 0.3,
              ease: "power2.out",
            }
          );
        } else {
          window.gsap.to(sidebarElement, {
            x: -300,
            opacity: 0,
            duration: 0.3,
            ease: "power2.in",
          });
        }
      }
    }
  }, [sidebarOpen]);

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100"
      ref={elementRef}
    >
      {/* Mobile Header */}
      <div className="lg:hidden bg-white/90 backdrop-blur-sm border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Admin Panel</h2>
              <p className="text-xs text-gray-500">SkillSwap Management</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden"
          >
            {sidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar - Hidden on mobile, shown on desktop */}
        <div
          className={`${
            sidebarOpen ? "block" : "hidden"
          } lg:block fixed lg:relative inset-0 z-50 lg:z-auto`}
        >
          <div
            className="lg:hidden fixed inset-0 bg-black/20"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="lg:hidden fixed left-0 top-0 h-full w-64 bg-white shadow-lg mobile-sidebar">
            <AdminSidebar
              activePage={activePage}
              onClose={() => setSidebarOpen(false)}
            />
          </div>
          <div className="hidden lg:block">
            <AdminSidebar activePage={activePage} />
          </div>
        </div>

        {/* Main Content */}
        <section className="flex-1 p-4 lg:p-8 space-y-6 lg:space-y-8 w-full">
          {children}
        </section>
      </div>
    </div>
  );
}
