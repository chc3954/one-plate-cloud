import { useEffect, useState } from 'react';
import { Footer } from './components/layouts/Footer';
import { Header } from './components/layouts/Header';
import axios from 'axios';

interface ApiResponse {
  page: number;
  total: number;
  totalPages: number;
  images: {
    filename: string;
    url: string;
  }[];
}

function App() {
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

  return (
    <div className="flex h-screen flex-col">
      <Header />
      <div className="container mx-auto size-full flex-1 p-4">
        <h2>Image Gallery</h2>
        <div className="mx-auto grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {images.map((img) => (
            <div key={img.filename}>
              <img src={img.url} alt={img.filename} className="size-full rounded object-cover" />
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-4 flex items-center justify-center">
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

      <Footer />
    </div>
  );
}

export default App;
