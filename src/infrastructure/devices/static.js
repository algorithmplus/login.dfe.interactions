const validateDigipassToken = (serialNumber, code) => {
  return code === '12345678';
};

module.exports = {
  validateDigipassToken,
};
