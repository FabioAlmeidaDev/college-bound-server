const express = require("express");
const mongoose = require("mongoose");
const auth = require("../middleware/requireAuth");

const Athlete = mongoose.model("Athlete");
const Covid = mongoose.model("Covid");

const router = express.Router();

// router.use(auth);

router.get("/athletes/find", async (req, res) => {
  // the user id is available in the req already because we set the req.user after we authenticate the user with the JWT
  const athletes = await Athlete.find({ userId: req.user._id });
  res.send(athletes);
});
router.get("/athletes/all", async (req, res) => {
  // the user id is available in the req already because we set the req.user after we authenticate the user with the JWT
  const athletes = await Athlete.find();
  res.send(athletes);
});
router.get("/athletes/duplicates", async (req, res) => {
  // the user id is available in the req already because we set the req.user after we authenticate the user with the JWT
  const group = {
    _id: "$name",
    uniqueIds: { $addToSet: "$_id" },
    count: { $sum: 1 },
  };
  const filter = { count: { $gt: 1 } };
  const athletes = await Athlete.aggregate([{ $group: group }, { $match: filter }]);

  // check if an id answered the covid questionaire
  for (let i in athletes) {
    const uniqueIdsCount = {};
    for (let k in athletes[i].uniqueIds) {
      const qCount = await Covid.find().where("userId").equals(athletes[i].uniqueIds[k]).countDocuments();
      uniqueIdsCount[athletes[i].uniqueIds[k]] = qCount;
    }
    athletes[i].uniqueIds = uniqueIdsCount;
  }
  res.send(athletes);
});

router.get("/athletes/duplicates/no_responses", async (req, res) => {
  // the user id is available in the req already because we set the req.user after we authenticate the user with the JWT
  const output = [];

  const group = {
    _id: "$name",
    uniqueIds: { $addToSet: "$_id" },
    count: { $sum: 1 },
  };
  const filter = { count: { $gt: 1 } };
  const athletes = await Athlete.aggregate([{ $group: group }, { $match: filter }]);

  // check if an id answered the covid questionaire
  for (let i in athletes) {
    const uniqueIdsCount = {};
    for (let k in athletes[i].uniqueIds) {
      const qCount = await Covid.find().where("userId").equals(athletes[i].uniqueIds[k]).countDocuments();
      if (qCount == 0) {
        uniqueIdsCount[athletes[i].uniqueIds[k]] = qCount;
        console.log("athlete: ", athletes[i]._id, athletes[i].uniqueIds[k], qCount);
      }
    }
    if (Object.keys(uniqueIdsCount).length > 0) {
      athletes[i].uniqueIds = uniqueIdsCount;
      output.push(athletes[i]);
    }
  }
  res.send(output);
});

router.get("/athletes/delete_duplicates_with_zero_answers", async (req, res) => {
  // the user id is available in the req already because we set the req.user after we authenticate the user with the JWT
  const output = [];

  const group = {
    _id: "$name",
    uniqueIds: { $addToSet: "$_id" },
    count: { $sum: 1 },
  };
  const filter = { count: { $gt: 1 } };
  const athletes = await Athlete.aggregate([{ $group: group }, { $match: filter }]);

  // check if an id answered the covid questionaire
  for (let i in athletes) {
    const uniqueIdsCount = {};
    for (let k in athletes[i].uniqueIds) {
      const qCount = await Covid.find().where("userId").equals(athletes[i].uniqueIds[k]).countDocuments();
      if (qCount == 0) {
        uniqueIdsCount[athletes[i].uniqueIds[k]] = qCount;
        console.log("DELETING: ", athletes[i]._id), " with id: ", athletes[i].uniqueIds[k];
        await Athlete.deleteOne({ _id: athletes[i].uniqueIds[k] }, function (err, res) {
          // console.log("DELETED: ", res);
        });
      }
    }
    if (Object.keys(uniqueIdsCount).length > 0) {
      athletes[i].uniqueIds = uniqueIdsCount;
      output.push(athletes[i]);
    }
  }
  res.send(output);
});

router.post("/athletes/merge_answers", async (req, res) => {
  // the user id is available in the req already because we set the req.user after we authenticate the user with the JWT
  let { old_id, new_id } = req.body;
  const update = await Covid.updateMany({ userId: old_id }, { $set: { userId: new_id } });
  res.send(update);
});

module.exports = router;
