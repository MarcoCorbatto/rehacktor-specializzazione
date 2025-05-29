import { Outlet } from "react-router";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Layout() {
  return (
    <div className="style-layout-system">
      <Header />

      <div className="style-main-content">
        <Outlet />
      </div>

      <Footer />
    </div>
  );
}
