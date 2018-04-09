const mapMimeType = (mimeType) => {
  switch (mimeType.toLowerCase()) {
    case 'application/json':
      return 'json';
      break;
    case 'text/html':
      return 'html';
      break;
  }
  return undefined;
};

module.exports = mapMimeType;