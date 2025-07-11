import { useContext, useState, useEffect, useRef } from "react";
import supabase from "../supabase/supabase-client";
import SessionContext from "../context/SessionContext";

export default function Chatbox({ data }) {
  const { session } = useContext(SessionContext);
  const [messages, setMessages] = useState([]); //  memorizzare i messaggi 
  const chatPanelRef = useRef(null); // scroll automatico

  //  recuperare i messaggi iniziali 
  useEffect(() => {
   
    const fetchMessages = async () => {
      const { data: initialMessages, error } = await supabase
        .from("messages")
        .select("*");
      

      if (error) {
        console.error("Errore nel recupero dei messaggi:", error);
      } else {
        setMessages(initialMessages);
      }
    };

    //  nuovi messaggi in tempo reale
    const messagesChannel = supabase
      .channel("game_chat:" + data.id)
      .on(
        "postgres_changes",
        {
          event: "INSERT", // (nuovi messaggi)
          schema: "public",
          table: "messages",
          filter: `game_id=eq.${data.id}`, // Filtra solo i messaggi  game_id
        },
        (payload) => {
          // Quando arriva un nuovo messaggio
          setMessages((prevMessages) => [...prevMessages, payload.new]);
        }
      )
      .subscribe();

    // funzione per recuperare i messaggi iniziali
    fetchMessages();

    // Funzione di cleanup per disiscriversi dal canale Realtime
    return () => {
      supabase.removeChannel(messagesChannel);
    };
  }, [data.id]); 

  
  useEffect(() => {
    if (chatPanelRef.current) {
      chatPanelRef.current.scrollTop = chatPanelRef.current.scrollHeight;
    }
  }, [messages]); 

  const handleMessageSubmit = async (event) => {
    event.preventDefault();
    const inputMessageForm = event.currentTarget; // Rinomina per chiarezza
    const { message } = Object.fromEntries(new FormData(inputMessageForm));

    if (!session?.user?.id || !session?.user?.user_metadata?.username) {
      alert("Devi essere loggato per inviare messaggi.");
      return;
    }

    if (typeof message === "string" && message.trim().length !== 0) {
      const { error } = await supabase
        .from("messages")
        .insert([
          {
            profile_id: session.user.id,
            profile_username: session.user.user_metadata.username, 
            game_id: data.id,
            content: message,
          },
        ])
        .select(); 
      if (error) {
        console.log("Errore invio messaggio:", error);
        alert("Errore nell'invio del messaggio.");
      } else {
        inputMessageForm.reset(); 
      }
    }
  };

  return (
    <div className="chat-container card bg-base-100 shadow-xl p-4 mt-6">
      {" "}
     
      <h4 className="text-xl font-bold mb-4">Gamers chat</h4>
      {/* Pannello della chat */}
      <div
        ref={chatPanelRef} 
        className="chat-panel border border-base-300 p-4 rounded-lg bg-base-200 h-80 overflow-y-auto flex flex-col gap-2"
      >
        {messages.length === 0 ? (
          <p className="text-center text-gray-500">
            No messages yet. Be the first to chat!
          </p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`chat ${
                msg.profile_id === session?.user.id ? "chat-end" : "chat-start"
              }`} 
            >
              <div className="chat-header text-sm text-gray-600">
                {msg.profile_username || "Utente Sconosciuto"}
                <time className="text-xs opacity-50 ml-2">
                  {new Date(msg.created_at).toLocaleTimeString()}
                </time>
              </div>
              <div className="chat-bubble">{msg.content}</div>
            </div>
          ))
        )}
      </div>
     
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
              Send
            </button>
          </form>
        ) : (
          <p className="text-center text-gray-500">
            Please log in to join the chat.
          </p>
        )}
      </div>
    </div>
  );
}
