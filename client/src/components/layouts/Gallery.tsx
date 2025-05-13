import axios from 'axios';
import { useEffect, useState } from 'react';
import { Image } from '../Image';
import { NoImage } from './NoImage';
import { Loading } from './Loading';

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

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/list?page=${page}`);
        console.log('Fetched images:', response.data);

        setImages(response.data.images);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error('Error fetching images:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, [page]);

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
          <Image key={img.filename} filename={img.filename} url={img.url} />
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
