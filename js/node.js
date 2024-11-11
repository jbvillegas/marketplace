const bcrypt = require('bcrypt');
const saltRounds = 10;

// Hash the password before storing it in the database
async function registerUser(username, email, password) {
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
    } catch (error) {
        console.error('Error hashing password:', error);
    }
}
