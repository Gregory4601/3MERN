const express = require('express');
const app = express();
const router = express.Router();
const ObjectID = require('mongoose').Types.ObjectId;
const bcrypt = require('bcrypt');

const cookieParser = require('cookie-parser');

const { UsersModel } = require('../models/usersModel');
const { createTokens } = require('./../middleware/JWT')

app.use(cookieParser());

/**
 * @swagger
 * components:
 *  schemas:
 *    Authentification:
 *      type: object
 *      required:
 *        - pseudo
 *        - password
 *      properties:
 *        pseudo:
 *          type: string
 *          description: The user pseudo
 *        password:
 *          type: string
 *          description: The user password
 *      example:
 *        pseudo: user1234
 *        password: password1234
 */

/**
 * @swagger
 * tags:
 *  name: Authentification
 *  description: The authentication managing API
 */

/**
 * @swagger
 * /authentification/login:
 *  post:
 *    summary: Login user
 *    tags: [Authentification]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/Authentification"
 *    responses:
 *      200:
 *        description: The user was successfully logged in
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Authentification"
 *      500:
 *        description: Some server error
 */

router.post('/login', async (req, res) => {
  const user = await UsersModel.findOne({'pseudo':req.body.pseudo})

  if (user == null) {
    // console.log('Cannot find user');
    return res.status(400).send('Cannot find user: Pseudo does not exist');
  }
  if(await bcrypt.compare(req.body.password, user.password)) {
    const accessToken = createTokens(user);
    res.cookie("access_Token", accessToken, {
      maxAge: 60*60*1000
    })
    // console.log('Login succesfull: Good password');
    return res.status(200).send({"Access_Token": accessToken});
  } else {
    // console.log('Login error: Password is not good');
    return res.status(400).send('Login error: Password is not good');
  }
})

module.exports = router;