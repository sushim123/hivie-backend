import bcrypt from 'bcrypt';
import {STATUS_CODES} from '../constants.js';
import {apiError} from './apiError.util';

export async function decryptHash(plainText, hashedKey) {
  try {
    // Compare the plain text string with the hashed key
    const match = await bcrypt.compare(plainText, hashedKey);
    return match ? plainText : ''; // Returns true if they match, false otherwise
  } catch (error) {
    throw new apiError(STATUS_CODES.INTERNAL_SERVER_ERROR, 'Failed to decrypt string', [error.message]);
  }
}
