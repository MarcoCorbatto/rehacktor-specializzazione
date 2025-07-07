import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen text-gray-900 dark:text-gray-100 bg-transparent"> 
      
      <Header /> 

      <div className="flex flex-grow"> 
        
        <aside className="w-64 bg-base-300 p-4 shadow-lg hidden md:block flex-shrink-0">
          <Sidebar /> 
        </aside>

        <main className="flex-grow p-6 overflow-auto"> 
          <Outlet /> 
        </main>

      </div>

      <Footer/>

    </div>
  );
};