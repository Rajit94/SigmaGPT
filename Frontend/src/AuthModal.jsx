import { useState } from 'react';
import { useAuth } from './AuthContext.jsx';
import './AuthModal.css';

function AuthModal() {
  const { login, register, isSignUp, setIsSignUp, loading } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const result = isSignUp 
      ? await register(formData.email, formData.password, formData.name)
      : await login(formData.email, formData.password);
    
    if (!result.success) setError(result.message);
  };

  return (
    <div className="auth-overlay">
      <div className="auth-card">
        <div className={`auth-forms ${isSignUp ? 'signup-active' : 'signin-active'}`}>
          {/* SIGN IN FORM */}
          <form className="auth-form signin-form" onSubmit={handleSubmit}>
            <h1>Sign in</h1>
            <p>Welcome back to SigmaGPT</p>
            <input
              type="email"
              placeholder="Email address"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
            {error && <div className="error">{error}</div>}
            <button type="submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
            <div className="toggle">
              Don't have an account? <span onClick={() => setIsSignUp(true)}>Sign up</span>
            </div>
          </form>

          {/* SIGN UP FORM */}
          <form className="auth-form signup-form" onSubmit={handleSubmit}>
            <h1>Create account</h1>
            <p>Join SigmaGPT today</p>
            <input
              type="text"
              placeholder="Full name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <input
              type="email"
              placeholder="Email address"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
            {error && <div className="error">{error}</div>}
            <button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Sign up'}
            </button>
            <div className="toggle">
              Already have an account? <span onClick={() => setIsSignUp(false)}>Sign in</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AuthModal;
