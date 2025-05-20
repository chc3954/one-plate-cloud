import axios from 'axios';
import { useEffect, useState } from 'react';
import { Image } from '../Image';
import { NoImage } from './NoImage';
import { Loading } from './Loading';
import { Bounce, toast } from 'react-toastify';
import { SERVER_URL } from '../../constants';
import { DropZone } from './DropZone';

interface ApiResponse {
  page: number;
  total: number;
  totalPages: number;
  images: {
    filename: string;
    url: string;
  }[];
}

export const Gallery = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [images, setImages] = useState<ApiResponse['images']>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const fetchImages = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${SERVER_URL}/api/list?page=${page}`);
      setImages(response.data.images);
      setTotalPages(response.data.totalPages);

      if (response.data.images.length === 0 && page > 1) {
        setPage(page - 1);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [page]);

  const handleDelete = (filenameToDelete: string) => {
    fetchImages().then(() => {
      toast.success(`Image "${filenameToDelete}" deleted successfully!`, {
        position: 'bottom-right',
        autoClose: 2000,
        hideProgressBar: true,
        theme: 'dark',
        transition: Bounce,
      });
    });
  };

  const handlePreviousPage = () => setPage((p) => Math.max(p - 1, 1));
  const handleNextPage = () => setPage((p) => Math.min(p + 1, totalPages));

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length === 0) {
      return;
    }

    // Check if any of the dropped files are not images
    const hasInvalidFiles = droppedFiles.some((file) => !file.type.startsWith('image/'));
    if (hasInvalidFiles) {
      toast.error('Only image files are allowed!', {
        position: 'bottom-right',
        autoClose: 2000,
        hideProgressBar: true,
        theme: 'dark',
        transition: Bounce,
      });
      return;
    }

    const formData = new FormData();
    droppedFiles.forEach((file) => {
      formData.append('images', file);
    });

    const response = await axios.post(`${SERVER_URL}/api/upload`, formData, {
      headers: { 'x-api-key': import.meta.env.VITE_API_KEY },
    });

    if (response.data.success.length > 0) {
      fetchImages().then(() => {
        toast.success('Images uploaded successfully!', {
          position: 'bottom-right',
          autoClose: 2000,
          hideProgressBar: true,
          theme: 'dark',
          transition: Bounce,
        });
      });
    }

    if (response.data.failed.length > 0) {
      toast.error('Some images failed to upload.', {
        position: 'bottom-right',
        autoClose: 2000,
        hideProgressBar: true,
        theme: 'dark',
        transition: Bounce,
      });
    }
  };

  // Loading state
  if (isLoading) {
    return <Loading />;
  }

  // No images state
  if (!isLoading && images.length === 0) {
    return <NoImage />;
  }

  return (
    <div onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
      {isDragging && <DropZone />}
      <div className="gallery">
        {images.map((img) => (
          <Image key={img.filename} filename={img.filename} url={img.url} onDelete={handleDelete} />
        ))}
      </div>
      {/* Pagination */}
      <div className="my-5 flex items-center justify-center">
        <button onClick={handlePreviousPage} disabled={page === 1} className="button">
          Previous
        </button>
        <span className="mx-2">
          Page {page} of {totalPages}
        </span>
        <button onClick={handleNextPage} disabled={page === totalPages} className="button">
          Next
        </button>
      </div>
    </div>
  );
};
