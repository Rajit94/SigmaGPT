import { useState } from 'react';
import { useAuth } from './AuthContext';
import './AuthModal.css';

function AuthModal() {
  const { login, register, isSignUp, setIsSignUp, loading } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    
    if (isSignUp && !formData.name.trim()) {
      setError('Name is required');
      setIsSubmitting(false);
      return;
    }

    if (!formData.email.trim()) {
      setError('Email is required');
      setIsSubmitting(false);
      return;
    }

    if (!formData.password.trim()) {
      setError('Password is required');
      setIsSubmitting(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setIsSubmitting(false);
      return;
    }

    const result = isSignUp 
      ? await register(formData.email, formData.password, formData.name)
      : await login(formData.email, formData.password);
    
    if (!result.success) {
      setError(result.message);
    }
    
    setIsSubmitting(false);
  };


  const handleToggle = (signUpMode) => {
    setIsSignUp(signUpMode);
    setFormData({ email: '', password: '', name: '' });
    setError('');
  };

  return (
    <div className="auth-overlay">
      <div className="auth-card">
        <div className={`auth-container ${isSignUp ? 'signup-active' : 'signin-active'}`}>
          { }
          <form 
            className="auth-form signin-form" 
            onSubmit={handleSubmit}
          >
            <span className="auth-brand">SigmaGPT</span>
            <h1>Welcome back</h1>
            <p>Sign in to continue your conversations.</p>
            
            <input
              type="email"
              placeholder="Email address"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={isSubmitting}
              required
            />
            
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              disabled={isSubmitting}
              required
            />
            
            {error && <div className="error">{error}</div>}
            
            <button type="submit" disabled={isSubmitting || loading}>
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>
            
            <div className="toggle">
              Don't have an account? 
              <span onClick={() => handleToggle(true)}> Sign up</span>
            </div>
          </form>

          {}
          <form 
            className="auth-form signup-form" 
            onSubmit={handleSubmit}
  
          >
            <span className="auth-brand">SigmaGPT</span>
            <h1>Create your account</h1>
            <p>Get started with a smarter workspace.</p>
            
            <input
              type="text"
              placeholder="Full name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              disabled={isSubmitting}
              required
            />
            
            <input
              type="email"
              placeholder="Email address"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={isSubmitting}
              required
            />
            
            <input
              type="password"
              placeholder="Password (min 6 characters)"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              disabled={isSubmitting}
              required
            />
            
            {error && <div className="error">{error}</div>}
            
            <button type="submit" disabled={isSubmitting || loading}>
              {isSubmitting ? 'Creating account...' : 'Sign Up'}
            </button>
            
            <div className="toggle">
              Already have an account? 
              <span onClick={() => handleToggle(false)}> Sign in</span>
            </div>
          </form>

          {}
          <div className={`overlay-panel ${isSignUp ? 'overlay-right' : 'overlay-left'}`}>
            <div className="overlay-content">
              {!isSignUp ? (
                <>
                  <h1>New here?</h1>
                  <p>Create your account to save chats and continue across devices.</p>
                  <button className="ghost-btn" onClick={() => handleToggle(true)} type="button">
                    Sign Up
                  </button>
                </>
              ) : (
                <>
                  <h1>Welcome back</h1>
                  <p>Sign in to pick up right where you left off.</p>
                  <button className="ghost-btn" onClick={() => handleToggle(false)} type="button">
                    Sign In
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthModal;
