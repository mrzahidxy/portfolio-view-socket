import path from "path";
import fs from "fs";

const COUNT_FILE_PATH = path.join(__dirname, "visit_count.json");

export const readVisitCount = () => {
  if (!fs.existsSync(COUNT_FILE_PATH)) {
    fs.writeFileSync(COUNT_FILE_PATH, JSON.stringify({ count: 0 }), "utf8");
  }

  try {
    const data = fs.readFileSync(COUNT_FILE_PATH, "utf-8");
    return JSON.parse(data).count || 0;
  } catch (error) {
    console.error("Error reading visit count:", error);
    return 0;
  }
};

export const writeVisitCount = (count: number) => {
  try {
    fs.writeFileSync(COUNT_FILE_PATH, JSON.stringify({ count }));
  } catch (error) {
    console.error("Error writing visit count:", error);
  }
};