import bcrypt from 'bcrypt';

export async function hashString(plainText) {
  try {
    // Generate a salt with a cost factor of 10
    const salt = await bcrypt.genSalt(10);
    // Hash the plain text string using the generated salt
    const hashedKey = await bcrypt.hash(plainText, salt);
    return hashedKey;
  } catch (error) {
    throw new ApiError(500,'Failed to hash string',[error.message]);
  }
}
