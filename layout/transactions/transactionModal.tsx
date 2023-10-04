import React, { useState } from 'react';
import Modal from 'react-modal';




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

//   payout: {
//     [key: string]: string | number;
//   };
}



const TransactionModal: React.FC<TransactionModalProps> = ({ payout, handleCloseModal, createPDF, children }) => {
  const [modalIsOpen, setModalIsOpen] = useState(true);


//   const openModal = () => {
//     setModalIsOpen(true);
//   };

  const closeModal = () => {
    setModalIsOpen(false);
  };

//   const handleDownload = () => {
//     // Implement download logic here
//     console.log('Downloading:', data);
//     closeModal();
//   };
  const modalStyle = {
    content: {
      height: "500px",
      borderRadius: "5px",
      paddingTop: "30px",
    },
  };

  return (
    <div>
      {/* <h2>Transaction Details</h2>
      <button onClick={openModal}>View Details</button> */}

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Transaction Modal"
        ariaHideApp={false} // Set to false to avoid warnings in the console
        className="fixed overflow-y-auto transform -translate-x-1/2 -translate-y-1/2  bg-white border outline-none top-1/2 left-1/2 w-11/12 md:w-1/2 py-5 px-5 max-w-md"
        overlayClassName="modal-overlay"
        style={modalStyle}

      >
        {children}
   {/* <div>
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

   </div> */}
        <div className='flex mt-8'>
          <button onClick={()=> createPDF(payout)}  className="  bg-gray-300 hover:bg-gray-400 text-white py-2 px-4 rounded mr-2 w-1/2">Download</button>
          <button  onClick={() => handleCloseModal(payout.payoutId)}  className="bg-[#00b0f0]  hover:bg-[#00b0f0dd] text-white py-2 px-4 rounded mr-2 w-1/2">Cancel</button>
        </div>
      </Modal>
    </div>
  );
};

export default TransactionModal;
