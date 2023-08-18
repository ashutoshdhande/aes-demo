"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var crypto_1 = __importDefault(require("crypto"));
var perf_hooks_1 = require("perf_hooks");
var algorithm = "aes-256-cbc";
var key = crypto_1.default.randomBytes(32);
var iv = crypto_1.default.randomBytes(16);
function encrypt(text) {
    var cipher = crypto_1.default.createCipheriv("aes-256-cbc", Buffer.from(key), iv);
    var encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return { iv: iv.toString("hex"), encryptedData: encrypted.toString("hex") };
}
function decrypt(text) {
    var iv = Buffer.from(text.iv, "hex");
    var encryptedText = Buffer.from(text.encryptedData, "hex");
    var decipher = crypto_1.default.createDecipheriv("aes-256-cbc", Buffer.from(key), iv);
    var decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}
var longString = "\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet ex a nisl commodo pulvinar. Curabitur nec lorem nec ante consequat pharetra. Aliquam erat volutpat. Integer sollicitudin quam quis leo commodo auctor. Quisque vestibulum diam vel risus efficitur, ac hendrerit nisi commodo. Duis feugiat nec lectus ut faucibus. Donec viverra, mauris nec suscipit blandit, ligula nulla suscipit nunc, nec luctus quam libero non sem. Nullam euismod, mauris ac viverra sagittis, ante dui laoreet justo, sed fringilla ex justo sit amet dui. Phasellus accumsan, erat vel malesuada volutpat, velit urna volutpat ex, vel convallis ligula risus ut mi. Fusce pellentesque velit a dui congue, vel lacinia libero bibendum. Vestibulum suscipit auctor tellus, vel facilisis metus dignissim id. Maecenas bibendum bibendum nisl in lacinia. Nullam bibendum ligula at elit aliquet aliquam.\n\nPellentesque nec iaculis libero. Vestibulum id ante a urna tristique feugiat. Fusce ut justo nec orci facilisis suscipit. Sed rhoncus aliquam orci, nec convallis arcu laoreet sit amet. Etiam tristique rhoncus lectus at accumsan. Aliquam erat volutpat. Ut sit amet ante nec metus ultricies cursus nec non ex. Sed in ante vel quam congue ullamcorper. Nullam venenatis arcu quis purus imperdiet, nec elementum sapien pellentesque.\n\nPhasellus vitae luctus velit, in mattis ante. Vivamus consectetur vehicula erat eu varius. Quisque ullamcorper, leo id luctus auctor, dolor nunc volutpat lectus, ut dapibus libero lectus eu ipsum. Sed tincidunt urna vel nisl aliquam, eget tincidunt libero cursus. Fusce sed hendrerit lectus. Suspendisse at bibendum risus. Duis eget nisl vel quam rhoncus malesuada. Vivamus venenatis, turpis at facilisis venenatis, dolor libero congue orci, at aliquet ex est in felis. Integer fermentum, ante eu suscipit venenatis, sapien neque venenatis elit, a hendrerit dui tortor eu turpis. Nulla hendrerit, sapien eget sollicitudin pharetra, ligula est rhoncus purus, nec ultrices urna dui eget ante. Etiam eget urna at libero congue placerat.\n";
var email = "test-admin-hello-webmaster-info-services-john-crazy-but-oh-so-uber-cool-english-alphabet-fanatic-abcdefghijklmnopqrstuvwxyz@try-email-if-possible-to-recall-this-as-this-is-the-longest-email-address-known-to-human-but-truthfully-this-is-an-absurdly-lengthy-sub-domain-it-may-continue-infinitely.pacraig.com";
var startTime = perf_hooks_1.performance.now();
var enc = encrypt(longString);
var endTime = perf_hooks_1.performance.now();
console.log("Function took ".concat(endTime - startTime, " milliseconds to execute."));
console.log("encrypted Data: ".concat(enc.encryptedData, " and ").concat(enc.encryptedData.length, "\n\n"));
var DEC_startTime = perf_hooks_1.performance.now();
var dec = decrypt(enc);
var DEC_endTime = perf_hooks_1.performance.now();
console.log("Function took ".concat(DEC_endTime - DEC_startTime, " milliseconds to execute."));
console.log("Decrypted Data: ".concat(dec));
console.log(longString === dec);
//# sourceMappingURL=cbc.js.map