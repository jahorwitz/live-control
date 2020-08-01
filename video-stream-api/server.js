const express = require('express');
const cors = require('cors');
const app = express();
const Pool = require('pg-pool');
const fs = require('fs');
const FileType = require('file-type');
const multiparty = require('multiparty');
const bodyParser = require('body-parser');

require('dotenv').config();
const { databaseConfig } = require('./config');
const uploadService = require('./services/uploadService');

app.use(cors());
app.use(bodyParser.json());

// Get all videos
app.get('/videos', async function (req, res) {
    const pool = new Pool(databaseConfig);
    const client = await pool.connect();
    const result = await client.query("SELECT * FROM videos");
    client.release();
    res.send(result.rows);
});

// Upload a new video
app.post('/videos', (request, response) => {
    const form = new multiparty.Form();
    form.parse(request, async (error, fields, files) => {
        if (error) {
            response.status(500).send(error);
        } else if (!fields.password.includes(process.env.ADMIN_UPLOAD_PASSWORD)) {
            response.status(403).send();
        } else {
            try {
                const path = files.file[0].path;
                const buffer = fs.readFileSync(path);
                const type = await FileType.fromBuffer(buffer);
                const timestamp = Date.now().toString();
                const fileName = `${timestamp}-lg`;
                const data = await uploadService.uploadFile(buffer, fileName, type);
    
                // Insert record into database
                const pool = new Pool(databaseConfig);
                const client = await pool.connect();
                await client.query(
                    `INSERT INTO videos (title, filename, url, resolutions)\
                        VALUES ('New Video ${fileName}', '${data.Key}', '${data.Location}', ARRAY[]::varchar[])`
                );
                const result = await client.query("SELECT * FROM videos");
                client.release();
                return response.status(200).send({
                    ...data,
                    videos: result.rows
                });
            } catch (awsUploadError) {
                console.log(awsUploadError);
                return response.status(400).send(awsUploadError);
            }
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