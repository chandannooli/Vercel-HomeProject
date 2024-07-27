"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const aws_sdk_1 = require("aws-sdk");
const s3 = new aws_sdk_1.S3({
    accessKeyId: "843025fbbc1a11529d9886dd7a3bde22",
    secretAccessKey: "0f587fc2f03e6aaaa4049b46296b0de8a748ec3a485a51a03e8f6fa190b3bfcd",
    endpoint: "https://84e761527c3629c31e8a5a30fe2d8e12.r2.cloudflarestorage.com" //if using AWS, it will directly choose the end point.
});
const app = (0, express_1.default)();
app.get("/*", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const host = req.hostname;
    const id = host.split(".")[0];
    const filePath = req.path;
    console.log(id);
    console.log(filePath);
    const key_value = `build/${id}${filePath}`;
    try {
        const contents = yield s3.getObject({
            Bucket: "vercel-homeproject",
            Key: key_value,
        }).promise();
        const type = filePath.endsWith("html") ? "text/html" : filePath.endsWith("css") ? "text/css" : "application/javascript";
        res.set("Content-Type", type);
        res.send(contents.Body);
    }
    catch (error) {
        console.log(`Pathway ${key_value} not found.`);
    }
}));
app.listen(3001);
