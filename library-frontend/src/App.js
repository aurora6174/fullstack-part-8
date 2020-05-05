import React, { useState } from "react"
import Authors from "./components/Authors"
//import Books from "./components/Books"
import NewBook from "./components/NewBook"
import Notify from "./components/Notify"
import LoginForm from "./components/LoginForm"
import ToggleTool from "./components/ToggleTool"
import EditAuthor from "./components/EditAuthor"
import GraphqlBookGenres from "./components/GraphqlBookGenres"
import {
  useQuery,
  useMutation,
  useSubscription,
  useApolloClient,
} from "@apollo/client"
import Recommend from "./components/Recommend"
import ALL_BOOKS, { BOOK_ADDED } from "./queries"

const App = () => {
  const [page, setPage] = useState("authors")
  const [errorMessage, setErrorMessage] = useState(null)
  const [token, setToken] = useState(null)
  const client = useApolloClient()
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
  const updateCacheWith = (addedBook) => {
    const includedIn = (set, object) => set.map((p) => p.id).includes(object.id)

    const dataInStore = client.readQuery({ query: ALL_BOOKS })
    if (!includedIn(dataInStore.booksInDB, addedBook)) {
      client.writeQuery({
        query: ALL_BOOKS,
        data: { booksInDB: dataInStore.booksInDB.concat(addedBook) },
      })
    }
  }

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const addedBook = subscriptionData.data.bookAdded
      window.alert(`${addedBook.title} added!`)
      console.log(subscriptionData)
      updateCacheWith(addedBook)
    },
  })

  if (!token) {
    return (
      <div>
        <Notify errorMessage={errorMessage} />
        <div>
          <button onClick={() => setPage("authors")}>authors</button>
          <button onClick={() => setPage("graphqlbooks")}>books</button>
          <ToggleTool buttonLabel="Login">
            <LoginForm setToken={setToken} setError={notify} />
          </ToggleTool>
        </div>

        <Authors show={page === "authors"} setError={notify} />
        <GraphqlBookGenres show={page === "graphqlbooks"} />
      </div>
    )
  }

  return (
    <div>
      <Notify errorMessage={errorMessage} />

      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("graphqlbooks")}>Books</button>
        <button onClick={() => setPage("add")}>add book</button>
        <button onClick={() => setPage("UpdateAuthor")}>Update Author</button>
        <button onClick={() => setPage("Recommended")}>Recommend</button>

        <button onClick={logout}>Logout</button>
      </div>
      <Authors show={page === "authors"} setError={notify} />
      <GraphqlBookGenres show={page === "graphqlbooks"} />
      <NewBook
        show={page === "add"}
        setError={notify}
        updateCacheWith={updateCacheWith}
      />

      <EditAuthor show={page === "UpdateAuthor"} setError={notify} />
      <Recommend show={page === "Recommended"} />
    </div>
  )
}

export default App
