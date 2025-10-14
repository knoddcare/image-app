function formatFileName(originalName, extension) {
  //  Remove Swedish letters and normalize
  let name = originalName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") 
    .replace(/å/gi, "a")
    .replace(/ä/gi, "a")
    .replace(/ö/gi, "o")
    .toLowerCase();

  //  Replace spaces with dashes and keep only first 10 chars
  name = name.replace(/\s+/g, "-").slice(0, 10);

  //  Create timestamp in YYYYMMDDHHMMSS
  const now = new Date();
  const timestamp = now
    .toISOString()
    .replace(/[-:T.Z]/g, "")
    .slice(0, 14);

  // Return combined filename
  return `${name}_${timestamp}.${extension}`;
}

module.exports = formatFileName;