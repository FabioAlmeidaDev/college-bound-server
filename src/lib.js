const create = async function (model, obj) {
  if (model.create) {
    model.create({ obj }, function (err) {
      if (err) {
        res.send(err);
      } else {
        res.send(true);
      }
    });
  }
};
module.exports = {
  create,
};
