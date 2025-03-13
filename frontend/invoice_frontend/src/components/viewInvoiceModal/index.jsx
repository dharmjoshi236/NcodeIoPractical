import { useEffect, useState, useRef } from "react";
import html2canvas from 'html2canvas'
import { Modal, Button } from "react-bootstrap";

const ViewModalForInvoice = (props) => {
    const hiddenDivRef = useRef(null);
    const [imageFromTemplate, setImageFromTemplate] = useState(null);

    useEffect(()=> {
        const convertHtmlTemplateToImage = async () => {
            if (!hiddenDivRef.current) {
                return;
            }

            try {
                const canvas = await html2canvas(hiddenDivRef.current);
                const image = canvas.toDataURL("image/jpeg");
          
                setImageFromTemplate(image);
              } catch (error) {
                console.error("🚨 Error converting to image:", error);
              }
        }
     convertHtmlTemplateToImage();
    })
  return (
    <>
      <Modal show={props.show} onHide={props.handleModalClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>View Invoice</Modal.Title>
        </Modal.Header>

        <Modal.Body className="text-center">
          {imageFromTemplate != null ? (
            <img src={imageFromTemplate} alt="Invoice" className="img-fluid" />
          ) : (
            <h5>No image found</h5>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.handleModalClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <div
        ref={hiddenDivRef}
        dangerouslySetInnerHTML={{ __html: props.htmlTemplate }}
        style={{
          position: "absolute",
          left: "-9999px",
          width: "800px",
          padding: "20px",
          backgroundColor: "white",
        }}
      />
    </>
  );
};

export default ViewModalForInvoice;