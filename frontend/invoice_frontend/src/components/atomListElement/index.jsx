import { useState } from "react";
import { Container, Button, Row, Col, Card, Form } from "react-bootstrap";
import moment from 'moment'

const ListItemElement = (props)=> {
    const [data, setData] = useState(props.data);
    
    const statusColor = props.data.paymentStatus == 'pending' ? "danger" : "success";
    const formatDate = moment(props.data.invoiceDate).format("DD/MM/YYYY")
    return (
        <Card key={data.invoiceNo} className="shadow-lg border-0 mb-3">
          <Card.Body>
            <Row className="align-items-center">
              <Col md={1}>
                <strong />
                {data.invoiceNo}
              </Col>
              <Col md={2}>{data.customerName}</Col>
              <Col md={2}>{data.customerEmail}</Col>
              <Col md={1}>Rs. {data.totalAmount}</Col>
              <Col md={2}>
                <div>
                  {formatDate} <br />
                </div>
              </Col>

              <Col md={4} className="d-flex justify-content-between align-items-center">
                <span className={`badge bg-${statusColor} p-2 mr-2`}>{data.paymentStatus.toUpperCase()}</span>
                <div className="d-flex justify-content-between">
                    <Button className="mx-2" variant="primary" disabled={props.isLoading} onClick={()=> props.callApiForView(data.invoiceId)}>View</Button>
                    <Button variant="success" disabled={props.isLoading} onClick={()=> props.callApiToParent(data.invoiceId)}>Download</Button>
                    <Button className="mx-2" disabled={props.isLoading} variant="dark" onClick={()=> props.callApiForSend(data.invoiceId)}>Send</Button>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
    )
}

export default ListItemElement;