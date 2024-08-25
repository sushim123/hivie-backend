// Function to generate a random password of a specified length
const generateRandomPassword = (length) => {
  // Define the set of characters that can be used in the password
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=';
  let password = '';
  for (let i = 0; i < length; i++) {
    // Generate a random index to select a character from the charset
    const randomIndex = Math.floor(Math.random() * charset.length);
    // Append the randomly selected character to the password string
    password += charset[randomIndex];
  }
  return password;
};

export {generateRandomPassword};
