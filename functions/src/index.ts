import { setGlobalOptions } from "firebase-functions";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";
import sgMail from "@sendgrid/mail";

admin.initializeApp();

// Set SendGrid API key from environment variable
sgMail.setApiKey(process.env.SENDGRID_KEY as string);

// Company email to receive notifications
const COMPANY_EMAIL = process.env.COMPANY_EMAIL || "kharvisuji66@gmail.com";

// Optional: limit max instances
setGlobalOptions({ maxInstances: 10 });

/**
 * CONTACT ENQUIRY EMAIL - Notify company
 * Sends notification to company when a contact form is submitted
 */
export const contactEmail = onDocumentCreated(
    "contactEnquiries/{docId}",
    async (event) => {
        const data = event.data?.data();
        const docId = event.params.docId;

        if (!data) {
            logger.error("No data found in contact enquiry");
            return;
        }

        // Validate required fields
        if (!data.name || !data.email || !data.message) {
            logger.error("Missing required fields in contact enquiry", { data });
            return;
        }

        // Build email content with optional fields
        const phoneSection = data.phone
            ? `<tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Phone:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${data.phone}</td></tr>`
            : '';

        const msg = {
            to: COMPANY_EMAIL,
            from: "your_verified_email@gmail.com", // must be verified in SendGrid
            replyTo: data.email, // Allow easy reply to customer
            subject: `New Contact Enquiry from ${data.name}`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">
            📧 New Contact Enquiry
          </h2>
          
          <table style="width: 100%; margin: 20px 0; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Name:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${data.name}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Email:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><a href="mailto:${data.email}">${data.email}</a></td>
            </tr>
            ${phoneSection}
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Submitted:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${new Date().toLocaleString()}</td>
            </tr>
          </table>

          <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #374151;">Message:</h3>
            <p style="margin: 0; white-space: pre-wrap;">${data.message}</p>
          </div>

          <div style="background: #eff6ff; padding: 12px; border-left: 4px solid #2563eb; margin-top: 20px;">
            <p style="margin: 0; font-size: 14px; color: #1e40af;">
              <strong>Action Required:</strong> Please respond to this enquiry within 24 hours.
            </p>
          </div>

          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
          <p style="color: #6b7280; font-size: 12px;">
            Document ID: ${docId}<br/>
            You can reply directly to this email to respond to ${data.name}.
          </p>
        </div>
      `,
        };

        try {
            await sgMail.send(msg);
            logger.info("Contact notification email sent to company", {
                email: data.email,
                name: data.name
            });

            // Update emailSent flag
            await event.data?.ref.update({ emailSent: true });
        } catch (error) {
            logger.error("Failed to send contact notification email", {
                error,
                customerEmail: data.email
            });
            throw error;
        }
    }
);

/**
 * PRODUCT ENQUIRY EMAIL - Notify company
 * Sends notification to company when a product enquiry is submitted
 */
export const productEmail = onDocumentCreated(
    "productEnquiries/{docId}",
    async (event) => {
        const data = event.data?.data();
        const docId = event.params.docId;

        if (!data) {
            logger.error("No data found in product enquiry");
            return;
        }

        // Validate required fields
        if (!data.name || !data.email || !data.productId) {
            logger.error("Missing required fields in product enquiry", { data });
            return;
        }

        // Fetch product details
        let productName = "Unknown Product";
        let productCategory = "";
        try {
            const productDoc = await admin.firestore()
                .collection("products")
                .doc(data.productId)
                .get();

            if (productDoc.exists) {
                const productData = productDoc.data();
                productName = productData?.name || productName;
                productCategory = productData?.categoryName || "";
            }
        } catch (error) {
            logger.warn("Could not fetch product details", { error, productId: data.productId });
        }

        // Build optional fields rows
        const phoneRow = data.phone
            ? `<tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Phone:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${data.phone}</td></tr>`
            : '';

        const organizationRow = data.organization
            ? `<tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Organization:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${data.organization}</td></tr>`
            : '';

        const quantityRow = data.estimatedQuantity
            ? `<tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Quantity:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${data.estimatedQuantity}</td></tr>`
            : '';

        const descriptionSection = data.projectDescription
            ? `
        <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #374151;">Project Description:</h3>
          <p style="margin: 0; white-space: pre-wrap;">${data.projectDescription}</p>
        </div>
      `
            : '';

        const msg = {
            to: COMPANY_EMAIL,
            from: "your_verified_email@gmail.com",
            replyTo: data.email, // Allow easy reply to customer
            subject: `New Product Enquiry: ${productName} - ${data.name}`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">
            📦 New Product Enquiry
          </h2>
          
          <div style="background: #eff6ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin: 0 0 10px 0; color: #1e40af;">Product: ${productName}</h3>
            ${productCategory ? `<p style="margin: 0; color: #6b7280;">Category: ${productCategory}</p>` : ''}
          </div>

          <h3 style="color: #374151;">Customer Details:</h3>
          <table style="width: 100%; margin: 20px 0; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Name:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${data.name}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Email:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><a href="mailto:${data.email}">${data.email}</a></td>
            </tr>
            ${phoneRow}
            ${organizationRow}
            ${quantityRow}
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Submitted:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${new Date().toLocaleString()}</td>
            </tr>
          </table>

          ${descriptionSection}

          <div style="background: #eff6ff; padding: 12px; border-left: 4px solid #2563eb; margin-top: 20px;">
            <p style="margin: 0; font-size: 14px; color: #1e40af;">
              <strong>Action Required:</strong> Please respond with product availability, pricing, and delivery timeline within 24 hours.
            </p>
          </div>

          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
          <p style="color: #6b7280; font-size: 12px;">
            Document ID: ${docId}<br/>
            Product ID: ${data.productId}<br/>
            You can reply directly to this email to respond to ${data.name}.
          </p>
        </div>
      `,
        };

        try {
            await sgMail.send(msg);
            logger.info("Product enquiry notification sent to company", {
                customerEmail: data.email,
                customerName: data.name,
                productId: data.productId,
                productName
            });

            // Update emailSent flag
            await event.data?.ref.update({ emailSent: true });
        } catch (error) {
            logger.error("Failed to send product enquiry notification", {
                error,
                customerEmail: data.email,
                productId: data.productId
            });
            throw error;
        }
    }
);
