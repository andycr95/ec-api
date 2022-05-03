// Regex function for search functionality
const escapeRegex = (string) => {
  if (string == undefined) return null;
  if (string.length == 0) return null;
  return string.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};
// Exporting Function
module.exports = escapeRegex;
