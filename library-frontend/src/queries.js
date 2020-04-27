import { gql } from "@apollo/client"

export const ADD_BOOK = gql`
  mutation addNewBook(
    $title: String!
    $author: String!
    $published: Int!
    $genres: [String!]!
  ) {
    addBook(
      title: $title
      author: $author
      published: $published
      genres: $genres
    ) {
      title
      author
      published
      genres
    }
  }
`
export const EDIT_AUTHOR = gql`
  mutation editAuthorDetails($name: String!, $setBornTo: Int!) {
    editAuthor(name: $name, setBornTo: $setBornTo) {
      name
      born
    }
  }
`
const ALL_BOOKS = gql`
  query {
    booksInDB {
      author
      title
      published
    }
  }
`
export const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      bookCount
      born
    }
  }
`
export default ALL_BOOKS
