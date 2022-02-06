const crypto = require('crypto');

const decryptedData = crypto.privateDecrypt(
  {
    key: Buffer.from(process.argv.slice(2)[0]),
    // In order to decrypt the data, we need to specify the
    // same hashing function and padding scheme that we used to
    // encrypt the data in the previous step
    padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
    oaepHash: "sha256",
  },
  Buffer.from(process.argv.slice(2)[1], 'base64')
);

// The decrypted data is of the Buffer type, which we can convert to a
// string to reveal the original data
console.log("decrypted data: \"" + decryptedData.toString() + "\"");
