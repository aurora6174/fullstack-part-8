const {
  ApolloServer,
  UserInputError,
  gql,
  AuthenticationError,
} = require("apollo-server")
const mongoose = require("mongoose")
const Author = require("./models/author")
const Book = require("./models/books")
const User = require("./models/user")
const jwt = require("jsonwebtoken")
const SECRET_KEY = "secretword"
mongoose.set("useFindAndModify", false)
const MONGODB_URI = `mongodb+srv://joe-martin:5HduydtLvZ4OR0nP@cluster0-2okkp.mongodb.net/graphql-library?retryWrites=true&w=majority`
console.log(`connecting to`, MONGODB_URI)

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true })
  .then(() => console.log(`Connected to mongoDB`))
  .catch((error) => console.log(`error connecting to mongoDB`, error.message))

const typeDefs = gql`
  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }
  type Token {
    value: String!
  }
  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author]!
    booksInDB: [Book!]!
    me: User
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
    createUser(username: String!, favoriteGenre: String!): User
    login(username: String!, password: String!): Token
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
`

const resolvers = {
  Query: {
    bookCount: () => Book.collection.countDocuments(),
    authorCount: () => Author.collection.countDocuments(),
    allBooks: (root, args) => {
      if (args.author && args.genre) {
        return Book.find({ author: args.author, genres: { $in: [args.genre] } })
      } else if (args.genre) {
        return Book.find({ genres: { $in: [args.genre] } })
      } else if (args.author) {
        return Book.find({ author: args.author })
      } else {
        return Book.find({})
      }
    },
    allAuthors: (root, args) => Author.find({}),
    booksInDB: (root, args) => Book.find({}),
    me: (root, args, context) => {
      return context.currentUser
    },
  },
  Author: {
    name: (root) => root.name,
    born: (root) => root.born,
    books: (root) => Book.find({ author: root.name }),
  },

  Mutation: {
    createUser: (root, args) => {
      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre,
      })
      return user.save().catch((error) => {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      })
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if (!user || args.password !== "password") {
        throw new UserInputError("wrong credentials")
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return { value: jwt.sign(userForToken, SECRET_KEY) }
    },

    addBook: async (root, args, context) => {
      const bookToAdd = new Book({ ...args })
      const authorName = bookToAdd.author
      const bookAuthor = await Author.findOne({ name: authorName })
      const currentUser = context.currentUser
      if (!currentUser) {
        throw new AuthenticationError("not authenticated")
      }
      try {
        if (!bookAuthor) {
          const newAuthor = new Author({ name: authorName })
          await newAuthor.save()
        }
        await bookToAdd.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }
      return bookToAdd
    },

    editAuthor: async (root, args, context) => {
      const authorToEdit = await Author.findOne({ name: args.name })
      const currentUser = context.currentUser
      if (!currentUser) {
        throw new AuthenticationError("not authenticated")
      }
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
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.toLowerCase().startsWith("bearer ")) {
      const decodedToken = jwt.verify(auth.substring(7), SECRET_KEY)
      const currentUser = await User.findById(decodedToken.id)
      return { currentUser }
    }
  },
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
