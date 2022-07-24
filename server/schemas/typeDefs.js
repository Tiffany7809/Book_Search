const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type Book {
        bookId: ID!
        authors: [String]
        description: String!
        image: String
        link: String
        title: String!
    }

    type User {
        _id: ID!
        username: String!
        email: String!
        password: String!
        savedBooks: [Book]
    }

    inpute InputBook {
        bookId: String
        authors: [String]
        title: String
        description: String
        image: String
        link:String

    }

    tyoe Auth {
        token: ID!
        user: User
    }
    type Query {
        me: User
    }
    type Mutation {
        login(email: String!, username: String!, password: String!): Auth
        addUser(username: String!, password: String!, email: String!): Auth
        saveBook:(newBook: InputBook!): User
        removeBook(bookId: ID!): User
    }
   
`;

module.exports = typeDefs;
