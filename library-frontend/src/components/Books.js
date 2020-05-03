import React, { useState } from "react"
import { useQuery } from "@apollo/client"
import ALL_BOOKS from "../queries"

const Books = (props) => {
  const result = useQuery(ALL_BOOKS)
  const [genres, setGenres] = useState("all")
  if (!props.show) {
    return null
  }
  if (result.loading) {
    return <div>loading...</div>
  }
  const books = result.data.booksInDB
  let booksToDisplay
  switch (genres) {
    case "refactoring":
      booksToDisplay = books.filter((book) =>
        book.genres.includes("refactoring")
      )
      break
    case "crime":
      booksToDisplay = books.filter((book) => book.genres.includes("crime"))
      break
    case "patterns":
      booksToDisplay = books.filter((book) => book.genres.includes("patterns"))
      break
    case "classic":
      booksToDisplay = books.filter((book) => book.genres.includes("classic"))
      break
    case "fullstack":
      booksToDisplay = books.filter((book) =>
        book.genres.includes("fullstack dev")
      )
      break
    case "all":
      booksToDisplay = books
      break
    default:
      booksToDisplay = books
  }
  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {booksToDisplay.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button onClick={() => setGenres("refactoring")}>Refactoring</button>
        <button onClick={() => setGenres("patterns")}>Patterns</button>
        <button onClick={() => setGenres("crime")}>Crime</button>
        <button onClick={() => setGenres("classic")}>Classic</button>
        <button onClick={() => setGenres("fullstack")}>
          Fullstack Development
        </button>
        <button onClick={() => setGenres("all")}>All genres</button>
      </div>
    </div>
  )
}

export default Books
