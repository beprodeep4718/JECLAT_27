const inr = new Intl.NumberFormat("en-IN");

/** ₹ with Indian digit grouping: 320000 → "₹3,20,000" */
export const rupees = (n: number) => `₹${inr.format(n)}`;

export const pad2 = (n: number) => String(n).padStart(2, "0");
