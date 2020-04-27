import React, { useState } from "react"
import { useMutation } from "@apollo/client"
import { EDIT_AUTHOR, ALL_AUTHORS } from "../queries"

const EditAuthor = (props) => {
  const [editAuthorDetails] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
    onError: (error) => {
      props.setError(error.message)
    },
  })
  const [name, setName] = useState("")
  const [born, setBorn] = useState("")
  const submit = async (event) => {
    event.preventDefault()
    editAuthorDetails({
      variables: { name, setBornTo: Number(born) },
    })
    console.log(`name: ${name}, born: ${born}`)

    setName("")
    setBorn("")
  }

  return (
    <div>
      <h2>Set BirthYear</h2>
      <form onSubmit={submit}>
        Name:{" "}
        <input
          type="text"
          value={name}
          onChange={({ target }) => setName(target.value)}
        />
        SetBorn:{" "}
        <input
          type="number"
          value={born}
          onChange={({ target }) => setBorn(target.value)}
        />
        <button type="submit">Update Author</button>
      </form>
    </div>
  )
}

export default EditAuthor
