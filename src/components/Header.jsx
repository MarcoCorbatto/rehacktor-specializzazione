import { useEffect, useState } from "react";
import { useContext } from "react";
import { Link } from "react-router-dom";
import supabase from "../supabase/supabase-client";
import SessionContext from "../context/SessionContext";
import Searchbar from "../components/Searchbar";
import Avatar from "./Avatar";
import Alert from "./Alert";

export default function Header() {
  const { session } = useContext(SessionContext) || {};
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);

  const getUserDetail = async () => {
    const { data: userData, error: userError } = await supabase.auth.getUser();

    // if (userError) {
    //   console.error("Authentication error:", userError.message);
    //   alert("You must log in to add to favorites.");
    //   return;
    // }

    const id = userData?.user?.id;
    setUserId(id);

    if (id) {
      const { data: profileData, error } = await supabase
        .from("profiles")
        .select("avatar_url")
        .eq("id", id)
        .single();

      if (error) console.error("Errore profilo:", error.message);
      else setAvatarUrl(profileData?.avatar_url);
      console.log(profileData?.avatar_url);
      setAvatarUrl(profileData?.avatar_url);
    }
    setLoading(false);
  };

  useEffect(() => {
    getUserDetail();
  }, [session]);

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.log(error);
    // else alert("Signed out 👋");
    Alert();
  };

  return (
    <div className="navbar bg-base-100 shadow-md px-6 sticky top-0 z-50">
      <div className="flex-1">
        <Link
          to="/"
          className="text-2xl font-bold text-primary btn btn-ghost normal-case hover:bg-transparent"
        >
          Rehacktor
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center border rounded-md px-2 py-1">
          <Searchbar />
        </div>

        {session ? (
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden"
                style={{ width: 40, height: 40 }}>
                <Avatar
                  uid={session.user.id}
                  url={avatarUrl}
                  size={40}
                  onUpload={(url) => {
                    setAvatarUrl(url);
                    updateProfile(null, url);
                  }}
                  showUploadButton={false}
                />
              </div>

            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <Link to="/account">Profile</Link>
              </li>
              <li>
                <button onClick={signOut}>Logout</button>
              </li>
            </ul>
          </div>
        ) : (
          <div className="flex items-center gap-2">
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
