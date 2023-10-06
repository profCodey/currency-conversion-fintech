// import React, { useState } from 'react';
// import Modal from 'react-modal';




// interface Transaction {
//   id: number;
//   name: string;
//   description: string;
// }

// interface TransactionModalProps {
//   data: {
//     id: string | number;
//     name: string | number;
//     description: string | number;
//   };

// //   payout: {
// //     [key: string]: string | number;
// //   };
// }


// const modalBG = {
//   // height: "100vh",
//   // backgroundColor: "black",
//   // width: "1000px",
//   // // marginTop: "-150px"
//   // position: "fixed",
//   // top: "-800px"
// }


// const TransactionModal: React.FC<TransactionModalProps> = ({ payout,  createPDF, children }) => {
//   const [modalIsOpen, setModalIsOpen] = useState(true);

//   const closeModal = () => {
//     setModalIsOpen(false);
//   };

//   //Download Logic For Modal
//   const handleDownload = () => {
//     // Implement download logic here
//     closeModal();
//   };
//   // const modalStyle = {
//   //   content: {
//   //     top: '50%',
//   //     left: '60%',
//   //     right: 'auto',
//   //     bottom: 'auto',
//   //     marginRight: '-50%',
//   //     transform: 'translate(-50%, -50%)',
//   //   },
//   // };

//   return (
//     <div style = {modalBG}>
//       {/* <h2>Transaction Details</h2>
//       <button>View Details</button> */}

//       <Modal
//         isOpen={modalIsOpen}
//         // onRequestClose={closeModal}
//         // contentLabel="Transaction Modal"
//         ariaHideApp={false} // Set to false to avoid warnings in the console
//         className="fixed overflow-y-auto transform -translate-x-1/2 -translate-y-1/2  bg-white border outline-none top-1/2 left-1/2 w-11/12 md:w-1/2 py-5 px-5 lg:w-2/5 flex flex-col justify-center"
//         // overlayClassName="modal-overlay"
//         // isOpen={isOpen}
//         onRequestClose={closeModal}
//         contentLabel="Transaction Details Modal"
//         // className="Modal"
//         overlayClassName="Overlay"
//         // style={modalStyle}

//       >
//            <div>
//              <button
//                        className="absolute top-4 right-4 text-gray-500"
//                        onClick={closeModal}
//                      >
//                        X
//                      </button>
//            </div>
//         {children}
//    {/* <div>
//    <h2 className="text-2xl font-bold mb-4">Transaction Details</h2>
//           <p>Date: {payout.createdOn}</p>
//           <p>Status: {payout.status}</p>
//           <p>Amount: {payout.amount}</p>
//           <p>Transaction ID: {payout.transactionId}</p>
//           <p>Payment Reference: {payout.payoutId}</p>

//           <p className="mt-4 mb-2 font-bold">Recipient Details</p>
//           <p>Bank Name: {payout.bankname}</p>
//           <p>Account Name: {payout.accountName}</p>
//           <p>Account Number: {payout.accountNumber}</p>

//    </div> */}
//         <div className='flex mt-8'>
//           <button onClick={()=> createPDF(payout)}  className="text-xl w-full bg-[#132144] hover:bg-[#00b0f0dd] text-white py-2 px-4 rounded mr-2 ">Download</button>
//           {/* <button 
//            onClick={() =>
//              handleCloseModal(payout.id)
//           } 
//             className="bg-[#00b0f0]  hover:bg-[#00b0f0dd] text-white py-2 px-4 rounded mr-2 w-1/2">Cancel</button> */}
//         </div>
        
//       </Modal>
//     </div>
//   );
// };

// export default TransactionModal;
