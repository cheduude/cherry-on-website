import { NavLink } from "react-router-dom"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Key,
  CreditCard,
  User,
  Users,
  LifeBuoy
} from "lucide-react"

const links = [
  { to: "/cabinet", label: "Dashboard", icon: LayoutDashboard },
  { to: "/cabinet/keys", label: "Keys", icon: Key },
  { to: "/cabinet/billing", label: "Billing", icon: CreditCard },
  { to: "/cabinet/profile", label: "Profile", icon: User },
  { to: "/cabinet/referrals", label: "Referrals", icon: Users },
  { to: "/cabinet/support", label: "Support", icon: LifeBuoy },
]

export const Sidebar = () => {
  return (
    <aside className="w-64 h-screen border-r bg-background/60 backdrop-blur-xl p-4">
      <div className="mb-8 text-lg font-semibold">
        Cherry Panel
      </div>

      <nav className="space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === "/cabinet"}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground shadow"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )
            }
          >
            <link.icon className="h-4 w-4" />
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}