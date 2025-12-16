import { 
  Home, Users, Palmtree, Briefcase, Heart, Calendar, 
  X, ChevronDown, ChevronsLeft, ChevronsRight,CardSim,UserCog
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useState } from "react";

const sidebarItems = [
  { path: "/dashboard", label: "Dashboard", icon: Home },
  { path: "/employees", label: "Employees", icon: Users },
  { path: "/retirement", label: "Retirement", icon: Palmtree },
  { 
    path: "/position-management", 
    label: "Position Management", 
    icon: Briefcase,
    children: [
      { path: "/position-management/position", label: "Position" },
      { 
        path: "/position-management/items", label: "Items",
        children: [
          { path: "/position-management/items/item1", label: "Available Items" },
          { path: "/position-management/items/item2", label: "Repubrish Items" },
        ]
      },
      { path: "/position-management/salary", label: "Salary Tranches" },
    ],
  },
  { 
    path: "/appointment-details", 
    label: "Appointments & Contracts", 
    icon: Briefcase,
    children: [
      { path: "/appointment-details/appointment", label: "Appointments" },
      { path: "/appointment-details/contract", label: "Contracts" }
    ]
  },
    { path: "/service-records", label: "Service Records", icon: CardSim},

      { path: "/user-management", label: "User Management", icon: UserCog },
];

const Sidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [openSubmenus, setOpenSubmenus] = useState({});
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSubmenu = (path) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [path]: !prev[path],
    }));
  };

  const renderMenu = (items, level = 0) => {
    return items.map((item) => {
      const Icon = item.icon;
      const isActive = location.pathname === item.path;
      const hasChildren = item.children && item.children.length > 0;
      const submenuOpen = openSubmenus[item.path];

      return (
        <div key={item.path} className={cn(isCollapsed ? "ml-0" : `ml-${level * 4}`)}>
          <button
            onClick={() => {
              if (hasChildren && !isCollapsed) {
                toggleSubmenu(item.path);
              } else {
                navigate(item.path);
                setIsOpen(false);
              }
            }}
            className={cn(
              "w-full flex items-center px-4 py-3 rounded-lg transition-colors",
              isActive 
                ? "bg-[#7CB342] text-[#1A3A1A] font-medium" 
                : "text-[#F0F4F0] hover:bg-[#F0F4F0]/10 hover:text-grass-grey",
              isCollapsed ? "justify-center" : "space-x-3"
            )}
            title={isCollapsed ? item.label : ""}
          >
            {Icon && <Icon className="h-5 w-5" />}

            {!isCollapsed && <span>{item.label}</span>}

            {!isCollapsed && hasChildren && (
              <ChevronDown
                className={cn(
                  "h-4 w-4 ml-auto transition-transform",
                  submenuOpen ? "rotate-180" : "rotate-0"
                )}
              />
            )}
          </button>

          {/* Submenu */}
          {hasChildren && submenuOpen && !isCollapsed && (
            <div className="space-y-2">
              {renderMenu(item.children, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed h-screen md:static z-50 bg-[#1A3A1A] text-grass-grey border-r border-border transform transition-all duration-300",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        {/* Desktop collapse button */}
        <div className="hidden md:flex justify-end p-3">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-white hover:bg-white/10 p-2 rounded-lg"
          >
            {isCollapsed ? (
              <ChevronsRight className="w-5 h-5" />
            ) : (
              <ChevronsLeft className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mobile header */}
        <div className="p-6 flex justify-between items-center md:hidden">
          <h2 className="text-white font-semibold text-lg">Menu</h2>
          <button onClick={() => setIsOpen(false)}>
            <X className="h-5 w-5 text-white" />
          </button>
        </div>

        <nav className={cn("space-y-2 p-4", isCollapsed ? "items-center" : "")}>
          {renderMenu(sidebarItems)}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
