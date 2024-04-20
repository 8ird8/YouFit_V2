const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TokenSchema = new Schema({
	userId: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: "User",
		unique: true,
	},
	token: { type: String, required: true },
	
});

const Token = mongoose.model("Token", TokenSchema);

module.exports = Token;