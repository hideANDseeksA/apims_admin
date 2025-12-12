import { Home, User, Calendar, FileText, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { name: "Home", icon: Home, href: "/user/dashboard" },
  { name: "Leave", icon: Calendar, href: "/user/leave" },
  { name: "Eligibility", icon: FileText, href: "/user/eligibility" },
  { name: "Profile", icon: User, href: "/user/profile" }
];

export default function BottomNav() {
  const { pathname } = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white shadow-md">
      <div className="mx-auto grid grid-cols-4 text-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.name}
              to={item.href}
              className="flex flex-col items-center py-2"
            >
              <Icon
                className={`h-6 w-6 ${
                  active ? "text-blue-600" : "text-gray-500"
                }`}
              />
              <span
                className={`text-xs ${
                  active ? "text-blue-600 font-medium" : "text-gray-500"
                }`}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
