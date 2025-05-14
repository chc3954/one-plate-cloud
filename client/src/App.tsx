import { ToastContainer } from 'react-toastify';
import { Footer } from './components/layouts/Footer';
import { Gallery } from './components/layouts/Gallery';
import { Header } from './components/layouts/Header';

function App() {
  return (
    <div className="relative min-h-screen">
      <Header />
      <div className="container">
        <h2 className="mt-3 text-center text-4xl font-bold">Image Gallery</h2>
        <ToastContainer />
        <Gallery />
      </div>
      <Footer />
    </div>
  );
}

export default App;
