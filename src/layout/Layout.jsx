import { Outlet } from "react-router";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar"

export default function Layout() {
  return (
    <div className="style-layout-system">

      <Header />

      <div className="style-sidebar-filters">
        <Sidebar />
      </div>

      <div className="style-main-content">
        <Outlet />
      </div>

      <Footer/>

    </div>
  );
};