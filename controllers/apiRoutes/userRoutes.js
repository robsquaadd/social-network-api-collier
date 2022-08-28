const router = require("express").Router();
const { User, Thought } = require("../../models");

router.get("/", (req, res) => {
  User.find({})
    .then((dbUserData) => {
      res.json(dbUserData);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/:userId", (req, res) => {
  User.findOne({ _id: req.params.userId })
    .populate({ path: "friends", select: "-__v" })
    .populate({ path: "thoughts", select: "-__v" })
    .select("-__v")
    .then((dbUserData) => {
      if (!dbUserData) {
        res.status(404).json({ message: "No user with that id was found" });
        return;
      }
      res.json(dbUserData);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/", (req, res) => {
  User.create(req.body)
    .then((dbUserData) => {
      res.json(dbUserData);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.put("/:userId", (req, res) => {
  User.findOneAndUpdate({ _id: req.params.userId }, req.body, {
    new: true,
    runValidators: true,
  })
    .then((dbUserData) => {
      if (!dbUserData) {
        res.status(404).json({ message: "No user with that id exists" });
        return;
      }
      res.json(dbUserData);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.delete("/:userId", (req, res) => {
  User.findOneAndDelete({ _id: req.params.userId })
    .then((dbUserData) => {
      if (!dbUserData) {
        res.status(404).json({ message: "No user with that id exists" });
        return;
      }
      return Thought.deleteMany({ userId: dbUserData._id });
    })
    .then((dbThoughtData) => {
      res.json(dbThoughtData);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/:userId/friends/:friendId", (req, res) => {
  User.findOneAndUpdate(
    { _id: req.params.userId },
    { $push: { friends: req.params.friendId } },
    { new: true }
  )
    .then((dbUserData) => {
      if (!dbUserData) {
        res.status(404).json({ message: "No user with that id was found!" });
        return;
      }
      res.json(dbUserData);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.delete("/:userId/friends/:friendId", (req, res) => {
  User.findOneAndUpdate(
    { _id: req.params.userId },
    { $pull: { friends: req.params.friendId } },
    { new: true }
  )
    .then((dbUserData) => {
      if (!dbUserData) {
        res.status(404).json({ message: "No user with this id was found." });
        return;
      }
      res.json(dbUserData);
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
