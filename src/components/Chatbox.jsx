import { useContext, useState, useEffect, useRef } from "react";
import supabase from "../supabase/supabase-client";
import SessionContext from "../context/SessionContext";

export default function Chatbox({ data }) {
  const { session } = useContext(SessionContext);
  const [messages, setMessages] = useState([]); // Stato per memorizzare i messaggi della chat
  const chatPanelRef = useRef(null); // Ref per lo scroll automatico

  // Funzione per recuperare i messaggi iniziali e sottoscriversi ai nuovi
  useEffect(() => {
    // 1. Funzione per recuperare i messaggi iniziali
    const fetchMessages = async () => {
      const { data: initialMessages, error } = await supabase
        .from("messages")
        .select("*");
      // .eq("game_id", data.id) // Filtra i messaggi per l'ID del gioco corrente
      // .order("created_at", { ascending: true }); // Ordina per data di creazione

      if (error) {
        console.error("Errore nel recupero dei messaggi:", error);
      } else {
        setMessages(initialMessages);
      }
    };

    // 2. Sottoscrizione ai nuovi messaggi in tempo reale
    const messagesChannel = supabase
      .channel("game_chat:" + data.id) // Usa un canale specifico per il gioco
      .on(
        "postgres_changes",
        {
          event: "INSERT", // Ascolta solo gli inserimenti (nuovi messaggi)
          schema: "public",
          table: "messages",
          filter: `game_id=eq.${data.id}`, // Filtra solo i messaggi per questo game_id
        },
        (payload) => {
          // Quando arriva un nuovo messaggio, aggiungilo allo stato esistente
          setMessages((prevMessages) => [...prevMessages, payload.new]);
        }
      )
      .subscribe();

    // Chiama la funzione per recuperare i messaggi iniziali
    fetchMessages();

    // Funzione di cleanup: MOLTO IMPORTANTE per disiscriversi dal canale Realtime
    return () => {
      supabase.removeChannel(messagesChannel);
    };
  }, [data.id]); // Riesegui l'effetto se cambia l'ID del gioco

  // Effetto per scrollare automaticamente in basso quando arrivano nuovi messaggi
  useEffect(() => {
    if (chatPanelRef.current) {
      chatPanelRef.current.scrollTop = chatPanelRef.current.scrollHeight;
    }
  }, [messages]); // Dipende dallo stato dei messaggi

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
            profile_username: session.user.user_metadata.username, // Assicurati che user_metadata.username esista
            game_id: data.id,
            content: message,
          },
        ])
        .select(); // Non è necessario .select() qui se non ti serve il ritorno immediato

      if (error) {
        console.log("Errore invio messaggio:", error);
        alert("Errore nell'invio del messaggio.");
      } else {
        inputMessageForm.reset(); // Resetta il campo input dopo l'invio
      }
    }
  };

  return (
    <div className="chat-container card bg-base-100 shadow-xl p-4 mt-6">
      {" "}
      {/* Aggiungi stile DaisyUI */}
      <h4 className="text-xl font-bold mb-4">Gamers chat</h4>
      {/* Pannello della chat */}
      <div
        ref={chatPanelRef} // ref qui
        className="chat-panel border border-base-300 p-4 rounded-lg bg-base-200 h-80 overflow-y-auto flex flex-col gap-2"
      >
        {messages.length === 0 ? (
          <p className="text-center text-gray-500">
            Nessun messaggio ancora. Sii il primo a chattare!
          </p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`chat ${
                msg.profile_id === session?.user.id ? "chat-end" : "chat-start"
              }`} // Stile DaisyUI per chat
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
      {/* Form di input per i messaggi */}
      <div className="mt-4">
        {session ? ( // Mostra il form se loggato
          <form onSubmit={handleMessageSubmit} className="flex gap-2">
            <input
              type="text"
              name="message"
              placeholder="Scrivi un messaggio..."
              className="input input-bordered w-full" // DaisyUI
              autoComplete="off"
            />
            <button type="submit" className="btn btn-primary">
              Invia
            </button>
          </form>
        ) : (
          <p className="text-center text-gray-500">
            Effettua il login per partecipare alla chat.
          </p>
        )}
      </div>
    </div>
  );
}
