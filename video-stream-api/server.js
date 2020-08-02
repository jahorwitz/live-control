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
const resizeService = require('./services/resizeService');

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
                const type = await FileType.fromBuffer(fs.readFileSync(path));
                const timestamp = Date.now().toString();
                const fileName = `${timestamp}`;

                console.log("Calling resize service...");
                const resizedStreams = await resizeService.resizeVideo(path, type);
                const uploadPromises = [];
                console.log("Finished resizing...");

                resizedStreams.forEach(video => {
                    const buffer = fs.readFileSync(video.path);
                    const data = uploadService.uploadFile(buffer, `${fileName}-${video.resolution}`, type);
                    uploadPromises.push(data);
                })

                await Promise.all(uploadPromises);
                console.log("Finished uploading...");
    
                // Insert record into database
                const pool = new Pool(databaseConfig);
                const client = await pool.connect();
                await client.query(
                    `INSERT INTO videos (title, filename, resolutions)\
                        VALUES ('New Video ${fileName}', '${fileName}', ARRAY['${resizedStreams.map(stream => stream.resolution).join(`', '`)}'])`
                );
                const result = await client.query("SELECT * FROM videos");
                client.release();
                return response.status(200).send({
                    videos: result.rows
                });
            } catch (awsUploadError) {
                console.log(awsUploadError);
                return response.status(500).send(awsUploadError);
            }
        }
    });
});

// Update a video
app.put('/videos/:id', async function (request, response) {
    const form = new multiparty.Form();
    form.parse(request, async (error, fields) => {
        if (error) {
            response.status(500).send(error);
        } else if (!fields.password.includes(process.env.ADMIN_UPLOAD_PASSWORD)) {
            response.status(403).send();
        } else {
            try {
                const title = fields.title[0];
                const pool = new Pool(databaseConfig);
                const client = await pool.connect();
                await client.query(
                    `UPDATE videos SET "title" = '${title}' where "id" = ${request.params.id}`
                );
                const result = await client.query("SELECT * FROM videos");
                client.release();
                return response.status(200).send({
                    videos: result.rows
                });
            } catch (dbUpdateError) {
                return response.status(500).send(dbUpdateError);
            }
        }
    });
});


app.listen(8081);