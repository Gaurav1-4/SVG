import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';

const AdminLogin = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const navigate = useNavigate();

  // Check if already authenticated via sessionStorage
  useEffect(() => {
    if (sessionStorage.getItem('tr_admin') === 'true') {
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (password === 'trtraders2025') {
      sessionStorage.setItem('tr_admin', 'true');
      navigate('/admin/dashboard');
    } else {
      setError('Incorrect password');
      setShake(true);
      setTimeout(() => setShake(false), 500); // Reset shake after animation
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="bg-surface w-full max-w-md p-8 rounded-2xl shadow-xl border border-border flex flex-col items-center">
        
        <div className="admin-login-logo">
          <img 
            src="/images/tr-traders-logo.png" 
            alt="TR TRADERS Admin" 
            className="login-logo"
          />
        </div>
        <p className="text-muted text-sm uppercase tracking-widest mb-8">Admin Portal</p>

        <form onSubmit={handleSubmit} className="w-full space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-text">Access Password</label>
            <input
              type="password"
              placeholder="Enter password..."
              className={`w-full px-4 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
                error ? 'border-red-500' : 'border-border focus:border-primary'
              } ${shake ? 'animate-shake' : ''}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && <p className="text-red-500 text-sm mt-1 animate-fade-in">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-text hover:bg-black text-white py-3.5 rounded-xl uppercase tracking-widest text-sm font-bold transition-all shadow-md active:scale-[0.98]"
          >
            Enter Portal
          </button>
        </form>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-5px); }
          40%, 80% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default AdminLogin;
