import { Trash2 } from "lucide-react";
import Modal from "../../ui/modal";

interface DeleteModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteModal({
  open,
  onClose,
  onConfirm,
}: DeleteModalProps) {
  return (
    <Modal open={open} onClose={onClose}>
      <div className="w-full h-65 py-4 flex flex-col justify-between items-center gap-2">
        {/* Outer halo ring, inner disc holds the icon */}
        <div className="relative flex size-18 shrink-0 items-center justify-center rounded-full backdrop-blur-xl before:absolute before:inset-0 before:rounded-full before:bg-linear-to-b before:from-[#717784] before:to-transparent before:opacity-10">
          <div className="relative z-10 flex size-12 items-center justify-center rounded-full bg-white shadow-xs inset-ring-1 inset-ring-gray-200">
            <Trash2 size={24} strokeWidth={1.75} className="text-red-500" />
          </div>
        </div>

        {/* Text */}
        <div className="text-center max-w-70">
          Are You sure you want to Delete the following Rows.
        </div>

        <div className="flex gap-3 mt-4">
          <div
            onClick={onClose}
            className="w-40 flex justify-center h-fit border-l border-b-2
              bg-black active:scale-95 rounded-sm
               border-black"
          >
            <div
              className="text-[15px] w-full text-center  shadow-xs
               active:border-b-transparent bg-clip-padding cursor-pointer text-white gap-2 flex
                items-center justify-center border-r-[1.5px] border-b-2
                 border-black px-2.5 py-1.5 rounded-sm"
              style={{
                backgroundImage: "linear-gradient(to bottom, #111, #0a0a0a)",
                boxShadow: "0px 2px 0px 0px rgba(255,255,255,0.15) inset",
              }}
            >
              Cancel
            </div>
          </div>

          <div
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="w-40 flex justify-center h-fit border-l border-b-2
               bg-gray-200 active:scale-95 rounded-sm
                border-gray-200"
          >
            <div
              className="text-[15px] w-full text-center  shadow-xs
               active:border-b-transparent bg-clip-padding cursor-pointer text-gray-800 gap-2 flex
                items-center justify-center border-t-[1.5px] border-r-[1.5px] border-b-2
                 border-gray-200 bg-white px-2.5 py-1.5 rounded-sm"
            >
              Delete
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
