import { setGlobalOptions } from "firebase-functions";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { defineSecret } from "firebase-functions/params";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";

import { generateContactEmailHtml, generateProductEmailHtml } from "./emailHelpers";
import { sendEmail } from "./sendEmail";

admin.initializeApp();

// ✅ Define SendGrid Secret (GEN 2 CORRECT WAY)
const SENDGRID_API_KEY = defineSecret("SENDGRID_API_KEY");

// Define Configuration Parameters
const COMPANY_EMAIL = defineSecret("COMPANY_EMAIL");
const FROM_EMAIL = defineSecret("FROM_EMAIL");

// Optional: limit max instances
setGlobalOptions({ maxInstances: 10 });

// ===============================
// CONTACT ENQUIRY EMAIL
// ===============================
export const contactEmail = onDocumentCreated(
    {
        document: "contactEnquiries/{docId}",
        secrets: [SENDGRID_API_KEY, COMPANY_EMAIL, FROM_EMAIL],
    },
    async (event) => {
        const data = event.data?.data();
        const docId = event.params.docId;

        if (!data || !data.name || !data.email || !data.message) {
            logger.error("Missing required fields in contact enquiry", { data });
            return;
        }

        const html = generateContactEmailHtml(data, docId);

        try {
            await sendEmail({
                apiKey: SENDGRID_API_KEY.value(),
                to: COMPANY_EMAIL.value(),
                from: FROM_EMAIL.value(),
                subject: `New Contact Enquiry from ${data.name}`,
                html: html,
                replyTo: data.email,
            });

            await event.data?.ref.update({ emailSent: true });
        } catch (error) {
            // Error logged in sendEmail
            throw error;
        }
    }
);

// ===============================
// PRODUCT ENQUIRY EMAIL
// ===============================
export const productEmail = onDocumentCreated(
    {
        document: "productEnquiries/{docId}",
        secrets: [SENDGRID_API_KEY, COMPANY_EMAIL, FROM_EMAIL],
    },
    async (event) => {
        const data = event.data?.data();
        const docId = event.params.docId;

        if (!data || !data.name || !data.email || !data.productId) {
            logger.error("Missing required fields in product enquiry", { data });
            return;
        }

        let productName = "Unknown Product";

        try {
            const productDoc = await admin
                .firestore()
                .collection("products")
                .doc(data.productId)
                .get();

            if (productDoc.exists) {
                productName = productDoc.data()?.name || productName;
            }
        } catch (error) {
            logger.warn("Could not fetch product details", { error });
        }

        const html = generateProductEmailHtml(data, docId, productName);

        try {
            await sendEmail({
                apiKey: SENDGRID_API_KEY.value(),
                to: COMPANY_EMAIL.value(),
                from: FROM_EMAIL.value(),
                subject: `New Product Enquiry: ${productName}`,
                html: html,
                replyTo: data.email,
            });

            await event.data?.ref.update({ emailSent: true });
        } catch (error) {
            // Error logged in sendEmail
            throw error;
        }
    }
);
