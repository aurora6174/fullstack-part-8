import React, { useState } from "react"
import Authors from "./components/Authors"
import Books from "./components/Books"
import NewBook from "./components/NewBook"
import Notify from "./components/Notify"
import AddAuthor from "./components/AddAuthor"
const App = () => {
  const [page, setPage] = useState("authors")
  const [errorMessage, setErrorMessage] = useState(null)
  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }
  return (
    <div>
      <Notify errorMessage={errorMessage} />
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        <button onClick={() => setPage("add")}>add book</button>
        <button onClick={() => setPage("addAuthor")}>add author</button>
      </div>

      <Authors show={page === "authors"} setError={notify} />

      <Books show={page === "books"} />

      <NewBook show={page === "add"} setError={notify} />
      <AddAuthor show={page === "addAuthor"} setError={notify} />
    </div>
  )
}

export default App
