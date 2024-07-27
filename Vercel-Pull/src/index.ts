//Access Key: 843025fbbc1a11529d9886dd7a3bde22
//Secret Access Key: 0f587fc2f03e6aaaa4049b46296b0de8a748ec3a485a51a03e8f6fa190b3bfcd
//End Point: https://84e761527c3629c31e8a5a30fe2d8e12.r2.cloudflarestorage.com

import express from "express";
import cors from "cors";
import simpleGit from "simple-git";
import { generate } from "./Generate";
import path from "path";
import { getAllFiles } from "./file";
import { uploadFile } from "./aws";
import { createClient } from "redis";
const publisher = createClient();
publisher.connect();

const subscriber = createClient();
subscriber.connect();

const app = express();
app.use(cors())
app.use(express.json());

// POSTMAN
app.post("/deploy", async (req, res) => {
    const repoUrl = req.body.repoUrl;
    const id = generate(); // asd12
    await simpleGit().clone(repoUrl, path.join(__dirname, `output/${id}`));
    const files = getAllFiles(path.join(__dirname, `output/${id}`));

    files.forEach(async file => {
        await uploadFile(file.slice(__dirname.length + 1), file);
    })

    publisher.lPush("build-queue", id);
    publisher.hSet ("status", id, "uploaded");

    res.json({
        id: id
    })
});

app.get("/status", async(req, res) => {
    const id = req.query.id;
    const response = await subscriber.hGet("status" , id as string);
    res.json({
        status: response
    })
})

// Start the server and listen on port 3000
app.listen(3000, '127.0.0.1', () => {
    console.log('Server is running on http://127.0.0.1:3000');
});
