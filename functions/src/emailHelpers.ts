export const generateContactEmailHtml = (data: any, docId: string) => {
    const phoneSection = data.phone
        ? `<p><strong>Phone:</strong> ${data.phone}</p>`
        : "";

    return `
        <h2>New Contact Enquiry</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        ${phoneSection}
        <p><strong>Message:</strong></p>
        <p>${data.message}</p>
        <hr/>
        <p>Document ID: ${docId}</p>
    `;
};

export const generateProductEmailHtml = (
    data: any,
    docId: string,
    productName: string
) => {
    const phoneRow = data.phone
        ? `<p><strong>Phone:</strong> ${data.phone}</p>`
        : "";
    const organizationRow = data.organization
        ? `<p><strong>Organization:</strong> ${data.organization}</p>`
        : "";
    const quantityRow = data.estimatedQuantity
        ? `<p><strong>Quantity:</strong> ${data.estimatedQuantity}</p>`
        : "";
    const descriptionSection = data.projectDescription
        ? `<p><strong>Description:</strong> ${data.projectDescription}</p>`
        : "";

    return `
        <h2>New Product Enquiry</h2>
        <p><strong>Product:</strong> ${productName}</p>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        ${phoneRow}
        ${organizationRow}
        ${quantityRow}
        ${descriptionSection}
        <hr/>
        <p>Document ID: ${docId}</p>
    `;
};
