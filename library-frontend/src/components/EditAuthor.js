import React, { useState } from "react"
import { useMutation, useQuery } from "@apollo/client"
import { EDIT_AUTHOR, ALL_AUTHORS } from "../queries"
import Select from "react-select"

const EditAuthor = (props) => {
  const [name, setName] = useState({})
  const [born, setBorn] = useState("")
  const [editAuthorDetails] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
    onError: (error) => {
      props.setError(error.message)
    },
  })
  const result = useQuery(ALL_AUTHORS)
  let authors
  if (result.loading) {
    return <div>loading...</div>
  }
  authors = result.data.allAuthors
  let authorsInDB = []
  const nameList = authors.map((author) => author.name)

  nameList.forEach((author) =>
    authorsInDB.push({ value: author, label: author })
  )

  if (!props.show) {
    return null
  }
  const submit = async (event) => {
    event.preventDefault()
    editAuthorDetails({
      variables: { name: name.value, setBornTo: Number(born) },
    })
    console.log(`name: ${name.value}, born: ${born}`)

    setName("")
    setBorn("")
  }

  return (
    <div>
      <h2>Set BirthYear</h2>
      <form onSubmit={submit}>
        Name:{" "}
        <Select
          options={authorsInDB}
          onChange={setName}
          autoFocus
          isSearchable
          placeholder="Search author"
          noOptionsMessage={() => "No other author available :("}
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
