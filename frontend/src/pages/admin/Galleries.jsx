import { useEffect, useState } from 'react';
import { galleriesService } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';

const AdminGalleries = () => {
  const [galleries, setGalleries] = useState([]);
  const [selectedGallery, setSelectedGallery] = useState('');
  const [galleryTitle, setGalleryTitle] = useState('');
  const [galleryDescription, setGalleryDescription] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const loadGalleries = async () => {
    try {
      setLoading(true);
      const response = await galleriesService.getAll({ limit: 50 });
      const data = response.data?.data ?? response.data ?? response ?? [];
      setGalleries(Array.isArray(data) ? data : []);
      // Auto-select the first gallery if none selected
      if (data.length > 0 && (!selectedGallery || selectedGallery === '')) {
        setSelectedGallery(data[0].id || data[0].gallery_id);
      }
    } catch (error) {
      toast.error('Failed to load galleries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGalleries();
  }, []);

  const handleCreateGallery = async (e) => {
    e.preventDefault();
    if (!galleryTitle) {
      toast.error('Please enter a gallery title.');
      return;
    }

    try {
      setUploading(true);
      const res = await galleriesService.create({
        title: galleryTitle,
        description: galleryDescription,
      });
      toast.success('Gallery created successfully.');
      setGalleryTitle('');
      setGalleryDescription('');
      loadGalleries();
      if (res.data?.data?.id || res.data?.data?.gallery_id) {
        setSelectedGallery(res.data.data.id || res.data.data.gallery_id);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to create gallery.');
    } finally {
      setUploading(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    e.preventDefault();
    if (!selectedGallery) {
      toast.error('Select a gallery first.');
      return;
    }
    if (!photoFile) {
      toast.error('Choose a photo to upload.');
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('photo', photoFile);
      const response = await galleriesService.uploadPhoto(selectedGallery, formData);
      toast.success(response.data?.message || 'Photo uploaded successfully! 📸');
      setPhotoFile(null);
      setPreview(null);
      loadGalleries();
    } catch (error) {
      console.error('Upload Error:', error);
      const message = error.response?.status === 413 ? "File too large (Max 10MB)" : (error.response?.data?.message || 'Upload failed');
      toast.error(message);
    } finally {
      setUploading(false);
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setPhotoFile(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.4em] text-secondary mb-4">Admin Gallery Tools</p>
          <h1 className="section-title">Gallery Upload & Management</h1>
          <p className="section-subtitle max-w-2xl">
            Create new portfolio collections, upload studio photos, and manage gallery content in one place.
          </p>
        </div>
      </div>

      <div className="grid gap-8 xl:grid-cols-[0.9fr_0.8fr] mt-10">
        <div className="card p-8 space-y-8">
          <div>
            <h2 className="text-xl font-semibold mb-3">Create a New Gallery</h2>
            <form onSubmit={handleCreateGallery} className="space-y-5">
              <div>
                <label className="text-sm font-medium text-white">Gallery Title</label>
                <input
                  type="text"
                  value={galleryTitle}
                  onChange={(e) => setGalleryTitle(e.target.value)}
                  className="mt-2 w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-primary"
                  placeholder="E.g. Wedding Highlights"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-white">Description</label>
                <textarea
                  value={galleryDescription}
                  onChange={(e) => setGalleryDescription(e.target.value)}
                  className="mt-2 w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-primary"
                  rows={4}
                  placeholder="Short description for the gallery"
                />
              </div>
              <button type="submit" className="btn-secondary" disabled={uploading}>
                {uploading ? 'Creating...' : 'Create Gallery'}
              </button>
            </form>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-3">Upload Photo to Gallery</h2>
            <form onSubmit={handlePhotoUpload} className="space-y-5">
              <div>
                <label className="text-sm font-medium text-white">Select Gallery</label>
                <select
                  value={selectedGallery}
                  onChange={(e) => setSelectedGallery(e.target.value)}
                  className="mt-2 w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-primary"
                >
                  <option value="">Choose gallery</option>
                  {galleries.map((gallery) => (
                    <option key={gallery.id || gallery.gallery_id} value={gallery.id || gallery.gallery_id}>
                      {gallery.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-white">Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="mt-2 w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none file:bg-primary file:px-4 file:py-2 file:text-black"
                />
              </div>
              {preview && (
                <div className="rounded-3xl overflow-hidden border border-white/10">
                  <img src={preview} alt="Preview" className="h-52 w-full object-cover" />
                </div>
              )}
              <button type="submit" className="btn-secondary" disabled={uploading}>
                {uploading ? 'Uploading...' : 'Upload Photo'}
              </button>
            </form>
          </div>
        </div>

        <div className="card p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold">Current Galleries</h2>
              <p className="text-gray-500">Review available collections and pick one for uploads.</p>
            </div>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : galleries.length > 0 ? (
            <div className="space-y-4">
              {galleries.map((gallery) => (
                <div
                  key={gallery.id || gallery.gallery_id}
                  className={`rounded-3xl border p-4 transition-all ${
                    (selectedGallery === gallery.id || selectedGallery === gallery.gallery_id) 
                    ? 'border-orange-500 bg-orange-500/5 shadow-lg shadow-orange-500/10' 
                    : 'border-white/10 bg-white/5'
                  }`}
                >
                  <h3 className="text-lg font-semibold mb-1">{gallery.title}</h3>
                  <p className="text-gray-400 text-sm mb-3">{gallery.description || 'No description provided.'}</p>
                  <button
                    onClick={() => setSelectedGallery(gallery.id || gallery.gallery_id)}
                    className="btn-outline"
                  >
                    Select for upload
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No galleries available yet. Create one to start uploading photos.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default AdminGalleries;
