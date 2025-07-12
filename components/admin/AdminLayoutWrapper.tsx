import AdminProtected from "./AdminProtected";
import AdminLayout from "./AdminLayout";

interface AdminLayoutWrapperProps {
  children: React.ReactNode;
  activePage: "dashboard" | "users" | "swaps" | "message";
}

export default function AdminLayoutWrapper({
  children,
  activePage,
}: AdminLayoutWrapperProps) {
  return (
    <AdminProtected>
      <AdminLayout activePage={activePage}>{children}</AdminLayout>
    </AdminProtected>
  );
}
