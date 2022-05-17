const express = require('express');
const { validateToken } = require('../middleware/JWT');
const router = express.Router();
const ObjectID = require('mongoose').Types.ObjectId;

const { RoversModel } = require('../models/roversModel');

/**
 * @swagger
 * components:
 *  schemas:
 *    Rover:
 *      type: object
 *      required:
 *        - name
 *        - launch_date
 *        - construction_date
 *        - rover_constructor
 *        - image
 *      properties:
 *        id:
 *          type: string
 *          description: The auto-generated id of the rover
 *        name:
 *          type: string
 *          description: The rover name
 *        launch_date:
 *          type: date
 *          description: The rover launch_date
 *        construction_date:
 *          type: date
 *          description: The rover construction date
 *        rover_contructor:
 *          type: string
 *          description: The rover contructor
 *        image:
 *          type: string
 *          description: The rover image
 *      example:
 *        name: Rover
 *        launch_date: 01/01/2001
 *        construction_date: 01/01/2000
 *        rover_constructor: Rover Construction Ltd
 *        image: image.png
 */

/**
 * @swagger
 * tags:
 *  name: Rovers
 *  description: The rovers managing API
 */

/**
 * @swagger
 * /rovers:
 *  get:
 *    summary: Returns the list of all the rovers
 *    tags: [Rovers]
 *    responses:
 *      200:
 *        description: The list of the rovers
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: "#/components/schemas/Rover"
 */

router.get('/', (req, res) => {
  RoversModel.find((err, docs) => {
    if (!err) res.send(docs);
    else console.log("Error to get all rovers : " + err);
  })
});

/**
 * @swagger
 * /rovers/{id}:
 *  get:
 *    summary: Returns the rover by id
 *    tags: [Rovers]
 *    parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The rover id
 *    responses:
 *      200:
 *        description: The rover
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: "#/components/schemas/Rover"
 *      404:
 *        description: The rover was not found
 */

 router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const rover = await RoversModel.findById(id);

    res.status(200).json(rover);
  } catch (error) {
      res.status(404).json({ message: error.message });
  }
});

/**
 * @swagger
 * /rovers:
 *  post:
 *    summary: Create a new rover
 *    tags: [Rovers]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/Rover"
 *    responses:
 *      200:
 *        description: The rover was successfully created
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Rover"
 *      500:
 *        description: Some server error
 */

router.post('/', (req, res) => {
  const newRecord = new RoversModel({
    // id: req.body.id,
    name: req.body.name,
    launch_date: req.body.launch_date,
    construction_date: req.body.construction_date,
    rover_constructor: req.body.rover_constructor,
    image: req.body.image
  });

  newRecord.save((err, docs) => {
    if (!err) res.send(docs);
    else console.log('Error creating new rover : ' + err);
  })
});

/**
 * @swagger
 * /rovers/{id}:
 *  put:
 *    summary: Update the rover by the id
 *    tags: [Rovers]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The rover id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/Rover"
 *    responses:
 *      200:
 *        description: The rover was successfully updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Rover"
 *      404:
 *        description: The rover was not found
 *      500:
 *        description: Some server error
 */

router.put("/:id", (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknow : " + req.params.id)
  
  const updateRecord = {
    // id: req.body.id,
    name: req.body.name,
    launch_date: req.body.launch_date,
    constructor_date: req.body.constructor_date,
    rover_constructor: req.body.rover_constructor,
    image: req.body.image
  };

  RoversModel.findByIdAndUpdate(
    req.params.id,
    { $set: updateRecord},
    { new: true },
    (err, docs) => {
      if (!err) res.send(docs);
      else console.log("Update rover error : " + err);
    }
  )
});

/**
 * @swagger
 * /rovers/{id}:
 *  delete:
 *    summary: Delete the rover by the id
 *    tags: [Rovers]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The rover id
 *    responses:
 *      200:
 *        description: The rover was successfully deleted
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Rover"
 *      404:
 *        description: The rover was not found
 */

router.delete("/:id", (req, res) => {
  try {
    if (!ObjectID.isValid(req.params.id))
      return res.status(400).send("ID unknow : " + req.params.id)
  
    RoversModel.findByIdAndRemove(
      req.params.id,
      (err, docs) => {
        if (!err) res.send(docs);
        else console.log("Delete rover error : " + err);
      })
  } catch(err) {
    return res.status(500).send("User not Authenticated!: ", err)
  }
});

module.exports = router;