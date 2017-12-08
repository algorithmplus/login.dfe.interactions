const validateDigipassToken = (serialNumber, code) => {
  console.info(`${serialNumber} / ${code}`);
  return code === '12345678';
};

module.exports = {
  validateDigipassToken,
};
