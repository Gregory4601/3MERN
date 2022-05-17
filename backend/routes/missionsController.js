const express = require('express');
const router = express.Router();
const ObjectID = require('mongoose').Types.ObjectId;

const { MissionsModel } = require('../models/missionsModel');

/**
 * @swagger
 * components:
 *  schemas:
 *    Mission:
 *      type: object
 *      required:
 *        - country
 *        - start_date
 *        - end_date
 *        - rovers
 *      properties:
 *        id:
 *          type: string
 *          description: The auto-generated id of the mission
 *        country:
 *          type: string
 *          description: The mission country
 *        start_date:
 *          type: string
 *          description: The mission start date
 *        end_date:
 *          type: string
 *          description: The mission end date
 *        rovers:
 *          type: string
 *          description: The mission rovers
 *      example:
 *        country: France
 *        start_date: 01/01/2000
 *        end_date: 01/01/2001
 *        rovers: Rover
 */

/**
 * @swagger
 * tags:
 *  name: Missions
 *  description: The missions managing API
 */

/**
 * @swagger
 * /missions:
 *  get:
 *    summary: Returns the list of all the missions
 *    tags: [Missions]
 *    responses:
 *      200:
 *        description: The list of the missions
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: "#/components/schemas/Mission"
 */

router.get('/', (req, res) => {
  MissionsModel.find((err, docs) => {
    if (!err) res.send(docs);
    else console.log("Error to get all missions : " + err);
  })
});

/**
 * @swagger
 * /missions/{id}:
 *  get:
 *    summary: Returns the mission by id
 *    tags: [Missions]
 *    parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The mission id
 *    responses:
 *      200:
 *        description: The mission
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: "#/components/schemas/Mission"
 *      404:
 *        description: The mission was not found
 */

 router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const mission = await MissionsModel.findById(id);

    res.status(200).json(mission);
  } catch (error) {
      res.status(404).json({ message: error.message });
  }
});

/**
 * @swagger
 * /missions:
 *  post:
 *    summary: Create a new mission
 *    tags: [Missions]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/Mission"
 *    responses:
 *      200:
 *        description: The mission was successfully created
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Mission"
 *      500:
 *        description: Some server error
 */

router.post('/', (req, res) => {
  const newRecord = new MissionsModel({
    // id: req.body.id,
    country: req.body.country,
    start_date: req.body.start_date,
    end_date: req.body.end_date,
    rovers: req.body.rovers
  });

  newRecord.save((err, docs) => {
    if (!err) res.send(docs);
    else console.log('Error creating new mission : ' + err);
  })
});

/**
 * @swagger
 * /missions/{id}:
 *  put:
 *    summary: Update the mission by the id
 *    tags: [Missions]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The mission id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/Mission"
 *    responses:
 *      200:
 *        description: The mission was successfully updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Mission"
 *      404:
 *        description: The mission was not found
 *      500:
 *        description: Some server error
 */

router.put("/:id", (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknow : " + req.params.id)
  
  const updateRecord = {
    // id: req.body.id,
    country: req.body.country,
    start_date: req.body.start_date,
    end_date: req.body.end_date,
    rovers: req.body.rovers
  };

  MissionsModel.findByIdAndUpdate(
    req.params.id,
    { $set: updateRecord},
    { new: true },
    (err, docs) => {
      if (!err) res.send(docs);
      else console.log("Update mission error : " + err);
    }
  )
});

/**
 * @swagger
 * /missions/{id}:
 *  delete:
 *    summary: Delete the mission by the id
 *    tags: [Missions]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The mission id
 *    responses:
 *      200:
 *        description: The mission was successfully deleted
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Mission"
 *      404:
 *        description: The mission was not found
 */

router.delete("/:id", (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknow : " + req.params.id)
  
  MissionsModel.findByIdAndRemove(
    req.params.id,
    (err, docs) => {
      if (!err) res.send(docs);
      else console.log("Delete mission error : " + err);
    })
});

module.exports = router;