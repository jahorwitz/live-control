const express = require('express');
const cors = require('cors');
const app = express();
const Pool = require('pg-pool');
const fs = require('fs');
const fileType = require('file-type');
const multiparty = require('multiparty');
const bodyParser = require('body-parser');
const { databaseConfig } = require('./config');
require('dotenv').config();

const uploadService = require('./services/uploadService');

app.use(cors());
app.use(bodyParser.json());

// Get all videos
app.get('/videos', async function (req, res) {
    const pool = new Pool(databaseConfig);
    const client = await pool.connect();
    const result = await client.query("select * from videos");
    client.release();
    res.send(result.rows);
});

// Upload a new video
app.post('/videos', (request, response) => {
    const form = new multiparty.Form();
    form.parse(request, async (error, fields, files) => {
        if (error) {
            res.status(500).send(error);
        }
        try {
            const path = files.file[0].path;
            const buffer = fs.readFileSync(path);
            const type = fileType(buffer);
            const timestamp = Date.now().toString();
            const fileName = `${timestamp}-lg`;
            const data = await uploadService.uploadFile(buffer, fileName, type);

            // Insert record into database
            // const pool = new Pool(databaseConfig);
            // const client = await pool.connect();
            // const result = await client.query("select  from videos");
            // client.release();
            return response.status(200).send(data);
        } catch (awsUploadError) {
            return response.status(400).send(awsUploadError);
        }
    });
});

// Update a video
// app.put('/videos/:id', async function (req, res) {
//     const pool = new Pool(databaseConfig);
//     const client = await pool.connect();
//     const result = await client.query("select * from videos");
//     client.release();
//     res.send(result.rows);
// });


app.listen(8081);