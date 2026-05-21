import { useState } from "react";
import ReactMarkdown from "react-markdown";

import API from "../services/api";

import {
  Bot,
  SendHorizonal
} from "lucide-react";

import { motion } from "framer-motion";

const AIChat = () => {

  const [message, setMessage] = useState("");

  const [chat, setChat] = useState([]);

  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {

    if(!message.trim()) return;

    const userMessage = {
      role: "user",
      text: message
    };

    setChat((prev) => [
      ...prev,
      userMessage
    ]);

    try {

      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await API.post(
        "/ai/chat",
        {
          message
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const aiMessage = {
        role: "ai",
        text: res.data.reply
      };

      setChat((prev) => [
        ...prev,
        aiMessage
      ]);

    } catch(error){

      console.log(error);

    } finally {

      setLoading(false);

      setMessage("");
    }
  };

  return (

    <div className="
      min-h-screen
      bg-[#030712]
      text-white
      flex
      flex-col
    ">

      {/* TOP */}
      <div className="
        p-6
        border-b
        border-white/10
        bg-white/5
        backdrop-blur-xl
      ">

        <h1 className="
          text-4xl
          font-bold
          flex
          items-center
          gap-3
        ">

          <Bot className="text-cyan-400" />

          AI Librarian

        </h1>

      </div>

      {/* CHAT AREA */}
      <div className="
        flex-1
        overflow-y-auto
        p-6
        space-y-5
      ">

        {
          chat.map((msg, index) => (

            <motion.div
              initial={{
                opacity: 0,
                y: 20
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              key={index}
              className={`
                max-w-[70%]
                p-5
                rounded-3xl
                ${
                  msg.role === "user"
                  ? "ml-auto bg-cyan-500 text-white"
                  : "bg-white/10 border border-white/10"
                }
              `}
            >

                  <div className="prose prose-invert max-w-none">

                      <ReactMarkdown>
                          {msg.text}
                      </ReactMarkdown>

                  </div>

            </motion.div>
          ))
        }

        {
          loading && (

            <div className="
              bg-white/10
              border
              border-white/10
              w-fit
              px-6
              py-4
              rounded-3xl
            ">

              AI is typing...

            </div>
          )
        }

      </div>

      {/* INPUT */}
      <div className="
        p-6
        border-t
        border-white/10
        bg-white/5
        backdrop-blur-xl
      ">

        <div className="
          flex
          items-center
          gap-4
        ">

          <input
            type="text"
            placeholder="Ask AI Librarian..."
            value={message}
            onChange={(e) =>
              setMessage(e.target.value)
            }
            className="
              flex-1
              p-5
              rounded-2xl
              bg-white/5
              border
              border-white/10
              outline-none
              focus:border-cyan-400
            "
          />

          <button
            onClick={sendMessage}
            className="
              p-5
              rounded-2xl
              bg-gradient-to-r
              from-cyan-500
              to-purple-600
              hover:scale-105
              transition-all
            "
          >

            <SendHorizonal />

          </button>

        </div>

      </div>

    </div>
  );
};

export default AIChat;