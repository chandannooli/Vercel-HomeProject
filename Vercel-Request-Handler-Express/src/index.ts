 import express from "express";
 import { S3 } from "aws-sdk";

 
const s3= new S3({
    accessKeyId: "843025fbbc1a11529d9886dd7a3bde22",
    secretAccessKey: "0f587fc2f03e6aaaa4049b46296b0de8a748ec3a485a51a03e8f6fa190b3bfcd",
    endpoint: "https://84e761527c3629c31e8a5a30fe2d8e12.r2.cloudflarestorage.com" //if using AWS, it will directly choose the end point.
})

 const app = express();

 app.get("/*", async (req, res) => {
    const host = req.hostname;

    const id = host.split(".")[0];
    const filePath = req.path;
    console.log(id);
    console.log(filePath);

    const key_value = `build/${id}${filePath}`

    try{
        const contents = await s3.getObject({
            Bucket: "vercel-homeproject",
            Key: key_value,
        }).promise();

        const type = filePath.endsWith("html")? "text/html" : filePath.endsWith("css") ? "text/css" : "application/javascript"
        res.set("Content-Type", type);
        res.send(contents.Body);


    } catch (error) {
        console.log(`Pathway ${key_value} not found.`);
    }

 })

 app.listen(3001);