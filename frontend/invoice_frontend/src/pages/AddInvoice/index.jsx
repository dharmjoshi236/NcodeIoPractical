import { useState } from "react";
import {
  Container,
  Button,
  InputGroup,
  Form,
  Row,
  Col,
  ButtonGroup,
} from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import { useFormik } from "formik";
import InvoiceValidationSchema from "../../validationSchema";
import { useNavigate } from "react-router";
import { postRequest } from "../../apiHelpers";

const AddInvoice = (props) => {
  const [items, setItems] = useState([
    {
      itemName: "",
      unitPrice: 0,
      itemQuantity: 0,
    },
  ]);

  const [maxArrayLength, setMaxArrayLength] = useState("");
  const [onLoading, setOnLoading] = useState(false);
  const [isArrayMaxed, setIsArrayMaxed] = useState(false);
  const navigate = useNavigate();

  const goToHome = () => {
    navigate("/");
  };

  const [formDetails, setFormDetails] = useState({
    invoiceDate: "",
    customerName: "",
    customerAddress: "",
    customerEmail: "",
    paymentStatus: "",
    discountPercentage: 0,
    taxPercentage: 0,
    items: items,
  });

  const formik = useFormik({
    initialValues: {
      invoiceDate: "",
      customerName: "",
      customerAddress: "",
      customerEmail: "",
      paymentStatus: "",
      discountPercentage: 0,
      taxPercentage: 0,
      items: [
        {
          unitPrice: 0,
          itemName: "",
          itemQuantity: 0,
        },
      ],
    },
    validationSchema: InvoiceValidationSchema,
    async onSubmit(values) {
      await handleFormSubmission(values);
    },
    onReset() {
      clearState();
    },
  });

  const handleItemsArrayKey = (index, key, value) => {
    let updatedItemsArray = [...items];
    updatedItemsArray[index][key] = value;
    setItems(updatedItemsArray);
    setFormDetails({ ...formDetails, items: updatedItemsArray });
    formik.setValues({ ...formik.values, items: updatedItemsArray });
  };

  const addItem = () => {
    if (items.length > 9) {
      toast.error("You cannot add more than 10 items in an invoice");
      setIsArrayMaxed(true);
      return;
    }
    let updatedItemsArray = [
      ...items,
      { itemName: "", unitPrice: 0, itemQuantity: 0 },
    ];
    setItems(updatedItemsArray);
    setFormDetails({ ...formDetails, items: updatedItemsArray });
    formik.setValues({ ...formik.values, items: updatedItemsArray });
  };

  const removeItem = (index) => {
    setIsArrayMaxed(false);
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
    setFormDetails({ ...formDetails, items: updatedItems });
    formik.setValues({ ...formik.values, items: updatedItems });
  };

  const handleFormSubmission = async (values) => {
    try {
      setOnLoading(true);
      let response = await postRequest("/invoice/add", values);

      if (response.status == 200) {
        toast.success(response.data.message, {autoClose: 2000});
        setTimeout(()=> {
          setOnLoading(false);
          navigate("/");
        }, 2000);
      } else {
        toast.error(response.data.message, {autoClose: 2000});
        clearState();
        setTimeout(()=> {
          setOnLoading(false);
          navigate("/");
        }, 2000)
      }
    } catch (error) {
      console.log("Error in api call for posting invoice ", error);
      setOnLoading(false);
      toast("Unable to add invoice, try again");
      clearState();
    }
  };

  const handlePaymentStatus = (e) => {
    formik.setValues({ ...formik.values, paymentStatus: e.target.value });
  };

  const clearState = () => {
    setFormDetails({
      invoiceDate: "",
      customerName: "",
      customerAddress: "",
      customerEmail: "",
      paymentStatus: "",
      discountPercentage: 0,
      taxPercentage: 0,
      items: [
        {
          unitPrice: 0,
          itemName: "",
          itemQuantity: 0,
        },
      ],
    });
    setItems([
      {
        unitPrice: 0,
        itemName: "",
        itemQuantity: 0,
      },
    ]);
    formik.resetForm();
  };

  const handleBlurForItems = (index, field) => {
    formik.setTouched({
      ...formik.touched,
      items:
        formik.touched.items?.map((touchedItem, i) =>
          i === index ? { ...touchedItem, [field]: true } : touchedItem
        ) || [],
    });
  };

  return (
    <Container className="mt-5">
      <ToastContainer/>
      <h3>Create Invoice</h3>
      {/* <
        initialValues={formDetails}
        validationSchema={InvoiceValidationSchema}
        onSubmit={handleSubmit}
      > */}
      <Form>
        <Container className="mt-5">
          <Row className="mb-3">
            <Col md={4}>
              <div className="mb-3">
                <Form.Label className="fw-semibold">Invoice Date</Form.Label>
                <Form.Control
                  type="date"
                  name="invoiceDate"
                  placeholder="Select your invoice date"
                  className="no-outline"
                  value={formik.values.invoiceDate}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.errors.invoiceDate && formik.touched.invoiceDate ? (
                  <p className="text-danger mb-0 pt-2">
                    {formik.errors.invoiceDate}
                  </p>
                ) : null}
              </div>
            </Col>
            <Col md={4}>
              <div className="mb-3">
                <Form.Label className="fw-semibold">Customer Name</Form.Label>
                <Form.Control
                  type="text"
                  name="customerName"
                  placeholder="Enter the customer name"
                  value={formik.values.customerName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.errors.customerName && formik.touched.customerName ? (
                  <p className="text-danger mb-0 pt-2">
                    {formik.errors.customerName}
                  </p>
                ) : null}
              </div>
            </Col>
            <Col md={4}>
              <div className="mb-3">
                <Form.Label className="fw-semibold">Customer Email</Form.Label>
                <Form.Control
                  type="text"
                  name="customerEmail"
                  placeholder="Enter customer email"
                  value={formik.values.customerEmail}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.errors.customerEmail && formik.touched.customerEmail ? (
                  <p className="text-danger mb-0 pt-2">
                    {formik.errors.customerEmail}
                  </p>
                ) : null}
              </div>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md={6}>
              <div className="mb-3">
                <Form.Label className="fw-semibold">
                  Customer Address
                </Form.Label>
                <Form.Control
                  type="text"
                  name="customerAddress"
                  placeholder="Enter customer address"
                  className="no-outline"
                  value={formik.values.customerAddress}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.errors.customerAddress &&
                formik.touched.customerAddress ? (
                  <p className="text-danger mb-0 pt-2">
                    {formik.errors.customerAddress}
                  </p>
                ) : null}
              </div>
            </Col>
            <Col md={2}>
              <div className="mb-3">
                <Form.Label className="fw-semibold">Payment Status</Form.Label>
                <Form.Select
                  name="paymentStatus"
                  value={formik.values.paymentStatus}
                  onChange={(e) => handlePaymentStatus(e)}
                  onBlur={formik.handleBlur}
                >
                  <option value="pending" selected>
                    Pending
                  </option>
                  <option value="paid">Paid</option>
                </Form.Select>
                {formik.errors.paymentStatus && formik.touched.paymentStatus ? (
                  <p className="text-danger mb-0 pt-2">
                    {formik.errors.paymentStatus}
                  </p>
                ) : null}
              </div>
            </Col>
            <Col md={2}>
              <div className="mb-3">
                <Form.Label className="fw-semibold">Tax Percentage</Form.Label>
                <Form.Control
                  type="number"
                  name="taxPercentage"
                  placeholder="Enter tax percetage"
                  className="no-outline"
                  value={formik.values.taxPercentage}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.errors.taxPercentage && formik.touched.taxPercentage ? (
                  <p className="text-danger mb-0 pt-2">
                    {formik.errors.taxPercentage}
                  </p>
                ) : null}
              </div>
            </Col>
            <Col md={2}>
              <div className="mb-3">
                <Form.Label className="fw-semibold">Discount</Form.Label>
                <Form.Control
                  type="number"
                  name="discountPercentage"
                  placeholder="Enter discount percentage"
                  className="no-outline"
                  value={formik.values.discountPercentage}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.errors.discountPercentage &&
                formik.touched.discountPercentage ? (
                  <p className="text-danger mb-0 pt-2">
                    {formik.errors.discountPercentage}
                  </p>
                ) : null}
              </div>
            </Col>
          </Row>
          <Row className="mb-3">
            <h5 className="mb-3">Add Items</h5>

            <Container
              className="mb-2 mt-1"
              style={{
                overflowY: "auto",
                height: "30vh",
                scrollBehavior: "smooth",
              }}
            >
              {items.map((item, index) => (
                <Row
                  key={index}
                  className="mb-2 mt-2 px-2 py-2"
                  style={{
                    backgroundColor: "aliceblue",
                    borderRadius: "0.5rem",
                  }}
                >
                  <Col md={2}>
                    <div className="mb-3">
                      <Form.Label className="fw-semibold">Item Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="itemName"
                        placeholder="Enter name of item"
                        className="no-outline"
                        value={formik.values.items[index].itemName}
                        onChange={(e) =>
                          handleItemsArrayKey(
                            index,
                            e.target.name,
                            e.target.value
                          )
                        }
                        onBlur={() => handleBlurForItems(index, "itemName")}
                      />
                      {formik.touched.items?.[index]?.itemName &&
                      formik.errors.items?.[index]?.itemName ? (
                        <p className="text-danger mb-0 pt-2">
                          {formik.errors.items?.[index]?.itemName}
                        </p>
                      ) : null}
                    </div>
                  </Col>
                  <Col md={2}>
                    <div className="mb-3">
                      <Form.Label className="fw-semibold">
                        Unit Price
                      </Form.Label>
                      <Form.Control
                        type="number"
                        name="unitPrice"
                        placeholder="Enter unit price"
                        className="no-outline"
                        value={formik.values.items[index].unitPrice}
                        onChange={(e) =>
                          handleItemsArrayKey(
                            index,
                            e.target.name,
                            e.target.value
                          )
                        }
                        onBlur={() => handleBlurForItems(index, "unitPrice")}
                      />
                      {formik.touched.items?.[index]?.unitPrice &&
                      formik.errors.items?.[index]?.unitPrice ? (
                        <p className="text-danger mb-0 pt-2">
                          {formik.errors.items?.[index]?.unitPrice}
                        </p>
                      ) : null}
                    </div>
                  </Col>
                  <Col md={2}>
                    <div className="mb-3">
                      <Form.Label className="fw-semibold">Quantity</Form.Label>
                      <Form.Control
                        type="number"
                        name="itemQuantity"
                        placeholder="Enter item quantity"
                        className="no-outline"
                        value={formik.values.items[index].itemQuantity}
                        onChange={(e) =>
                          handleItemsArrayKey(
                            index,
                            e.target.name,
                            e.target.value
                          )
                        }
                        onBlur={() => handleBlurForItems(index, "itemQuantity")}
                      />
                      {formik.touched.items?.[index]?.itemQuantity &&
                      formik.errors.items?.[index]?.itemQuantity ? (
                        <p className="text-danger mb-0 pt-2">
                          {formik.errors.items?.[index]?.itemQuantity}
                        </p>
                      ) : null}
                    </div>
                  </Col>
                  <Col md={4} className="align-items-center d-flex mt-2">
                    <div className="d-flex justify-content-start">
                      <Button
                        className="mx-2 align-items-end"
                        variant="success"
                        disabled={onLoading || isArrayMaxed}
                        onClick={() => addItem()}
                      >
                        Add
                      </Button>
                      {index != 0 ? (
                        <Button
                          className="mx-2 align-items-end"
                          variant="danger"
                          disabled={onLoading}
                          onClick={() => removeItem()}
                        >
                          Delete
                        </Button>
                      ) : null}
                    </div>
                  </Col>
                </Row>
              ))}
            </Container>
          </Row>
        </Container>
        <div className="d-flex justify-content-start">
          <Button
            className="mx-2"
            variant="primary"
            disabled={onLoading}
            onClick={formik.handleSubmit}
          >
            Submit
          </Button>
          <Button
            className="mr-2"
            variant="danger"
            disabled={onLoading}
            onClick={formik.handleReset}
          >
            Reset
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default AddInvoice;
