import crypto from "crypto";
import { performance } from "perf_hooks";

const secret = "thisissomeserioussecret";

const CIPHER_ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;
const TAG_LENGTH = 16;
const SALT_LENGTH = 64;
const ITERATIONS = 100000;

const tagPosition = SALT_LENGTH + IV_LENGTH;
const encryptedPosition = tagPosition + TAG_LENGTH;

const getKey = (salt: Buffer, secret: string) => {
  return crypto.pbkdf2Sync(secret, salt, ITERATIONS, 32, "sha512");
};

const aes = {
  encrypt: (input: string, secret: string) => {
    const iv = crypto.randomBytes(IV_LENGTH);
    const salt = crypto.randomBytes(SALT_LENGTH);

    const AES_KEY = getKey(salt, secret);

    const cipher = crypto.createCipheriv(CIPHER_ALGORITHM, AES_KEY, iv);
    const encrypted = Buffer.concat([
      cipher.update(String(input), "utf8"),
      cipher.final(),
    ]);

    const tag = cipher.getAuthTag();

    return Buffer.concat([salt, iv, tag, encrypted]).toString("hex");
  },

  decrypt: (input: string, secret: string) => {
    const inputValue = Buffer.from(String(input), "hex");
    const salt = inputValue.subarray(0, SALT_LENGTH);
    const iv = inputValue.subarray(SALT_LENGTH, tagPosition);
    const tag = inputValue.subarray(tagPosition, encryptedPosition);
    const encrypted = inputValue.subarray(encryptedPosition);

    const key = getKey(salt, secret);

    const decipher = crypto.createDecipheriv(CIPHER_ALGORITHM, key, iv);

    decipher.setAuthTag(tag);

    return decipher.update(encrypted) + decipher.final("utf8");
  },
};

// const email =
//   "test-admin-hello-webmaster-info-services-john-crazy-but-oh-so-uber-cool-english-alphabet-fanatic-abcdefghijklmnopqrstuvwxyz@try-email-if-possible-to-recall-this-as-this-is-the-longest-email-address-known-to-human-but-truthfully-this-is-an-absurdly-lengthy-sub-domain-it-may-continue-infinitely.pacraig.com";

// const longString = `
// Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet ex a nisl commodo pulvinar. Curabitur nec lorem nec ante consequat pharetra. Aliquam erat volutpat. Integer sollicitudin quam quis leo commodo auctor. Quisque vestibulum diam vel risus efficitur, ac hendrerit nisi commodo. Duis feugiat nec lectus ut faucibus. Donec viverra, mauris nec suscipit blandit, ligula nulla suscipit nunc, nec luctus quam libero non sem. Nullam euismod, mauris ac viverra sagittis, ante dui laoreet justo, sed fringilla ex justo sit amet dui. Phasellus accumsan, erat vel malesuada volutpat, velit urna volutpat ex, vel convallis ligula risus ut mi. Fusce pellentesque velit a dui congue, vel lacinia libero bibendum. Vestibulum suscipit auctor tellus, vel facilisis metus dignissim id. Maecenas bibendum bibendum nisl in lacinia. Nullam bibendum ligula at elit aliquet aliquam.

// Pellentesque nec iaculis libero. Vestibulum id ante a urna tristique feugiat. Fusce ut justo nec orci facilisis suscipit. Sed rhoncus aliquam orci, nec convallis arcu laoreet sit amet. Etiam tristique rhoncus lectus at accumsan. Aliquam erat volutpat. Ut sit amet ante nec metus ultricies cursus nec non ex. Sed in ante vel quam congue ullamcorper. Nullam venenatis arcu quis purus imperdiet, nec elementum sapien pellentesque.

// Phasellus vitae luctus velit, in mattis ante. Vivamus consectetur vehicula erat eu varius. Quisque ullamcorper, leo id luctus auctor, dolor nunc volutpat lectus, ut dapibus libero lectus eu ipsum. Sed tincidunt urna vel nisl aliquam, eget tincidunt libero cursus. Fusce sed hendrerit lectus. Suspendisse at bibendum risus. Duis eget nisl vel quam rhoncus malesuada. Vivamus venenatis, turpis at facilisis venenatis, dolor libero congue orci, at aliquet ex est in felis. Integer fermentum, ante eu suscipit venenatis, sapien neque venenatis elit, a hendrerit dui tortor eu turpis. Nulla hendrerit, sapien eget sollicitudin pharetra, ligula est rhoncus purus, nec ultrices urna dui eget ante. Etiam eget urna at libero congue placerat.
// `;

// const ENC_startTime = performance.now();
// const enc = aes.encrypt(longString, secret);
// const ENC_endTime = performance.now();

// console.log(
//   `Function took ${ENC_endTime - ENC_startTime} milliseconds to execute.`
// );

// console.log(`Encrypted: ${enc} and ${enc.length}\n\n`);

// const DEC_startTime = performance.now();
// const dec = aes.decrypt(enc, secret);
// const DEC_endTime = performance.now();

// console.log(
//   `Function took ${DEC_endTime - DEC_startTime} milliseconds to execute.`
// );

// console.log(`Decrypted: ${dec} and ${dec.length}\n\n`);

// console.log(longString === dec);

export default aes;
