const db = require("../models");
const kafkaClient = require("../kafka")
const kafkaConfig = require("../kafka/config")
const { v4: uuidv4 } = require('uuid');
const License = db.license;
const Op = db.Sequelize.Op;

const producer = kafkaClient.producer;

// Create and Save a new License
exports.create = (req, res) => {

    // Validate request
  if (!req.body.userId) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  // Create a License
  const license = {
    userId: req.body.userId,
    validityDays: req.body.validityDays
  };
  // Save License in the database
  License.create(license)
    .then(data => {
      kafkaClient.sendActionMessage("LICENSE_CREATE_SUCCESS", data)
      res.send(data);
    })
    .catch(err => {
      kafkaClient.sendActionMessage("LICENSE_CREATE_FAIL", req.body)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the License."
      });
    }); 
};

exports.createTrigger = (body) => {

  // Validate request
if (!body.userId) {
  res.status(400).send({
    message: "Content can not be empty!"
  });
  return;
}

// Create a License
const license = {
  userId: body.userId,
  validityDays: body.validityDays ? body.validityDays : 30
};
// Save License in the database
License.create(license)
  .then(data => {
    kafkaClient.sendActionMessage("LICENSE_CREATE_SUCCESS", data)
  })
  .catch(err => {
    kafkaClient.sendActionMessage("LICENSE_CREATE_FAIL", req.body)
  }); 
};

// Retrieve all License from the database.
exports.findAll = (req, res) => {
    const userId = req.query.userId;
    var condition = userId ? { userId: { [Op.like]: `%${userId}%` } } : null;
    License.findAll({ where: condition })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving Licenses."
        });
      });
};

// Find a single License with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
    License.findByPk(id)
      .then(data => {
        if (data) {
          res.send(data);
        } else {
          res.status(404).send({
            message: `Cannot find License with id=${id}.`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error retrieving License with id=" + id
        });
      });
};
// Update a License by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;
    License.update(req.body, {
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          kafkaClient.sendActionMessage("LICENSE_UPDATE_SUCCESS", req.params)
          res.send({
            message: "License was updated successfully."
          });
        } else {
          kafkaClient.sendActionMessage("LICENSE_UPDATE_FAIL", req.params)
          res.send({
            message: `Cannot update License with id=${id}. Maybe License was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        kafkaClient.sendActionMessage("LICENSE_UPDATE_FAIL", req.params)
        res.status(500).send({
          message: "Error updating License with id=" + id
        });
      });
};
// Delete a License with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
    License.destroy({
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          kafkaClient.sendActionMessage("LICENSE_DELETE_SUCCESS", req.params)
          res.send({
            message: "License was deleted successfully!"
          });
        } else {
          kafkaClient.sendActionMessage("LICENSE_DELETE_FAIL", req.params)
          res.send({
            message: `Cannot delete License with id=${id}. Maybe License was not found!`
          });
        }
      })
      .catch(err => {
        kafkaClient.sendActionMessage("LICENSE_DELETE_FAIL", req.params)
        res.status(500).send({
          message: "Could not delete License with id=" + id
        });
      });
};
// Delete all License from the database.
exports.deleteAll = (req, res) => {
  License.destroy({
        where: {},
        truncate: false
      })
        .then(nums => {
          kafkaClient.sendActionMessage("LICENSE_FLUSH_SUCCESS", {})
          res.send({ message: `${nums} License were deleted successfully!` });
        })
        .catch(err => {
          kafkaClient.sendActionMessage("LICENSE_FLUSH_FAIL", {})
          res.status(500).send({
            message:
              err.message || "Some error occurred while removing all Licenses."
          });
        });
};
