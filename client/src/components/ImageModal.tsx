interface ModalProps {
  filename: string;
  url: string;
  onClose: () => void;
}

export const Modal = ({ filename, url, onClose }: ModalProps) => {
  return (
    <div
      className="bg-opacity-50 fixed inset-0 flex size-full items-center justify-center backdrop-blur-md backdrop-brightness-50"
      onClick={onClose}
    >
      <div className="mx-auto max-w-3/5">
        <img src={url} alt={filename} className="aspect-square object-contain" />
      </div>
    </div>
  );
};
