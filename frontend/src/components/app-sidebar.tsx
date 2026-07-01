import { BedDouble, Calendar, CalendarDays, Home, LogOut, PlusCircle, Settings, User, Users } from "lucide-react"
import { Link } from "react-router"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const adminItems = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: Home,
  },
  {
    title: "Quartos",
    url: "/admin/quartos",
    icon: BedDouble,
  },
  {
    title: "Reservas",
    url: "/admin/reservas",
    icon: Calendar,
  },
  {
    title: "Hóspedes",
    url: "/admin/hospedes",
    icon: Users,
  },
]

const clientItems = [
  {
    title: "Minha conta",
    url: "/conta",
    icon: User,
  },
  {
    title: "Minhas reservas",
    url: "/minhas-reservas",
    icon: CalendarDays,
  },
  {
    title: "Fazer nova reserva",
    url: "/nova-reserva",
    icon: PlusCircle,
  },
  {
    title: "Perfil",
    url: "/perfil",
    icon: Settings,
  },
]

interface AppSidebarProps {
  role?: "admin" | "client"
}

export function AppSidebar({ role = "admin" }: AppSidebarProps) {
  const items = (role === "admin") ? adminItems : clientItems;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <BedDouble className="size-4" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-semibold text-primary text-lg">SuaPousada</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    {/* <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a> */}
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="text-destructive hover:text-destructive hover:bg-destructive/10">
              <Link to="/">
                <LogOut />
                <span>Sair</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
