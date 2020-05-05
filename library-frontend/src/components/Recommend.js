import React from "react"
import { useQuery } from "@apollo/client"
import ALL_BOOKS, { USER } from "../queries"

const Recommend = (props) => {
  const result = useQuery(USER)
  const books = useQuery(ALL_BOOKS)
  if (!props.show) {
    return null
  }
  if (result.loading) {
    return <div>Loading...</div>
  }
  const fav = result.data.me.favoriteGenre

  const bookBasedOnGenre = books.data.booksInDB

  const filtered = bookBasedOnGenre.filter((book) =>
    book.genres.includes(fav.toLowerCase())
  )
  return (
    <div>
      <h2>Recommendations</h2>
      <p>
        Books based on your favorite genre <em>{fav}</em>{" "}
      </p>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {filtered.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Recommend
