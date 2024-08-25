import {randomBytes} from 'crypto';

// Generate a 32-byte random key and convert it to a hexadecimal string
const key1 = randomBytes(32).toString('hex'); // Key for encryption or other cryptographic uses
const key2 = randomBytes(32).toString('hex');

// Display the generated keys in a table format in the console
console.table({key1, key2});
