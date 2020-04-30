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
    allBooks(author: String!, genre: String!): [Book!]!
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
    allBooks: (root, args) =>
      books.filter(
        (book) =>
          book.author === args.author && book.genres.includes(args.genre)
      ),
    allAuthors: (root, args) => Author.find({}),
    booksInDB: (root, args) => Book.find({}),
  },
  Author: {
    name: (root) => root.name,
    born: (root) => root.born,
    books: (root) => Book.find({ author: root.name }),
  },

  Mutation: {
    addBook: (root, args) => {
      const bookToAdd = new Book({ ...args })
      return bookToAdd.save()
    },
    addAuthor: (root, args) => {
      const authorToAdd = new Author({ ...args })
      return authorToAdd.save()
    },
    editAuthor: async (root, args) => {
      const authorToEdit = await Author.findOne({ name: args.name })
      authorToEdit.born = args.setBornTo
      return authorToEdit.save()
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
