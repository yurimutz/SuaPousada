import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Outlet } from "react-router";

export function Admin() {
  return (
    <SidebarProvider>
      <AppSidebar role="admin" />
      <main className="flex-1 w-full overflow-y-auto bg-background text-foreground">
        <div className="p-4 md:p-8">
          <div className="mb-6 flex items-center">
            <SidebarTrigger className="mr-4" />
          </div>
          
          <Outlet />

        </div>
      </main>
    </SidebarProvider>
  );
}
