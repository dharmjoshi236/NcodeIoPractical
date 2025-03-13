import { Container, Button, Row, Col, Card, Form } from "react-bootstrap";
import { use, useEffect, useState } from "react";
import { getRequest, postRequest } from "../../apiHelpers/index";
import ListItemElement from "../../components/atomListElement";
import ViewModalForInvoice from "../../components/viewInvoiceModal";
import { toast, ToastContainer } from "react-toastify";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Pagination from "react-js-pagination";
import { useNavigate } from "react-router-dom";
import {debounce} from 'lodash'
// import "bootstrap/less/bootstrap.less";
const Home = () => {
  const [filters, setFilters] = useState({
    pageNo: 1,
    pageLimit: 10,
    startDate: null,
    endDate: null,
    paymentStatus: null,
    searchStr: "",
    sortInvoiceBy: "invoiceDate",
    sortOrder: "DESC",
  });

  const navigate = useNavigate();

  const goToCreateInvoice = () => {
    navigate("/addinvoice");
  };

  const [invoiceList, setInvoiceList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [showViewModal, setShowViewModal] = useState(false);
  const [invoiceHtmlString, setInvoiceHtmlString] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [customLoading, setCustomLoading] = useState();

  const fetchInvoicesListWhenSearch = debounce(async () => {
    setIsLoading(true)
    try {
      console.log("filers ", filters);
      console.log(isLoading);
      let response = await postRequest("/invoice/list", filters);
      if (response.status == 200) {
        console.log("response ", response.data.data.rows);
        setInvoiceList([...response.data.data.rows]);
        setTotalCount(response.data.data.count);
        setIsLoading(false);
      }
    } catch (error) {
      console.log("error from the api helpser ", error);
      setIsLoading(false)
    }
  }, 800);

  useEffect(() => {
    fetchInvoicesListWhenSearch();

    return ()=> {
      fetchInvoicesListWhenSearch.cancel()
    }
  }, [filters.searchStr]);

  useEffect(()=> {
    fetchInvoicesListWhenSearch();

    return ()=> {
      fetchInvoicesListWhenSearch.cancel()
    }
  }, [])

  useEffect(()=> {
    setIsLoading(true)
    const fetchInvoiceList = async()=> {
      try {
        let response = await postRequest("/invoice/list", filters);
      if (response.status == 200) {
        console.log("response ", response.data.data.rows);
        setInvoiceList([...response.data.data.rows]);
        setTotalCount(response.data.data.count);
        setIsLoading(false);
      }
      } catch (error) {
        console.log("error from the api helpser ", error);
        setIsLoading(false)
      }
    }

    fetchInvoiceList();
  }, [filters.pageLimit, filters.pageNo, filters.paymentStatus, filters.sortInvoiceBy, filters.sortOrder])

  const callDownloadPdfApi = async (invoiceId) => {
    try {
      setCustomLoading(true);
      const response = await getRequest(
        `/invoice/downloadPdf/${invoiceId}`,
        false
      );
      if (response.status == 200) {
        const { base64Pdf, filename } = response.data.data;

        const byteCharacters = atob(base64Pdf);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "application/pdf" });

        const createObjectUrl = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = createObjectUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        window.URL.revokeObjectURL(createObjectUrl);

        setCustomLoading(false);
        toast.success(response.data.message);
      } else {
        setCustomLoading(false);
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log("error in call api generate pdf ", error);
      setCustomLoading(false);
      throw error;
    }
  };
  const callViewInvoiceApi = async (invoiceId) => {
    try {
      const response = await getRequest(`/invoice/view/${invoiceId}`, false);
      if (response.status == 200) {
        setInvoiceHtmlString(response.data.data.htmlString);
        setShowViewModal(true);
      }
    } catch (error) {
      console.log("error in call api generate pdf ", error);
      throw error;
    }
  };
  const callSendPdfToUserApi = async (invoiceId) => {
    try {
      setCustomLoading(true);
      const response = await postRequest(`/invoice/sendInvoice`, {
        invoiceId: invoiceId,
      });
      if (response.status == 200) {
        setCustomLoading(false);
        toast.success(response.data.message, { autoClose: 2000 });
      }
    } catch (error) {
      console.log("error in call api generate pdf ", error);
      setCustomLoading(false);
      throw error;
    }
  };
  const handleModalClose = () => {
    setShowViewModal(false);
  };
  const handlePageChange = (pageNo) => {
    setFilters({ ...filters, pageNo: pageNo });
  };

  return (
    <>
      <Container className="mt-5">
        <ToastContainer />
        <Container className="mt-3">
          <Row className="mb-3 align-items-center">
            <Col md={3}>
              <Form.Label className="fw-semibold text-dark">
                Search Invoices
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Search by customer name or invoice number...."
                value={filters.searchStr}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    searchStr: e.target.value,
                    pageNo: 1,
                  })
                }
                disabled={isLoading || customLoading}
              />
            </Col>
            <Col md={2}>
              <Form.Label className="fw-semibold text-dark">Sort By</Form.Label>
              <Form.Select
                value={filters.sortOrder}
                onChange={(e) =>
                  setFilters({ ...filters, sortOrder: e.target.value })
                }
                disabled={isLoading || customLoading}
              >
                <option value="DESC">High to Low</option>
                <option value="ASC">Low to High</option>
              </Form.Select>
            </Col>
            <Col md={2}>
              <Form.Label className="fw-semibold text-dark">
                Sort Parameters
              </Form.Label>
              <Form.Select
                value={filters.sortInvoiceBy}
                onChange={(e) =>
                  setFilters({ ...filters, sortInvoiceBy: e.target.value })
                }
                disabled={isLoading || customLoading}
              >
                <option value="invoiceDate">Invoice Date</option>
                <option value="createdAt">Created Date</option>
                <option value="totalAmount">Amount</option>
              </Form.Select>
            </Col>
            <Col md={2}>
              <Form.Label className="fw-semibold text-dark">
                Payment status
              </Form.Label>
              <Form.Select
                value={filters.paymentStatus}
                onChange={(e) =>
                  setFilters({ ...filters, paymentStatus: e.target.value })
                }
                disabled={isLoading || customLoading}
              >
                <option value="">All</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
              </Form.Select>
            </Col>
            <Col md={3} className="d-flex justify-content-end">
              <Button
                onClick={() => goToCreateInvoice()}
                disabled={isLoading || customLoading}
                variant="dark"
              >
                + Create Invoice
              </Button>
            </Col>
          </Row>
        </Container>
        <div className="d-flex justify-content-between">
          <h3 className="mt-5 mb-3">Invoices</h3>
          <div className="d-flex align-items-end">
            <Pagination
              activePage={filters.pageNo}
              itemsCountPerPage={10}
              totalItemsCount={totalCount}
              pageRangeDisplayed={5}
              onChange={(number) => handlePageChange(number)}
              itemClass="page-item"
              linkClass="page-link"
            />
          </div>
        </div>
        <Container
            className="mt-3"
            style={{
              overflowY: "auto",
              height: "60vh",
              padding: "10px",
              backgroundColor: "#9ec6e9",
              borderRadius: "0.5rem",
              scrollBehavior: "smooth",
              scrollbarWidth: "none",
            }}
          >
        {isLoading ? 
          <Skeleton className="z-3" height={70} count={5} />
         : (
            invoiceList.length > 0 ? (
              invoiceList.map((listItem) => (
                <ListItemElement
                  callApiToParent={callDownloadPdfApi}
                  callApiForView={callViewInvoiceApi}
                  callApiForSend={callSendPdfToUserApi}
                  key={listItem.invoiceId}
                  data={listItem}
                  isLoading={customLoading || isLoading}
                />
              ))
            ) : (
              <h3
                style={{
                  marginTop: "10rem",
                  color: "black",
                  textAlign: "center",
                }}
              >
                No Data Found
              </h3>
            )
          )}
          </Container>
      </Container>

      {showViewModal ? (
        <ViewModalForInvoice
          show={showViewModal}
          handleModalClose={handleModalClose}
          htmlTemplate={invoiceHtmlString}
        />
      ) : null}
    </>
  );
};

export default Home;
