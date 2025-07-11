import { useState, useEffect, useRef, useCallback, useContext } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import supabase from "../supabase/supabase-client";
import SessionContext from "../context/SessionContext"; 

dayjs.extend(relativeTime);

export default function RealtimeChat({ data }) { 
  const { session } = useContext(SessionContext); 
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null); 
  const chatPanelRef = useRef(null); 

  // Funzione per recuperare i messaggi iniziali
  const fetchMessages = useCallback(async () => {
    if (!data?.id) {
      console.warn("RealtimeChat: Game ID non disponibile per il fetch iniziale.");
      setMessages([]);
      return;
    }
    setLoading(true);
    setError(null); 

    console.log("RealtimeChat: Inizio fetch initial messages per game ID:", data.id);
    const { data: initialMessages, error: fetchError } = await supabase
      .from("messages")
      .select("*")
      .eq("game_id", data.id) 
      .order("created_at", { ascending: true }); 

    if (fetchError) {
      console.error("RealtimeChat: Errore nel recupero dei messaggi iniziali:", fetchError);
      setError(fetchError.message);
    } else {
      console.log("RealtimeChat: Messaggi iniziali recuperati:", initialMessages.length, "messaggi");
      setMessages(initialMessages);
    }
    setLoading(false);
  }, [data?.id]);

  
  useEffect(() => {
    if (!data?.id) {
      
      setMessages([]);
      return;
    }

    //  fetch iniziale 
    fetchMessages();

    //  cambiamenti in tempo reale
    const channelName = `game_chat:${data.id}`; 
    console.log("RealtimeChat: Tentativo di sottoscrizione al canale:", channelName);

    const messagesChannel = supabase
      .channel(channelName) 
      .on(
        'postgres_changes',
        {
          event: 'INSERT', 
          schema: 'public',
          table: 'messages',
          filter: `game_id=eq.${data.id}` 
        },
        (payload) => {
          console.log('RealtimeChat: Realtime - Nuovo messaggio ricevuto via INSERT!', payload.new);
     
          setMessages((prevMessages) => [...prevMessages, payload.new]);
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('RealtimeChat: Canale Realtime', channelName, 'SUBSCRIBED!');
        } else if (status === 'TIMED_OUT') {
          console.warn('RealtimeChat: Canale Realtime', channelName, 'TIMED_OUT!');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('RealtimeChat: Canale Realtime', channelName, 'ERRORE DEL CANALE!');
        } else {
          console.log('RealtimeChat: Canale Realtime', channelName, 'Stato:', status);
        }
      });

   
    return () => {
      console.log('RealtimeChat: Cleanup - Rimozione canale:', channelName);
     
      supabase.removeChannel(messagesChannel);
    };
  }, [data?.id, fetchMessages]); 

 
  useEffect(() => {
    scrollSmoothToBottom();
  }, [messages]); 

  const scrollSmoothToBottom = () => {
    if (chatPanelRef.current) {
      chatPanelRef.current.scrollTop = chatPanelRef.current.scrollHeight;
    }
  };

  const handleMessageSubmit = async (event) => {
    event.preventDefault();
    const inputMessageForm = event.currentTarget;
    const { message } = Object.fromEntries(new FormData(inputMessageForm));

    if (!session?.user?.id || !session?.user?.user_metadata?.username) {
        alert("Devi essere loggato per inviare messaggi.");
        return;
    }

    if (typeof message === "string" && message.trim().length !== 0) {
      console.log("RealtimeChat: Tentativo di invio messaggio:", message);
      const { error: insertError } = await supabase
        .from("messages")
        .insert([
          {
            profile_id: session.user.id,
            profile_username: session.user.user_metadata.username,
            game_id: data.id,
            content: message,
            created_at: new Date().toISOString(), 
          },
        ]);

      if (insertError) {
        console.error("RealtimeChat: Errore invio messaggio a Supabase:", insertError);
        alert("Errore nell'invio del messaggio.");
      } else {
        console.log("RealtimeChat: Messaggio inviato con successo a Supabase.");
        inputMessageForm.reset();
      }
    }
  };

  return (
    <div className="chat-container card bg-base-100 shadow-xl p-4 mt-6">
      <h4 className="text-xl font-bold mb-4">Gamers chat</h4>

      {/* Pannello della chat */}
      <div 
        ref={chatPanelRef} 
        className="chat-panel border border-base-300 p-4 rounded-lg bg-base-200 h-80 overflow-y-auto flex flex-col gap-2"
      >
        {loading && <p className="text-center text-gray-500">Caricamento messaggi...</p>}
        {error && <p className="text-center text-red-500">Errore: {error}</p>}
        {!loading && !error && messages.length === 0 ? (
          <p className="text-center text-gray-500">Nessun messaggio ancora. Sii il primo a chattare!</p>
        ) : (
          messages.map((message) => (
            <div 
              key={message.id} 
              className={`chat ${message.profile_id === session?.user.id ? 'chat-end' : 'chat-start'}`}
            >
              <div className="chat-header text-sm text-gray-600">
                {message.profile_username || "Utente Sconosciuto"}
                {/* Mostra il tempo relativo solo se created_at è una data valida */}
                {message.created_at && (
                  <time className="text-xs opacity-50 ml-2">
                    {dayjs().to(dayjs(message.created_at))}
                  </time>
                )}
              </div>
              <div className="chat-bubble">
                {message.content}
              </div>
            </div>
          ))
        )}
      </div>

      {/*FORMM input per i messaggi */}
      <div className="mt-4">
        {session ? (
          <form onSubmit={handleMessageSubmit} className="flex gap-2">
            <input 
              type="text" 
              name="message" 
              placeholder="Scrivi un messaggio..." 
              className="input input-bordered w-full"
              autoComplete="off"
            />
            <button type="submit" className="btn btn-primary">
              Invia
            </button>
          </form>
        ) : (
          <p className="text-center text-gray-500">Effettua il login per partecipare alla chat.</p>
        )}
      </div>
    </div>
  );
}