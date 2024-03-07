const typeDefs = `
type User {
    _id: ID!
    name: String
    email: String
    bookCount: Int
    savedBooks: [Book]
}
type Book {
    authors: [String]
    _id: ID!
    description: String
    image: String
    link: String
    title: String
    bookId: String
}
type Query {
    user: User
}
type Auth {
    token: ID!
    user: User
}
input SavedBookInput {
    authors: [String]
    description: String
    bookId: String
    image: String
    link: String
    title: String
}
type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    savedBook(book: SavedBookInput): User
    removeBook(bookId: String!): User
}
`
module.exports = typeDefs