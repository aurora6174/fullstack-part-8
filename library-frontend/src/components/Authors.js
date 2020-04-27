import React from "react"
import { useQuery } from "@apollo/client"
import { ALL_AUTHORS } from "../queries"
import EditAuthor from "../components/EditAuthor"
const Authors = ({ show, setError }) => {
  const result = useQuery(ALL_AUTHORS)

  let authors
  if (!show) {
    return null
  }
  if (result.loading) {
    return <div>loading...</div>
  }

  authors = result.data.allAuthors

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <EditAuthor setError={setError} />
    </div>
  )
}

export default Authors
