import axios from 'axios';
import { useEffect, useState } from 'react';
import { Image } from '../Image';
import { NoImage } from './NoImage';
import { Loading } from './Loading';
import { Bounce, toast } from 'react-toastify';
import { SERVER_URL } from '../../constants';

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
  const [isLoading, setIsLoading] = useState(true);
  const [images, setImages] = useState<ApiResponse['images']>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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

  // Loading state
  if (isLoading) {
    return <Loading />;
  }

  // No images state
  if (!isLoading && images.length === 0) {
    return <NoImage />;
  }

  return (
    <>
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
    </>
  );
};
