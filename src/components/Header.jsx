import React from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'
import { Button } from './ui/button'
import { Avatar, AvatarFallback } from './ui/avatar'
import { Menu } from 'lucide-react'
import { useNavigate } from 'react-router-dom'   // <-- add this if using react-router

const Header = ({ onMenuClick }) => {
  const navigate = useNavigate()

  const role = localStorage.getItem("hr_role");
  let role_value = "";

  if (role === "admin") {
    role_value = "Admin";
  } else if (role === "hr") {
    role_value = "HR Personnel";
  } else {
    role_value = "Guest";
  }

  const handleLogout = () => {
    // Clear any auth data if needed
    // localStorage.removeItem("token")
    // sessionStorage.clear()

    navigate('/')   // redirect to default page (change to /login if needed)
  }

  return (
    <div className="flex items-center justify-between px-4 py-3 shadow-md bg-white sticky top-0 z-40">
      {/* Left section */}
      <section className="flex items-center space-x-3">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-md hover:bg-gray-100 transition"
        >
          <Menu className="h-6 w-6 text-[#1A3A1A]" />
        </button>

        <div className="w-10 h-10 bg-gradient-to-br from-[#2D5A2D] to-[#1A3A1A] rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-lg">A</span>
        </div>

        <div>
          <h1 className="text-xl font-semibold text-grass-dark">APIMS</h1>
          <p className="text-xs text-muted-foreground">SDO - Camarines Norte</p>
        </div>
      </section>

      {/* Right section */}
      <section className="pr-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center space-x-2">
              <Avatar>
                <AvatarFallback className="bg-[#7CB342] text-[#1A3A1A]">KT</AvatarFallback>
              </Avatar>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-[#1A3A1A]">Kean Tan</p>
                <p className="text-xs text-[#5A6F5A]">{role_value}</p>
              </div>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-52">
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </section>
    </div>
  )
}

export default Header
