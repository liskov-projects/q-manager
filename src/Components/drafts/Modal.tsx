// NOTE: STILL NO IDEA HOW TO MAKE IT WORK CORRECTLY IN OUR NEXTJS VERSION

// NOTE: the modal component
// import {useCallback, useEffect, ReactNode, useRef} from "react";
// import ReactDOM from "react-dom";
// import Link from "next/link";

// export default function Modal({
//   isOpen,
//   onClose,
//   children
// }: {
//   isOpen: boolean;
//   onClose: () => void;
//   children: ReactNode;
// }) {
//   // create ref for the StyledModalWrapper component
//   const modalWrapperRef = useRef();

//   // check if the user has clicked inside or outside the modal
//   // useCallback is used to store the function reference, so that on modal closure, the correct callback can be cleaned in window.removeEventListener
//   const backDropHandler = useCallback(e => {
//     if (!modalWrapperRef?.current?.contains(e.target)) {
//       onClose();
//     }
//   }, []);

//   useEffect(() => {
//     // wrap it inside setTimeout in order to prevent the eventListener to be attached before the modal is open.
//     setTimeout(() => {
//       window.addEventListener("click", backDropHandler);
//     });
//   }, []);

//   useEffect(() => {
//     return () => window.removeEventListener("click", backDropHandler);
//   }, []);

//   const handleCloseClick = e => {
//     e.preventDefault();
//     onClose();
//   };
//   if (!isOpen) return null;

//   const modalContent = (
//     <div className="overlay">
//       <div ref={modalWrapperRef}>
//         <div className="modal proper">
//           <div>
//             <Link href="#" onClick={handleCloseClick}>
//               X
//             </Link>
//           </div>
//           {children}
//         </div>
//       </div>
//     </div>
//   );

//   return ReactDOM.createPortal(modalContent, document.getElementById("modal-root"));
// }

// NOTE: whatever was in the component that uses the modal
{
  /* NEW: not a big fan of this approach*/
}
{
  /* <Modal isOpen={isModalOpen} onClose={closeModal}>
        <h2 className="text-xl font-bold mb-4">Edit Player Information</h2>
        <form>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Player Name</label>
            <input
              type="text"
              defaultValue={item.names}
              className="border rounded-md px-4 py-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Phone Numbers
            </label>
            <input
              type="text"
              defaultValue={item.phoneNumbers.join(", ")}
              className="border rounded-md px-4 py-2 w-full"
            />
          </div>
          <Button
            onClick={() => {
              // Save logic here
              closeModal();
            }}
            className="bg-green-500 text-white px-4 py-2 rounded">
            Save Changes
          </Button>
        </form>
      </Modal> */
}
