const { Book, User } = require("../models");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id }).select('-__v -password');
        return userData;
      }
      throw new AuthenticationError('You need to be logged in!');
    },
  

  },
  Mutation: {
    deleteBook: async ({ user, params }, res) => {
        const updatedUser = await User.findOneAndUpdate(
          { _id: user._id },
          { $pull: { savedBooks: { bookId: params.bookId } } },
          { new: true }
        );
        if (!updatedUser) {
          return res.status(404).json({ message: "Couldn't find user with this id!" });
        }
        return res.json(updatedUser);
      },
      createUser: async ({ body }, res) => {
        const user = await User.create(body);
        if (!user) {
          return res.status(400).json({ message: "Something is wrong!" });
        }
        const token = signToken(user);
        res.json({ token, user });
      },
      login: async ({ body }, res) => {
        const user = await User.findOne({
          $or: [{ username: body.username }, { email: body.email }],
        });
        if (!user) {
          return res.status(400).json({ message: "Can't find this user" });
        }
        const correctPw = await user.isCorrectPassword(body.password);
  
        if (!correctPw) {
          return res.status(400).json({ message: "Wrong password!" });
        }
        const token = signToken(user);
        res.json({ token, user });
      },
      saveBook: async ({ user, body }, res) => {
        console.log(user);
        try {
          const updatedUser = await User.findOneAndUpdate(
            { _id: user._id },
            { $addToSet: { savedBooks: body } },
            { new: true, runValidators: true }
          );
          return res.json(updatedUser);
        } catch (err) {
          console.log(err);
          return res.status(400).json(err);
        }
      },
  },
};

module.exports = resolvers;
