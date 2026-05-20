const AdminBookings = () => {
  return (
    <section className="container mx-auto px-4 py-12">
      <h1 className="section-title">Manage Bookings</h1>
      <p className="section-subtitle">Approve, update, and review booking requests from clients.</p>
      <div className="card p-8 mt-8">
        <p className="text-gray-600">Booking approval and status change functionality is handled through the admin API routes.</p>
      </div>
    </section>
  );
};

export default AdminBookings;
