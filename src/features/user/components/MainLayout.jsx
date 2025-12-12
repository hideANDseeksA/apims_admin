import { Outlet } from "react-router-dom";
import BottomNav from "./BottomNav";


export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen pb-16"> 
      
      <Outlet />

      <BottomNav />
    </div>
  );
}
