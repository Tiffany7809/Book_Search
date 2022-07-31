const { User } = require("../models");
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');


const resolvers = {
  Query: {
    // me: async (parent, args, context) => {
    //   if (context.user) {
    //     const userData = await User.findOne({ _id: context.user._id }).select(
    //       "-__v -password"
    //     );
    //     return userData;
    //   }
    //   throw new AuthenticationError("You need to be logged in!");
    // },


    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({_id: context.user._id}).select('-__v -password');
        return userData;
      }
      throw new AuthenticationError ('Please Log in!')
    },
  },

  Mutation: {
    // deleteBook: async ({ user, params }, res) => {
    //   const updatedUser = await User.findOneAndUpdate(
    //     { _id: user._id },
    //     { $pull: { savedBooks: { bookId: params.bookId } } },
    //     { new: true }
    //   );
    //   if (!updatedUser) {
    //     return res
    //       .status(404)
    //       .json({ message: "Couldn't find user with this id!" });
    //   }
    //   return res.json(updatedUser);
    // },

    deleteBook: async (parent, { bookId}, context) => {
     if (context.user) {
      const updatedUser = await User.findOneAndUpdate(
        {_id: context.user._id},
        {$pull: {savedBooks: {bookId}}},
        {new: true}
      );
      return updatedUser;
     }
     throw new AuthenticationError( 'you must be logged in!')
    },



    // addUser: async ({ body }, res) => {
    //   const user = await User.create(body);
    //   if (!user) {
    //     return res.status(400).json({ message: "Something is wrong!" });
    //   }
    //   const token = signToken(user);
    //   res.json({ token, user });
    // },


    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);
      return {token, user};
    },
    
    // login: async ({ body }, res) => {
    //   const user = await User.findOne({
    //     $or: [{ username: body.username }, { email: body.email }],
    //   });
    //   if (!user) {
    //     return res.status(400).json({ message: "Can't find this user" });
    //   }
    //   const correctPw = await user.isCorrectPassword(body.password);

    //   if (!correctPw) {
    //     return res.status(400).json({ message: "Wrong password!" });
    //   }
    //   const token = signToken(user);
    //   res.json({ token, user });
    // },


    login: async (parent, {email, password}) => {
      const user = await User.findOne({email});
      if(!user) {
        throw new AuthenticationError ('login failed, forget your password?');
      }
      const corectPw = await user.isCorrectPassword(password);
      if(!correctPw) {
        throw new AuthenticationError('Wrong password!');
      }
      const token = signToken(user);
      return { token, user };

    },




    // saveBook: async ({ user, body }, res) => {
    //   console.log(user);
    //   try {
    //     const updatedUser = await User.findOneAndUpdate(
    //       { _id: user._id },
    //       { $addToSet: { savedBooks: body } },
    //       { new: true, runValidators: true }
    //     );
    //     return res.json(updatedUser);
    //   } catch (err) {
    //     console.log(err);
    //     return res.status(400).json(err);
    //   }
    // },

    saveBook: async (parent, {newBook}, context ) => {
      if (context.user) {
        const updatedUser = await User.findByIdAndUpdate(
          {_id: contect.user._id},
          {$push: {savedBooks: newBook }},
          {new: true}
        );
        return updatedUser;
      }
      throw new AuthenticationError('you must be logged in to save books!')
    },
  },
};

module.exports = resolvers;
