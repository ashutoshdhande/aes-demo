import crypto from "crypto";
import { performance } from "perf_hooks";

const algorithm = "aes-256-cbc";
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

function encrypt(text: any) {
  let cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(key), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return { iv: iv.toString("hex"), encryptedData: encrypted.toString("hex") };
}

function decrypt(text: any) {
  let iv = Buffer.from(text.iv, "hex");
  let encryptedText = Buffer.from(text.encryptedData, "hex");
  let decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(key), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

const longString = `
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet ex a nisl commodo pulvinar. Curabitur nec lorem nec ante consequat pharetra. Aliquam erat volutpat. Integer sollicitudin quam quis leo commodo auctor. Quisque vestibulum diam vel risus efficitur, ac hendrerit nisi commodo. Duis feugiat nec lectus ut faucibus. Donec viverra, mauris nec suscipit blandit, ligula nulla suscipit nunc, nec luctus quam libero non sem. Nullam euismod, mauris ac viverra sagittis, ante dui laoreet justo, sed fringilla ex justo sit amet dui. Phasellus accumsan, erat vel malesuada volutpat, velit urna volutpat ex, vel convallis ligula risus ut mi. Fusce pellentesque velit a dui congue, vel lacinia libero bibendum. Vestibulum suscipit auctor tellus, vel facilisis metus dignissim id. Maecenas bibendum bibendum nisl in lacinia. Nullam bibendum ligula at elit aliquet aliquam.

Pellentesque nec iaculis libero. Vestibulum id ante a urna tristique feugiat. Fusce ut justo nec orci facilisis suscipit. Sed rhoncus aliquam orci, nec convallis arcu laoreet sit amet. Etiam tristique rhoncus lectus at accumsan. Aliquam erat volutpat. Ut sit amet ante nec metus ultricies cursus nec non ex. Sed in ante vel quam congue ullamcorper. Nullam venenatis arcu quis purus imperdiet, nec elementum sapien pellentesque.

Phasellus vitae luctus velit, in mattis ante. Vivamus consectetur vehicula erat eu varius. Quisque ullamcorper, leo id luctus auctor, dolor nunc volutpat lectus, ut dapibus libero lectus eu ipsum. Sed tincidunt urna vel nisl aliquam, eget tincidunt libero cursus. Fusce sed hendrerit lectus. Suspendisse at bibendum risus. Duis eget nisl vel quam rhoncus malesuada. Vivamus venenatis, turpis at facilisis venenatis, dolor libero congue orci, at aliquet ex est in felis. Integer fermentum, ante eu suscipit venenatis, sapien neque venenatis elit, a hendrerit dui tortor eu turpis. Nulla hendrerit, sapien eget sollicitudin pharetra, ligula est rhoncus purus, nec ultrices urna dui eget ante. Etiam eget urna at libero congue placerat.
`;

const email =
  "test-admin-hello-webmaster-info-services-john-crazy-but-oh-so-uber-cool-english-alphabet-fanatic-abcdefghijklmnopqrstuvwxyz@try-email-if-possible-to-recall-this-as-this-is-the-longest-email-address-known-to-human-but-truthfully-this-is-an-absurdly-lengthy-sub-domain-it-may-continue-infinitely.pacraig.com";

const startTime = performance.now();
var enc = encrypt(longString);
const endTime = performance.now();
console.log(`Function took ${endTime - startTime} milliseconds to execute.`);
console.log(
  `encrypted Data: ${enc.encryptedData} and ${enc.encryptedData.length}\n\n`
);

const DEC_startTime = performance.now();
const dec = decrypt(enc);
const DEC_endTime = performance.now();

console.log(
  `Function took ${DEC_endTime - DEC_startTime} milliseconds to execute.`
);
console.log(`Decrypted Data: ${dec}`);

console.log(longString === dec);
