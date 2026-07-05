import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Outlet } from "react-router";
import { Footer } from "@/components/footer";

export function Admin() {
  return (
    <SidebarProvider>
      <AppSidebar role="admin" />
      <main className="flex-1 w-full flex flex-col h-screen overflow-y-auto bg-background text-foreground">
        <div className="p-4 md:p-8 flex-1">
          <div className="mb-6 flex items-center">
            <SidebarTrigger className="mr-4" />
          </div>
          
          <Outlet />

        </div>
        <Footer />
      </main>
    </SidebarProvider>
  );
}
