import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { blogService } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { getBackendAssetUrl } from '../utils/apiUrl';



const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await blogService.getPostBySlug(slug);
        setPost(response.data || response || null);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!post) {
    return (
      <section className="container mx-auto px-4 py-12">
        <p className="text-gray-600">Blog post not found.</p>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <p className="text-sm uppercase tracking-[0.3em] text-secondary mb-2">Blog</p>

          {post.image && (
            <div className="mb-8 rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src={post.image.startsWith('/assets/') ? post.image : getBackendAssetUrl(post.image)} 
                alt={post.title} 
                className="w-full object-cover max-h-[500px]"
              />
            </div>
          )}

          <h1 className="section-title">{post.title}</h1>
          <p className="text-gray-600">{post.summary || post.excerpt || 'Studio news and photography advice.'}</p>
        </div>
        <div className="prose prose-lg max-w-none text-gray-700">
          <p>{post.content || 'Detailed story will appear here once published.'}</p>
        </div>
      </div>
    </section>
  );
};

export default BlogPost;
