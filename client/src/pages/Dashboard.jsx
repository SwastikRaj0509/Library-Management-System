import { useEffect, useState } from "react";

import {
  BookOpen,
  Users,
  ClipboardList,
  Sparkles
} from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

import { motion } from "framer-motion";

import API from "../services/api";

const data = [
  {
    name: "Mon",
    books: 4
  },
  {
    name: "Tue",
    books: 7
  },
  {
    name: "Wed",
    books: 5
  },
  {
    name: "Thu",
    books: 9
  },
  {
    name: "Fri",
    books: 6
  }
];

const Dashboard = () => {

  const user = JSON.parse(
  localStorage.getItem("user")
);

const [stats, setStats] = useState({
  totalBooks: 0,
  totalUsers: 0,
  borrowedBooks: 0,
  overdueBooks: 0
});

useEffect(() => {

  const fetchStats = async () => {

    try {

      const res = await API.get("/dashboard");

      setStats(res.data);

    } catch(error){

      console.log(error);
    }
  };

  fetchStats();

}, []);

  return (

    <div className="
      min-h-screen
      bg-[#030712]
      text-white
      flex
    ">

      {/* SIDEBAR */}
      <div className="
        w-[260px]
        bg-white/5
        border-r
        border-white/10
        backdrop-blur-xl
        p-6
        flex
        flex-col
        justify-between
      ">

        <div>

          <h1 className="
            text-3xl
            font-bold
            mb-12
            bg-gradient-to-r
            from-cyan-400
            to-purple-500
            text-transparent
            bg-clip-text
          ">
            AI Library
          </h1>

          <div className="space-y-4">

            <button className="
              w-full
              text-left
              p-4
              rounded-2xl
              bg-cyan-500/10
              hover:bg-cyan-500/20
              transition-all
            ">
              Dashboard
            </button>

            <button
  onClick={() =>
    window.location.href = "/books"
  }
  className="
    w-full
    text-left
    p-4
    rounded-2xl
    hover:bg-white/10
    transition-all
  "
>
  Books
</button>

            <button
  onClick={() =>
    window.location.href = "/my-books"
  }
  className="
    w-full
    text-left
    p-4
    rounded-2xl
    hover:bg-white/10
    transition-all
  "
>
  My Books
</button>

          <button
  onClick={() =>
    window.location.href = "/ai-chat"
  }
  className="
    w-full
    text-left
    p-4
    rounded-2xl
    hover:bg-white/10
    transition-all
  "
>
  AI Assistant
</button>

          </div>

        </div>

        <button
          onClick={() => {

            localStorage.clear();

            window.location.href = "/";
          }}
          className="
            p-4
            rounded-2xl
            bg-red-500/20
            hover:bg-red-500/30
            transition-all
          "
        >
          Logout
        </button>

      </div>

      {/* MAIN CONTENT */}
      <div className="
        flex-1
        p-10
      ">

        {/* TOP */}
        <div className="mb-10">

          <h1 className="
            text-5xl
            font-bold
            mb-3
          ">

            Welcome back,
            <span className="
              text-cyan-400
              ml-3
            ">
              {user?.name}
            </span>

          </h1>

          <p className="text-gray-400 text-lg">
            AI-powered Library Dashboard
          </p>

        </div>

        {/* STATS */}
        <div className="
          grid
          grid-cols-1
          md:grid-cols-2
          lg:grid-cols-4
          gap-6
          mb-10
        ">

          {/* CARD */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="
              bg-white/5
              border
              border-white/10
              rounded-3xl
              p-6
              backdrop-blur-xl
            "
          >

            <BookOpen
              className="text-cyan-400 mb-4"
              size={35}
            />

            <h2 className="text-4xl font-bold">
              {stats.totalBooks}
            </h2>

            <p className="text-gray-400 mt-2">
              Total Books
            </p>

          </motion.div>

          <motion.div
            whileHover={{ scale: 1.03 }}
            className="
              bg-white/5
              border
              border-white/10
              rounded-3xl
              p-6
              backdrop-blur-xl
            "
          >

            <Users
              className="text-purple-400 mb-4"
              size={35}
            />

            <h2 className="text-4xl font-bold">
              {stats.totalUsers}
            </h2>

            <p className="text-gray-400 mt-2">
              Users
            </p>

          </motion.div>

          <motion.div
            whileHover={{ scale: 1.03 }}
            className="
              bg-white/5
              border
              border-white/10
              rounded-3xl
              p-6
              backdrop-blur-xl
            "
          >

            <ClipboardList
              className="text-pink-400 mb-4"
              size={35}
            />

            <h2 className="text-4xl font-bold">
              {stats.borrowedBooks}
            </h2>

            <p className="text-gray-400 mt-2">
              Borrowed
            </p>

          </motion.div>

          <motion.div
            whileHover={{ scale: 1.03 }}
            className="
              bg-white/5
              border
              border-white/10
              rounded-3xl
              p-6
              backdrop-blur-xl
            "
          >

            <Sparkles
              className="text-yellow-400 mb-4"
              size={35}
            />

            <h2 className="text-4xl font-bold">
              {stats.overdueBooks}
            </h2>

            <p className="text-gray-400 mt-2">
              Overdue Books
            </p>

          </motion.div>

        </div>

        {/* CHART */}
        <div className="
          bg-white/5
          border
          border-white/10
          rounded-3xl
          p-8
          backdrop-blur-xl
        ">

          <h2 className="
            text-2xl
            font-bold
            mb-6
          ">
            Weekly Activity
          </h2>

          <div className="h-[300px]">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <BarChart data={data}>

                <XAxis dataKey="name" />

                <YAxis />

                <Tooltip />

                <Bar
                  dataKey="books"
                  radius={[10, 10, 0, 0]}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Dashboard;