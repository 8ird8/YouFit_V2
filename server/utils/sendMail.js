const nodemailer = require("nodemailer");

module.exports = async (email, subject, htmltemplate) => {
	try {
		const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.APP_EMAIL_ADDRESS,
        pass: process.env.APP_EMAIL_PASS,
      },
		});

		await transporter.sendMail({
			from: process.env.APP_EMAIL_ADDRESS,
			to: email,
			subject: subject,
			html: htmltemplate , 
		});
		console.log("email sent successfully");
	} catch (error) {
		console.log("email not sent!");
		console.log(error);
		return error;
	}
};