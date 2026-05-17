import image_41ed3d3b1f5ac3b856dd737585068fc402abb522 from 'figma:asset/41ed3d3b1f5ac3b856dd737585068fc402abb522.png'
import image_5fbaac37e96e358c3eb60973822df1e871b063ee from 'figma:asset/5fbaac37e96e358c3eb60973822df1e871b063ee.png'
import { useNavigate } from "react-router";
import { Building2, MapPin, Shield, Users, Search, Heart, CheckCircle, Star, Sparkles, Zap, Award, Check, BarChart3, FileText, Receipt, Settings, UserCheck, DollarSign, Home, Wrench } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { motion, useScroll, useTransform } from "motion/react";
import { useState, useEffect } from "react";

export function Landing() {
  const navigate = useNavigate();
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Advanced parallax transforms for 3D scroll storytelling
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);
  const heroRotateX = useTransform(scrollYProgress, [0, 0.2], [0, -10]);
  
  // Depth layer transforms
  const backgroundY = useTransform(scrollYProgress, [0, 0.4], [0, 200]);
  const textY = useTransform(scrollYProgress, [0, 0.3], [0, 100]);
  const textRotateX = useTransform(scrollYProgress, [0, 0.3], [0, 15]);
  const modelY = useTransform(scrollYProgress, [0, 0.3], [0, -50]);
  const modelScale = useTransform(scrollYProgress, [0, 0.15, 0.3], [1, 1.1, 0.9]);
  const modelRotate = useTransform(scrollYProgress, [0, 0.3], [0, 15]);
  const modelRotateY = useTransform(scrollYProgress, [0, 0.3], [0, -20]);
  const cardsY = useTransform(scrollYProgress, [0, 0.3], [0, 80]);
  const cardsRotate = useTransform(scrollYProgress, [0, 0.3], [0, -5]);
  
  // Features section 3D transforms
  const featuresY = useTransform(scrollYProgress, [0.2, 0.4], [100, 0]);
  const featuresRotateX = useTransform(scrollYProgress, [0.2, 0.4], [20, 0]);
  const featuresOpacity = useTransform(scrollYProgress, [0.2, 0.35], [0, 1]);
  
  // Price section 3D transforms
  const priceY = useTransform(scrollYProgress, [0.35, 0.5], [100, 0]);
  const priceRotateX = useTransform(scrollYProgress, [0.35, 0.5], [25, 0]);
  const priceScale = useTransform(scrollYProgress, [0.35, 0.5], [0.9, 1]);
  
  // How it works section 3D transforms
  const howItWorksY = useTransform(scrollYProgress, [0.5, 0.65], [100, 0]);
  const howItWorksRotateX = useTransform(scrollYProgress, [0.5, 0.65], [30, 0]);
  const howItWorksOpacity = useTransform(scrollYProgress, [0.5, 0.6], [0, 1]);
  
  // Testimonials section 3D transforms
  const testimonialsY = useTransform(scrollYProgress, [0.65, 0.8], [100, 0]);
  const testimonialsRotateX = useTransform(scrollYProgress, [0.65, 0.8], [20, 0]);
  const testimonialsScale = useTransform(scrollYProgress, [0.65, 0.8], [0.95, 1]);

  const features = [
    {
      icon: Search,
      title: "Smart Matching",
      description: "Find the perfect dorm and roommate based on your preferences and lifestyle",
      color: "from-[#14b8a6] to-[#0d9488]"
    },
    {
      icon: Shield,
      title: "Verified Listings",
      description: "All dormitories are verified and approved by our admin team for your safety",
      color: "from-[#0d9488] to-[#0f766e]"
    },
    {
      icon: Users,
      title: "Community Connect",
      description: "Connect with fellow BatStateU students and find compatible roommates",
      color: "from-[#14b8a6] to-[#0d9488]"
    },
    {
      icon: Heart,
      title: "Student-Friendly",
      description: "Affordable rates, flexible terms, and amenities designed for student life",
      color: "from-[#0d9488] to-[#0f766e]"
    }
  ];

  const testimonials = [
    {
      name: "Maria Santos",
      course: "BS Computer Science",
      year: "3rd Year",
      text: "Found my perfect dorm near BatStateU in just 2 days! The roommate matching feature helped me find someone with the same schedule.",
      rating: 5
    },
    {
      name: "Juan Reyes",
      course: "BS Engineering",
      year: "2nd Year",
      text: "RoomSync made my transition to Arasof Campus so easy. The maintenance request system is super helpful!",
      rating: 5
    },
    {
      name: "Andrea Cruz",
      course: "BS Education",
      year: "4th Year",
      text: "Love how affordable the dorms are in Bucana! Walking distance to campus and very safe area.",
      rating: 5
    }
  ];

  const stats = [
    { value: "500+", label: "Students Housed", icon: Users, color: "from-[#14b8a6] to-[#0d9488]" },
    { value: "50+", label: "Verified Dorms", icon: Building2, color: "from-[#0d9488] to-[#0f766e]" },
    { value: "98%", label: "Satisfaction Rate", icon: Award, color: "from-[#14b8a6] to-[#0d9488]" },
    { value: "24/7", label: "Support", icon: Zap, color: "from-[#0d9488] to-[#0f766e]" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#f0fdfa] to-[#ccfbf1] relative overflow-hidden">
      {/* Interactive Dynamic Background with Pastel Gradient Lights */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Drifting Pastel Gradient Light 1 - Soft Teal */}
        <motion.div
          animate={{
            x: ["-20%", "20%", "-20%"],
            y: ["-10%", "15%", "-10%"],
            scale: [1, 1.3, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            background: "radial-gradient(circle, rgba(204, 251, 241, 0.5) 0%, rgba(153, 246, 228, 0.35) 25%, rgba(240, 253, 250, 0.2) 50%, transparent 100%)"
          }}
          className="absolute top-[10%] left-[5%] w-[800px] h-[800px] rounded-full blur-[100px] opacity-60"
        />
        
        {/* Drifting Pastel Gradient Light 2 - Mint Teal */}
        <motion.div
          animate={{
            x: ["30%", "-15%", "30%"],
            y: ["20%", "-5%", "20%"],
            scale: [1.2, 1, 1.2],
            rotate: [180, 270, 180],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            background: "radial-gradient(circle, rgba(153, 246, 228, 0.4) 0%, rgba(94, 234, 212, 0.3) 30%, rgba(204, 251, 241, 0.15) 60%, transparent 100%)"
          }}
          className="absolute top-[40%] right-[10%] w-[700px] h-[700px] rounded-full blur-[120px] opacity-50"
        />
        
        {/* Drifting Pastel Gradient Light 3 - Soft White */}
        <motion.div
          animate={{
            x: ["-10%", "25%", "-10%"],
            y: ["30%", "10%", "30%"],
            scale: [1, 1.4, 1],
            rotate: [90, 180, 90],
          }}
          transition={{
            duration: 35,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            background: "radial-gradient(circle, rgba(255, 255, 255, 0.5) 0%, rgba(240, 253, 250, 0.35) 25%, rgba(245, 254, 252, 0.2) 50%, transparent 100%)"
          }}
          className="absolute bottom-[15%] left-[20%] w-[900px] h-[900px] rounded-full blur-[110px] opacity-40"
        />
        
        {/* Drifting Pastel Gradient Light 4 - Pale Teal */}
        <motion.div
          animate={{
            x: ["15%", "-20%", "15%"],
            y: ["-5%", "20%", "-5%"],
            scale: [1.1, 1, 1.1],
            rotate: [270, 360, 270],
          }}
          transition={{
            duration: 28,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            background: "radial-gradient(circle, rgba(204, 251, 241, 0.45) 0%, rgba(240, 253, 250, 0.3) 35%, rgba(245, 254, 252, 0.15) 65%, transparent 100%)"
          }}
          className="absolute bottom-[30%] right-[25%] w-[750px] h-[750px] rounded-full blur-[90px] opacity-55"
        />
        
        {/* Drifting Pastel Gradient Light 5 - Cream Teal */}
        <motion.div
          animate={{
            x: ["-25%", "10%", "-25%"],
            y: ["25%", "-10%", "25%"],
            scale: [1, 1.25, 1],
            rotate: [45, 135, 45],
          }}
          transition={{
            duration: 32,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            background: "radial-gradient(circle, rgba(245, 254, 252, 0.5) 0%, rgba(240, 253, 250, 0.35) 30%, rgba(245, 254, 252, 0.2) 55%, transparent 100%)"
          }}
          className="absolute top-[60%] left-[40%] w-[650px] h-[650px] rounded-full blur-[95px] opacity-45"
        />
        
        {/* Cursor-Following Radial Glow - VisionOS Style */}
        <motion.div
          animate={{
            x: mousePosition.x - 400,
            y: mousePosition.y - 400,
          }}
          transition={{
            type: "spring",
            damping: 30,
            stiffness: 150,
            mass: 0.8
          }}
          style={{
            background: "radial-gradient(circle, rgba(255, 255, 255, 0.6) 0%, rgba(204, 251, 241, 0.4) 15%, rgba(153, 246, 228, 0.25) 30%, rgba(94, 234, 212, 0.15) 45%, transparent 70%)"
          }}
          className="absolute w-[800px] h-[800px] rounded-full blur-[80px] opacity-70 mix-blend-soft-light"
        />
        
        {/* Secondary Cursor Glow - Softer, Larger */}
        <motion.div
          animate={{
            x: mousePosition.x - 500,
            y: mousePosition.y - 500,
          }}
          transition={{
            type: "spring",
            damping: 25,
            stiffness: 100,
            mass: 1
          }}
          style={{
            background: "radial-gradient(circle, rgba(240, 253, 250, 0.5) 0%, rgba(204, 251, 241, 0.3) 20%, rgba(153, 246, 228, 0.2) 40%, transparent 65%)"
          }}
          className="absolute w-[1000px] h-[1000px] rounded-full blur-[120px] opacity-50 mix-blend-overlay"
        />
      </div>

      {/* Glassmorphic Navigation */}
      <nav className="backdrop-blur-2xl bg-white/80 border-b border-white/50 sticky top-0 z-50 relative shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 relative z-10">
            <motion.div 
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-[#14b8a6] to-[#0f766e] rounded-xl flex items-center justify-center shadow-lg">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold bg-gradient-to-r from-[#0f766e] to-[#134e4a] bg-clip-text text-transparent">RoomSync</span>
            </motion.div>
            <div className="hidden md:flex items-center gap-8">
              <a 
                href="#features" 
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-sm text-gray-700 hover:text-[#0f766e] transition-colors font-medium cursor-pointer"
              >
                Features
              </a>
              <a 
                href="#how-it-works" 
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-sm text-gray-700 hover:text-[#0f766e] transition-colors font-medium cursor-pointer"
              >
                How It Works
              </a>
              <a 
                href="#testimonials" 
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('testimonials')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-sm text-gray-700 hover:text-[#0f766e] transition-colors font-medium cursor-pointer"
              >
                Testimonials
              </a>
              <motion.button 
                onClick={() => navigate('/login')}
                className="px-4 py-2 text-sm text-gray-700 hover:text-[#0f766e] transition-colors font-medium"
                whileHover={{ scale: 1.05 }}
              >
                Sign In
              </motion.button>
            </div>
            <motion.button 
              onClick={() => navigate('/login')}
              className="md:hidden px-4 py-2 text-sm bg-gradient-to-r from-[#14b8a6] to-[#0f766e] text-white rounded-lg shadow-lg"
              whileTap={{ scale: 0.95 }}
            >
              Sign In
            </motion.button>
          </div>
        </div>
      </nav>

      {/* Hero Section with 3D Scroll Storytelling */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden" style={{ perspective: '2000px' }}>
        {/* Apple-Style Spotlight Effect - Enhanced */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          animate={{
            x: (mousePosition.x - (typeof window !== 'undefined' ? window.innerWidth / 2 : 0)) * 0.05,
            y: (mousePosition.y - (typeof window !== 'undefined' ? window.innerHeight / 2 : 0)) * 0.05,
          }}
          transition={{
            type: "spring",
            damping: 20,
            stiffness: 80
          }}
        >
          <div 
            className="w-[1200px] h-[1200px] rounded-full blur-[150px] opacity-40"
            style={{
              background: "radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, rgba(204, 251, 241, 0.6) 20%, rgba(153, 246, 228, 0.4) 40%, rgba(94, 234, 212, 0.2) 60%, transparent 80%)",
              mixBlendMode: "overlay"
            }}
          />
        </motion.div>

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative">
            {/* Left Content - Text Layer (Depth Layer 1) */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              style={{ 
                y: textY,
                transformStyle: "preserve-3d"
              }}
              transition={{ duration: 0.8 }}
              className="relative z-20"
            >
              <motion.div 
                className="inline-flex items-center gap-2 px-4 py-2 backdrop-blur-xl bg-white/70 border border-[#99f6e4]/50 text-[#134e4a] rounded-full text-sm mb-6 shadow-lg"
                whileHover={{ scale: 1.05 }}
                style={{
                  boxShadow: hoveredCard !== null ? "0 20px 60px rgba(20, 184, 166, 0.4)" : "0 10px 30px rgba(20, 184, 166, 0.2)"
                }}
              >
                <Sparkles className="w-4 h-4 text-red-500" />
                <span className="font-medium">Serving BatStateU Arasof Campus, Nasugbu</span>
              </motion.div>
              
              <motion.h1 
                className="text-5xl lg:text-6xl font-bold mb-6 leading-tight"
                style={{ transformStyle: "preserve-3d" }}
              >
                <span className="bg-gradient-to-r from-[#0d9488] to-[#134e4a] bg-clip-text text-transparent">
                  Find Your Perfect Dorm
                </span>
                <br />
                <span className="text-gray-800">Near Campus</span>
              </motion.h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                RoomSync connects BatStateU students with safe, affordable dormitories in Barangay Bucana. 
                Smart matching for dorms and roommates made easy.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button 
                  onClick={() => navigate('/login')}
                  className="px-8 py-4 bg-gradient-to-r from-[#14b8a6] to-[#0f766e] text-white rounded-2xl font-semibold text-lg shadow-lg shadow-[#0d9488]/30 font-bold relative overflow-hidden"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    boxShadow: hoveredCard !== null 
                      ? "0 25px 60px rgba(13, 148, 136, 0.5), 0 0 80px rgba(20, 184, 166, 0.3)" 
                      : "0 15px 40px rgba(13, 148, 136, 0.3)"
                  }}
                >
                  <span className="relative z-10">Find Your Dorm</span>
                </motion.button>
                
                <motion.button 
                  onClick={() => navigate('/login')}
                  className="px-8 py-4 backdrop-blur-xl bg-white/80 border-2 border-[#99f6e4] text-[#134e4a] rounded-2xl font-semibold text-lg hover:bg-white/90 transition-all shadow-lg font-bold"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  List Your Property
                </motion.button>
              </div>
              
              {/* Stats - Glassmorphism with Sage Green */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + index * 0.1, duration: 0.6 }}
                      whileHover={{ scale: 1.05, y: -5 }}
                      className="relative backdrop-blur-2xl bg-white/70 rounded-2xl p-4 border border-white/50 shadow-xl text-center"
                    >
                      <div className={`inline-flex w-10 h-10 bg-gradient-to-br ${stat.color} rounded-xl items-center justify-center mb-2`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                      <div className="text-xs text-gray-600 font-medium">{stat.label}</div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
            
            {/* Right Content - 3D Dorm Model with Floating Cards (Depth Layer 2) */}
            <motion.div 
              className="relative lg:h-[600px] flex items-center justify-center"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              style={{ 
                y: modelY,
                scale: modelScale,
                transformStyle: "preserve-3d"
              }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {/* Dorm Image Container */}
              <div className="relative w-full max-w-[500px] aspect-square">
                {/* Main Dorm Image - Fixed */}
                <motion.div 
                  className="rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl bg-white/40 border border-white/50 p-3 relative"
                  whileHover={{ 
                    scale: 1.02,
                    transition: { duration: 0.3 }
                  }}
                  style={{
                    boxShadow: hoveredCard !== null 
                      ? "0 40px 100px rgba(13, 148, 136, 0.4), 0 0 120px rgba(20, 184, 166, 0.3)" 
                      : "0 25px 60px rgba(13, 148, 136, 0.2)"
                  }}
                >
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50cyUyMGRvcm0lMjByb29tfGVufDF8fHx8MTc3MzU4ODA4OXww&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="Student dormitory"
                    className="w-full h-auto rounded-2xl"
                  />
                  
                  {/* Proximity-Based Glow Overlay */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl pointer-events-none"
                    style={{
                      opacity: hoveredCard !== null ? 0.6 : 0.2,
                      transition: "opacity 0.3s ease"
                    }}
                  />
                </motion.div>

                {/* Floating Glassmorphism UI Cards */}
                
                {/* Card 1: Verified Dorms - Top Left */}
                <motion.div
                  className="absolute -top-6 -left-12 backdrop-blur-2xl bg-white/85 rounded-2xl shadow-2xl p-4 border border-[#99f6e4]/50 cursor-pointer z-30"
                  initial={{ opacity: 0, scale: 0.8, rotateY: -20 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1,
                    rotateY: 0,
                    y: [0, -10, 0],
                  }}
                  transition={{ 
                    opacity: { delay: 0.6, duration: 0.5 },
                    scale: { delay: 0.6, duration: 0.5 },
                    y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                  }}
                  whileHover={{ 
                    scale: 1.1, 
                    rotateY: 5,
                    z: 100,
                    transition: { duration: 0.3 }
                  }}
                  onHoverStart={() => setHoveredCard(0)}
                  onHoverEnd={() => setHoveredCard(null)}
                  style={{
                    transformStyle: "preserve-3d",
                    transform: `translateZ(${hoveredCard === 0 ? 150 : 110}px)`,
                    boxShadow: hoveredCard === 0 
                      ? "0 30px 80px rgba(13, 148, 136, 0.5), 0 0 100px rgba(20, 184, 166, 0.4)" 
                      : "0 20px 50px rgba(13, 148, 136, 0.3)",
                    filter: hoveredCard === 0 ? "brightness(1.15)" : "brightness(1)"
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg bg-gradient-to-br from-[#14b8a6] to-[#0f766e]">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#134e4a]">Verified Dorms</p>
                      <p className="text-xs text-[#134e4a]">100% Safe & Checked</p>
                    </div>
                  </div>
                </motion.div>

                {/* Card 2: Student Reviews - Top Right */}
                <motion.div
                  className="absolute -top-8 -right-16 backdrop-blur-2xl bg-white/85 rounded-2xl shadow-2xl p-4 border border-[#99f6e4]/50 cursor-pointer"
                  initial={{ opacity: 0, scale: 0.8, rotateY: 20 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1,
                    rotateY: 0,
                    y: [0, -15, 0],
                  }}
                  transition={{ 
                    opacity: { delay: 0.8, duration: 0.5 },
                    scale: { delay: 0.8, duration: 0.5 },
                    y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }
                  }}
                  whileHover={{ 
                    scale: 1.1, 
                    rotateY: -5,
                    z: 100,
                    transition: { duration: 0.3 }
                  }}
                  onHoverStart={() => setHoveredCard(1)}
                  onHoverEnd={() => setHoveredCard(null)}
                  style={{
                    transformStyle: "preserve-3d",
                    transform: `translateZ(${hoveredCard === 1 ? 120 : 70}px)`,
                    boxShadow: hoveredCard === 1 
                      ? "0 30px 80px rgba(13, 148, 136, 0.5), 0 0 100px rgba(20, 184, 166, 0.4)" 
                      : "0 20px 50px rgba(13, 148, 136, 0.3)",
                    filter: hoveredCard === 1 ? "brightness(1.15)" : "brightness(1)"
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg bg-gradient-to-br from-[#0d9488] to-[#0f766e]">
                      <Star className="w-6 h-6 text-white fill-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#134e4a]">500+ Reviews</p>
                      <p className="text-xs text-[#134e4a]">4.9★ Average Rating</p>
                    </div>
                  </div>
                </motion.div>

                {/* Card 3: Smart Matching - Bottom Left Corner */}
                <motion.div
                  className="absolute bottom-0 left-0 backdrop-blur-2xl bg-white/85 rounded-2xl shadow-2xl p-4 border border-[#99f6e4]/50 cursor-pointer z-20"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1,
                    y: [0, 8, 0],
                  }}
                  transition={{ 
                    opacity: { delay: 1.0, duration: 0.5 },
                    scale: { delay: 1.0, duration: 0.5 },
                    y: { duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 }
                  }}
                  whileHover={{ 
                    scale: 1.1,
                    transition: { duration: 0.3 }
                  }}
                  onHoverStart={() => setHoveredCard(2)}
                  onHoverEnd={() => setHoveredCard(null)}
                  style={{
                    boxShadow: hoveredCard === 2 
                      ? "0 30px 80px rgba(13, 148, 136, 0.5), 0 0 100px rgba(20, 184, 166, 0.4)" 
                      : "0 20px 50px rgba(13, 148, 136, 0.3)",
                    filter: hoveredCard === 2 ? "brightness(1.15)" : "brightness(1)"
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg bg-gradient-to-br from-[#14b8a6] to-[#0d9488]">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#134e4a]">Smart Matching</p>
                      <p className="text-xs text-[#134e4a]">Find Perfect Roommates</p>
                    </div>
                  </div>
                </motion.div>

                {/* Card 4: Affordable Rent - Bottom Right Corner */}
                <motion.div
                  className="absolute bottom-0 right-0 backdrop-blur-2xl bg-white/85 rounded-2xl shadow-2xl p-4 border border-[#99f6e4]/50 cursor-pointer z-20"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1,
                    y: [0, 10, 0],
                  }}
                  transition={{ 
                    opacity: { delay: 1.2, duration: 0.5 },
                    scale: { delay: 1.2, duration: 0.5 },
                    y: { duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }
                  }}
                  whileHover={{ 
                    scale: 1.1,
                    transition: { duration: 0.3 }
                  }}
                  onHoverStart={() => setHoveredCard(3)}
                  onHoverEnd={() => setHoveredCard(null)}
                  style={{
                    boxShadow: hoveredCard === 3 
                      ? "0 30px 80px rgba(13, 148, 136, 0.5), 0 0 100px rgba(20, 184, 166, 0.4)" 
                      : "0 20px 50px rgba(13, 148, 136, 0.3)",
                    filter: hoveredCard === 3 ? "brightness(1.15)" : "brightness(1)"
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg bg-[#0f766e]">
                      <img src={image_5fbaac37e96e358c3eb60973822df1e871b063ee} alt="Verified" className="w-full h-full object-cover rounded-xl" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#134e4a]">₱2,200 - ₱3,500</p>
                      <p className="text-xs text-[#134e4a]">Affordable Options</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Three Powerful Portals Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 backdrop-blur-xl bg-white/70 border border-[#99f6e4]/50 text-[#134e4a] rounded-full text-sm mb-6 shadow-lg"
              whileHover={{ scale: 1.05 }}
            >
              <Zap className="w-4 h-4 text-[#14b8a6]" />
              <span className="font-medium">Three Powerful Platforms in One</span>
            </motion.div>

            <h2 className="text-5xl font-bold bg-gradient-to-r from-[#0d9488] to-[#134e4a] bg-clip-text text-transparent mb-6">
              Built for Everyone
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Whether you're a student searching for a home, an owner managing properties, or an admin overseeing operations — RoomSync has you covered.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Student Portal */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="relative group"
            >
              <div className="relative backdrop-blur-3xl bg-gradient-to-br from-white/90 to-white/70 rounded-3xl p-8 border border-white/50 shadow-2xl overflow-hidden h-full">
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#14b8a6] to-[#0d9488] rounded-2xl flex items-center justify-center shadow-lg">
                    <Users className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">Student</h3>
                    <p className="text-sm text-gray-600">Find Your Perfect Home</p>
                  </div>
                </div>

                {/* Mock Screenshot */}
                <div className="relative mb-6 rounded-xl overflow-hidden border-2 border-[#99f6e4]/50 shadow-lg">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxzdHVkZW50cyUyMGxhcHRvcHxlbnwxfHx8fDE3NzM1ODgwODl8MA&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="Student Dashboard"
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white/90 to-transparent" />
                </div>

                {/* Features */}
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#14b8a6] to-[#0d9488] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">Browse 50+ Verified Dorms</p>
                      <p className="text-sm text-gray-600">All within walking distance to campus</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#14b8a6] to-[#0d9488] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">Smart Roommate Matching</p>
                      <p className="text-sm text-gray-600">Find compatible roommates by lifestyle</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#14b8a6] to-[#0d9488] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">Easy Payment Tracking</p>
                      <p className="text-sm text-gray-600">View receipts & payment history online</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#14b8a6] to-[#0d9488] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">Quick Maintenance Requests</p>
                      <p className="text-sm text-gray-600">Report issues directly to owners</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Owner Portal */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="relative group"
            >
              <div className="relative backdrop-blur-3xl bg-gradient-to-br from-white/90 to-white/70 rounded-3xl p-8 border-2 border-[#14b8a6]/50 shadow-2xl overflow-hidden h-full">
                {/* Popular Badge */}
                <div className="absolute -top-3 -right-3 z-20">
                  <div className="flex items-center gap-1 bg-gradient-to-r from-[#14b8a6] to-[#0f766e] px-3 py-1.5 rounded-full text-white font-semibold text-xs shadow-lg">
                    <Star className="w-3 h-3 fill-white" />
                    Popular
                  </div>
                </div>

                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#14b8a6] to-[#0f766e] rounded-2xl flex items-center justify-center shadow-lg">
                    <Building2 className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">Owner</h3>
                    <p className="text-sm text-gray-600">Manage Your Properties</p>
                  </div>
                </div>

                {/* Mock Screenshot */}
                <div className="relative mb-6 rounded-xl overflow-hidden border-2 border-[#14b8a6]/50 shadow-lg">
                  <div className="bg-gradient-to-br from-[#f0fdfa] to-[#ccfbf1] p-6 h-48 flex items-center justify-center">
                    <div className="grid grid-cols-2 gap-3 w-full">
                      <div className="bg-white/90 rounded-lg p-3 shadow">
                        <BarChart3 className="w-5 h-5 text-[#14b8a6] mb-1" />
                        <p className="text-xs font-semibold text-gray-700">₱45,000</p>
                        <p className="text-xs text-gray-500">This Month</p>
                      </div>
                      <div className="bg-white/90 rounded-lg p-3 shadow">
                        <Users className="w-5 h-5 text-[#14b8a6] mb-1" />
                        <p className="text-xs font-semibold text-gray-700">15 Tenants</p>
                        <p className="text-xs text-gray-500">Active</p>
                      </div>
                      <div className="bg-white/90 rounded-lg p-3 shadow">
                        <Receipt className="w-5 h-5 text-[#14b8a6] mb-1" />
                        <p className="text-xs font-semibold text-gray-700">12 Paid</p>
                        <p className="text-xs text-gray-500">Payments</p>
                      </div>
                      <div className="bg-white/90 rounded-lg p-3 shadow">
                        <Wrench className="w-5 h-5 text-[#14b8a6] mb-1" />
                        <p className="text-xs font-semibold text-gray-700">3 Pending</p>
                        <p className="text-xs text-gray-500">Requests</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#14b8a6] to-[#0f766e] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">Property Management</p>
                      <p className="text-sm text-gray-600">List & manage multiple dormitories</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#14b8a6] to-[#0f766e] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">Tenant Management</p>
                      <p className="text-sm text-gray-600">Track occupancy & tenant information</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#14b8a6] to-[#0f766e] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">Revenue Analytics</p>
                      <p className="text-sm text-gray-600">Monthly income reports & insights</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#14b8a6] to-[#0f766e] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">Maintenance Tracking</p>
                      <p className="text-sm text-gray-600">Handle requests & track repairs</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Admin Portal */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="relative group"
            >
              <div className="relative backdrop-blur-3xl bg-gradient-to-br from-white/90 to-white/70 rounded-3xl p-8 border border-white/50 shadow-2xl overflow-hidden h-full">
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#0d9488] to-[#0f766e] rounded-2xl flex items-center justify-center shadow-lg">
                    <Shield className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">Admin</h3>
                    <p className="text-sm text-gray-600">Oversee the Platform</p>
                  </div>
                </div>

                {/* Mock Screenshot */}
                <div className="relative mb-6 rounded-xl overflow-hidden border-2 border-[#99f6e4]/50 shadow-lg">
                  <div className="bg-gradient-to-br from-[#f0fdfa] to-[#e0f2f1] p-6 h-48 flex items-center justify-center">
                    <div className="w-full space-y-3">
                      <div className="bg-white/90 rounded-lg p-3 shadow flex items-center gap-3">
                        <Settings className="w-5 h-5 text-[#0d9488]" />
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-gray-700">System Health</p>
                          <div className="h-1.5 bg-gray-200 rounded-full mt-1">
                            <div className="h-full w-[92%] bg-gradient-to-r from-[#14b8a6] to-[#0d9488] rounded-full"></div>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-white/90 rounded-lg p-2 shadow text-center">
                          <p className="text-lg font-bold text-[#0d9488]">500+</p>
                          <p className="text-xs text-gray-600">Students</p>
                        </div>
                        <div className="bg-white/90 rounded-lg p-2 shadow text-center">
                          <p className="text-lg font-bold text-[#0d9488]">50+</p>
                          <p className="text-xs text-gray-600">Dorms</p>
                        </div>
                      </div>
                      <div className="bg-white/90 rounded-lg p-2 shadow flex items-center justify-between">
                        <span className="text-xs text-gray-600">Pending Approvals</span>
                        <span className="text-xs font-bold text-[#0d9488]">3</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#0d9488] to-[#0f766e] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">Owner Verification</p>
                      <p className="text-sm text-gray-600">Approve & manage dormitory owners</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#0d9488] to-[#0f766e] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">Platform Analytics</p>
                      <p className="text-sm text-gray-600">Monitor usage & system health</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#0d9488] to-[#0f766e] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">Listing Moderation</p>
                      <p className="text-sm text-gray-600">Ensure quality & safety standards</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#0d9488] to-[#0f766e] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">Support Management</p>
                      <p className="text-sm text-gray-600">Handle disputes & user support</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section - 3D Cards with White/Sage */}
      <section id="features" className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent to-white/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold bg-gradient-to-r from-[#0d9488] to-[#134e4a] bg-clip-text text-transparent mb-4">
              Why Choose RoomSync?
            </h2>
            <p className="text-xl text-gray-600">Everything you need to find and manage your student housing</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50, rotateX: -15 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ delay: index * 0.1, duration: 0.6, type: "spring" }}
                  whileHover={{
                    y: -10,
                    rotateY: 5,
                    scale: 1.03,
                    transition: { duration: 0.3 }
                  }}
                  className="relative group"
                  style={{ perspective: 1000 }}
                  onMouseEnter={() => setHoveredFeature(index)}
                  onMouseLeave={() => setHoveredFeature(null)}
                >
                  {/* Glassmorphism Card */}
                  <div className="relative backdrop-blur-3xl bg-white/70 rounded-3xl p-6 border border-white/50 shadow-2xl overflow-hidden h-full">
                    <div className="relative z-10 text-center">
                      {/* Icon with gradient */}
                      <div className="relative inline-block mb-4">
                        <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                      </div>

                      <h3 className="text-lg font-semibold text-gray-800 mb-2">{feature.title}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Price Range Section - White/Sage Glassmorphism */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Lamp Effect Container */}
          <div className="relative">
            {/* Lamp Light Beam */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none overflow-hidden"
            >
              {/* Top glow/light source */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.2 }}
                className="absolute -top-40 left-1/2 -translate-x-1/2 w-32 h-32 bg-gradient-radial from-white via-[#99f6e4] to-transparent rounded-full blur-3xl opacity-60"
              />
              
              {/* Light beam cone */}
              <motion.div
                initial={{ opacity: 0, scaleY: 0 }}
                whileInView={{ opacity: 1, scaleY: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
                style={{
                  background: "linear-gradient(180deg, rgba(255,255,255,0.6) 0%, rgba(153,246,228,0.4) 20%, rgba(20,184,166,0.2) 50%, transparent 100%)",
                  transformOrigin: "top center"
                }}
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] opacity-50"
                clipPath="polygon(45% 0%, 55% 0%, 70% 100%, 30% 100%)"
              />
              
              {/* Radial glow effect behind content */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, delay: 0.5 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-gradient-radial from-white/40 via-[#99f6e4]/20 to-transparent blur-3xl"
              />
            </motion.div>

            <motion.div 
              className="text-center mb-16 relative z-10"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold bg-gradient-to-r from-[#0d9488] to-[#134e4a] bg-clip-text text-transparent mb-4">
                Affordable Student Housing
              </h2>
              <p className="text-xl text-gray-600">Find dormitories that fit your budget</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
              {/* Budget-Friendly */}
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: 0.1, duration: 0.6 }}
                whileHover={{ 
                  y: -10,
                  scale: 1.02,
                  rotateY: 5,
                  transition: { duration: 0.3 }
                }}
                className="relative group"
                style={{ perspective: 1000 }}
              >
                <div className="relative backdrop-blur-3xl bg-white/80 rounded-3xl p-8 border border-[#99f6e4]/50 shadow-2xl overflow-hidden h-full">
                  <div className="relative z-10 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#14b8a6] to-[#0d9488] rounded-full mb-4 shadow-lg">
                      <span className="text-2xl">����</span>
                    </div>
                    <h3 className="text-xl font-semibold text-[#134e4a] mb-2">Budget-Friendly</h3>
                    <p className="text-3xl font-bold bg-gradient-to-r from-[#0d9488] to-[#0f766e] bg-clip-text text-transparent mb-2">₱2,200 - ₱2,800</p>
                    <p className="text-sm text-[#134e4a] mb-4 font-medium">Perfect for students on a tight budget</p>
                    <ul className="text-sm text-[#134e4a] space-y-2 text-left">
                      <li className="flex items-center gap-2"><span className="text-[#0d9488] font-bold">✓</span> Fan rooms</li>
                      <li className="flex items-center gap-2"><span className="text-[#0d9488] font-bold">✓</span> Free WiFi</li>
                      <li className="flex items-center gap-2"><span className="text-[#0d9488] font-bold">✓</span> Walking distance to campus</li>
                      <li className="flex items-center gap-2"><span className="text-[#0d9488] font-bold">✓</span> Common kitchen & study area</li>
                    </ul>
                  </div>
                </div>
              </motion.div>

              {/* Standard - Most Popular */}
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: -20, scale: 1.05 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: 0.2, duration: 0.6 }}
                whileHover={{ 
                  y: -30,
                  scale: 1.08,
                  rotateY: 5,
                  transition: { duration: 0.3 }
                }}
                className="relative group"
                style={{ perspective: 1000 }}
              >
                {/* Popular Badge */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-4 left-1/2 -translate-x-1/2 z-20"
                >
                  <div className="flex items-center gap-1 bg-gradient-to-r from-[#14b8a6] to-[#0f766e] px-4 py-2 rounded-full text-white font-semibold text-sm shadow-lg">
                    <Star className="w-4 h-4 fill-white" />
                    Most Popular
                  </div>
                </motion.div>

                <div className="relative backdrop-blur-3xl bg-white/90 rounded-3xl p-8 border-2 border-[#14b8a6]/50 shadow-2xl overflow-hidden h-full">
                  <div className="relative z-10 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#14b8a6] to-[#0f766e] rounded-full mb-4 shadow-lg">
                      <span className="text-2xl">🏠</span>
                    </div>
                    <h3 className="text-xl font-semibold text-[#134e4a] mb-2">Standard</h3>
                    <p className="text-3xl font-bold bg-gradient-to-r from-[#0d9488] to-[#134e4a] bg-clip-text text-transparent mb-2">₱3,000 - ₱3,200</p>
                    <p className="text-sm text-[#134e4a] mb-4 font-medium">Best value for comfort & convenience</p>
                    <ul className="text-sm text-[#134e4a] space-y-2 text-left">
                      <li className="flex items-center gap-2"><span className="text-[#0d9488] font-bold">✓</span> Air-conditioned rooms</li>
                      <li className="flex items-center gap-2"><span className="text-[#0d9488] font-bold">✓</span> High-speed WiFi</li>
                      <li className="flex items-center gap-2"><span className="text-[#0d9488] font-bold">✓</span> 2-5 mins walk to campus</li>
                      <li className="flex items-center gap-2"><span className="text-[#0d9488] font-bold">✓</span> Laundry area & study lounge</li>
                      <li className="flex items-center gap-2"><span className="text-[#0d9488] font-bold">✓</span> 24/7 CCTV security</li>
                    </ul>
                  </div>
                </div>
              </motion.div>

              {/* Premium */}
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: 0.3, duration: 0.6 }}
                whileHover={{ 
                  y: -10,
                  scale: 1.02,
                  rotateY: 5,
                  transition: { duration: 0.3 }
                }}
                className="relative group"
                style={{ perspective: 1000 }}
              >
                <div className="relative backdrop-blur-3xl bg-white/80 rounded-3xl p-8 border border-[#99f6e4]/50 shadow-2xl overflow-hidden h-full">
                  <div className="relative z-10 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#14b8a6] to-[#0d9488] rounded-full mb-4 shadow-lg">
                      <span className="text-2xl">⭐</span>
                    </div>
                    <h3 className="text-xl font-semibold text-[#134e4a] mb-2">Premium</h3>
                    <p className="text-3xl font-bold bg-gradient-to-r from-[#0d9488] to-[#0f766e] bg-clip-text text-transparent mb-2">₱3,500+</p>
                    <p className="text-sm text-[#134e4a] mb-4 font-medium">For students who want the best</p>
                    <ul className="text-sm text-[#134e4a] space-y-2 text-left">
                      <li className="flex items-center gap-2"><span className="text-[#0d9488] font-bold">✓</span> Fully air-conditioned</li>
                      <li className="flex items-center gap-2"><span className="text-[#0d9488] font-bold">✓</span> Premium WiFi (100Mbps+)</li>
                      <li className="flex items-center gap-2"><span className="text-[#0d9488] font-bold">✓</span> Gym access</li>
                      <li className="flex items-center gap-2"><span className="text-[#0d9488] font-bold">✓</span> Rooftop study area</li>
                      <li className="flex items-center gap-2"><span className="text-[#0d9488] font-bold">✓</span> Gaming lounge & mini store</li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - 3D Cards */}
      <section id="how-it-works" className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold bg-gradient-to-r from-[#0d9488] to-[#134e4a] bg-clip-text text-transparent mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">Get settled in 3 easy steps</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { num: "1", title: "Create Your Profile", desc: "Sign up and tell us about yourself, your budget, and what you're looking for in a dorm and roommate.", color: "from-[#14b8a6] to-[#0d9488]", emoji: "👤" },
              { num: "2", title: "Find Your Match", desc: "Browse verified dormitories near campus and use our smart matching to find compatible roommates.", color: "from-[#0d9488] to-[#0f766e]", emoji: "🎯" },
              { num: "3", title: "Move In & Manage", desc: "Submit your request, coordinate with the owner, and manage everything from payments to maintenance online.", color: "from-[#14b8a6] to-[#0d9488]", emoji: "🏡" }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50, rotateX: -20 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: index * 0.15, duration: 0.6, type: "spring" }}
                whileHover={{ 
                  y: -10,
                  rotateY: 5,
                  scale: 1.03,
                  transition: { duration: 0.3 }
                }}
                className="relative group"
                style={{ perspective: 1000 }}
              >
                <div className="relative backdrop-blur-3xl bg-white/80 rounded-3xl p-8 border border-white/50 shadow-2xl overflow-hidden h-full">
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center text-xl font-bold text-white shadow-lg`}>
                        {step.num}
                      </div>
                      
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">{step.title}</h3>
                    <p className="text-gray-700 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials - White Glassmorphism */}
      <section id="testimonials" className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold bg-gradient-to-r from-[#0d9488] to-[#134e4a] bg-clip-text text-transparent mb-4">
              What Students Say
            </h2>
            <p className="text-xl text-gray-600">Join hundreds of happy BatStateU students</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ 
                  y: -5,
                  scale: 1.02,
                  transition: { duration: 0.3 }
                }}
                className="relative group"
              >
                <div className="relative backdrop-blur-3xl bg-white/80 rounded-3xl p-6 border border-white/50 shadow-2xl overflow-hidden h-full">
                  <div className="relative z-10">
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-[#14b8a6] text-[#14b8a6]" />
                      ))}
                    </div>
                    <p className="text-gray-800 mb-4 italic leading-relaxed font-medium">"{testimonial.text}"</p>
                    <div className="pt-3 border-t border-[#99f6e4]/40">
                      <p className="font-semibold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-700">{testimonial.course}</p>
                      <p className="text-xs text-gray-600">{testimonial.year}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold bg-gradient-to-r from-[#0d9488] to-[#134e4a] bg-clip-text text-transparent mb-4">
              Perfect Location
            </h2>
            <p className="text-xl text-gray-600">All dorms within walking distance to BatStateU Arasof Campus, Nasugbu</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Map Visual */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative backdrop-blur-3xl bg-white/80 rounded-3xl p-8 border border-white/50 shadow-2xl">
                <div className="bg-gradient-to-br from-[#f0fdfa] to-[#ccfbf1] rounded-2xl p-8 h-80 flex items-center justify-center relative overflow-hidden">
                  {/* Mock Map */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="grid grid-cols-8 grid-rows-8 h-full w-full">
                      {[...Array(64)].map((_, i) => (
                        <div key={i} className="border border-[#14b8a6]/20"></div>
                      ))}
                    </div>
                  </div>

                  {/* Campus Marker */}
                  <div className="relative z-10 flex flex-col items-center">
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="relative"
                    >
                      <div className="w-16 h-16 bg-gradient-to-br from-[#14b8a6] to-[#0f766e] rounded-full flex items-center justify-center shadow-2xl">
                        <Building2 className="w-8 h-8 text-white" />
                      </div>
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-8 bg-gradient-to-b from-[#14b8a6] to-transparent"></div>
                    </motion.div>
                    <div className="mt-8 bg-white/90 rounded-2xl px-6 py-3 shadow-lg">
                      <p className="font-bold text-[#0d9488]">BatStateU Arasof Campus</p>
                      <p className="text-sm text-gray-600">Barangay Bucana, Nasugbu</p>
                    </div>

                    {/* Dorm Markers */}
                    {[
                      { x: -60, y: -40 },
                      { x: 70, y: -30 },
                      { x: -50, y: 50 },
                      { x: 80, y: 40 }
                    ].map((pos, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        transition={{ delay: 0.2 + i * 0.1 }}
                        className="absolute w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-[#14b8a6]"
                        style={{ left: `calc(50% + ${pos.x}px)`, top: `calc(50% + ${pos.y}px)` }}
                      >
                        <Home className="w-4 h-4 text-[#14b8a6]" />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Location Benefits */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              {[
                {
                  icon: MapPin,
                  title: "2-10 Minute Walk to Campus",
                  description: "All dormitories are strategically located within walking distance to BatStateU Arasof Campus.",
                  color: "from-[#14b8a6] to-[#0d9488]"
                },
                {
                  icon: Shield,
                  title: "Safe Barangay Bucana Area",
                  description: "All dorms are in secure, well-lit neighborhoods with 24/7 security and CCTV coverage.",
                  color: "from-[#0d9488] to-[#0f766e]"
                },
                {
                  icon: Building2,
                  title: "Near Essential Amenities",
                  description: "Close proximity to convenience stores, restaurants, laundry shops, and public transport.",
                  color: "from-[#14b8a6] to-[#0d9488]"
                }
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ x: 10 }}
                    className="flex items-start gap-4 backdrop-blur-3xl bg-white/70 rounded-2xl p-5 border border-white/50 shadow-lg"
                  >
                    <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">{item.title}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust & Security Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white/50 to-transparent">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold bg-gradient-to-r from-[#0d9488] to-[#134e4a] bg-clip-text text-transparent mb-4">
              Your Safety is Our Priority
            </h2>
            <p className="text-xl text-gray-600">Every dormitory and owner is verified for your peace of mind</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: UserCheck,
                title: "Verified Owners",
                description: "All dormitory owners undergo strict verification by our admin team",
                stat: "100%"
              },
              {
                icon: Shield,
                title: "Safe Properties",
                description: "Every listing meets our safety and quality standards",
                stat: "50+"
              },
              {
                icon: FileText,
                title: "Clear Contracts",
                description: "Transparent terms, fair pricing, and documented agreements",
                stat: "100%"
              },
              {
                icon: Award,
                title: "Student Rated",
                description: "Real reviews from fellow BatStateU students",
                stat: "4.9★"
              }
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="relative backdrop-blur-3xl bg-white/80 rounded-3xl p-6 border border-white/50 shadow-2xl text-center"
                >
                  <div className="inline-flex w-16 h-16 bg-gradient-to-br from-[#14b8a6] to-[#0d9488] rounded-2xl items-center justify-center mb-4 shadow-lg">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-[#0d9488] mb-2">{item.stat}</div>
                  <h3 className="font-semibold text-gray-800 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section - White/Sage Glassmorphism */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative backdrop-blur-3xl bg-gradient-to-br from-white/90 to-white/70 rounded-3xl p-12 md:p-16 border-2 border-[#99f6e4]/50 shadow-2xl overflow-hidden">
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#99f6e4]/30 to-transparent rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-[#ccfbf1]/30 to-transparent rounded-full blur-3xl"></div>

              <div className="relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  {/* Left: CTA Content */}
                  <div className="text-center lg:text-left">
                    <motion.div
                      className="inline-flex items-center gap-2 px-4 py-2 backdrop-blur-xl bg-white/70 border border-[#99f6e4]/50 text-[#134e4a] rounded-full text-sm mb-6 shadow-lg"
                      whileHover={{ scale: 1.05 }}
                    >
                      <Sparkles className="w-4 h-4 text-[#14b8a6]" />
                      <span className="font-medium">Join 500+ Students Today</span>
                    </motion.div>

                    <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#0d9488] to-[#134e4a] bg-clip-text text-transparent">
                      Ready to Find Your Perfect Dorm?
                    </h2>

                    <p className="text-xl text-gray-700 mb-8 font-medium leading-relaxed">
                      Join RoomSync today and discover safe, affordable housing near BatStateU Arasof Campus. Your home away from home is just a click away.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                      <motion.button
                        onClick={() => navigate('/login')}
                        className="px-8 py-4 bg-gradient-to-r from-[#14b8a6] to-[#0f766e] text-white rounded-2xl font-semibold text-lg shadow-lg shadow-[#0d9488]/50"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Get Started Now
                      </motion.button>

                      <motion.button
                        onClick={() => navigate('/login')}
                        className="px-8 py-4 backdrop-blur-xl bg-white/80 border-2 border-[#99f6e4] text-[#134e4a] rounded-2xl font-semibold text-lg"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Learn More
                      </motion.button>
                    </div>
                  </div>

                  {/* Right: Visual Stats */}
                  <div className="hidden lg:grid grid-cols-2 gap-4">
                    {[
                      { icon: Users, value: "500+", label: "Happy Students" },
                      { icon: Building2, value: "50+", label: "Verified Dorms" },
                      { icon: Star, value: "4.9★", label: "Average Rating" },
                      { icon: DollarSign, value: "₱2,200+", label: "Starting Price" }
                    ].map((stat, index) => {
                      const Icon = stat.icon;
                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.1 + index * 0.1 }}
                          whileHover={{ scale: 1.05 }}
                          className="backdrop-blur-2xl bg-white/70 rounded-2xl p-5 border border-white/50 shadow-xl text-center"
                        >
                          <div className="inline-flex w-12 h-12 bg-gradient-to-br from-[#14b8a6] to-[#0d9488] rounded-xl items-center justify-center mb-3 shadow-lg">
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <div className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</div>
                          <div className="text-xs text-gray-600 font-medium">{stat.label}</div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer - Glassmorphism */}
      <footer className="relative backdrop-blur-xl bg-white/70 border-t border-white/50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-gradient-to-br from-[#14b8a6] to-[#0f766e] rounded-lg flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-semibold bg-gradient-to-r from-[#0f766e] to-[#134e4a] bg-clip-text text-transparent">RoomSync</span>
              </div>
              <p className="text-sm text-gray-600">
                Connecting BatStateU students with quality housing in Nasugbu, Batangas.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-800 mb-4">For Students</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-[#0f766e] transition-colors">Find Dorms</a></li>
                <li><a href="#" className="hover:text-[#0f766e] transition-colors">Find Roommates</a></li>
                <li><a href="#" className="hover:text-[#0f766e] transition-colors">How It Works</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-800 mb-4">For Owners</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-[#0f766e] transition-colors">List Your Property</a></li>
                <li><a href="#" className="hover:text-[#0f766e] transition-colors">Manage Listings</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-800 mb-4">Contact</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Barangay Bucana, Nasugbu</li>
                <li>Batangas, Philippines</li>
                <li className="text-[#0f766e] font-medium">support@roomsync.ph</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/50 mt-8 pt-8 text-center text-sm text-gray-600">
            <p>Made with 💚 for BatStateU students • &copy; 2026 RoomSync. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}