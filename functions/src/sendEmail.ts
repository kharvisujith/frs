import * as logger from "firebase-functions/logger";
import sgMail from "@sendgrid/mail";

interface SendEmailOptions {
    apiKey: string;
    to: string;
    from: string;
    subject: string;
    html: string;
    replyTo?: string;
}

export const sendEmail = async ({
    apiKey,
    to,
    from,
    subject,
    html,
    replyTo,
}: SendEmailOptions) => {
    // Set API key for this execution
    sgMail.setApiKey(apiKey);

    const msg = {
        to,
        from,
        replyTo,
        subject,
        html,
    };

    try {
        await sgMail.send(msg);
        logger.info(`Email sent successfully to ${to}`);
        return true;
    } catch (error) {
        logger.error("Failed to send email", { error });
        throw error;
    }
};
