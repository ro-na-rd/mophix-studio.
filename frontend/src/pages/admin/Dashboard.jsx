import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <section className="container mx-auto px-4 py-12">
      <div className="bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.12),_transparent_40%)] rounded-[2rem] border border-white/10 p-10 shadow-2xl">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.4em] text-secondary mb-4">Admin Control Center</p>
            <h1 className="section-title">Welcome back, Studio Manager</h1>
            <p className="section-subtitle max-w-2xl">
              This dashboard lets you upload new galleries, manage bookings, respond to inquiries, and publish fresh portfolio content.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Link to="/admin/galleries" className="btn-secondary">Upload Gallery</Link>
            <Link to="/admin/bookings" className="btn-outline">Manage Bookings</Link>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3 mt-10">
        <div className="card p-6">
          <h2 className="text-lg font-semibold mb-3">Gallery Upload</h2>
          <p className="text-gray-600">Use the gallery management area to add new collections and upload photos for portfolio display.</p>
        </div>
        <div className="card p-6">
          <h2 className="text-lg font-semibold mb-3">Booking Requests</h2>
          <p className="text-gray-600">Review new session requests, approve or decline, and confirm dates directly from the admin panel.</p>
        </div>
        <div className="card p-6">
          <h2 className="text-lg font-semibold mb-3">Inquiries & Messages</h2>
          <p className="text-gray-600">Respond to client questions and manage contact form submissions from one place.</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 mt-10">
        <div className="card p-8">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <ul className="space-y-4 text-gray-600">
            <li>• Review new gallery uploads and photos</li>
            <li>• Track booking statuses and payments</li>
            <li>• Moderate testimonials and client feedback</li>
            <li>• Publish blog posts and update categories</li>
          </ul>
        </div>
        <div className="card p-8">
          <h2 className="text-xl font-semibold mb-4">Admin Stats</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-white/5 p-6">
              <p className="text-xs uppercase tracking-[0.25em] text-secondary mb-3">Active Bookings</p>
              <p className="text-4xl font-semibold">24</p>
            </div>
            <div className="rounded-3xl bg-white/5 p-6">
              <p className="text-xs uppercase tracking-[0.25em] text-secondary mb-3">Portfolio Items</p>
              <p className="text-4xl font-semibold">12</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminDashboard;
