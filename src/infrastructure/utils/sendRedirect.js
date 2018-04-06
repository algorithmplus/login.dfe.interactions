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

const sendRedirect = (req, res, data) => {

  const accepts = req.accepts();
  let renderType;

  if (accepts instanceof String) {
    renderType = mapMimeType(accepts);
  } else if (accepts instanceof Array) {
    for (let i = 0; i < accepts.length && !renderType; i++) {
      renderType = mapMimeType(accepts[i]);
    }
  }

  if (!renderType) {
    return res.redirect(data.uri);
  }

  if (renderType === 'json') {
    return res.contentType('json').send(JSON.stringify(data));
  }

  return res.redirect(data.uri);

};

module.exports = sendRedirect;
