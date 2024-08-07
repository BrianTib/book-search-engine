const typeDefs = `
    type Book {
        authors: [String]
        description: String!
        bookId: String!
        image: String
        link: String
        title: String!
    }

    type User {
        id: ID!
        username: String!
        email: String!
        password: String!
        savedBooks: [Book]
        bookCount: Int
    }

    type Query {
        getUser(id: ID!): User
        getUsers: [User],
        me: User
    }

    type Mutation {
        createUser(username: String!, email: String!, password: String!): User
        login(email: String!, password: String!): Auth
        saveBook(book: BookInput!): User
        removeBook(bookId: String!): User
    }

    input BookInput {
        authors: [String]
        description: String!
        bookId: String!
        image: String
        link: String
        title: String!
    }

    type Auth {
        token: String!
        user: User
    }
`;

module.exports = typeDefs;
