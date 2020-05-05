import React, { useState, useEffect } from "react"
import { useLazyQuery } from "@apollo/client"
import ALL_BOOKS, { GET_BOOKS_BY_GENRE, ALL_AUTHORS } from "../queries"

const GraphqlBooks = (props) => {
  const [books, setBooks] = useState([])
  const [getBook, { loading, data }] = useLazyQuery(GET_BOOKS_BY_GENRE, {
    refetchQueries: [{ query: ALL_BOOKS }, { query: ALL_AUTHORS }],
    onError: (error) => {
      props.setError(error.message)
    },
  })

  let booksToDisplay = books

  useEffect(() => {
    if (loading) {
      console.log(`loading...`)
    }
    if (data) {
      setBooks(data.allBooks)
    }
  }, [data, loading])

  if (!props.show) {
    return null
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
        <button
          onClick={() => getBook({ variables: { genre: "refactoring" } })}
        >
          Refactoring
        </button>
        <button onClick={() => getBook({ variables: { genre: "patterns" } })}>
          Patterns
        </button>
        <button onClick={() => getBook({ variables: { genre: "crime" } })}>
          Crime
        </button>
        <button onClick={() => getBook({ variables: { genre: "classic" } })}>
          Classic
        </button>
        <button
          onClick={() =>
            getBook({ variables: { genre: "Reinforcement Learning" } })
          }
        >
          Reinforcement Learning
        </button>
        <button
          onClick={() => getBook({ variables: { genre: "fullstack dev" } })}
        >
          Fullstack Development
        </button>
        <button onClick={() => getBook({})}>All genres</button>
      </div>
    </div>
  )
}

export default GraphqlBooks
