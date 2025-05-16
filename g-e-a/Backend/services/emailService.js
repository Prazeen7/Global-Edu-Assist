const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

exports.sendVerificationEmail = async (email, otp) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Verify Your Account",
        text: `Your verification OTP is: ${otp}\nThis OTP will expire in 10 minutes.`,
        html: `<p>Your verification OTP is: <strong>${otp}</strong></p>
               <p>This OTP will expire in 10 minutes.</p>`
    };

    await transporter.sendMail(mailOptions);
};

exports.sendPasswordResetEmail = async (email, otp) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your Password Reset OTP",
        text: `Your OTP for password reset is: ${otp}\nThis OTP will expire in 10 minutes.`,
        html: `<p>Your OTP for password reset is: <strong>${otp}</strong></p>
               <p>This OTP will expire in 10 minutes.</p>`
    };

    await transporter.sendMail(mailOptions);
};

// New function for agent registration pending approval email
exports.sendAgentPendingEmail = async (email, agentName) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your Account Registration is Under Review",
        text: `Dear ${agentName},

Thank you for registering with us.
Your account has been submitted for approval and will be reviewed by an administrator within a few days.
We will notify you once the review process is complete.

Thank you for your patience.

Best regards,
Global Edu Assist`,
        html: `<p>Dear <strong>${agentName}</strong>,</p>
               <p>Thank you for registering with us.</p>
               <p>Your account has been submitted for approval and will be reviewed by an administrator within a few days.</p>
               <p>We will notify you once the review process is complete.</p>
               <p>Thank you for your patience.</p>
               <p>Best regards,<br>Global Edu Assist</p>`
    };

    await transporter.sendMail(mailOptions);
};

// New function for agent approval email
exports.sendAgentApprovalEmail = async (email, agentName) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your Account Has Been Approved",
        text: `Dear ${agentName},

Congratulations!
Your account has been approved and you can now log in and start using our services.

If you have any questions or need assistance, feel free to reach out to us.

Welcome aboard!

Best regards,
Global Edu Assist`,
        html: `<p>Dear <strong>${agentName}</strong>,</p>
               <p>Congratulations!</p>
               <p>Your account has been approved and you can now log in and start using our services.</p>
               <p>If you have any questions or need assistance, feel free to reach out to us.</p>
               <p>Welcome aboard!</p>
               <p>Best regards,<br>Global Edu Assist</p>`
    };

    await transporter.sendMail(mailOptions);
};

// New function for agent rejection email
exports.sendAgentRejectionEmail = async (email, agentName, reason) => {
    const reasonText = reason ? `\nReason: ${reason}` : '';
    const reasonHtml = reason ? `<p>Reason: <em>${reason}</em></p>` : '';

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your Account Registration Has Been Declined",
        text: `Dear ${agentName},

Thank you for your interest in joining us.
After reviewing your application, we regret to inform you that your account registration has been declined.${reasonText}

Your account information has been removed from our system.
If you believe this decision was made in error or have any questions, please feel free to contact us.

Best regards,
Global Edu Assist`,
        html: `<p>Dear <strong>${agentName}</strong>,</p>
               <p>Thank you for your interest in joining us.</p>
               <p>After reviewing your application, we regret to inform you that your account registration has been declined.</p>
               ${reasonHtml}
               <p>Your account information has been removed from our system.</p>
               <p>If you believe this decision was made in error or have any questions, please feel free to contact us.</p>
               <p>Best regards,<br>Global Edu Assist</p>`
    };

    await transporter.sendMail(mailOptions);
};