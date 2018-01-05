const sanitizer = require('sanitizer');
const htmlencode = require('htmlencode');

const sanatiseAndEncode = (obj) => {
  let sanatised = obj;
  if (typeof sanatised === 'string') {
    sanatised = sanitizer.sanitize(sanatised);
    sanatised = htmlencode.htmlEncode(sanatised);
  } else if (sanatised instanceof Object) {
    Object.keys(sanatised).forEach((prop) => {
      sanatised[prop] = sanatiseAndEncode(sanatised[prop]);
    });
  }
  return obj;
};
const sanatise = (source) => {
  const keys = Object.keys(source);
  keys.forEach((key) => {
    if (key.toLowerCase() === 'clientid' && !/^[A-Za-z0-9]+$/.test(source[key])) {
      source[key] = '';
    } else {
      source[key] = sanatiseAndEncode(source[key]);
    }
  });
};

const middleware = () => {
  return (req, res, next) => {
    sanatise(req.query);
    return next();
  };
};

module.exports = middleware;
