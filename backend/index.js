const express = require('express');
const app = express();
require('./models/dbConfig');
const authenticatorRoutes = require('./routes/authenticatorController');
const usersRoutes = require('./routes/usersController');
const roversRoutes = require('./routes/roversController');
const missionsRoutes = require('./routes/missionsController');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const { validateToken } = require('./middleware/JWT');

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "3MERN: SpaceX API",
            version: "1.0.0",
            description: "A SpaceX API to produce the best live data for everything linked to space travel, launches and missions"
        },
        servers: [
            {
                url: "http://localhost:5000"
            }
        ]
    },
    apis: ["./routes/*.js"]
}

const specs = swaggerJsDoc(options);

// mongoose.set('useFindAndModify', false);

app.use(bodyParser.json());
app.use(cors());
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
app.use('/authentification', authenticatorRoutes)
app.use('/users', usersRoutes);
app.use('/rovers', roversRoutes);
app.use('/missions', missionsRoutes);

app.listen(5000, () => console.log('Server started: 5000'));