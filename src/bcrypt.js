const bcrypt = require("bcryptjs");
let { genSalt, hash, compare } = bcrypt;
const { promisify } = require("util");

hash = promisify(hash);
genSalt = promisify(genSalt);
compare = promisify(compare);

module.exports.compare = compare;

module.exports.hash = plaintTextPass =>
  genSalt().then(salt => hash(plaintTextPass, salt));
