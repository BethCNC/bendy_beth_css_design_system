const fs = require("fs");
const path = require("path");

const map = JSON.parse(fs.readFileSync("./lint/rename-map.json", "utf-8"));

const flatMap = Object.values(map).reduce((acc, group) => {
  return { ...acc, ...group };
}, {});

const APPLY = process.argv.includes("--apply");

function processFile(filePath) {
  let content = fs.readFileSync(filePath, "utf-8");
  let modified = false;

  for (const [oldName, newName] of Object.entries(flatMap)) {
    if (content.includes(oldName)) {
      console.log(
        `${APPLY ? "replacing" : "would replace"} ${oldName} → ${newName} in ${filePath}`
      );
      if (APPLY) {
        content = content.replace(new RegExp(oldName, "g"), newName);
        modified = true;
      }
    }
  }

  if (APPLY && modified) {
    fs.writeFileSync(filePath, content, "utf-8");
  }
}

function scanDir(dir) {
  fs.readdirSync(dir).forEach((file) => {
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) {
      scanDir(full);
    } else if (file.endsWith(".css")) {
      processFile(full);
    }
  });
}

scanDir("./src");
