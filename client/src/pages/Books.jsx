import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import API from "../services/api";

import {
  Search,
  BookOpen
} from "lucide-react";

import toast, {
  Toaster
} from "react-hot-toast";

import { motion } from "framer-motion";

const Books = () => {

  const [books, setBooks] = useState([]);

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [editingBookId, setEditingBookId] = useState(null);

  const [bookData, setBookData] = useState({
  title: "",
  author: "",
  genre: "",
  category: "",
  isbn: "",
  availableCopies: 1
});

  const user = JSON.parse(
    localStorage.getItem("user")
      );

  const fetchBooks = async () => {

    try {

      const res = await API.get("/books");

      setBooks(res.data);

    } catch(error){

      console.log(error);
    }
  };

  useEffect(() => {

    fetchBooks();

  }, []);

  // BORROW BOOK
  const borrowBook = async (id) => {

    try {

      const token = localStorage.getItem("token");

      await API.post(
        "/borrow",
        {
          bookId: id
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      toast.success("Book Borrowed 🚀");

      fetchBooks();

    } catch(error){

      toast.error(
        error.response?.data?.message ||
        "Failed"
      );
    }
  };

  // SEARCH FILTER
  const filteredBooks = books.filter((book) =>
    book.title
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const addBook = async () => {

  try {

    const token = localStorage.getItem("token");

    await API.post(
      "/books",
      bookData,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    toast.success("Book Added 🚀");

    setShowModal(false);

    fetchBooks();

  } catch(error){

    toast.error(
      error.response?.data?.message ||
      "Failed to add book"
    );
  }
};

const deleteBook = async (id) => {

  try {

    const token = localStorage.getItem("token");

    await API.delete(
      `/books/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    toast.success("Book Deleted 🗑️");

    fetchBooks();

  } catch(error){

    toast.error(
      error.response?.data?.message ||
      "Failed to delete"
    );
  }
};

const updateBook = async () => {

  try {

    const token = localStorage.getItem("token");

    await API.put(
      `/books/${editingBookId}`,
      bookData,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    toast.success("Book Updated ✏️");

    setShowModal(false);

    setEditingBookId(null);

    fetchBooks();

  } catch(error){

    toast.error(
      error.response?.data?.message ||
      "Failed to update"
    );
  }
};

  return (

    <div className="
      min-h-screen
      bg-[#030712]
      text-white
      px-8
      py-10
    ">

      <Toaster />

      {/* TOP */}
<div className="
  flex
  flex-col
  md:flex-row
  md:items-center
  md:justify-between
  gap-6
  mb-10
">

  <div>

    <h1 className="
      text-5xl
      font-bold
      mb-3
    ">
      Library Books
    </h1>

    <p className="text-gray-400">
      Explore futuristic AI-powered library
    </p>

  </div>

  <div className="
    flex
    items-center
    gap-4
  ">

    {/* SEARCH */}
    <div className="
      relative
      w-full
      md:w-[350px]
    ">

      <Search
        className="
          absolute
          left-4
          top-1/2
          -translate-y-1/2
          text-gray-400
        "
      />

      <input
        type="text"
        placeholder="Search books..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        className="
          w-full
          pl-12
          pr-4
          py-4
          rounded-2xl
          bg-white/5
          border
          border-white/10
          outline-none
          focus:border-cyan-400
          transition-all
        "
      />

    </div>

    {/* ADMIN BUTTON */}
    {
      user?.role === "admin" && (

        <button
  onClick={() =>
    setShowModal(true)
  }
  className="
            px-6
            py-4
            rounded-2xl
            bg-gradient-to-r
            from-cyan-500
            to-purple-600
            font-semibold
            hover:scale-105
            transition-all
            whitespace-nowrap
          "
        >
          Add Book
        </button>

      )
    }

    {/* MY BORROWED BOOKS LINK */}
    <Link
      to="/my-books"
      className="
        px-6
        py-4
        rounded-2xl
        bg-gradient-to-r
        from-blue-500
        to-indigo-600
        font-semibold
        hover:scale-105
        transition-all
        whitespace-nowrap
        text-center
      "
    >
      My Borrowed Books
    </Link>

  </div>

</div>

      {
  showModal && (

    <div className="
      fixed
      inset-0
      bg-black/60
      backdrop-blur-sm
      flex
      items-center
      justify-center
      z-50
    ">

      <div className="
        w-full
        max-w-lg
        bg-[#0F172A]
        border
        border-white/10
        rounded-3xl
        p-8
      ">

        <h2 className="
          text-3xl
          font-bold
          mb-6
        ">
        {
            editingBookId
            ? "Edit Book"
            : "Add New Book"
        }
        </h2>

        <div className="
          flex
          flex-col
          gap-4
        ">

          <input
            type="text"
            placeholder="Book Title"
            value={bookData.title}
            onChange={(e) =>
              setBookData({
                ...bookData,
                title: e.target.value
              })
            }
            className="
              p-4
              rounded-2xl
              bg-white/5
              border
              border-white/10
              outline-none
            "
          />

          <input
            type="text"
            placeholder="Author"
            value={bookData.author}
            onChange={(e) =>
              setBookData({
                ...bookData,
                author: e.target.value
              })
            }
            className="
              p-4
              rounded-2xl
              bg-white/5
              border
              border-white/10
              outline-none
            "
          />

          <input
  type="text"
  placeholder="Genre"
  value={bookData.genre}
  onChange={(e) =>
    setBookData({
      ...bookData,
      genre: e.target.value
    })
  }
  className="
    p-4
    rounded-2xl
    bg-white/5
    border
    border-white/10
    outline-none
  "
/>

<input
  type="text"
  placeholder="Category"
  value={bookData.category}
  onChange={(e) =>
    setBookData({
      ...bookData,
      category: e.target.value
    })
  }
  className="
    p-4
    rounded-2xl
    bg-white/5
    border
    border-white/10
    outline-none
  "
/>

<input
  type="text"
  placeholder="ISBN"
  value={bookData.isbn}
  onChange={(e) =>
    setBookData({
      ...bookData,
      isbn: e.target.value
    })
  }
  className="
    p-4
    rounded-2xl
    bg-white/5
    border
    border-white/10
    outline-none
  "
/>

          <input
            type="number"
            placeholder="Copies"
            value={bookData.availableCopies}
            onChange={(e) =>
              setBookData({
                ...bookData,
                availableCopies: e.target.value
              })
            }
            className="
              p-4
              rounded-2xl
              bg-white/5
              border
              border-white/10
              outline-none
            "
          />

          <div className="
            flex
            gap-4
            mt-4
          ">

            <button
            onClick={
                editingBookId
                ? updateBook
                : addBook
            }
              className="
                flex-1
                py-4
                rounded-2xl
                bg-gradient-to-r
                from-cyan-500
                to-purple-600
                font-semibold
              "
            >
              {
  editingBookId
    ? "Update Book"
    : "Add Book"
}
            </button>

            <button
              onClick={() =>
                setShowModal(false)
              }
              className="
                flex-1
                py-4
                rounded-2xl
                bg-white/10
              "
            >
              Cancel
            </button>

          </div>

        </div>

      </div>

    </div>

  )
}
      {/* BOOK GRID */}
      <div className="
        grid
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-3
        xl:grid-cols-4
        gap-8
      ">

        {
          filteredBooks.map((book) => (

            <motion.div
              whileHover={{
                y: -8
              }}
              key={book._id}
              className="
                bg-white/5
                border
                border-white/10
                rounded-3xl
                overflow-hidden
                backdrop-blur-xl
                shadow-lg
              "
            >

              {/* TOP */}
              <div className="
                h-[220px]
                bg-gradient-to-br
                from-cyan-500/30
                to-purple-600/30
                flex
                items-center
                justify-center
              ">

                <BookOpen size={70} />

              </div>

              {/* CONTENT */}
              <div className="p-6">

                <h2 className="
                  text-2xl
                  font-bold
                  mb-2
                ">
                  {book.title}
                </h2>

                <p className="
                  text-gray-400
                  mb-2
                ">
                  {book.author}
                </p>

                <p className="
                  text-sm
                  text-gray-500
                  mb-4
                ">
                 {book.category}
                </p>

                <div className="
                  flex
                  items-center
                  justify-between
                  mb-5
                ">

                  <span className="
                    text-cyan-400
                    font-semibold
                  ">
                    Available:
                    {" "}
                    {book.availableCopies}
                  </span>

                </div>

                <button
                  onClick={() =>
                    borrowBook(book._id)
                  }
                  className="
                    w-full
                    py-3
                    rounded-2xl
                    bg-gradient-to-r
                    from-cyan-500
                    to-purple-600
                    hover:scale-[1.02]
                    transition-all
                    font-semibold
                  "
                >

                  Borrow Book

                </button>

    {
  user?.role === "admin" && (

    <button
      onClick={() =>
        deleteBook(book._id)
      }
      className="
        w-full
        mt-3
        py-3
        rounded-2xl
        bg-red-500/20
        border
        border-red-500/30
        hover:bg-red-500/30
        transition-all
        font-semibold
      "
    >

      Delete Book

    </button>

  )
}

{
  user?.role === "admin" && (

    <button
      onClick={() => {

        setEditingBookId(book._id);

        setBookData({
          title: book.title,
          author: book.author,
          genre: book.genre,
          category: book.category,
          isbn: book.isbn,
          availableCopies: book.availableCopies
        });

        setShowModal(true);
      }}
      className="
        w-full
        mt-3
        py-3
        rounded-2xl
        bg-yellow-500/20
        border
        border-yellow-500/30
        hover:bg-yellow-500/30
        transition-all
        font-semibold
      "
    >

      Edit Book

    </button>

  )
}

              </div>

            </motion.div>
          ))
        }

      </div>

    </div>
  );
};

export default Books;