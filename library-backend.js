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

const typeDefs = gql`
  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String!): [Book!]!
    allAuthors: [Author]!
    booksInDB: [Book!]!
  }
  type Author {
    name: String!
    born: Int
    books: [Book!]
  }
  type Book {
    title: String!
    published: Int!
    author: String!
    genres: [String!]!
    id: ID!
  }
  type Mutation {
    addBook(
      title: String!
      published: Int!
      author: String!
      genres: [String!]!
    ): Book
    editAuthor(name: String!, setBornTo: Int!): Author
    removeBook(title: String!): Book
    addAuthor(name: String!, born: Int!): Author
  }
`

const resolvers = {
  Query: {
    bookCount: () => Book.collection.countDocuments(),
    authorCount: () => Author.collection.countDocuments(),
    allBooks: (root, args) => Book.find({ author: args.author }),
    allAuthors: (root, args) => Author.find({}),
    booksInDB: (root, args) => Book.find({}),
  },
  Author: {
    name: (root) => root.name,
    born: (root) => root.born,
    books: (root) => Book.find({ author: root.name }),
  },

  Mutation: {
    addBook: async (root, args) => {
      const bookToAdd = new Book({ ...args })
      try {
        await bookToAdd.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }
      return bookToAdd
    },
    addAuthor: async (root, args) => {
      const authorToAdd = new Author({ ...args })
      try {
        await authorToAdd.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }
      return authorToAdd
    },
    editAuthor: async (root, args) => {
      const authorToEdit = await Author.findOne({ name: args.name })
      try {
        authorToEdit.born = args.setBornTo
        await authorToEdit.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }
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
