const express = require("express");
const { sendEmail } = require("./emailService");
const path = require("path");
const fs = require("fs");
const validator = require("validator");
const router = express.Router();

// Helper function to validate request body
const validateContactForm = (req) => {
  const { name, email, aboutProject } = req.body;

  if (!name || !email || !aboutProject) {
    return "Name, email, and project details are required.";
  }

  if (!validator.isEmail(email)) {
    return "Invalid email address.";
  }

  return null; // No validation errors
};

// Helper function to read and compile email templates
const compileEmailTemplate = (templatePath, data) => {
  let emailHtml = fs.readFileSync(templatePath, "utf-8");

  // Replace placeholders with actual data
  Object.keys(data).forEach(key => {
    emailHtml = emailHtml.replace(new RegExp(`{{${key}}}`, 'g'), data[key] || 'N/A');
  });

  return emailHtml;
};

// POST route to handle contact form submissions
router.post("/contact-me", async (req, res) => {

  console.log("Request Body:", req.body);
  
  const { name, company, email, phone, aboutProject } = req.body;

  // 1. Validate the request data
  const validationError = validateContactForm(req);
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  // 2. Prepare the data for email templates
  const adminEmailData = { name, company, email, phone, aboutProject };
  const submitterEmailData = { name, company, email, phone, aboutProject };

  try {
    // 3. Read admin email template and send email to admin
    const adminTemplatePath = path.join(__dirname, "emails", "adminEmail.html");
    const adminEmailHtml = compileEmailTemplate(adminTemplatePath, adminEmailData);
    
    await sendEmail({
      to: process.env.EMAIL_USER,
      subject: `Contact Me Submitted: ${name}`,
      text: "", // Optional text version
      html: adminEmailHtml,
    });

    // 4. Read submitter email template and send confirmation to submitter
    const submitterTemplatePath = path.join(__dirname, "emails", "submitterEmail.html");
    const submitterEmailHtml = compileEmailTemplate(submitterTemplatePath, submitterEmailData);

    await sendEmail({
      to: email,
      subject: "Thank You for Reaching Out! We'll Be in Touch Shortly.",
      text: "", // Optional text version
      html: submitterEmailHtml,
    });

    // 5. Return a success response
    return res.status(200).json({
      message: "Your message has been sent successfully. We'll get back to you shortly!",
    });

  } catch (error) {
    console.error("Error processing contact form:", error);
    return res.status(500).json({
      message: "An error occurred while processing your request. Please try again later.",
    });
  }
});


router.get("/", (req, res) => res.send("api is running...."));

module.exports = router;
