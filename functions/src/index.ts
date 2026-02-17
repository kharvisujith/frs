import { setGlobalOptions } from "firebase-functions";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { defineSecret, defineString } from "firebase-functions/params";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";
import sgMail from "@sendgrid/mail";

admin.initializeApp();

// ✅ Define SendGrid Secret (GEN 2 CORRECT WAY)
const SENDGRID_API_KEY = defineSecret("SENDGRID_API_KEY");

// Define Configuration Parameters
const COMPANY_EMAIL = defineString("COMPANY_EMAIL");
const FROM_EMAIL = defineString("FROM_EMAIL");

// Optional: limit max instances
setGlobalOptions({ maxInstances: 10 });

// ===============================
// CONTACT ENQUIRY EMAIL
// ===============================
export const contactEmail = onDocumentCreated(
    {
        document: "contactEnquiries/{docId}",
        secrets: [SENDGRID_API_KEY],
    },
    async (event) => {
        const data = event.data?.data();
        const docId = event.params.docId;

        if (!data || !data.name || !data.email || !data.message) {
            logger.error("Missing required fields in contact enquiry", { data });
            return;
        }

        // ✅ Set API key inside function
        sgMail.setApiKey(SENDGRID_API_KEY.value());


        const msg = {
            to: COMPANY_EMAIL.value(),
            from: FROM_EMAIL.value(), // MUST be verified in SendGrid
            replyTo: data.email,
            subject: `New Contact Enquiry from ${data.name}`,
            html: `
        <h2>New Contact Enquiry</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        ${data.phone ? `<p><strong>Phone:</strong> ${data.phone}</p>` : ""}
        <p><strong>Message:</strong></p>
        <p>${data.message}</p>
        <hr/>
        <p>Document ID: ${docId}</p>
      `,
        };

        try {
            await sgMail.send(msg);
            logger.info("Contact email sent successfully");

            await event.data?.ref.update({ emailSent: true });
        } catch (error) {
            logger.error("Failed to send contact email", { error });
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
        secrets: [SENDGRID_API_KEY],
    },
    async (event) => {
        const data = event.data?.data();
        const docId = event.params.docId;

        if (!data || !data.name || !data.email || !data.productId) {
            logger.error("Missing required fields in product enquiry", { data });
            return;
        }

        sgMail.setApiKey(SENDGRID_API_KEY.value());

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

        const msg = {
            to: COMPANY_EMAIL.value(),
            from: FROM_EMAIL.value(), // MUST be verified
            replyTo: data.email,
            subject: `New Product Enquiry: ${productName}`,
            html: `
        <h2>New Product Enquiry</h2>
        <p><strong>Product:</strong> ${productName}</p>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        ${data.phone ? `<p><strong>Phone:</strong> ${data.phone}</p>` : ""}
        ${data.organization ? `<p><strong>Organization:</strong> ${data.organization}</p>` : ""}
        ${data.estimatedQuantity ? `<p><strong>Quantity:</strong> ${data.estimatedQuantity}</p>` : ""}
        ${data.projectDescription ? `<p><strong>Description:</strong> ${data.projectDescription}</p>` : ""}
        <hr/>
        <p>Document ID: ${docId}</p>
      `,
        };

        try {
            await sgMail.send(msg);
            logger.info("Product enquiry email sent successfully");

            await event.data?.ref.update({ emailSent: true });
        } catch (error) {
            logger.error("Failed to send product enquiry email", { error });
            throw error;
        }
    }
);
