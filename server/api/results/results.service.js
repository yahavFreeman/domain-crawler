export function readCSV() {
  const filePath = getCsvFilePath();
  if (!fs.existsSync(filePath)) {
    return []; // no results yet
  }
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const results = parse(fileContent, { columns: true });
  return results;
}
