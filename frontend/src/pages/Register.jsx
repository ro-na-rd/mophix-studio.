import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    confirm_password: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        email: formData.email,
        password: formData.password,
        password_confirm: formData.confirm_password,
        first_name: formData.first_name,
        last_name: formData.last_name,
      };
      await authService.register(payload);
      navigate('/login');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Unable to register. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-card">
        <div className="mb-8">
          <h1 className="auth-title">Create your account</h1>
          <p className="auth-subtitle">Join Mophix Studio and book professional photography sessions in Kigali.</p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid gap-6 md:grid-cols-2">
            <input
              type="text"
              name="first_name"
              className="input-field auth-input"
              placeholder="First name"
              value={formData.first_name}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="last_name"
              className="input-field auth-input"
              placeholder="Last name"
              value={formData.last_name}
              onChange={handleChange}
              required
            />
          </div>
          <input
            type="email"
            name="email"
            className="input-field auth-input"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            className="input-field auth-input"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="confirm_password"
            className="input-field auth-input"
            placeholder="Confirm password"
            value={formData.confirm_password}
            onChange={handleChange}
            required
          />
          <button disabled={loading} className="btn-primary w-full">
            {loading ? 'Creating account...' : 'Create account'}
          </button>
          {error && <p className="text-sm text-orange-300">{error}</p>}
        </form>
        <p className="text-sm text-gray-300 mt-6">
          Already have an account? <Link to="/login" className="text-orange-400 hover:text-orange-300">Login</Link>.
        </p>
      </div>
    </section>
  );
};

export default Register;
