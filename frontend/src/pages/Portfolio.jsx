import { useEffect, useState } from 'react';
import { galleriesService } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const Portfolio = () => {
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGalleries = async () => {
      try {
        const response = await galleriesService.getAll();
        setGalleries(response.data || response || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchGalleries();
  }, []);

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="relative overflow-hidden rounded-[2rem] mb-10 h-[360px] shadow-xl">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1400&q=80)',
          }}
        />
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative z-10 flex h-full flex-col justify-center p-10 text-white">
          <p className="text-sm uppercase tracking-[0.4em] mb-3">Signature Collections</p>
          <h1 className="text-4xl sm:text-5xl font-semibold mb-4">Portfolio</h1>
          <p className="max-w-2xl text-lg text-gray-100/90">
            Explore gallery highlights from weddings, portraits, events, and brand campaigns.
          </p>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : galleries.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-3">
          {galleries.map((gallery) => (
            <article key={gallery.gallery_id} className="card overflow-hidden">
              <div
                className="h-64 bg-gray-200"
                style={{
                  backgroundImage: `url(${gallery.cover_image_path || 'https://images.unsplash.com/photo-1499856871958-5b962f4bb7cf?auto=format&fit=crop&w=900&q=80'})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">{gallery.title}</h2>
                <p className="text-gray-600">{gallery.description || 'A handcrafted photography story.'}</p>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-600">No galleries are available right now.</div>
      )}
    </section>
  );
};

export default Portfolio;
