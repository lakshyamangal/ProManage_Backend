const validateUnixTimestamp = (value) => {
  if (!/^\d{13}$/.test(value)) {
    throw new Error("Invalid Unix timestamp");
  }
  return true;
};
module.exports = validateUnixTimestamp;
