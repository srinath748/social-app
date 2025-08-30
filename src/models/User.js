const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const userSchema = new mongoose.Schema(
{
username: {
type: String,
required: true,
unique: true,
trim: true,
minlength: 3,
maxlength: 30,
match: /^[a-zA-Z0-9_]+$/,
},
email: {
type: String,
required: true,
unique: true,
trim: true,
lowercase: true,
match: /[^@\s]+@[^@\s]+\.[^@\s]+/,
},
name: { type: String, trim: true, maxlength: 50 },
bio: { type: String, trim: true, maxlength: 160 },
avatarUrl: { type: String, trim: true },
password: { type: String, required: true, minlength: 6 },
followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
},
{ timestamps: true }
);


userSchema.pre('save', async function (next) {
if (!this.isModified('password')) return next();
const salt = await bcrypt.genSalt(10);
this.password = await bcrypt.hash(this.password, salt);
next();
});


userSchema.methods.comparePassword = async function (candidate) {
return bcrypt.compare(candidate, this.password);
};


userSchema.index({ username: 1 }, { unique: true });
userSchema.index({ email: 1 }, { unique: true });


module.exports = mongoose.model('User', userSchema);