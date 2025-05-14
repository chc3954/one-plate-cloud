import axios from 'axios';
import { Download, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Modal } from './ImageModal';
import { createPortal } from 'react-dom';

interface ImageProps {
  filename: string;
  url: string;
  onDelete: (filename: string) => void;
}

export const Image = ({ filename, url, onDelete }: ImageProps) => {
  const [showModal, setShowModal] = useState(false);

  const handleDownload = () => {
    const link = document.createElement('a');
    const file = new Blob([url], { type: 'image/*' });

    link.href = URL.createObjectURL(file);
    link.download = filename;
    link.click();
  };

  const handleDelete = async () => {
    const response = await axios.delete(`http://localhost:3000/api/delete/${filename}`, {
      headers: { 'x-api-key': import.meta.env.VITE_API_KEY },
    });
    if (response.status === 200) {
      onDelete(filename);
    } else {
      alert('Error deleting image');
    }
  };

  return (
    <>
      <div
        key={filename}
        className="group relative cursor-pointer transition-transform duration-300 hover:scale-105"
        onClick={() => setShowModal(true)}
      >
        <img
          src={url}
          alt={filename}
          className="aspect-square size-full rounded border border-gray-400 object-cover shadow"
        />
        <div className="absolute top-2 right-2 flex gap-1 text-white">
          <button className="image-tool-button bg-gray-800" onClick={handleDownload}>
            <Download className="m-3 size-5" />
          </button>
          <button className="image-tool-button bg-red-600" onClick={handleDelete}>
            <Trash2 className="m-3 size-5" />
          </button>
        </div>
        <span className="absolute right-0 bottom-0 left-0 bg-gray-800 p-2 text-sm font-bold text-white opacity-0 group-hover:opacity-80">
          {filename}
        </span>
      </div>
      {showModal &&
        createPortal(
          <Modal filename={filename} url={url} onClose={() => setShowModal(false)} />,
          document.body
        )}
    </>
  );
};
