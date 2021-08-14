const xlsx = require("xlsx");
const path = require("path");

const exportExel = (data, workSheetColumNames, workSheetName, filePath) => {
  const workBook = xlsx.utils.book_new();
  const workSheetData = [workSheetColumNames, ...data];
  const workSheet = xlsx.utils.aoa_to_sheet(workSheetData);
  xlsx.utils.book_append_sheet(workBook, workSheet, workSheetName);
  xlsx.writeFile(workBook, path.resolve(filePath));
};

const exportUsersToExel = (
  users,
  workSheetColumNames,
  workSheetName,
  filePath
) => {
  const data = users.map((user) => {
    return [user.id, user.userId, user.name, user.phone , user.subbed];
  });
  exportExel(data, workSheetColumNames, workSheetName, filePath);
};

module.exports = exportUsersToExel;
