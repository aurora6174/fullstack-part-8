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
      published
      genres
      author
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
export const ADD_AUTHOR = gql`
  mutation addNewAuthor($name: String!, $born: Int!) {
    addAuthor(name: $name, born: $born) {
      name
      born
    }
  }
`
const ALL_BOOKS = gql`
  query {
    booksInDB {
      title
      author
      published
      genres
    }
  }
`
export const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      books {
        title
      }
    }
  }
`
export const USER = gql`
  query {
    me {
      username
      favoriteGenre
    }
  }
`
export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`
export default ALL_BOOKS
