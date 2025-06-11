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

  if (!session) {
    return <p>Loading session...</p>;
  }

  useEffect(() => {
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

  return (
    <div className="container">
      <h2>Profile Settings</h2>
      <form onSubmit={updateProfile} className="form-widget">
        <Avatar
          uid={session.user.id}
          url={avatar_url}
          size={100}
          onUpload={(url) => {
            setAvatarUrl(url);
            updateProfile(null, url);
          }}
        />
        <div>
          <label htmlFor="email">Email</label>
          <input id="email" type="text" value={session.user.email} disabled />
        </div>

        <div>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            required
            value={username || ''}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="first_name">First name</label>
          <input
            id="first_name"
            type="text"
            value={first_name || ''}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="last_name">Last name</label>
          <input
            id="last_name"
            type="text"
            value={last_name || ''}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>

        <div>
          <button type="submit" disabled={loading}>
            {loading ? 'Loading ...' : 'Update'}
          </button>
        </div>
      </form>
    </div>
  );
}
