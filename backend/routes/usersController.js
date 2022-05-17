const express = require('express');
const router = express.Router();
const ObjectID = require('mongoose').Types.ObjectId;
const bcrypt = require('bcrypt');

const { UsersModel } = require('../models/usersModel');

/**
 * @swagger
 * components:
 *  schemas:
 *    User:
 *      type: object
 *      required:
 *        - email
 *        - pseudo
 *        - password
 *        - isAdmin
 *      properties:
 *        id:
 *          type: string
 *          description: The auto-generated id of the user
 *        email:
 *          type: string
 *          description: The user email
 *        pseudo:
 *          type: string
 *          description: The user pseudo
 *        password:
 *          type: string
 *          description: The user password
 *        isAdmin:
 *          type: boolean
 *          description: The user is Admin?
 *      example:
 *        email: user@email.com
 *        pseudo: user1234
 *        password: password1234
 *        isAdmin: false
 */

/**
 * @swagger
 * tags:
 *  name: Users
 *  description: The users managing API
 */

/**
 * @swagger
 * /users:
 *  get:
 *    summary: Returns the list of all the users
 *    tags: [Users]
 *    responses:
 *      200:
 *        description: The list of the users
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: "#/components/schemas/User"
 */

router.get('/', (req, res) => {
  UsersModel.find((err, docs) => {
    if (!err) res.send(docs);
    else console.log("Error to get all users : " + err);
  })
});

/**
 * @swagger
 * /users/{id}:
 *  get:
 *    summary: Returns the user by id
 *    tags: [Users]
 *    parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *    responses:
 *      200:
 *        description: The user
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: "#/components/schemas/User"
 *      404:
 *        description: The user was not found
 */

 router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const user = await UsersModel.findById(id);

    res.status(200).json(user);
  } catch (error) {
      res.status(404).json({ message: error.message });
  }
});

/**
 * @swagger
 * /users:
 *  post:
 *    summary: Create a new user
 *    tags: [Users]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/User"
 *    responses:
 *      200:
 *        description: The user was successfully created
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/User"
 *      500:
 *        description: Some server error
 */

router.post('/', async (req, res) => {
  try {
    const isAdmin = "";
    if (req.body.isAdmin) {
      isAdmin = req.body.isAdmin;
    } else {
      isAdmin = false;
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const newRecord = new UsersModel({
      email: req.body.email,
      pseudo: req.body.pseudo,
      password: hashedPassword,
      isAdmin: isAdmin
    });
    newRecord.save((err, docs) => {
      if (!err) res.status(200).send(docs);
      else console.log('Error creating new user : ' + err);
    })
  } catch {
    res.status(500).send("Error 500");
  }
})

/**
 * @swagger
 * /users/{id}:
 *  put:
 *    summary: Update the user by the id
 *    tags: [Users]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The user id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/User"
 *    responses:
 *      200:
 *        description: The user was successfully updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/User"
 *      404:
 *        description: The user was not found
 *      500:
 *        description: Some server error
 */

router.put("/:id", async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknow : " + req.params.id)
  
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const updateRecord = {
    // id: req.body.id,
    email: req.body.email,
    pseudo: req.body.pseudo,
    password: hashedPassword,
    isAdmin: req.body.isAdmin
  };

  UsersModel.findByIdAndUpdate(
    req.params.id,
    { $set: updateRecord},
    { new: true },
    (err, docs) => {
      if (!err) res.send(docs);
      else console.log("Update user error : " + err);
    }
  )
  } catch {
    res.status(500).send("Error 500");
  }
});

/**
 * @swagger
 * /users/{id}:
 *  delete:
 *    summary: Delete the user by the id
 *    tags: [Users]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The user id
 *    responses:
 *      200:
 *        description: The user was successfully deleted
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/User"
 *      404:
 *        description: The user was not found
 */

router.delete("/:id", (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknow : " + req.params.id)
  
  UsersModel.findByIdAndRemove(
    req.params.id,
    (err, docs) => {
      if (!err) res.send(docs);
      else console.log("Delete user error : " + err);
    })
});

module.exports = router;