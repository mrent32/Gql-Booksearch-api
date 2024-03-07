const { typeDefs, resolvers } = require("./index");
const { Book, User } = require('../models/index');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');


const resolvers = {
    Query: {
    user: async () => {
        return User.find({})
    },
    book: async (parent, {_id }) => {
        const params = _id ? {_id } : {};
        return Book.find(params);
    },
    },
    Mutation: {
        addUser: async( parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);

            return {token, user }
        },
        login: async (parent, {email, password}) => {
            const user = await User.findOne( {email})
            if(!user ) {
                throw new AuthenticationError('Incorrect Credentials')
            }
            const correctPw = await user.isCorrectPassword(password)
            if(!correctPw) {
                throw new AuthenticationError('Incorrect credentials')
            }
            const token = signToken(user)
            return { token, user}
        },
        saveBook: async (parent, { book }, params ) => {
            if (params.user) {
                const upddatedUser = await User.findOneAndUpdate(
                    {_id: params.user._id},
                    { $addToSet: {savedBooks: book}},
                    {new: true}
                )
                return upddatedUser
            }
            throw new AuthenticationError('Please log in first ')
        },
        removeBook: async (parent, { bookId }, params )
    }
};




module.exports = resolvers