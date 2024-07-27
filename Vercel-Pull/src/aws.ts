import { S3 } from "aws-sdk";
import fs from "fs";

const s3= new S3({
    accessKeyId: "843025fbbc1a11529d9886dd7a3bde22",
    secretAccessKey: "0f587fc2f03e6aaaa4049b46296b0de8a748ec3a485a51a03e8f6fa190b3bfcd",
    endpoint: "https://84e761527c3629c31e8a5a30fe2d8e12.r2.cloudflarestorage.com" //if using AWS, it will directly choose the end point.
})

export const uploadFile = async (fileName: string, localFilePath: string) => {
    console.log("Called")
    const fileContent = fs.readFileSync(localFilePath);
    const response = await s3.upload({
        Body: fileContent,
        Bucket: "vercel-homeproject",
        Key: fileName,
    }).promise();
    console.log(response)

}