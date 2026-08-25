import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import BottomNav from "./BottomNav";

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-surface-container-low">
      <Sidebar />
      <div className="md:ml-sidebar-width flex flex-col min-h-screen">
        <Topbar />
        <main className="flex-1 p-md md:p-lg pb-24 md:pb-lg max-w-container-max w-full mx-auto">{children}</main>
      </div>
      <BottomNav />
    </div>
  );
}
