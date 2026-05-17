import { useState } from "react";
import { useNavigate } from "react-router";
import { Building2, Mail, Lock, Eye, EyeOff, ArrowLeft, User } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('/roomsyncapp/api/?route=auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();
      if (result.success) {
        const role = result.data.role;
        if (role === 'admin') {
          navigate('/admin');
        } else if (role === 'owner') {
          navigate('/owner');
        } else if (role === 'student') {
          navigate('/student');
        } else {
          navigate('/');
        }
      } else {
        alert(result.message || 'Invalid login credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Unable to login. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#f0fdfa] to-[#ccfbf1] dark:from-gray-900 dark:via-[#042f2e] dark:to-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            background: "radial-gradient(circle, rgba(153, 246, 228, 0.4) 0%, rgba(204, 251, 241, 0.2) 50%, transparent 100%)"
          }}
          className="absolute top-0 -left-40 w-96 h-96 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            background: "radial-gradient(circle, rgba(94, 234, 212, 0.3) 0%, rgba(153, 246, 228, 0.2) 50%, transparent 100%)"
          }}
          className="absolute bottom-0 -right-40 w-96 h-96 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            y: [0, 100, 0],
            x: [0, 50, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            background: "radial-gradient(circle, rgba(20, 184, 166, 0.25) 0%, rgba(153, 246, 228, 0.15) 50%, transparent 100%)"
          }}
          className="absolute top-1/2 left-1/2 w-96 h-96 rounded-full blur-3xl"
        />
      </div>

      {/* Back to Landing Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ x: -5, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 border border-[#99f6e4]/50 dark:border-[#0f766e]/50 rounded-xl text-gray-700 dark:text-white hover:bg-white/90 dark:hover:bg-gray-800/90 transition-all shadow-lg"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Back to Home</span>
      </motion.button>

      <div className="w-full max-w-md relative z-10">
        {/* Glassmorphic Login Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="backdrop-blur-3xl bg-white/80 dark:bg-gray-800/80 rounded-3xl shadow-2xl border border-white/50 dark:border-gray-700/50 p-8 md:p-10"
        >
          {/* Logo and Header */}
          <motion.div
            initial={{ scale: 0, rotateY: 180 }}
            animate={{ scale: 1, rotateY: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
            className="text-center mb-8"
          >
            <div 
              className="w-20 h-20 bg-gradient-to-br from-[#14b8a6] to-[#0f766e] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl"
            >
              <Building2 className="w-11 h-11 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-[#134e4a] dark:text-white mb-2">
              Welcome Back
            </h1>
            <p className="text-sm text-[#115e59] dark:text-[#5eead4]">
              Sign in to access your RoomSync account
            </p>
          </motion.div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Input */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label className="block text-sm font-medium text-[#134e4a] dark:text-white mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#0d9488] dark:text-[#5eead4]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full pl-12 pr-4 py-3.5 backdrop-blur-xl bg-white/60 dark:bg-gray-700/60 border border-[#99f6e4]/50 dark:border-[#0f766e]/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0d9488] focus:border-transparent transition-all text-[#134e4a] dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                />
              </div>
            </motion.div>

            {/* Password Input */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label className="block text-sm font-medium text-[#134e4a] dark:text-white mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#0d9488] dark:text-[#5eead4]" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full pl-12 pr-12 py-3.5 backdrop-blur-xl bg-white/60 dark:bg-gray-700/60 border border-[#99f6e4]/50 dark:border-[#0f766e]/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0d9488] focus:border-transparent transition-all text-[#134e4a] dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#0d9488] dark:text-[#5eead4] hover:text-[#115e59] dark:hover:text-[#14b8a6] transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </motion.div>

            {/* Remember Me & Forgot Password */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-between text-sm"
            >
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-[#0d9488] bg-white dark:bg-white border-[#99f6e4]/50 dark:border-[#0f766e]/50 rounded focus:ring-[#0d9488] cursor-pointer"
                />
                <span className="text-[#115e59] dark:text-gray-300 group-hover:text-[#134e4a] dark:group-hover:text-white transition-colors">
                  Remember me
                </span>
              </label>
              <button
                type="button"
                className="text-[#0d9488] dark:text-[#5eead4] hover:text-[#0f766e] dark:hover:text-[#14b8a6] font-medium transition-colors"
              >
                Forgot password?
              </button>
            </motion.div>

            {/* Login Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: isLoading ? 1 : 1.02, y: isLoading ? 0 : -2 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
              className="w-full py-3.5 bg-gradient-to-r from-[#14b8a6] to-[#0f766e] text-white rounded-xl font-semibold hover:from-[#0d9488] hover:to-[#115e59] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg relative overflow-hidden"
            >
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center gap-2"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                    <span>Signing in...</span>
                  </motion.div>
                ) : (
                  <motion.span
                    key="text"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    Sign In
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </form>

          {/* Footer */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="text-center text-sm text-[#115e59] dark:text-gray-300 mt-6"
          >
            Don't have an account?{' '}
            <button 
              onClick={() => navigate('/signup')}
              className="text-[#0d9488] dark:text-[#5eead4] hover:text-[#0f766e] dark:hover:text-[#14b8a6] font-semibold transition-colors"
            >
              Sign up
            </button>
          </motion.p>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-6 text-center"
        >
          <div className="backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 border border-[#99f6e4]/50 dark:border-[#0f766e]/50 rounded-2xl px-6 py-3 inline-block shadow-lg">
            <p className="text-sm text-[#115e59] dark:text-gray-300">Serving <span className="font-bold text-[#0d9488] dark:text-[#5eead4]">BatStateU ARASOF Campus</span> Nasugbu</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}