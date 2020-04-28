const { ApolloServer, UserInputError, gql } = require("apollo-server")
const mongoose = require("mongoose")
const Author = require("./models/author")
const Book = require("./models/books")
mongoose.set("useFindAndModify", false)
const MONGODB_URI = `mongodb+srv://joe-martin:5HduydtLvZ4OR0nP@cluster0-2okkp.mongodb.net/graphql-library?retryWrites=true&w=majority`
console.log(`connecting to`, MONGODB_URI)

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true })
  .then(() => console.log(`Connected to mongoDB`))
  .catch((error) => console.log(`error connecting to mongoDB`, error.message))

let authors = [
  {
    name: "Robert Martin",
    id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
    born: 1952,
  },
  {
    name: "Martin Fowler",
    id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
    born: 1963,
  },
  {
    name: "Fyodor Dostoevsky",
    id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
    born: 1821,
  },
  {
    name: "Joshua Kerievsky", // birthyear not known
    id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
  },
  {
    name: "Sandi Metz", // birthyear not known
    id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
  },
]

/*
 * Saattaisi olla järkevämpää assosioida kirja ja sen tekijä tallettamalla kirjan yhteyteen tekijän nimen sijaan tekijän id
 * Yksinkertaisuuden vuoksi tallennamme kuitenkin kirjan yhteyteen tekijän nimen
 */

let books = [
  {
    title: "Clean Code",
    published: 2008,
    author: "Robert Martin",
    id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring"],
  },
  {
    title: "Agile software development",
    published: 2002,
    author: "Robert Martin",
    id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
    genres: ["agile", "patterns", "design"],
  },
  {
    title: "Refactoring, edition 2",
    published: 2018,
    author: "Martin Fowler",
    id: "afa5de00-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring"],
  },
  {
    title: "Refactoring to patterns",
    published: 2008,
    author: "Joshua Kerievsky",
    id: "afa5de01-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring", "patterns"],
  },
  {
    title: "Practical Object-Oriented Design, An Agile Primer Using Ruby",
    published: 2012,
    author: "Sandi Metz",
    id: "afa5de02-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring", "design"],
  },
  {
    title: "Crime and punishment",
    published: 1866,
    author: "Fyodor Dostoevsky",
    id: "afa5de03-344d-11e9-a414-719c6709cf3e",
    genres: ["classic", "crime"],
  },
  {
    title: "The Demon ",
    published: 1872,
    author: "Fyodor Dostoevsky",
    id: "afa5de04-344d-11e9-a414-719c6709cf3e",
    genres: ["classic", "revolution"],
  },
]

const typeDefs = gql`
  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String!, genre: String!): [Book!]!
    allAuthors: [Author]!
    booksInDB: [Book!]!
  }
  type Author {
    name: String!
    bookCount: Int!
    born: Int
  }
  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]!
    id: ID!
  }
  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book
    editAuthor(name: String!, setBornTo: Int!): Author
    removeBook(title: String!): Book
  }
`

const resolvers = {
  Query: {
    bookCount: () => books.length,
    authorCount: () => authors.length,
    allBooks: (root, args) =>
      books.filter(
        (book) =>
          book.author === args.author && book.genres.includes(args.genre)
      ),
    allAuthors: () => authors,
    booksInDB: () => books,
  },
  Author: {
    name: (root) => root.name,
    bookCount: (root) =>
      books.filter((book) => book.author === root.name).length,
    born: (root) => root.born,
  },

  Mutation: {
    addBook: (root, args) => {
      const bookToAdd = { ...args }
      const newBookAuthor = books.find((book) => book.author === args.author)
      if (!newBookAuthor) {
        authors = authors.concat({ name: args.author })
      }
      books = books.concat(bookToAdd)
      return bookToAdd
    },
    removeBook: (root, args) => {
      const bookToRemove = { ...args }
      books = books.filter((book) => book.title !== args.title)
      return bookToRemove
    },
    editAuthor: (root, args) => {
      const authorToEdit = { name: args.name, born: args.setBornTo }
      console.log(authorToEdit)
      const search = authors.find((author) => author.name === args.name)
      console.log(search)
      if (!search) {
        return null
      }
      authors = authors.map((author) =>
        author.name === args.name ? { ...authorToEdit } : author
      )
      console.log(authors)
      return authorToEdit
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
