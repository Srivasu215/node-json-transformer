import fs from "node:fs";
import path from "node:path";

const sourceDirectory = path.resolve("src/v4");
const files = fs.readdirSync(sourceDirectory)
    .filter((file) => file.endsWith(".js"));

const patterns = [
    "traverse(",
    "traverseObject(",
    "traverseArray(",
    "resolvePath(",
    "resolveValue("
];

console.log("V4 source search\n");

files.forEach((file) => {
    const filePath = path.join(sourceDirectory, file);
    const lines = fs.readFileSync(filePath, "utf8").split("\n");

    lines.forEach((line, index) => {
        if (patterns.some((pattern) => line.includes(pattern))) {
            console.log(
                `${file}:${index + 1}: ${line.trim()}`
            );
        }
    });
});
