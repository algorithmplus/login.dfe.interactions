const onHeaders = require('on-headers');
const Cookies = require('cookies');
const crypto = require('crypto');

const expiryInMilliseconds = (26 * 60) * 60 * 1000; // 26 hours

const SessionCookies = class {
  constructor(req, res, opts) {
    this.context = { req, res };
    this.options = Object.assign({}, opts);

    let keys = this.options.signingKeys;
    if (!keys && this.options.signingSecret) {
      keys = [this.options.signingSecret];
    }

    if (!keys) {
      throw new Error('Must provide keys or secret for migratingUserMiddleware');
    }

    this._cookies = new Cookies(req, res, { keys });
  }

  get(name) {
    let json = this._cookies.get(name, { signed: true });
    if (json) {
      if (this.options.encrypt) {
        const decipher = crypto.createDecipher('aes-256-ctr', this.options.encryptionSecret);
        let decrypted = decipher.update(json, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        json = decrypted;
      }
      return JSON.parse(json);
    }
    return undefined;
  };

  set(name, value) {
    let data = JSON.stringify(value);
    if (this.options.encrypt) {
      const cipher = crypto.createCipher('aes-256-ctr', this.options.encryptionSecret);
      let encrypted = cipher.update(data, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      data = encrypted;
    }
    this._cookies.set(name, data, {
      httpOnly: true,
      secure: true,
      expires: new Date(Date.now() + expiryInMilliseconds),
      signed: true,
    });
  }
};

const migratingUserMiddleware = () => {
  return (req, res, next) => {
    const cookies = new SessionCookies(req, res, {
      signingSecret: 'isfnmw98mnwcnw9w',
      encrypt: true,
      encryptionSecret: 'sdfo89wfncqsdnu9a',
    });

    try {
      req.migrationUser = cookies.get('msa');
    } catch (e) {
      throw new Error(`Error loading migrating user cookie - ${e.message}`);
    }

    onHeaders(res, function () {
      try {
        if (req.migrationUser) {
          cookies.set('msa', req.migrationUser);
        }
      } catch (e) {
        throw new Error(`Error saving migrating user cookie - ${e.message}`);
      }
    });

    next();
  };
};
module.exports = migratingUserMiddleware;