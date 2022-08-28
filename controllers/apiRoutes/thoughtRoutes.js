const router = require("express").Router();
const { Thought, User } = require("../../models");

router.get("/", (req, res) => {
  Thought.find({})
    .then((dbThoughtData) => {
      res.json(dbThoughtData);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/:thoughtId", (req, res) => {
  Thought.findOne({ _id: req.params.thoughtId })
    .then((dbThoughtData) => {
      if (!dbThoughtData) {
        res.status(404).json("No thought with that id exists.");
        return;
      }
      res.json(dbThoughtData);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/", (req, res) => {
  Thought.create(req.body)
    .then((dbThoughtData) => {
      return User.findOneAndUpdate(
        { _id: dbThoughtData.userId },
        { $push: { thoughts: dbThoughtData._id } },
        { new: true, runValidators: true }
      );
    })
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

router.put("/:thoughtId", (req, res) => {
  Thought.findOneAndUpdate({ _id: req.params.thoughtId }, req.body, {
    new: true,
    runValidators: true,
  })
    .then((dbThoughtData) => {
      if (!dbThoughtData) {
        res.status(404).json({ message: "No thought with that id was found" });
        return;
      }
      res.json(dbThoughtData);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.delete("/:thoughtId", (req, res) => {
  Thought.findOneAndDelete({ _id: req.params.thoughtId })
    .then((dbThoughtData) => {
      if (!dbThoughtData) {
        res.status(404).json({ message: "No thought with that id was found" });
        return;
      }
      res.json(dbThoughtData);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/:thoughtId/reactions", (req, res) => {
  Thought.findOneAndUpdate(
    { _id: req.params.thoughtId },
    { $push: { reactions: req.body } },
    { new: true, runValidators: true }
  )
    .then((dbThoughtData) => {
      if (!dbThoughtData) {
        res.status(404).json({ message: "No thought with that id was found" });
        return;
      }
      res.json(dbThoughtData);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.delete("/:thoughtId/reactions/:reactionId", (req, res) => {
  Thought.findOneAndUpdate(
    { _id: req.params.thoughtId },
    { $pull: { reactions: { reactionId: req.params.reactionId } } },
    { new: true }
  )
    .then((dbThoughtData) => {
      if (!dbThoughtData) {
        res.status(404).json({ message: "No thought with that id was found" });
        return;
      }
      res.json(dbThoughtData);
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
