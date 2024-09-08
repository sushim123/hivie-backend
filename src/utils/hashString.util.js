import bcrypt from 'bcrypt';
import {STATUS_CODES} from '../constants.js';

export async function hashString(plainText) {
  try {
    // Generate a salt with a cost factor of 10
    const salt = await bcrypt.genSalt(10);
    // Hash the plain text string using the generated salt
    const hashedKey = await bcrypt.hash(plainText, salt);
    return hashedKey;
  } catch (error) {
    throw new apiError(STATUS_CODES.INTERNAL_SERVER_ERROR, 'Failed to hash string', [error.message]);
  }
}
