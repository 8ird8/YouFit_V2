const User = require("../models/user");
const Token = require("../models/token");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");

require("dotenv").config();

const registerUser = async (req, res) => {
  try {
    const hashedPassword = await bcryptjs.hash(req.body.password, 10);

    const data = {
      username: req.body.username,
      email: req.body.email,
      weight: req.body.weight,
      // avatar: req.file ? req.file.filename : "Default.png",
      password: hashedPassword,
      confirmPassword: req.body.confirmPassword,
      activityLevel: req.body.activityLevel,
      role: req.body.role,
      gender: req.body.gender,
    };

    const checkEmail = await User.findOne({ email: req.body.email });
    if (!checkEmail) {
      if (req.body.password === req.body.confirmPassword) {
        const newUser = await User.create(data);
        const token = jwt.sign(
          {
            userId: newUser._id,
            username: newUser.username,
            avatar: newUser.avatar,
            weight: newUser.weight,
            role: newUser.role,
            gender: newUser.gender,
          },
          process.env.JWT_SECRET_KEY,
          { expiresIn: "7h" }
        );
        const VerifyToken = new Token({
          userId: newUser._id,
          token: token,
        });

        await VerifyToken.save();

        const link = `http://localhost:5173/users/${newUser._id}/verify/${VerifyToken.token}`;
        const htmltemplate = `
          <div style="
              width: 100%;
              height: 100%;
              margin: 0;
              padding: 0;
              display: flex;
              align-items: center;
              justify-content: center;
              background-color: #ebf4ff;
            ">
            <div style="
                max-width: 36rem;
                padding: 2rem;
                text-align: center;
                color: #2d3748;
                background-color: #ffffff;
                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
                  0 4px 6px -2px rgba(0, 0, 0, 0.05);
                border-radius: 1.5rem;
                marging: auto;
              ">
                <div style="margin-bottom: 1rem">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"
                        style="width: 5rem; height: 5rem; margin: auto" fill="#FB4A07">
                        <path
                            d="M160 112c0-35.3 28.7-64 64-64s64 28.7 64 64v48H160V112zm-48 48H48c-26.5 0-48 21.5-48 48V416c0 53 43 96 96 96H352c53 0 96-43 96-96V208c0-26.5-21.5-48-48-48H336V112C336 50.1 285.9 0 224 0S112 50.1 112 112v48zm24 48a24 24 0 1 1 0 48 24 24 0 1 1 0-48zm152 24a24 24 0 1 1 48 0 24 24 0 1 1 -48 0z" />
                    </svg>
                    <h2 style="font-size: 1.875rem; font-weight: bold; margin: auto">
                        YOUFIT
                    </h2>
                </div>
                <h3 style="font-size: 1.5rem; margin-top: 1.5rem">
                    Thanks for signing up for YOUFIT!
                </h3>
                <p style="margin-top: 1rem">
                    We're happy you're here. Let's get your email address verified:
                </p>
                <div style="margin-top: 1rem">
                    <button style="
                    padding: 0.5rem 0.5rem;
                    color: #bee3f8;
                    background-color: #441cb4;
                    border-radius: 0.25rem;
                  ">
                        <a href="${link}" style="color: #bee3f8; text-decoration: none">Click to Verify Email</a>
                    </button>
                    <p style="font-size: 0.875rem; margin-top: 1rem">
                        If you’re having trouble clicking the "Verify Email Address" button,
                        copy and paste the URL below into your web browser:
                        <a href="#"
                            style="color: #2b6cb0; text-decoration: underline">${link}</a>
                    </p>
                </div>
            </div>
          </div>
          `;

        await sendMail(newUser.email, "Verify email", htmltemplate);
        res.cookie("token", token, {
          httpOnly: true,
          secure: true, // use secure flag in production
          sameSite: "strict",
          maxAge: 9600000,
        });

        console.log("User registered successfully:", newUser);
        console.log("Token : ", token);
        res.status(200).json({
          success: true,
          message: "we sent to you an email, please verify your email",
          type: "success",
        });
        console.log("User created successfully:", newUser);
      } else {
        res
          .status(400)
          .json({ success: false, message: "Passwords do not match" });
      }
    } else {
      res.status(400).json({ success: false, message: "Email already in use" });
    }
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const verify = async (req, res) => {
  try {
    const { userId, token } = req.params;
    const tokenDoc = await Token.findOne({ userId, token });
    if (!tokenDoc) {
      return res.status(400).send("Invalid link or expired");
    }

    await User.updateOne({ _id: userId }, { $set: { isVerified: true } });
    await Token.deleteOne({ _id: tokenDoc._id });

    // Redirect or send a response to indicate successful verification
    res.status(200).json({
      success: true,
      message: "Your account has been  Verified successfully",
      type: "success",
    });
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).send("Internal Server Error");
  }
};

const loginUser = async (req, res) => {
  try {
    const data = await User.findOne({ email: req.body.email });

    if (data) {
      const passwordMatch = await bcryptjs.compare(
        req.body.password,
        data.password
      );

      if (passwordMatch) {
        const token = jwt.sign(
          {
            userId: data._id,
            username: data.username,
            weight: data.weight,
            avatar: data.avatar,
            role: data.role,
            gender: data.gender,
          },
          "arrrrrryskldmùdùfnhgzfdcevnkorp^rfnfbbfvdvd",
          { expiresIn: "7h" }
        );
        if (!data.isVerified) {
          let checkToken = await Token.findOne({ userId: data._id });
          if (!checkToken) {
            const VerifyToken = new Token({
              userId: data._id,
              token: token,
            });
            await VerifyToken.save();
          }

          const link = `http://localhost:5173/users/${data._id}/verify/${checkToken.token}`;
          const htmltemplate = `
                <div style="
                    width: 100%;
                    height: 100%;
                    margin: 0;
                    padding: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background-color: #ebf4ff;
                  ">
                  <div style="
                      max-width: 36rem;
                      padding: 2rem;
                      text-align: center;
                      color: #2d3748;
                      background-color: #ffffff;
                      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
                        0 4px 6px -2px rgba(0, 0, 0, 0.05);
                      border-radius: 1.5rem;
                      marging: auto;
                    ">
                      <div style="margin-bottom: 1rem">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"
                              style="width: 5rem; height: 5rem; margin: auto" fill="#FB4A07">
                              <path
                                  d="M160 112c0-35.3 28.7-64 64-64s64 28.7 64 64v48H160V112zm-48 48H48c-26.5 0-48 21.5-48 48V416c0 53 43 96 96 96H352c53 0 96-43 96-96V208c0-26.5-21.5-48-48-48H336V112C336 50.1 285.9 0 224 0S112 50.1 112 112v48zm24 48a24 24 0 1 1 0 48 24 24 0 1 1 0-48zm152 24a24 24 0 1 1 48 0 24 24 0 1 1 -48 0z" />
                          </svg>
                          <h2 style="font-size: 1.875rem; font-weight: bold; margin: auto">
                              YOUFIT
                          </h2>
                      </div>
                      <h3 style="font-size: 1.5rem; margin-top: 1.5rem">
                          Thanks for signing up for YOUFIT!
                      </h3>
                      <p style="margin-top: 1rem">
                          We're happy you're here. Let's get your email address verified:
                      </p>
                      <div style="margin-top: 1rem">
                          <button style="
                          padding: 0.5rem 0.5rem;
                          color: #bee3f8;
                          background-color: #441cb4;
                          border-radius: 0.25rem;
                        ">
                              <a href="${link}" style="color: #bee3f8; text-decoration: none">Click to Verify Email</a>
                          </button>
                          <p style="font-size: 0.875rem; margin-top: 1rem">
                              If you’re having trouble clicking the "Verify Email Address" button,
                              copy and paste the URL below into your web browser:
                              <a href="#"
                                  style="color: #2b6cb0; text-decoration: underline">${link}</a>
                          </p>
                      </div>
                  </div>
                </div>
              `;

          await sendMail(data.email, "Verify email", htmltemplate);
          return res.status(401).json({
            success: false,
            type: "success",
            message: "We sent you an email, Please verify your email address ",
          });
        }
        res.cookie("token", token, {
          httpOnly: true,
          secure: true, // use secure flag in production
          // sameSite: "strict",
          maxAge: 9600000,
        });
        res.status(200).json({
          success: true,
          type: "success",
          message: "Login successful",
          token,
          data,
        });
        console.log("User logged in successfully:", data);
        console.log("Token : ", token);
      } else {
        res
          .status(401)
          .json({ success: false, type: "error", message: "Invalid password" });
      }
    } else {
      res.status(404).json({
        success: false,
        type: "error",
        message: "Invalid Email Address",
      });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res
      .status(500)
      .json({ success: false, type: "error", message: "error server" });
  }
};

const resendEmail = async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized", type: "error" });
  }

  try {
    const decoded = jwt.verify(
      token,
      "arrrrrryskldmùdùfnhgzfdcevnkorp^rfnfbbfvdvd"
    );
    const userId = decoded.userId;
    const data = await User.findById(userId);

    if (!data.isVerified) {
      let checkToken = await Token.findOne({ userId: data._id });
      if (!checkToken) {
        const VerifyToken = new Token({
          userId: data._id,
          token: token,
        });
        await VerifyToken.save();
      }

      const link = `http://localhost:5173/users/${data._id}/verify/${checkToken.token}`;
      const htmltemplate = `
            <div style="
                width: 100%;
                height: 100%;
                margin: 0;
                padding: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                background-color: #ebf4ff;
              ">
              <div style="
                  max-width: 36rem;
                  padding: 2rem;
                  text-align: center;
                  color: #2d3748;
                  background-color: #ffffff;
                  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
                    0 4px 6px -2px rgba(0, 0, 0, 0.05);
                  border-radius: 1.5rem;
                  marging: auto;
                ">
                  <div style="margin-bottom: 1rem">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"
                          style="width: 5rem; height: 5rem; margin: auto" fill="#FB4A07">
                          <path
                              d="M160 112c0-35.3 28.7-64 64-64s64 28.7 64 64v48H160V112zm-48 48H48c-26.5 0-48 21.5-48 48V416c0 53 43 96 96 96H352c53 0 96-43 96-96V208c0-26.5-21.5-48-48-48H336V112C336 50.1 285.9 0 224 0S112 50.1 112 112v48zm24 48a24 24 0 1 1 0 48 24 24 0 1 1 0-48zm152 24a24 24 0 1 1 48 0 24 24 0 1 1 -48 0z" />
                      </svg>
                      <h2 style="font-size: 1.875rem; font-weight: bold; margin: auto">
                          YOUFIT
                      </h2>
                  </div>
                  <h3 style="font-size: 1.5rem; margin-top: 1.5rem">
                      Thanks for signing up for YOUFIT!
                  </h3>
                  <p style="margin-top: 1rem">
                      We're happy you're here. Let's get your email address verified:
                  </p>
                  <div style="margin-top: 1rem">
                      <button style="
                      padding: 0.5rem 0.5rem;
                      color: #bee3f8;
                      background-color: #441cb4;
                      border-radius: 0.25rem;
                    ">
                          <a href="${link}" style="color: #bee3f8; text-decoration: none">Click to Verify Email</a>
                      </button>
                      <p style="font-size: 0.875rem; margin-top: 1rem">
                          If you’re having trouble clicking the "Verify Email Address" button,
                          copy and paste the URL below into your web browser:
                          <a href="#"
                              style="color: #2b6cb0; text-decoration: underline">${link}</a>
                      </p>
                  </div>
              </div>
            </div>
          `;

      await sendMail(data.email, "Verify email", htmltemplate);
      return res.status(200).json({
        success: true,
        type: "success",
        message: "We resent you an email, Please verify your email address ",
      });
    }
  } catch (e) {
    console.error("Error during resend email:", e);
    res
      .status(500)
      .json({ success: false, type: "error", message: "error server" });
  }
};

const logoutUser = (req, res) => {
  res.clearCookie("token");

  res.status(200).json({ success: true, message: "Logout successful" });
};

const TokenInfo = (req, res) => {
  const token = req.cookies.token;
  try {
    const decoded = jwt.verify(
      token,
      "arrrrrryskldmùdùfnhgzfdcevnkorp^rfnfbbfvdvd"
    );
    currentUserId = decoded.userId;
    avatar = decoded.avatar;
    username = decoded.username;
    email = decoded.email;
    weight = decoded.weight;
    role = decoded.role;
    res.status(200).json({
      success: true,
      message: " sucsses",
      TokenInfo: {
        userId: currentUserId,
        avatar: avatar,
        username: username,
        email: email,
        weight: weight,
      },
    });
  } catch (error) {
    res.status(401).json({ message: "Invalid token", type: "error" });
  }
};

const CurrentUser = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserInfo = await User.findById(id);

    if (!currentUserInfo) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    } else {
      return res.status(200).json({ success: true, currentUserInfo });
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ success: false, message: "Error fetching user" });
  }
};
const UpdateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const updateData = {
      email: req.body.email ? req.body.email : user.email,
      username: req.body.username ? req.body.username : user.username,
      weight: req.body.weight ? req.body.weight : user.weight,
      gender: req.body.gender ? req.body.gender : user.gender,
      activityLevel: req.body.activityLevel
        ? req.body.activityLevel
        : user.activityLevel,
      goal: req.body.goal ? req.body.goal : user.goal,
      level: req.body.level ? req.body.level : user.level,
      // role: req.body.role? req.body.role: user.role,
    };
    if (req.file) {
      updateData.avatar = req.file.filename;
    }

    const update = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });
    return res.status(200).json({ success: true, update });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ success: false, message: "Error updating user" });
  }
};

const UpdateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const updateData = {
      role: req.body.role ? req.body.role : user.role,
    };

    const update = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });
    return res.status(200).json({ success: true, update });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ success: false, message: "Error updating user" });
  }
};

const UpdatePassword = async (req, res) => {
  try {
    const userId = req.params.id;
    const Cuser = await User.findById(userId);
    const updateData = {};

    if (
      req.body.OldPassword &&
      req.body.NewPassword &&
      req.body.ConfirmPassword
    ) {
      // Use bcrypt.compare to compare the hashed password with the OldPassword
      const isMatch = await bcryptjs.compare(
        req.body.OldPassword,
        Cuser.password
      );
      if (!isMatch) {
        return res
          .status(401)
          .json({ success: false, message: "Old password is wrong" });
      }
      if (req.body.NewPassword !== req.body.ConfirmPassword) {
        return res
          .status(401)
          .json({ success: false, message: "Passwords don't match" });
      }
      const hashedPassword = await bcryptjs.hash(req.body.NewPassword, 10);
      updateData.password = hashedPassword;
      const updateUser = await User.findByIdAndUpdate(userId, updateData, {
        new: true,
      });

      if (updateUser) {
        updateUser.password = undefined;
        return res.status(200).json({
          success: true,
          message: "User updated successfully",
          user: updateUser,
        });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }
    }
  } catch (e) {
    return res.status(500).send("Server Error");
  }
};

const ferchUsers = async (req, res) => {
  try {
    const Users = await User.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, Users });
  } catch (err) {
    console.error("Error fetching Users:", err);
    return res
      .status(500)
      .json({ success: false, message: "Error fetching users" });
  }
};
const DeleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const deleteUser = await User.findByIdAndDelete(userId);
    if (!deleteUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    // Optionally, send some simple details back, if necessary
    return res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (err) {
    console.error("Error deleting user:", err);
    return res
      .status(500)
      .json({ success: false, message: "Error deleting user" });
  }
};

module.exports = {
  loginUser,
  registerUser,
  verify,
  logoutUser,
  CurrentUser,
  TokenInfo,
  ferchUsers,
  UpdateUser,
  UpdateUserRole,
  UpdatePassword,
  DeleteUser,
  resendEmail,
};
