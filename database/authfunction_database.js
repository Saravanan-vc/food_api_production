const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const authmodel = mongoose.Schema({
    name: String,
    email: String,
    password: String
});

// Pre-save hook to hash the password before saving
authmodel.pre('save', async function (next) {
    if (this.password != null) {
        if (!this.isModified('password')) {
            return next(); // If password is not modified, skip hashing
        }

        try {
            if (!this.password) {
                throw new Error('Password is required'); // Ensure the password is not empty
            }

            const salt = await bcrypt.genSalt(10); // Generate salt
            this.password = await bcrypt.hash(this.password, salt); // Hash the password
            next(); // Proceed with saving the user
        } catch (error) {
            next(error); // Pass any error to the next function (to be handled)
        }
    } else { next() }
});

module.exports = mongoose.model('authentication', authmodel);
