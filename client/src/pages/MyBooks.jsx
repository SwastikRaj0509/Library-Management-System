import { useEffect, useState } from "react";

import API from "../services/api";

import { motion } from "framer-motion";

const MyBooks = () => {

  const [books, setBooks] = useState([]);

  const fetchBorrowedBooks = async () => {

    try {

      const token = localStorage.getItem("token");

      const res = await API.get(
        "/borrow/my-books",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setBooks(res.data);

    } catch(error){

      console.log(error);
    }
  };

  const returnBook = async (borrowId) => {

    try {

      const token = localStorage.getItem("token");

      await API.put(
        `/borrow/return/${borrowId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      fetchBorrowedBooks();

    } catch(error){

      console.log(error);
    }
  };

  useEffect(() => {

    fetchBorrowedBooks();

  }, []);

  return (

    <div className="
      min-h-screen
      bg-[#030712]
      text-white
      p-10
    ">

      <h1 className="
        text-5xl
        font-bold
        mb-10
      ">
        My Borrowed Books
      </h1>

      <div className="space-y-6">

        {
          books.map((item) => (

            <motion.div
              whileHover={{
                scale: 1.01
              }}
              key={item._id}
              className="
                bg-white/5
                border
                border-white/10
                rounded-3xl
                p-6
                backdrop-blur-xl
                flex
                flex-col
                md:flex-row
                md:items-center
                md:justify-between
                gap-6
              "
            >

              <div>

                <h2 className="
                  text-3xl
                  font-bold
                  mb-2
                ">
                  {item.book?.title}
                </h2>

                <p className="text-gray-400">
                  {item.book?.author}
                </p>

              </div>

              <div className="
                flex
                flex-col
                gap-2
              ">

                <p>
                  Due Date:
                  {" "}
                  <span className="text-cyan-400">
                    {
                      new Date(
                        item.dueDate
                      ).toLocaleDateString()
                    }
                  </span>
                </p>

                <p>
                  Fine:
                  {" "}
                  <span className="text-red-400">
                    ₹{item.fine}
                  </span>
                </p>

                <p>
                  Status:
                  {" "}
                  <span className="
                    text-green-400
                  ">
                    {item.status}
                  </span>
                </p>

                {item.status === "borrowed" && (
                  <button
                    onClick={() => returnBook(item._id)}
                    className="
                      mt-4
                      bg-blue-600
                      hover:bg-blue-700
                      text-white
                      font-semibold
                      py-2
                      px-6
                      rounded-lg
                      transition
                    "
                  >
                    Return Book
                  </button>
                )}

              </div>

            </motion.div>
          ))
        }

      </div>

    </div>
  );
};

export default MyBooks;