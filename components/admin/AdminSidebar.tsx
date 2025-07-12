import Link from "next/link";
import {
  Users,
  RefreshCw,
  MessageSquare,
  BarChart3,
  Shield,
} from "lucide-react";

interface AdminSidebarProps {
  activePage: "dashboard" | "users" | "swaps" | "message";
  onClose?: () => void;
}

export default function AdminSidebar({
  activePage,
  onClose,
}: AdminSidebarProps) {
  const getLinkClasses = (page: string) => {
    const isActive = activePage === page;
    return `flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
      isActive
        ? "text-blue-700 bg-blue-50 border border-blue-200"
        : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
    }`;
  };

  const handleLinkClick = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <aside className="w-64 border-r border-gray-200 h-screen sticky top-0 bg-white/80 backdrop-blur-sm shadow-lg lg:block">
      <div className="p-4 lg:p-6">
        {/* Desktop Header - Hidden on mobile since we have mobile header */}
        <div className="hidden lg:flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Admin Panel</h2>
            <p className="text-xs text-gray-500">SkillSwap Management</p>
          </div>
        </div>

        <nav className="space-y-2">
          <Link
            href="/admin"
            className={getLinkClasses("dashboard")}
            onClick={handleLinkClick}
          >
            <BarChart3 className="w-5 h-5" />
            Dashboard
          </Link>
          <Link
            href="/admin/users"
            className={getLinkClasses("users")}
            onClick={handleLinkClick}
          >
            <Users className="w-5 h-5" />
            Manage Users
          </Link>
          <Link
            href="/admin/swaps"
            className={getLinkClasses("swaps")}
            onClick={handleLinkClick}
          >
            <RefreshCw className="w-5 h-5" />
            Monitor Swaps
          </Link>
          <Link
            href="/admin/message"
            className={getLinkClasses("message")}
            onClick={handleLinkClick}
          >
            <MessageSquare className="w-5 h-5" />
            Send Message
          </Link>
        </nav>
      </div>
    </aside>
  );
}
