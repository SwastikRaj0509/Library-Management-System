import dotenv from "dotenv";

dotenv.config();

import Groq from "groq-sdk";

const groq = new Groq({
   apiKey: process.env.GROQ_API_KEY
});

export const aiChat = async (req, res) => {

   try {

      const { message } = req.body;

      const completion = await groq.chat.completions.create({

         messages: [

            {
               role: "system",
               content: "You are an AI librarian assistant for a Library Management System."
            },

            {
               role: "user",
               content: message
            }
         ],

         model: "llama-3.3-70b-versatile"
      });

      res.json({

         reply: completion.choices[0].message.content
      });

   } catch(error){

      res.status(500).json({
         message: error.message
      });
   }
};