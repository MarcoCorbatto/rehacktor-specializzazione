import { useState, useEffect, useContext } from 'react'
import supabase from '../..//supabase/supabase-client'
import SessionContext from '../../context/SessionContext';
import Avatar from '../../components/Avatar';

export default function AccountPage() {
  const { session } = useContext(SessionContext);

  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(null);
  const [first_name, setFirstName] = useState(null);
  const [last_name, setLastName] = useState(null);
  const [avatar_url, setAvatarUrl] = useState(null);
  const [avatar, setAvatar] = useState(null); 


  
  useEffect(() => {
    if (!session) return;

    let ignore = false;

    const getProfile = async () => {
      setLoading(true);
      const { user } = session;

      const { data, error } = await supabase
        .from('profiles')
        .select('username, first_name, last_name, avatar_url')
        .eq('id', user.id)
        .single();

      if (!ignore) {
        if (error) {
          console.warn(error);
        } else if (data) {
          setUsername(data.username);
          setFirstName(data.first_name);
          setLastName(data.last_name);
          setAvatarUrl(data.avatar_url);
        }
      }

      setLoading(false);
    };

    getProfile();

    return () => {
      ignore = true;
    };
  }, [session]);

  const updateProfile = async (event, avatarUrl) => {
    if (event) event.preventDefault();
    setLoading(true);
    const { user } = session;

    const updates = {
      id: user.id,
      username,
      first_name,
      last_name,
      avatar_url: avatarUrl || avatar_url,
      updated_at: new Date(),
    };

    const { error } = await supabase.from('profiles').upsert(updates);
    if (error) alert(error.message);
    else if (avatarUrl) setAvatarUrl(avatarUrl);

    setLoading(false);
  };

    if (!session) {
    return <div>Please login</div>;
  }

return (
    <div className="max-w-xl mx-auto p-6">
      <div className="card bg-base-100 shadow-xl p-6">
        <h2 className="text-2xl font-semibold mb-4 text-center">Profile Settings</h2>
        <form onSubmit={updateProfile} className="form-widget flex flex-col gap-4">
          <div className="flex justify-center">
            <Avatar
              uid={session.user.id}
              url={avatar_url}
              size={100}
              onUpload={(url) => {
                setAvatarUrl(url);
                updateProfile(null, url);
              }}
            />
          </div>

          <div>
            <label htmlFor="email" className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              id="email"
              type="text"
              value={session.user.email}
              disabled
              className="input input-bordered w-full"
            />
          </div>

          <div>
            <label htmlFor="username" className="label">
              <span className="label-text">Username</span>
            </label>
            <input
              id="username"
              type="text"
              required
              value={username || ''}
              onChange={(e) => setUsername(e.target.value)}
              className="input input-bordered w-full"
            />
          </div>

          <div>
            <label htmlFor="first_name" className="label">
              <span className="label-text">First Name</span>
            </label>
            <input
              id="first_name"
              type="text"
              value={first_name || ''}
              onChange={(e) => setFirstName(e.target.value)}
              className="input input-bordered w-full"
            />
          </div>

          <div>
            <label htmlFor="last_name" className="label">
              <span className="label-text">Last Name</span>
            </label>
            <input
              id="last_name"
              type="text"
              value={last_name || ''}
              onChange={(e) => setLastName(e.target.value)}
              className="input input-bordered w-full"
            />
          </div>

          <div className="mt-4">
            <button
              type="submit"
              disabled={loading}
              className={`btn btn-primary w-full ${loading ? 'btn-disabled' : ''}`}
            >
              {loading ? 'Loading ...' : 'Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}