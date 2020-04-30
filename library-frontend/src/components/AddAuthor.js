import React, { useState } from "react"
import { useMutation } from "@apollo/client"
import { ADD_AUTHOR, ALL_AUTHORS } from "../queries"

const AddAuthor = (props) => {
  const [addNewAuthor] = useMutation(ADD_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
    onError: (error) => {
      props.setError(error.message)
    },
  })
  const [name, setName] = useState("")
  const [born, setBorn] = useState("")
  if (!props.show) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()
    addNewAuthor({
      variables: { name, born: Number(born) },
    })
    console.log(`name: ${name}  born: ${born}`)

    setName("")
    setBorn("")
  }
  return (
    <div style={{ marginTop: `2.5em` }}>
      <form onSubmit={submit}>
        <div>
          Name:{" "}
          <input
            type="text"
            value={name}
            onChange={({ target }) => setName(target.value)}
          />
        </div>
        <br />
        <div>
          Born:{" "}
          <input
            type="number"
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>
        <br />
        <button type="submit">Add Author</button>
      </form>
    </div>
  )
}
export default AddAuthor
