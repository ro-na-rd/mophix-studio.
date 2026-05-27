import { useState, useEffect } from 'react';
import { blogService } from '../../services/api';
import { useAuthStore } from '../../store';
import toast from 'react-hot-toast';

const AdminBlog = () => {
  const { user } = useAuthStore();
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, published, draft
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  
  // Form states
  const [formData, setFormData] = useState({
    title: '',
    category_id: '',
    content: '',
    featured_image_url: '',
    status: 'draft'
  });

  // Fallback static data
  const staticPosts = [
    {
      post_id: 1,
      title: 'How to prepare for your photography session',
      slug: 'prepare-for-photoshoot',
      category: { name: 'Photography Tips' },
      category_id: 1,
      author: { first_name: 'Mophix', last_name: 'Admin' },
      status: 'published',
      published_date: '2026-05-20T10:00:00Z',
      view_count: 142,
      featured_image_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80',
      content: 'Learn how to plan your wardrobe, choose locations, and feel confident in front of the camera.'
    },
    {
      post_id: 2,
      title: 'Top 5 Outdoor Spots in Kigali for Portraits',
      slug: 'outdoor-spots-kigali',
      category: { name: 'Locations' },
      category_id: 2,
      author: { first_name: 'Mophix', last_name: 'Admin' },
      status: 'published',
      published_date: '2026-05-18T14:30:00Z',
      view_count: 98,
      featured_image_url: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=600&q=80',
      content: 'Kigali is filled with gorgeous landscapes. From the heights of Mount Kigali to the lush green valleys...'
    },
    {
      post_id: 3,
      title: 'Mastering the Art of Wedding Lighting',
      slug: 'wedding-lighting-mastery',
      category: { name: 'Technique' },
      category_id: 3,
      author: { first_name: 'Mophix', last_name: 'Admin' },
      status: 'draft',
      published_date: null,
      view_count: 0,
      featured_image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
      content: 'Lighting is everything when it comes to capturing the magic of a couple\'s special day. In this guide...'
    },
    {
      post_id: 4,
      title: 'Why You Need a Professional Portrait for LinkedIn',
      slug: 'linkedin-professional-portrait',
      category: { name: 'Branding' },
      category_id: 4,
      author: { first_name: 'Mophix', last_name: 'Admin' },
      status: 'published',
      published_date: '2026-05-10T09:00:00Z',
      view_count: 215,
      featured_image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
      content: 'In today\'s digital world, your profile picture is your first impression. Let\'s look at why professional portraits...'
    },
    {
      post_id: 5,
      title: 'Capturing the Energy of Cultural Festivals',
      slug: 'cultural-festivals-energy',
      category: { name: 'Event Photography' },
      category_id: 5,
      author: { first_name: 'Mophix', last_name: 'Admin' },
      status: 'draft',
      published_date: null,
      view_count: 0,
      featured_image_url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=600&q=80',
      content: 'Rwanda\'s rich heritage comes alive in its traditional ceremonies. Photographing these events requires...'
    },
    {
      post_id: 6,
      title: 'Behind the Scenes of a Pregnancy Shoot',
      slug: 'pregnancy-shoot-bts',
      category: { name: 'Maternity' },
      category_id: 6,
      author: { first_name: 'Mophix', last_name: 'Admin' },
      status: 'published',
      published_date: '2026-05-01T15:00:00Z',
      view_count: 178,
      featured_image_url: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=600&q=80',
      content: 'Maternity sessions are a beautiful celebration of new life. Here is how we create a safe, warm environment...'
    }
  ];

  const staticCategories = [
    { blog_category_id: 1, name: 'Photography Tips' },
    { blog_category_id: 2, name: 'Locations' },
    { blog_category_id: 3, name: 'Technique' },
    { blog_category_id: 4, name: 'Branding' },
    { blog_category_id: 5, name: 'Event Photography' },
    { blog_category_id: 6, name: 'Maternity' }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const postsRes = await blogService.getPosts();
      const categoriesRes = await blogService.getCategories();
      
      const postsData = postsRes.data || postsRes;
      const categoriesData = categoriesRes.data || categoriesRes;
      
      if (Array.isArray(postsData) && postsData.length > 0) {
        setPosts(postsData);
      } else {
        setPosts(staticPosts);
      }
      
      if (Array.isArray(categoriesData) && categoriesData.length > 0) {
        setCategories(categoriesData);
      } else {
        setCategories(staticCategories);
      }
    } catch (error) {
      console.error('Error fetching blog data:', error);
      setPosts(staticPosts);
      setCategories(staticCategories);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingPost(null);
    setFormData({
      title: '',
      category_id: categories[0]?.blog_category_id || '',
      content: '',
      featured_image_url: '',
      status: 'draft'
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (post) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      category_id: post.category_id || post.category?.blog_category_id || '',
      content: post.content,
      featured_image_url: post.featured_image_url || '',
      status: post.status
    });
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      toast.error('Title and content are required');
      return;
    }

    try {
      if (editingPost) {
        await blogService.update(editingPost.post_id, formData);
        toast.success('Blog post updated successfully!');
      } else {
        await blogService.create({
          ...formData,
          author_id: user?.user_id || 1
        });
        toast.success('Blog post created successfully!');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error saving blog post:', error);
      toast.error(error.message || 'Failed to save blog post');
      
      if (editingPost) {
        setPosts(prev => prev.map(p => p.post_id === editingPost.post_id ? { ...p, ...formData, category: categories.find(c => c.blog_category_id === parseInt(formData.category_id)) } : p));
      } else {
        const newPost = {
          post_id: Date.now(),
          ...formData,
          category: categories.find(c => c.blog_category_id === parseInt(formData.category_id)) || { name: 'Photography Tips' },
          author: { first_name: user?.first_name || 'Admin', last_name: user?.last_name || 'User' },
          published_date: formData.status === 'published' ? new Date().toISOString() : null,
          view_count: 0
        };
        setPosts(prev => [newPost, ...prev]);
      }
      setIsModalOpen(false);
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this blog post?')) return;

    try {
      await blogService.delete(postId);
      toast.success('Blog post deleted successfully');
      fetchData();
    } catch (error) {
      console.error('Error deleting blog post:', error);
      toast.error('Failed to delete blog post');
      
      setPosts(prev => prev.filter(p => p.post_id !== postId));
    }
  };

  const filteredPosts = posts.filter(post => {
    if (filter === 'all') return true;
    return post.status === filter;
  });

  const totalCount = posts.length;
  const publishedCount = posts.filter(p => p.status === 'published').length;
  const draftCount = posts.filter(p => p.status === 'draft').length;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold font-display text-orange-500 tracking-wide">Blog Management</h1>
            <p className="text-gray-400 mt-1">Publish tips, guides, stories and updates from Mophix Studio</p>
          </div>
          <button
            onClick={handleOpenCreateModal}
            className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-5 py-2.5 rounded-lg transition duration-200 shadow-lg shadow-orange-500/20 flex items-center gap-2 self-start md:self-auto"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
            </svg>
            New Post
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#111111] border border-white/10 p-6 rounded-xl shadow-md">
            <div className="text-gray-400 text-sm font-semibold uppercase tracking-wider text-gray-400">Total Articles</div>
            <div className="text-3xl font-bold mt-2 text-white">{totalCount}</div>
          </div>
          <div className="bg-[#111111] border border-white/10 p-6 rounded-xl shadow-md">
            <div className="text-gray-400 text-sm font-semibold uppercase tracking-wider text-green-400">Published</div>
            <div className="text-3xl font-bold mt-2 text-green-400">{publishedCount}</div>
          </div>
          <div className="bg-[#111111] border border-white/10 p-6 rounded-xl shadow-md">
            <div className="text-gray-400 text-sm font-semibold uppercase tracking-wider text-orange-400">Drafts</div>
            <div className="text-3xl font-bold mt-2 text-orange-400">{draftCount}</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex border-b border-white/10 gap-6 mb-6">
          {['all', 'published', 'draft'].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`pb-4 px-2 font-medium capitalize text-sm tracking-wider border-b-2 transition duration-200 ${
                filter === type
                  ? 'border-orange-500 text-orange-500'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              {type} Posts
            </button>
          ))}
        </div>

        {/* Table Container */}
        <div className="bg-[#111111] border border-white/10 rounded-xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 text-gray-300 uppercase text-xs tracking-wider border-b border-white/10">
                  <th className="py-4 px-6">Article</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Author</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Date</th>
                  <th className="py-4 px-6">Views</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredPosts.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-12 text-center text-gray-500">
                      No articles found matching the filter.
                    </td>
                  </tr>
                ) : (
                  filteredPosts.map((post) => (
                    <tr key={post.post_id} className="hover:bg-white/5 transition duration-150">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          <img
                            src={post.featured_image_url || 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=150&q=80'}
                            alt={post.title}
                            className="w-16 h-10 object-cover rounded bg-white/10"
                          />
                          <div className="max-w-md font-semibold text-white truncate hover:text-orange-400 cursor-pointer" onClick={() => handleOpenEditModal(post)}>
                            {post.title}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="bg-white/10 text-gray-300 text-xs px-2.5 py-1 rounded">
                          {post.category?.name || 'Photography Tips'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-300">
                        {post.author ? `${post.author.first_name} ${post.author.last_name}` : 'Admin'}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded uppercase tracking-wider ${
                          post.status === 'published'
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                            : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                        }`}>
                          {post.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-400 text-sm">
                        {post.published_date ? new Date(post.published_date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        }) : '-'}
                      </td>
                      <td className="py-4 px-6 font-semibold text-gray-300">
                        {post.view_count}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex justify-end gap-3">
                          <button
                            onClick={() => handleOpenEditModal(post)}
                            className="text-gray-400 hover:text-white p-1 transition-colors"
                            title="Edit Post"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(post.post_id)}
                            className="text-gray-400 hover:text-red-500 p-1 transition-colors"
                            title="Delete Post"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal - Create/Edit Post */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm transition duration-300">
            <div className="bg-[#111111] border border-white/10 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl relative">
              <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
                <h2 className="text-xl font-bold font-display text-white">
                  {editingPost ? 'Edit Blog Post' : 'Create Blog Post'}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-white transition"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">Post Title</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="e.g. Preparing for your Wedding Photoshoot"
                      className="w-full bg-black border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-orange-500 transition"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">Category</label>
                    <select
                      name="category_id"
                      value={formData.category_id}
                      onChange={handleInputChange}
                      className="w-full bg-black border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-orange-500 transition"
                      required
                    >
                      {categories.map((cat) => (
                        <option key={cat.blog_category_id || cat.id} value={cat.blog_category_id || cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Featured Image URL</label>
                  <input
                    type="url"
                    name="featured_image_url"
                    value={formData.featured_image_url}
                    onChange={handleInputChange}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-black border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-orange-500 transition"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Post Content</label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    rows="8"
                    placeholder="Write your article content here..."
                    className="w-full bg-black border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-orange-500 transition resize-y font-sans"
                    required
                  ></textarea>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      id="status-draft"
                      name="status"
                      value="draft"
                      checked={formData.status === 'draft'}
                      onChange={handleInputChange}
                      className="text-orange-500 focus:ring-orange-500 bg-black border-white/10 h-4 w-4"
                    />
                    <label htmlFor="status-draft" className="text-sm font-medium text-gray-300 cursor-pointer">
                      Draft
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      id="status-published"
                      name="status"
                      value="published"
                      checked={formData.status === 'published'}
                      onChange={handleInputChange}
                      className="text-orange-500 focus:ring-orange-500 bg-black border-white/10 h-4 w-4"
                    />
                    <label htmlFor="status-published" className="text-sm font-medium text-gray-300 cursor-pointer">
                      Publish Immediately
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-4 border-t border-white/10 pt-6">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 rounded-lg border border-white/10 text-gray-300 hover:text-white hover:bg-white/5 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold transition"
                  >
                    {editingPost ? 'Save Changes' : 'Create Post'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBlog;
