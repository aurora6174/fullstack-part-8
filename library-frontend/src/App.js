import React, { useState } from "react"
import Authors from "./components/Authors"
import Books from "./components/Books"
import NewBook from "./components/NewBook"
import Notify from "./components/Notify"
import Recommend from "./components/Recommend"
import LoginForm from "./components/LoginForm"
import ToggleTool from "./components/ToggleTool"
import EditAuthor from "./components/EditAuthor"
import { useQuery, useApolloClient } from "@apollo/client"
import { ALL_AUTHORS } from "./queries"
const App = () => {
  const [page, setPage] = useState("authors")
  const [errorMessage, setErrorMessage] = useState(null)
  const [token, setToken] = useState(null)
  const client = useApolloClient()
  // const [state, setState] = useState(false)
  const result = useQuery(ALL_AUTHORS)
  let authors
  if (result.loading) {
    return <div>loading...</div>
  }
  authors = result.data.allAuthors
  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }
  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }
  if (!token) {
    return (
      <div>
        <Notify errorMessage={errorMessage} />
        <div>
          <button onClick={() => setPage("authors")}>authors</button>
          <button onClick={() => setPage("books")}>books</button>
          <ToggleTool buttonLabel="Login">
            <LoginForm setToken={setToken} setError={notify} />
          </ToggleTool>
        </div>

        <Authors show={page === "authors"} setError={notify} />
        <Books show={page === "books"} />
      </div>
    )
  }

  return (
    <div>
      <Notify errorMessage={errorMessage} />

      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        <button onClick={() => setPage("add")}>add book</button>
        <button onClick={() => setPage("UpdateAuthor")}>Update Author</button>
        <button onClick={() => setPage("Recommend")}>Recommend</button>
        <button onClick={logout}>Logout</button>
      </div>
      <Authors show={page === "authors"} setError={notify} />
      <Books show={page === "books"} />
      <NewBook show={page === "add"} setError={notify} />

      <EditAuthor
        show={page === "UpdateAuthor"}
        setError={notify}
        authorList={authors}
      />
      <Recommend show={page === "Recommend"} />
    </div>
  )
}

export default App
