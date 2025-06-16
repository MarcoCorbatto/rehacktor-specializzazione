import { useContext } from "react";
import { Link } from "react-router-dom";
import supabase from "../supabase/supabase-client";
import SessionContext from "../context/SessionContext";
import Searchbar from "../components/Searchbar";
export default function Header() {
  const { session } = useContext(SessionContext) || {};

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.log(error);
    else alert("Signed out 👋");
  };

  return (
    <div className="navbar bg-base-100 shadow-md px-4 sticky top-0 z-50">
      <div className="flex-1"> 
        <Link
          to="/"
          className="btn btn-ghost normal-case text-2xl text-primary hover:bg-transparent"
        >
          Rehacktor
        </Link>
      </div>

      
      <div className="flex items-center gap-3">
        
       
        <Searchbar /> 

        {session ? (
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img
                  alt="User avatar"
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <Link to="/account" className="justify-between">
                  Profile
                </Link>
              </li>
              <li>
                <button onClick={signOut}>Logout</button>
              </li>
            </ul>
          </div>
        ) : (
          <div className="flex gap-2">
            <Link to="/login" className="btn btn-outline btn-sm">
              Login
            </Link>
            <Link to="/register" className="btn btn-primary btn-sm text-white">
              Register
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}