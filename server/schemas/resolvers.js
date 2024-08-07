const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { AuthenticationError } = require("apollo-server-express");

const secret = "mysecretsshhhhh";
const expiration = "2h";

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                return User.findById(context.user._id);
            }
            throw new AuthenticationError("Not logged in");
        },
        getUser: async (parent, { id }) => {
            return User.findById(id);
        },
        getUsers: async () => {
            return User.find({});
        },
    },

    Mutation: {
        createUser: async (parent, { username, email, password }) => {
            const user = await User.create({ username, email, password });
            const token = jwt.sign({ data: { userId: user._id } }, secret, {
                expiresIn: expiration,
            });
            return { token, user };
        },
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });
            if (!user) {
                throw new AuthenticationError("Incorrect credentials");
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError("Incorrect credentials");
            }

            const token = jwt.sign({ data: { userId: user._id } }, secret, {
                expiresIn: expiration,
            });
            return { token, user };
        },
        saveBook: async (parent, { book }, context) => {
            if (!context.user) {
                throw new AuthenticationError("You need to be logged in!");
            }

            const user = await User.findById(context.user._id);
            user.savedBooks.push(book);
            await user.save();
            return user;
        },
        removeBook: async (parent, { bookId }, context) => {
            if (!context.user) {
                throw new AuthenticationError("You need to be logged in!");
            }

            const user = await User.findById(context.user._id);
            user.savedBooks = user.savedBooks.filter(
                (book) => book.bookId !== bookId
            );
            await user.save();
            return user;
        },
    },
    User: {
        bookCount: (parent) => parent.savedBooks.length,
    },
};

module.exports = resolvers;
