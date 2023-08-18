"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var crypto_1 = __importDefault(require("crypto"));
var perf_hooks_1 = require("perf_hooks");
var secret = "thisissomeserioussecret";
var CIPHER_ALGORITHM = "aes-256-gcm";
var IV_LENGTH = 16;
var TAG_LENGTH = 16;
var SALT_LENGTH = 64;
var ITERATIONS = 100000;
var tagPosition = SALT_LENGTH + IV_LENGTH;
var encryptedPosition = tagPosition + TAG_LENGTH;
var getKey = function (salt, secret) {
    return crypto_1.default.pbkdf2Sync(secret, salt, ITERATIONS, 32, "sha512");
};
var aes = {
    encrypt: function (input, secret) {
        var iv = crypto_1.default.randomBytes(IV_LENGTH);
        var salt = crypto_1.default.randomBytes(SALT_LENGTH);
        var AES_KEY = getKey(salt, secret);
        var cipher = crypto_1.default.createCipheriv(CIPHER_ALGORITHM, AES_KEY, iv);
        var encrypted = Buffer.concat([
            cipher.update(String(input), "utf8"),
            cipher.final(),
        ]);
        var tag = cipher.getAuthTag();
        return Buffer.concat([salt, iv, tag, encrypted]).toString("hex");
    },
    decrypt: function (input, secret) {
        var inputValue = Buffer.from(String(input), "hex");
        var salt = inputValue.subarray(0, SALT_LENGTH);
        var iv = inputValue.subarray(SALT_LENGTH, tagPosition);
        var tag = inputValue.subarray(tagPosition, encryptedPosition);
        var encrypted = inputValue.subarray(encryptedPosition);
        var key = getKey(salt, secret);
        var decipher = crypto_1.default.createDecipheriv(CIPHER_ALGORITHM, key, iv);
        decipher.setAuthTag(tag);
        return decipher.update(encrypted) + decipher.final("utf8");
    },
};
var email = "test-admin-hello-webmaster-info-services-john-crazy-but-oh-so-uber-cool-english-alphabet-fanatic-abcdefghijklmnopqrstuvwxyz@try-email-if-possible-to-recall-this-as-this-is-the-longest-email-address-known-to-human-but-truthfully-this-is-an-absurdly-lengthy-sub-domain-it-may-continue-infinitely.pacraig.com";
var longString = "\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet ex a nisl commodo pulvinar. Curabitur nec lorem nec ante consequat pharetra. Aliquam erat volutpat. Integer sollicitudin quam quis leo commodo auctor. Quisque vestibulum diam vel risus efficitur, ac hendrerit nisi commodo. Duis feugiat nec lectus ut faucibus. Donec viverra, mauris nec suscipit blandit, ligula nulla suscipit nunc, nec luctus quam libero non sem. Nullam euismod, mauris ac viverra sagittis, ante dui laoreet justo, sed fringilla ex justo sit amet dui. Phasellus accumsan, erat vel malesuada volutpat, velit urna volutpat ex, vel convallis ligula risus ut mi. Fusce pellentesque velit a dui congue, vel lacinia libero bibendum. Vestibulum suscipit auctor tellus, vel facilisis metus dignissim id. Maecenas bibendum bibendum nisl in lacinia. Nullam bibendum ligula at elit aliquet aliquam.\n\nPellentesque nec iaculis libero. Vestibulum id ante a urna tristique feugiat. Fusce ut justo nec orci facilisis suscipit. Sed rhoncus aliquam orci, nec convallis arcu laoreet sit amet. Etiam tristique rhoncus lectus at accumsan. Aliquam erat volutpat. Ut sit amet ante nec metus ultricies cursus nec non ex. Sed in ante vel quam congue ullamcorper. Nullam venenatis arcu quis purus imperdiet, nec elementum sapien pellentesque.\n\nPhasellus vitae luctus velit, in mattis ante. Vivamus consectetur vehicula erat eu varius. Quisque ullamcorper, leo id luctus auctor, dolor nunc volutpat lectus, ut dapibus libero lectus eu ipsum. Sed tincidunt urna vel nisl aliquam, eget tincidunt libero cursus. Fusce sed hendrerit lectus. Suspendisse at bibendum risus. Duis eget nisl vel quam rhoncus malesuada. Vivamus venenatis, turpis at facilisis venenatis, dolor libero congue orci, at aliquet ex est in felis. Integer fermentum, ante eu suscipit venenatis, sapien neque venenatis elit, a hendrerit dui tortor eu turpis. Nulla hendrerit, sapien eget sollicitudin pharetra, ligula est rhoncus purus, nec ultrices urna dui eget ante. Etiam eget urna at libero congue placerat.\n";
var ENC_startTime = perf_hooks_1.performance.now();
var enc = aes.encrypt(longString, secret);
var ENC_endTime = perf_hooks_1.performance.now();
console.log("Function took ".concat(ENC_endTime - ENC_startTime, " milliseconds to execute."));
console.log("Encrypted: ".concat(enc, " and ").concat(enc.length, "\n\n"));
var DEC_startTime = perf_hooks_1.performance.now();
var dec = aes.decrypt(enc, secret);
var DEC_endTime = perf_hooks_1.performance.now();
console.log("Function took ".concat(DEC_endTime - DEC_startTime, " milliseconds to execute."));
console.log("Decrypted: ".concat(dec, " and ").concat(dec.length, "\n\n"));
console.log(longString === dec);
exports.default = aes;
//# sourceMappingURL=gcm.js.map