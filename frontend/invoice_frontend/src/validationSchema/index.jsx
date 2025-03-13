import * as yup from 'yup';

const InvoiceValidationSchema = yup.object({
  invoiceDate: yup.date().required("Invoice date is required"),
  customerName: yup
    .string()
    .required("Customer name is required")
    .min(3, "Customer name is too short")
    .max(50, "Customer name is too long"),
  customerAddress: yup
    .string()
    .min(5, "Customer address too short")
    .max(255, "Customer address is too long")
    .required("Customer Address is required"),
  customerEmail: yup
    .string()
    .email("Customer email should be a valid email")
    .required("Customer email is required"),
  discountPercentage: yup
    .number()
    .min(0, "Discount cannot be less than 0")
    .max(100, "Discounts cannot be more than 100")
    .required("Discount percentage is required"),
  taxPercentage: yup
    .number()
    .min(0, "Tax cannot be less than 0")
    .max(100, "Tax cannot be more than 100")
    .required("Tax percentage is required"),
  items: yup
    .array()
    .of(
      yup.object({
        itemName: yup
          .string()
          .required("Item name is required")
          .min(3, "Item name is too short")
          .max(255, "Item name is too long"),
        unitPrice: yup
          .number()
          .positive("Unit price must be positive")
          .required("Unit price of an item is required"),
        itemQuantity: yup
          .number()
          .positive("Item quantity must be positive")
          .required("Item quantity is required"),
      })
    )
    .min(1, "Atleast one item is required to generate invoice")
    .max(10, "Maximum 10 items are allowed in invoice")
    .required("Items are required to generate invoice"),
});

export default InvoiceValidationSchema;