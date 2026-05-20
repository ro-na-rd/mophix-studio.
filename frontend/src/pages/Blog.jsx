import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { blogService } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await blogService.getPosts();
        setPosts(response.data || response || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="relative overflow-hidden rounded-[2rem] h-[320px] mb-10 shadow-xl">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1498079022511-d15614cb1c02?auto=format&fit=crop&w=1400&q=80)',
          }}
        />
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative z-10 flex h-full flex-col justify-center p-10 text-white">
          <p className="text-sm uppercase tracking-[0.4em] mb-3">Studio Stories</p>
          <h1 className="text-4xl sm:text-5xl font-semibold mb-4">Blog</h1>
          <p className="max-w-2xl text-lg text-gray-100/90">
            Read the latest tips, behind-the-scenes stories, and photography inspiration from Mophix Studio.
          </p>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : posts.length > 0 ? (
        <div className="grid gap-6 lg:grid-cols-3">
          {posts.map((post) => (
            <article key={post.post_id} className="card p-6">
              <h2 className="text-xl font-semibold mb-3">{post.title}</h2>
              <p className="text-gray-600 mb-4">{post.excerpt || post.description || 'Read more about studio updates and photography tips.'}</p>
              <Link to={`/blog/${post.slug}`} className="btn-outline">Read post</Link>
            </article>
          ))}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {['Planning your shoot', 'Choosing the right dress', 'Top event photography tips'].map((title) => (
            <article key={title} className="card p-6">
              <h2 className="text-xl font-semibold mb-3">{title}</h2>
              <p className="text-gray-600 mb-4">A thoughtful guide from the studio to help your next session feel effortless and beautiful.</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default Blog;
