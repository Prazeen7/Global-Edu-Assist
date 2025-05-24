const nodemailer = require("nodemailer")
require("dotenv").config()

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
})

exports.sendVerificationEmail = async (email, otp) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Verify Your Account",
        text: `Your verification OTP is: ${otp}\nThis OTP will expire in 10 minutes.`,
        html: `<p>Your verification OTP is: <strong>${otp}</strong></p>
               <p>This OTP will expire in 10 minutes.</p>`,
    }

    await transporter.sendMail(mailOptions)
}

exports.sendPasswordResetEmail = async (email, otp) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your Password Reset OTP",
        text: `Your OTP for password reset is: ${otp}\nThis OTP will expire in 10 minutes.`,
        html: `<p>Your OTP for password reset is: <strong>${otp}</strong></p>
               <p>This OTP will expire in 10 minutes.</p>`,
    }

    await transporter.sendMail(mailOptions)
}

// function for agent registration pending approval email
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
               <p>Best regards,<br>Global Edu Assist</p>`,
    }

    await transporter.sendMail(mailOptions)
}

// function for agent approval email
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
               <p>Best regards,<br>Global Edu Assist</p>`,
    }

    await transporter.sendMail(mailOptions)
}

// agent rejection email with resubmission link
exports.sendAgentRejectionEmail = async (email, agentName, reason, agentId) => {
    const baseUrl = process.env.FRONTEND_URL || "http://localhost:3000"
    const resubmitLink = `${baseUrl}/agent-resubmit/${agentId}`

    const reasonText = reason ? `\nReason: ${reason}` : ""
    const reasonHtml = reason ? `<p>Reason: <em>${reason}</em></p>` : ""

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your Account Registration Has Been Declined",
        text: `Dear ${agentName},

Thank you for your interest in joining us.
After reviewing your application, we regret to inform you that your account registration has been declined.${reasonText}

You can update your information and resubmit your application by visiting:
${resubmitLink}

If you believe this decision was made in error or have any questions, please feel free to contact us.

Best regards,
Global Edu Assist`,
        html: `<p>Dear <strong>${agentName}</strong>,</p>
               <p>Thank you for your interest in joining us.</p>
               <p>After reviewing your application, we regret to inform you that your account registration has been declined.</p>
               ${reasonHtml}
               <p>You can update your information and resubmit your application by clicking the link below:</p>
               <p><a href="${resubmitLink}" style="display: inline-block; background-color: #4f46e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; margin-top: 10px;">Update and Resubmit</a></p>
               <p>If you believe this decision was made in error or have any questions, please feel free to contact us.</p>
               <p>Best regards,<br>Global Edu Assist</p>`,
    }

    await transporter.sendMail(mailOptions)
}

// function to notify admins when an agent resubmits their application
exports.sendAgentResubmissionNotificationToAdmin = async (agentName, agentId) => {
    const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER
    const baseUrl = process.env.ADMIN_URL || "http://localhost:3000/admin"
    const agentUrl = `${baseUrl}/agents`

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: adminEmail,
        subject: "Agent Application Resubmitted",
        text: `
Agent ${agentName} (ID: ${agentId}) has resubmitted their application after rejection.

Please review the updated information at your earliest convenience.

You can view all pending agents at: ${agentUrl}

Best regards,
System Notification
        `,
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
            <h2 style="color: #4f46e5;">Agent Application Resubmitted</h2>
            <p>Agent <strong>${agentName}</strong> (ID: ${agentId}) has resubmitted their application after rejection.</p>
            <p>Please review the updated information at your earliest convenience.</p>
            <div style="text-align: center; margin: 30px 0;">
                <a href="${agentUrl}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">View Pending Agents</a>
            </div>
            <p>Best regards,<br>System Notification</p>
        </div>
        `,
    }

    await transporter.sendMail(mailOptions)
}
