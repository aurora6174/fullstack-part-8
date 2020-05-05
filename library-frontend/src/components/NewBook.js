import React, { useState } from "react"
import { useMutation } from "@apollo/client"
import ALL_BOOKS, { ADD_BOOK, ALL_AUTHORS } from "../queries"
const NewBook = (props) => {
  const [addNewBook] = useMutation(ADD_BOOK, {
    refetchQueries: [{ query: ALL_BOOKS }, { query: ALL_AUTHORS }],
    onError: (error) => {
      props.setError(error.message)
    },
    update: (store, response) => {
      props.updateCacheWith(response.data.addBook)
    },
  })
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [published, setPublished] = useState("")
  const [genre, setGenre] = useState("")
  const [genres, setGenres] = useState([])

  if (!props.show) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()
    addNewBook({
      variables: {
        title,
        author,
        published: Number(published),
        genres,
      },
    })
    console.log(`title: ${title} published: ${published}`)

    setTitle("")
    setAuthor("")
    setPublished("")
    setGenres([])
    setGenre("")
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre("")
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          Published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(" ")}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  )
}

export default NewBook
