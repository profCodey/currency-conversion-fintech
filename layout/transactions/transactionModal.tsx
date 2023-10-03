import React, { useState } from 'react';
import Modal from 'react-modal';
import { jsPDF } from "jspdf";



interface Transaction {
  id: number;
  name: string;
  description: string;
}

interface TransactionModalProps {
  data: {
    id: string | number;
    name: string | number;
    description: string | number;
  };

  payout: {
    [key: string]: string | number;
  };
}



const TransactionModal: React.FC<TransactionModalProps> = ({ data, payout }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  console.log('amount', payout);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleDownload = () => {
    // Implement download logic here
    console.log('Downloading:', data);
    closeModal();
  };
  const modalStyle = {
    content: {
      height: "500px",
      borderRadius: "5px",
      paddingTop: "30px",
    },
  };



  const createPDF = async () => {
    const pdf = new jsPDF("portrait", "pt", "a4");
  
    // Set font size for better readability
    pdf.setFontSize(16); // Increase font size for the page title
  
    // Add page title
    pdf.text("TRANSFER CONFIRMATION", 50, 50);
  
    // Set font size for other content
    pdf.setFontSize(12);
  
    // Add payout details
    pdf.text(`Date: ${payout.createdOn}`, 50, 80);
    pdf.text(`Status: ${payout.status}`, 50, 100);
  
    // Add a line break before the next section
    pdf.text("", 50, 120);
  
    // Add content to the PDF
    pdf.text(`Amount: ${payout.amount}`, 50, 140);
    pdf.text(`Transaction ID: ${payout.transactionId}`, 50, 160);
    pdf.text(`Payment Reference: ${payout.payoutId}`, 50, 180);
  
    // Add a line break before recipient details
    pdf.text("", 50, 200);
    pdf.text("Recipient Details", 50, 220);
  
    // Recipient details
    pdf.text(`Bank Name: ${payout.bankname}`, 50, 240);
    pdf.text(`Account Name: ${payout.accountName}`, 50, 260);
    pdf.text(`Account Number: ${payout.accountNumber}`, 50, 280);
  
    // Save the PDF
    pdf.save("transaction_receipt.pdf");
  };
  




  


  return (
    <div>
      <h2>Transaction Details</h2>
      <button onClick={openModal}>View Details</button>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Transaction Modal"
        ariaHideApp={false} // Set to false to avoid warnings in the console
        className="fixed overflow-y-auto transform -translate-x-1/2 -translate-y-1/2  bg-white border outline-none top-1/2 left-1/2 w-11/12 md:w-1/2 py-5 px-5 max-w-md"
        overlayClassName="modal-overlay"
        style={modalStyle}

      >
   <div>
   <h2 className="text-2xl font-bold mb-4">Transaction Details</h2>
          <p>Date: {payout.createdOn}</p>
          <p>Status: {payout.status}</p>
          <p>Amount: {payout.amount}</p>
          <p>Transaction ID: {payout.transactionId}</p>
          <p>Payment Reference: {payout.payoutId}</p>

          <p className="mt-4 mb-2 font-bold">Recipient Details</p>
          <p>Bank Name: {payout.bankname}</p>
          <p>Account Name: {payout.accountName}</p>
          <p>Account Number: {payout.accountNumber}</p>

   </div>
        <div className='flex mt-8'>
          <button onClick={()=> createPDF()}  className="  bg-gray-300 hover:bg-gray-400 text-white py-2 px-4 rounded mr-2 w-1/2">Download</button>
          <button onClick={closeModal}  className="bg-[#00b0f0]  hover:bg-[#00b0f0dd] text-white py-2 px-4 rounded mr-2 w-1/2">Cancel</button>
        </div>
      </Modal>
    </div>
  );
};

export default TransactionModal;
