import { useState, useEffect } from "react";
import SessionContext from "./SessionContext";
import supabase from "../supabase/supabase-client";

export default function SessionProvider({ children }) {
  const [session, setSession] = useState(null);

  useEffect(() => {
    // 1. Ottieni la sessione iniziale
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // 2. Ascolta i cambiamenti di autenticazione
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      subscription?.unsubscribe?.(); // sicurezza in più
    };
  }, []);

  return (
    <SessionContext.Provider value={{ session }}>
      {children}
    </SessionContext.Provider>
  );
}
