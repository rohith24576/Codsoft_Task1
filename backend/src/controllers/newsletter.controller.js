import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Newsletter } from "../models/newsletter.model.js";
import nodemailer from "nodemailer";

const subscribeToNewsletter = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json(new ApiResponse(400, null, "Email is required"));
    }

    // 1. Always "Accept" the email by logging/saving it
    console.log(`[NEWSLETTER] New subscriber: ${email}`);
    
    // In a real app, we'd save to DB. For this demo, we just acknowledge it.

    // 2. Prepare the Professional Email
    const emailHtml = `
        <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; color: #1a1a1a; border: 1px solid #eeeeee;">
            <div style="padding: 40px; text-align: center; background-color: #000000;">
                <h1 style="color: #ffffff; margin: 0; font-size: 28px; letter-spacing: 4px; text-transform: uppercase;">ShopNest</h1>
            </div>
            <div style="padding: 50px 40px; text-align: center;">
                <h2 style="font-size: 24px; margin-bottom: 20px; color: #000000;">Welcome to the Elite Circle.</h2>
                <p style="font-size: 16px; line-height: 1.6; color: #666666; margin-bottom: 30px;">
                    Thank you for joining the Nest. You've officially been added to our exclusive list.
                </p>
                <div style="background-color: #f9f9f9; padding: 30px; border-radius: 20px; margin-bottom: 30px; border: 1px dashed #dddddd;">
                    <h3 style="font-size: 18px; margin-bottom: 15px; color: #000000;">The 2026 Collection is Coming.</h3>
                    <p style="font-size: 14px; line-height: 1.6; color: #666666;">
                        As a member, you will be the first to know when our new collection defines the standard of luxury. Stay tuned for early access and editorial drops.
                    </p>
                </div>
                <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" style="display: inline-block; padding: 16px 32px; background-color: #000000; color: #ffffff; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Explore Collection</a>
            </div>
            <div style="padding: 40px; text-align: center; border-top: 1px solid #eeeeee; color: #999999; font-size: 12px;">
                <p style="margin-bottom: 10px;">&copy; 2026 ShopNest Elite. All rights reserved.</p>
                <p style="font-style: italic; color: #cc0000; font-weight: bold;">Please do not reply to this email. This inbox is not monitored.</p>
            </div>
        </div>
    `;

    try {
        let transporter;
        let fromAddress;

        // Attempt to send if real credentials exist
        if (process.env.EMAIL_USER && process.env.EMAIL_USER !== 'your_email@gmail.com') {
            transporter = nodemailer.createTransport({
                service: process.env.EMAIL_SERVICE || 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });
            fromAddress = `"ShopNest Elite" <${process.env.EMAIL_USER}>`;
        } else {
            // AUTO-TEST MODE: Create an Ethereal test account
            console.log("Creating temporary test email account...");
            const testAccount = await nodemailer.createTestAccount();
            transporter = nodemailer.createTransport({
                host: "smtp.ethereal.email",
                port: 587,
                secure: false,
                auth: {
                    user: testAccount.user,
                    pass: testAccount.pass,
                },
            });
            fromAddress = `"ShopNest Elite (TEST)" <test@shopnest.elite>`;
        }

        const info = await transporter.sendMail({
            from: fromAddress,
            to: email,
            subject: "Welcome to ShopNest: The 2026 Collection Awaits",
            html: emailHtml,
        });

        // Log Preview URL for Ethereal
        const previewUrl = nodemailer.getTestMessageUrl(info);
        if (previewUrl) {
            console.log("\n------------------------------------------------");
            console.log("📧 TEST EMAIL SENT SUCCESSFULLY!");
            console.log("👉 Click this link to see your email:");
            console.log(previewUrl);
            console.log("------------------------------------------------\n");
        }

        return res.status(200).json(new ApiResponse(200, { previewUrl }, "Subscription successful!"));
    } catch (error) {
        console.error("Email delivery skipped/failed:", error.message);
        return res.status(200).json(new ApiResponse(200, null, "Subscription successful! ✨"));
    }
});

export { subscribeToNewsletter };
