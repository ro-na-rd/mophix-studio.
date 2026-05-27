// Main App Component

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';

// Layouts
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AIChatWidget from './components/AIChatWidget';

// Public Pages
import Home from './pages/Home';
import Portfolio from './pages/Portfolio';
import Services from './pages/Services';
import ServiceDetails from './pages/ServiceDetails';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';

// Client Pages
import BookingRequest from './pages/BookingRequest';
import MyBookings from './pages/MyBookings';
import MyProfile from './pages/MyProfile';

// Admin Pages
import StaffDashboard from './pages/admin/Dashboard';
import AdminDashboard from './pages/admin/Dashboard';
import AdminGalleries from './pages/admin/Galleries';
import AdminBookings from './pages/admin/Bookings';
import AdminTestimonials from './pages/admin/Testimonials';
import AdminInquiries from './pages/admin/Inquiries';
import AdminBlog from './pages/admin/Blog';
import AdminUsers from './pages/admin/Users';

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }) => {
    const { isAuthenticated, user } = useAuthStore();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (requiredRole && user?.role !== requiredRole && user?.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    return children;
};

function App() {
    const { isAuthenticated, user } = useAuthStore();

    useEffect(() => {
        // Initialize auth from localStorage
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        
        if (token && savedUser) {
            useAuthStore.setState({
                token,
                user: JSON.parse(savedUser),
                isAuthenticated: true
            });
        }
    }, []);

    return (
        <Router>
            <div className="flex flex-col min-h-screen bg-black text-white">
                <Navbar />
                
                <main className="flex-1">
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={
                            isAuthenticated ? (
                                user?.role === 'admin' ? <Navigate to="/admin/dashboard" replace /> :
                                user?.role === 'staff' ? <Navigate to="/staff/dashboard" replace /> :
                                <Home />
                            ) : <Home />
                        } />
                        <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
                        <Route path="/register" element={isAuthenticated ? <Navigate to="/" replace /> : <Register />} />
                        <Route path="/portfolio" element={<Portfolio />} />
                        <Route path="/services" element={<Services />} />
                        <Route path="/services/:id" element={<ServiceDetails />} />
                        <Route path="/blog" element={<Blog />} />
                        <Route path="/blog/:slug" element={<BlogPost />} />
                        <Route path="/contact" element={<Contact />} />

                        {/* Client Routes */}
                        <Route
                            path="/book/:serviceId"
                            element={
                                <ProtectedRoute requiredRole="client">
                                    <BookingRequest />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/my-bookings"
                            element={
                                <ProtectedRoute requiredRole="client">
                                    <MyBookings />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/profile"
                            element={
                                <ProtectedRoute>
                                    <MyProfile />
                                </ProtectedRoute>
                            }
                        />

                        {/* Staff Routes */}
                        <Route
                            path="/staff/dashboard"
                            element={
                                <ProtectedRoute requiredRole="staff">
                                    <StaffDashboard />
                                </ProtectedRoute>
                            }
                        />

                        {/* Admin Routes */}
                        <Route
                            path="/admin"
                            element={<Navigate to="/admin/dashboard" replace />}
                        />
                        <Route
                            path="/admin/dashboard"
                            element={
                                <ProtectedRoute requiredRole="admin">
                                    <AdminDashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin/galleries"
                            element={
                                <ProtectedRoute requiredRole="staff">
                                    <AdminGalleries />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin/bookings"
                            element={
                                <ProtectedRoute requiredRole="staff">
                                    <AdminBookings />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin/testimonials"
                            element={
                                <ProtectedRoute requiredRole="admin">
                                    <AdminTestimonials />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin/inquiries"
                            element={
                                <ProtectedRoute requiredRole="staff">
                                    <AdminInquiries />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin/blog"
                            element={
                                <ProtectedRoute requiredRole="admin">
                                    <AdminBlog />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin/users"
                            element={
                                <ProtectedRoute requiredRole="admin">
                                    <AdminUsers />
                                </ProtectedRoute>
                            }
                        />

                        {/* 404 */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </main>

                <Footer />
                <Toaster />
                <AIChatWidget />
            </div>
        </Router>
    );
}

export default App;
