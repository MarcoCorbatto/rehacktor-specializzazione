import { Outlet } from "react-router";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar"
import Searchbar from "../components/Searchbar";

export default function Layout() {
  return (
    <div className="style-layout-system">

      <Header />

      <div className="style-sidebar-filters">
        <Sidebar />
      </div>

      <div className="style-searchbar-filter">
        <Searchbar />
      </div>

      <div className="style-main-content">
        <Outlet />
      </div>

      <Footer/>

    </div>
  );
};