import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Building2,
  Mail,
  Lock,
  User,
  Phone,
  MapPin,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  School,
  Home,
  Shield,
  Upload,
  X,
  Check,
  Sparkles,
  Info,
  Camera,
  FileText,
  Zap,
  Globe,
  Github,
  Chrome,
} from "lucide-react";

type UserRole = "student" | "owner" | "admin";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  role: UserRole;
  profilePicture?: string;
  agreeToTerms: boolean;
  // Student-specific
  studentId?: string;
  course?: string;
  yearLevel?: string;
  // Owner-specific
  businessName?: string;
  address?: string;
  // Optional fields
  bio?: string;
  interests?: string[];
}

const availableInterests = [
  "Sports", "Music", "Gaming", "Reading", "Cooking",
  "Art", "Technology", "Travel", "Fitness", "Photography"
];

export function SignUp() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [profilePreview, setProfilePreview] = useState<string>("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [focusedField, setFocusedField] = useState<string>("");

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    // This page is being locked to Student-only sign up (role selection removed)
    role: "student",
    agreeToTerms: false,
    studentId: "",
    course: "",
    yearLevel: "",
    businessName: "",
    address: "",
    bio: "",
    interests: [],
  });

  // Mouse tracking for glassmorphism effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Password strength calculator
  useEffect(() => {
    const password = formData.password;
    let strength = 0;
    
    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 15;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 20;
    if (/\d/.test(password)) strength += 20;
    if (/[^a-zA-Z\d]/.test(password)) strength += 20;
    
    setPasswordStrength(strength);
  }, [formData.password]);

  const roles = [
    {
      id: "student" as UserRole,
      name: "Student/Tenant",
      icon: School,
      description: "Find your perfect dorm and roommate",
      color: "from-[#14b8a6] to-[#0d9488]",
      benefits: ["Access to verified dorms", "Roommate matching", "Payment tracking"]
    },
    {
      id: "owner" as UserRole,
      name: "Dormitory Owner",
      icon: Home,
      description: "List and manage your properties",
      color: "from-[#0d9488] to-[#0f766e]",
      benefits: ["List multiple properties", "Tenant management", "Revenue analytics"]
    },
    {
      id: "admin" as UserRole,
      name: "Administrator",
      icon: Shield,
      description: "Manage the entire platform",
      color: "from-[#0f766e] to-[#134e4a]",
      benefits: ["Full system access", "User management", "Analytics dashboard"]
    },
  ];

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (formData.firstName.length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (formData.lastName.length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (passwordStrength < 60) {
      newErrors.password = "Password is too weak. Add numbers, symbols, and mixed case.";
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Invalid phone number (10-11 digits required)";
    }

    if (formData.role === "student") {
      if (!formData.studentId?.trim()) {
        newErrors.studentId = "Student ID is required";
      }
      if (!formData.course?.trim()) {
        newErrors.course = "Course is required";
      }
      if (!formData.yearLevel) {
        newErrors.yearLevel = "Year level is required";
      }
    }

    if (formData.role === "owner") {
      if (!formData.businessName?.trim()) {
        newErrors.businessName = "Business name is required";
      }
      if (!formData.address?.trim()) {
        newErrors.address = "Address is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (step === 2 && validateStep2()) {
      setStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setErrors({});
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep3()) {
      setIsSubmitting(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsSubmitting(false);
      setShowSuccess(true);
      
      // Navigate after showing success animation
      setTimeout(() => {
        navigate("/login", { state: { registered: true, email: formData.email } });
      }, 2500);
    }
  };

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleProfilePictureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result as string);
        updateFormData("profilePicture", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleInterest = (interest: string) => {
    const current = formData.interests || [];
    if (current.includes(interest)) {
      updateFormData("interests", current.filter(i => i !== interest));
    } else {
      if (current.length < 5) {
        updateFormData("interests", [...current, interest]);
      }
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 40) return "bg-red-500";
    if (passwordStrength < 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 40) return "Weak";
    if (passwordStrength < 70) return "Medium";
    return "Strong";
  };

  // Success Animation Modal
  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-[#f0fdfa] to-[#ccfbf1] dark:from-gray-900 dark:via-[#042f2e] dark:to-gray-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="backdrop-blur-2xl bg-white/90 dark:bg-gray-800/90 rounded-3xl p-12 text-center shadow-2xl border border-white/50 dark:border-gray-700/50 max-w-md"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-[#14b8a6] to-[#0d9488] rounded-full flex items-center justify-center"
          >
            <CheckCircle2 className="w-12 h-12 text-white" />
          </motion.div>
          
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-3xl font-bold text-gray-800 dark:text-white mb-4"
          >
            Account Created!
          </motion.h2>
          
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-gray-600 dark:text-gray-400 mb-6"
          >
            Welcome to RoomSync, {formData.firstName}! <br/>
            Redirecting you to login...
          </motion.p>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.8, duration: 1.5 }}
            className="h-2 bg-gradient-to-r from-[#14b8a6] to-[#0d9488] rounded-full"
          />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#f0fdfa] to-[#ccfbf1] dark:from-gray-900 dark:via-[#042f2e] dark:to-gray-900 relative overflow-hidden">
      {/* Locked: Student-only sign up. Role selection removed. */}
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: ["-20%", "20%", "-20%"],
            y: ["-10%", "15%", "-10%"],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            background:
              "radial-gradient(circle, rgba(204, 251, 241, 0.4) 0%, rgba(153, 246, 228, 0.25) 50%, transparent 100%)",
          }}
          className="absolute top-[10%] left-[5%] w-[600px] h-[600px] rounded-full blur-[100px]"
        />

        <motion.div
          animate={{
            x: ["20%", "-20%", "20%"],
            y: ["20%", "-10%", "20%"],
            scale: [1.1, 1, 1.1],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            background:
              "radial-gradient(circle, rgba(153, 246, 228, 0.3) 0%, rgba(94, 234, 212, 0.2) 50%, transparent 100%)",
          }}
          className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] rounded-full blur-[100px]"
        />

        {/* Cursor Follow Effect */}
        <motion.div
          animate={{
            x: mousePosition.x - 300,
            y: mousePosition.y - 300,
          }}
          transition={{
            type: "spring",
            damping: 30,
            stiffness: 150,
          }}
          style={{
            background: "radial-gradient(circle, rgba(20, 184, 166, 0.15) 0%, transparent 70%)",
          }}
          className="absolute w-[600px] h-[600px] rounded-full blur-[60px]"
        />
      </div>

      {/* Back to Landing Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        onClick={() => navigate("/")}
        className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 border border-[#99f6e4]/50 dark:border-[#0f766e]/50 rounded-xl text-[#134e4a] dark:text-white hover:bg-white/90 dark:hover:bg-gray-800/90 transition-all shadow-lg group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium">Back to Home</span>
      </motion.button>

      {/* Main Sign Up Container */}
      <div className="flex items-center justify-center min-h-screen p-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative w-full max-w-5xl"
        >
          <div className="backdrop-blur-2xl bg-white/80 dark:bg-gray-800/80 rounded-3xl shadow-2xl border border-white/50 dark:border-gray-700/50 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#14b8a6] to-[#0d9488] p-8 text-white relative overflow-hidden">
              {/* Animated Background Patterns */}
              <div className="absolute inset-0 opacity-10">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                  className="absolute top-0 right-0 w-64 h-64"
                >
                  <div className="w-full h-full bg-gradient-to-br from-white to-transparent rounded-full blur-3xl" />
                </motion.div>
              </div>

              <div className="flex items-center gap-3 mb-4 relative z-10">
                <motion.div 
                  className="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-xl flex items-center justify-center"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <Building2 className="w-6 h-6" />
                </motion.div>
                <div>
                  <h1 className="text-3xl font-bold">Create Account</h1>
                  <p className="text-teal-100">Join RoomSync today - Step {step} of 3</p>
                </div>
              </div>

              {/* Progress Steps */}
              <div className="flex items-center gap-4 mt-6 relative z-10">
                {[
                  { num: 1, label: "Account" },
                  { num: 2, label: "Details" },
                  { num: 3, label: "Confirm" }
                ].map((s, idx) => (
                  <div key={s.num} className="flex items-center flex-1">
                    <div className="flex items-center gap-3 flex-1">
                      <motion.div
                        whileHover={{ scale: step >= s.num ? 1.1 : 1 }}
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                          step >= s.num
                            ? "bg-white text-teal-600 shadow-lg"
                            : "bg-white/20 text-white/60"
                        }`}
                      >
                        {step > s.num ? (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200 }}
                          >
                            <CheckCircle2 className="w-5 h-5" />
                          </motion.div>
                        ) : (
                          s.num
                        )}
                      </motion.div>
                      <span
                        className={`text-sm font-medium ${
                          step >= s.num ? "text-white" : "text-white/60"
                        }`}
                      >
                        {s.label}
                      </span>
                    </div>
                    {idx < 2 && (
                      <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: step > s.num ? 1 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="h-1 flex-1 rounded-full bg-white mx-2"
                        style={{ transformOrigin: "left" }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="p-8">
              <AnimatePresence mode="wait">
                {/* Step 1: Basic Account Info */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div>
                      <motion.h2 
                        className="text-2xl font-bold text-gray-800 dark:text-white mb-2 flex items-center gap-2"
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                      >
                        Account Information
                        <Sparkles className="w-5 h-5 text-[#14b8a6]" />
                      </motion.h2>
                      <p className="text-gray-600 dark:text-gray-400">
                        Let's start with your basic details
                      </p>
                    </div>

                    {/* Profile Picture Upload */}
                    <div className="flex justify-center">
                      <div className="relative">
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-[#99f6e4] shadow-lg cursor-pointer group"
                        >
                          {profilePreview ? (
                            <img src={profilePreview} alt="Profile" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-[#14b8a6] to-[#0d9488] flex items-center justify-center">
                              <Camera className="w-10 h-10 text-white" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Upload className="w-8 h-8 text-white" />
                          </div>
                        </motion.div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleProfilePictureUpload}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                        {profilePreview && (
                          <motion.button
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            type="button"
                            onClick={() => {
                              setProfilePreview("");
                              updateFormData("profilePicture", undefined);
                            }}
                            className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-red-600"
                          >
                            <X className="w-4 h-4" />
                          </motion.button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* First Name */}
                      <motion.div
                        whileHover={{ y: -2 }}
                        transition={{ duration: 0.2 }}
                      >
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          First Name *
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                          <motion.input
                            type="text"
                            value={formData.firstName}
                            onChange={(e) =>
                              updateFormData("firstName", e.target.value)
                            }
                            onFocus={() => setFocusedField("firstName")}
                            onBlur={() => setFocusedField("")}
                            className={`w-full pl-11 pr-4 py-3 rounded-xl border ${
                              errors.firstName
                                ? "border-red-300 focus:border-red-500"
                                : focusedField === "firstName"
                                ? "border-[#14b8a6] ring-2 ring-[#14b8a6]/20"
                                : "border-[#99f6e4] dark:border-gray-600 focus:border-[#14b8a6]"
                            } focus:outline-none transition-all bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500`}
                            placeholder="Juan"
                            whileFocus={{ scale: 1.01 }}
                          />
                          {formData.firstName && !errors.firstName && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute right-3 top-1/2 -translate-y-1/2"
                            >
                              <Check className="w-5 h-5 text-green-500" />
                            </motion.div>
                          )}
                        </div>
                        {errors.firstName && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-1 text-sm text-red-600 flex items-center gap-1"
                          >
                            <AlertCircle className="w-4 h-4" />
                            {errors.firstName}
                          </motion.p>
                        )}
                      </motion.div>

                      {/* Last Name */}
                      <motion.div
                        whileHover={{ y: -2 }}
                        transition={{ duration: 0.2 }}
                      >
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Last Name *
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                          <motion.input
                            type="text"
                            value={formData.lastName}
                            onChange={(e) =>
                              updateFormData("lastName", e.target.value)
                            }
                            onFocus={() => setFocusedField("lastName")}
                            onBlur={() => setFocusedField("")}
                            className={`w-full pl-11 pr-4 py-3 rounded-xl border ${
                              errors.lastName
                                ? "border-red-300 focus:border-red-500"
                                : focusedField === "lastName"
                                ? "border-[#14b8a6] ring-2 ring-[#14b8a6]/20"
                                : "border-[#99f6e4] dark:border-[#364153] focus:border-[#14b8a6]"
                            } focus:outline-none transition-all bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500`}
                            placeholder="Dela Cruz"
                            whileFocus={{ scale: 1.01 }}
                          />
                          {formData.lastName && !errors.lastName && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute right-3 top-1/2 -translate-y-1/2"
                            >
                              <Check className="w-5 h-5 text-green-500" />
                            </motion.div>
                          )}
                        </div>
                        {errors.lastName && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-1 text-sm text-red-600 flex items-center gap-1"
                          >
                            <AlertCircle className="w-4 h-4" />
                            {errors.lastName}
                          </motion.p>
                        )}
                      </motion.div>
                    </div>

                    {/* Email */}
                    <motion.div
                      whileHover={{ y: -2 }}
                      transition={{ duration: 0.2 }}
                    >
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                        <motion.input
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            updateFormData("email", e.target.value)
                          }
                          onFocus={() => setFocusedField("email")}
                          onBlur={() => setFocusedField("")}
                          className={`w-full pl-11 pr-4 py-3 rounded-xl border ${
                            errors.email
                              ? "border-red-300 focus:border-red-500"
                              : focusedField === "email"
                              ? "border-[#14b8a6] ring-2 ring-[#14b8a6]/20"
                              : "border-[#99f6e4] dark:border-[#364153] focus:border-[#14b8a6]"
                          } focus:outline-none transition-all bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500`}
                          placeholder="juan.delacruz@example.com"
                          whileFocus={{ scale: 1.01 }}
                        />
                        {formData.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && !errors.email && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute right-3 top-1/2 -translate-y-1/2"
                          >
                            <Check className="w-5 h-5 text-green-500" />
                          </motion.div>
                        )}
                      </div>
                      {errors.email && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-1 text-sm text-red-600 flex items-center gap-1"
                        >
                          <AlertCircle className="w-4 h-4" />
                          {errors.email}
                        </motion.p>
                      )}
                    </motion.div>

                    {/* Password */}
                    <motion.div
                      whileHover={{ y: -2 }}
                      transition={{ duration: 0.2 }}
                    >
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Password *
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                        <motion.input
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={(e) =>
                            updateFormData("password", e.target.value)
                          }
                          onFocus={() => setFocusedField("password")}
                          onBlur={() => setFocusedField("")}
                          className={`w-full pl-11 pr-12 py-3 rounded-xl border ${
                            errors.password
                              ? "border-red-300 focus:border-red-500"
                              : focusedField === "password"
                              ? "border-[#14b8a6] ring-2 ring-[#14b8a6]/20"
                              : "border-[#99f6e4] dark:border-[#364153] focus:border-[#14b8a6]"
                          } focus:outline-none transition-all bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500`}
                          placeholder="••••••••"
                          whileFocus={{ scale: 1.01 }}
                        />
                        <motion.button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </motion.button>
                      </div>
                      
                      {/* Password Strength Indicator */}
                      {formData.password && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="mt-2"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-gray-600">Password Strength:</span>
                            <span className={`text-xs font-medium ${
                              passwordStrength < 40 ? "text-red-600" :
                              passwordStrength < 70 ? "text-yellow-600" :
                              "text-green-600"
                            }`}>
                              {getPasswordStrengthText()}
                            </span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${passwordStrength}%` }}
                              transition={{ duration: 0.3 }}
                              className={`h-full ${getPasswordStrengthColor()} transition-colors`}
                            />
                          </div>
                          <div className="mt-2 space-y-1">
                            <p className={`text-xs flex items-center gap-1 ${formData.password.length >= 8 ? "text-green-600" : "text-gray-500"}`}>
                              <Check className={`w-3 h-3 ${formData.password.length >= 8 ? "" : "opacity-30"}`} />
                              At least 8 characters
                            </p>
                            <p className={`text-xs flex items-center gap-1 ${/[A-Z]/.test(formData.password) && /[a-z]/.test(formData.password) ? "text-green-600" : "text-gray-500"}`}>
                              <Check className={`w-3 h-3 ${/[A-Z]/.test(formData.password) && /[a-z]/.test(formData.password) ? "" : "opacity-30"}`} />
                              Mixed case letters
                            </p>
                            <p className={`text-xs flex items-center gap-1 ${/\d/.test(formData.password) ? "text-green-600" : "text-gray-500"}`}>
                              <Check className={`w-3 h-3 ${/\d/.test(formData.password) ? "" : "opacity-30"}`} />
                              Contains numbers
                            </p>
                            <p className={`text-xs flex items-center gap-1 ${/[^a-zA-Z\d]/.test(formData.password) ? "text-green-600" : "text-gray-500"}`}>
                              <Check className={`w-3 h-3 ${/[^a-zA-Z\d]/.test(formData.password) ? "" : "opacity-30"}`} />
                              Special characters
                            </p>
                          </div>
                        </motion.div>
                      )}
                      
                      {errors.password && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-1 text-sm text-red-600 flex items-center gap-1"
                        >
                          <AlertCircle className="w-4 h-4" />
                          {errors.password}
                        </motion.p>
                      )}
                    </motion.div>

                    {/* Confirm Password */}
                    <motion.div
                      whileHover={{ y: -2 }}
                      transition={{ duration: 0.2 }}
                    >
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Confirm Password *
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                        <motion.input
                          type={showConfirmPassword ? "text" : "password"}
                          value={formData.confirmPassword}
                          onChange={(e) =>
                            updateFormData("confirmPassword", e.target.value)
                          }
                          onFocus={() => setFocusedField("confirmPassword")}
                          onBlur={() => setFocusedField("")}
                          className={`w-full pl-11 pr-12 py-3 rounded-xl border ${
                            errors.confirmPassword
                              ? "border-red-300 focus:border-red-500"
                              : focusedField === "confirmPassword"
                              ? "border-[#14b8a6] ring-2 ring-[#14b8a6]/20"
                              : "border-[#99f6e4] dark:border-[#364153] focus:border-[#14b8a6]"
                          } focus:outline-none transition-all bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500`}
                          placeholder="••••••••"
                          whileFocus={{ scale: 1.01 }}
                        />
                        <motion.button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </motion.button>
                        {formData.confirmPassword && formData.password === formData.confirmPassword && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute right-12 top-1/2 -translate-y-1/2"
                          >
                            <Check className="w-5 h-5 text-green-500" />
                          </motion.div>
                        )}
                      </div>
                      {errors.confirmPassword && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-1 text-sm text-red-600 flex items-center gap-1"
                        >
                          <AlertCircle className="w-4 h-4" />
                          {errors.confirmPassword}
                        </motion.p>
                      )}
                    </motion.div>
                  </motion.div>
                )}

                {/* Step 2: Additional Details */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div>
                      <motion.h2 
                        className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2"
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                      >
                        Additional Details
                        <Info className="w-5 h-5 text-[#14b8a6]" />
                      </motion.h2>
                      <p className="text-gray-600">
                        Help us know you better
                      </p>
                    </div>

                    {/* Phone Number */}
                    <motion.div
                      whileHover={{ y: -2 }}
                      transition={{ duration: 0.2 }}
                    >
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <motion.input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) =>
                            updateFormData("phone", e.target.value)
                          }
                          onFocus={() => setFocusedField("phone")}
                          onBlur={() => setFocusedField("")}
                          className={`w-full pl-11 pr-4 py-3 rounded-xl border ${
                            errors.phone
                              ? "border-red-300 focus:border-red-500"
                              : focusedField === "phone"
                              ? "border-[#14b8a6] ring-2 ring-[#14b8a6]/20"
                              : "border-[#99f6e4] focus:border-[#14b8a6]"
                          } focus:outline-none transition-all bg-white/50 backdrop-blur-sm`}
                          placeholder="09123456789"
                          whileFocus={{ scale: 1.01 }}
                        />
                        {formData.phone && /^[0-9]{10,11}$/.test(formData.phone.replace(/\D/g, "")) && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute right-3 top-1/2 -translate-y-1/2"
                          >
                            <Check className="w-5 h-5 text-green-500" />
                          </motion.div>
                        )}
                      </div>
                      {errors.phone && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-1 text-sm text-red-600 flex items-center gap-1"
                        >
                          <AlertCircle className="w-4 h-4" />
                          {errors.phone}
                        </motion.p>
                      )}
                    </motion.div>

                    {/* Role Selection (REMOVED/LOCKED) */
                    /* Role selection removed; this page is student-only. */
                          const Icon = role.icon;
                          const isSelected = formData.role === role.id;
                          return (
                            <motion.button
                              key={role.id}
                              type="button"
                              onClick={() => updateFormData("role", role.id)}
                              whileHover={{ scale: 1.02, y: -4 }}
                              whileTap={{ scale: 0.98 }}
                              className={`relative p-4 rounded-2xl border-2 transition-all text-left ${
                                isSelected
                                  ? "border-[#14b8a6] bg-gradient-to-br from-[#14b8a6]/10 to-[#0d9488]/5 shadow-lg"
                                  : "border-[#99f6e4] bg-white/50 hover:border-[#14b8a6]/50"
                              }`}
                            >
                              {isSelected && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="absolute top-3 right-3"
                                >
                                  <CheckCircle2 className="w-5 h-5 text-[#14b8a6]" />
                                </motion.div>
                              )}

                              <div
                                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${role.color} flex items-center justify-center mb-3 shadow-lg`}
                              >
                                <Icon className="w-6 h-6 text-white" />
                              </div>

                              <h3 className="font-semibold text-gray-800 mb-1 text-sm">
                                {role.name}
                              </h3>
                              <p className="text-xs text-gray-600 mb-2">
                                {role.description}
                              </p>
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Role-specific fields */}
                    {formData.role === "student" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-6"
                      >
                        <div className="bg-gradient-to-br from-[#f0fdfa] to-white rounded-2xl p-4 border border-[#99f6e4]">
                          <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                            <School className="w-5 h-5 text-[#14b8a6]" />
                            Student Information
                          </h4>
                          
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Student ID *
                              </label>
                              <div className="relative">
                                <School className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                  type="text"
                                  value={formData.studentId}
                                  onChange={(e) =>
                                    updateFormData("studentId", e.target.value)
                                  }
                                  className={`w-full pl-11 pr-4 py-3 rounded-xl border ${
                                    errors.studentId
                                      ? "border-red-300 focus:border-red-500"
                                      : "border-[#99f6e4] focus:border-[#14b8a6]"
                                  } focus:outline-none focus:ring-2 focus:ring-[#14b8a6]/20 transition-all bg-white/50 backdrop-blur-sm`}
                                  placeholder="2024-12345"
                                />
                              </div>
                              {errors.studentId && (
                                <motion.p
                                  initial={{ opacity: 0, y: -10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="mt-1 text-sm text-red-600 flex items-center gap-1"
                                >
                                  <AlertCircle className="w-4 h-4" />
                                  {errors.studentId}
                                </motion.p>
                              )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Course/Program *
                                </label>
                                <input
                                  type="text"
                                  value={formData.course}
                                  onChange={(e) =>
                                    updateFormData("course", e.target.value)
                                  }
                                  className={`w-full px-4 py-3 rounded-xl border ${
                                    errors.course
                                      ? "border-red-300 focus:border-red-500"
                                      : "border-[#99f6e4] focus:border-[#14b8a6]"
                                  } focus:outline-none focus:ring-2 focus:ring-[#14b8a6]/20 transition-all bg-white/50 backdrop-blur-sm`}
                                  placeholder="BS Computer Science"
                                />
                                {errors.course && (
                                  <motion.p
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-1 text-sm text-red-600 flex items-center gap-1"
                                  >
                                    <AlertCircle className="w-4 h-4" />
                                    {errors.course}
                                  </motion.p>
                                )}
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Year Level *
                                </label>
                                <select
                                  value={formData.yearLevel}
                                  onChange={(e) =>
                                    updateFormData("yearLevel", e.target.value)
                                  }
                                  className={`w-full px-4 py-3 rounded-xl border ${
                                    errors.yearLevel
                                      ? "border-red-300 focus:border-red-500"
                                      : "border-[#99f6e4] focus:border-[#14b8a6]"
                                  } focus:outline-none focus:ring-2 focus:ring-[#14b8a6]/20 transition-all bg-white/50 backdrop-blur-sm`}
                                >
                                  <option value="">Select Year</option>
                                  <option value="1">1st Year</option>
                                  <option value="2">2nd Year</option>
                                  <option value="3">3rd Year</option>
                                  <option value="4">4th Year</option>
                                  <option value="5">5th Year</option>
                                </select>
                                {errors.yearLevel && (
                                  <motion.p
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-1 text-sm text-red-600 flex items-center gap-1"
                                  >
                                    <AlertCircle className="w-4 h-4" />
                                    {errors.yearLevel}
                                  </motion.p>
                                )}
                              </div>
                            </div>

                            {/* Interests Selection */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Interests (Select up to 5)
                              </label>
                              <div className="flex flex-wrap gap-2">
                                {availableInterests.map((interest) => (
                                  <motion.button
                                    key={interest}
                                    type="button"
                                    onClick={() => toggleInterest(interest)}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                      formData.interests?.includes(interest)
                                        ? "bg-gradient-to-r from-[#14b8a6] to-[#0d9488] text-white shadow-lg"
                                        : "bg-white/70 text-gray-700 border border-[#99f6e4] hover:border-[#14b8a6]"
                                    }`}
                                  >
                                    {interest}
                                  </motion.button>
                                ))}
                              </div>
                              <p className="text-xs text-gray-500 mt-2">
                                Selected: {formData.interests?.length || 0}/5
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {formData.role === "owner" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-6"
                      >
                        <div className="bg-gradient-to-br from-[#f0fdfa] to-white rounded-2xl p-4 border border-[#99f6e4]">
                          <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                            <Building2 className="w-5 h-5 text-[#14b8a6]" />
                            Business Information
                          </h4>
                          
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Business/Dormitory Name *
                              </label>
                              <div className="relative">
                                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                  type="text"
                                  value={formData.businessName}
                                  onChange={(e) =>
                                    updateFormData("businessName", e.target.value)
                                  }
                                  className={`w-full pl-11 pr-4 py-3 rounded-xl border ${
                                    errors.businessName
                                      ? "border-red-300 focus:border-red-500"
                                      : "border-[#99f6e4] focus:border-[#14b8a6]"
                                  } focus:outline-none focus:ring-2 focus:ring-[#14b8a6]/20 transition-all bg-white/50 backdrop-blur-sm`}
                                  placeholder="BatStateU Dormitory"
                                />
                              </div>
                              {errors.businessName && (
                                <motion.p
                                  initial={{ opacity: 0, y: -10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="mt-1 text-sm text-red-600 flex items-center gap-1"
                                >
                                  <AlertCircle className="w-4 h-4" />
                                  {errors.businessName}
                                </motion.p>
                              )}
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Property Address *
                              </label>
                              <div className="relative">
                                <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                <textarea
                                  value={formData.address}
                                  onChange={(e) =>
                                    updateFormData("address", e.target.value)
                                  }
                                  rows={3}
                                  className={`w-full pl-11 pr-4 py-3 rounded-xl border ${
                                    errors.address
                                      ? "border-red-300 focus:border-red-500"
                                      : "border-[#99f6e4] focus:border-[#14b8a6]"
                                  } focus:outline-none focus:ring-2 focus:ring-[#14b8a6]/20 transition-all bg-white/50 backdrop-blur-sm resize-none`}
                                  placeholder="Barangay Bucana, Nasugbu, Batangas"
                                />
                              </div>
                              {errors.address && (
                                <motion.p
                                  initial={{ opacity: 0, y: -10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="mt-1 text-sm text-red-600 flex items-center gap-1"
                                >
                                  <AlertCircle className="w-4 h-4" />
                                  {errors.address}
                                </motion.p>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {formData.role === "admin" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="bg-gradient-to-br from-teal-50 to-white border border-teal-200 rounded-xl p-4"
                      >
                        <div className="flex items-start gap-3">
                          <Shield className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-semibold text-teal-800 mb-1">
                              Administrator Account
                            </p>
                            <p className="text-sm text-teal-700">
                              Admin accounts require approval from existing administrators. 
                              You'll receive an email once your account is verified. This process typically takes 24-48 hours.
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Bio (Optional for all) */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bio (Optional)
                      </label>
                      <textarea
                        value={formData.bio}
                        onChange={(e) => updateFormData("bio", e.target.value)}
                        rows={4}
                        maxLength={300}
                        className="w-full px-4 py-3 rounded-xl border border-[#99f6e4] focus:border-[#14b8a6] focus:outline-none focus:ring-2 focus:ring-[#14b8a6]/20 transition-all bg-white/50 backdrop-blur-sm resize-none"
                        placeholder="Tell us a bit about yourself..."
                      />
                      <p className="text-xs text-gray-500 mt-1 text-right">
                        {formData.bio?.length || 0}/300
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Confirm & Submit */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div>
                      <motion.h2 
                        className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2"
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                      >
                        Review & Confirm
                        <FileText className="w-5 h-5 text-[#14b8a6]" />
                      </motion.h2>
                      <p className="text-gray-600">
                        Please review your information before submitting
                      </p>
                    </div>

                    {/* Profile Summary Card */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gradient-to-br from-[#f0fdfa] to-white rounded-2xl p-6 border border-[#99f6e4] shadow-lg"
                    >
                      <div className="flex items-start gap-4 mb-6">
                        <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-[#99f6e4] shadow-lg flex-shrink-0">
                          {profilePreview ? (
                            <img src={profilePreview} alt="Profile" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-[#14b8a6] to-[#0d9488] flex items-center justify-center">
                              <User className="w-10 h-10 text-white" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-gray-800">
                            {formData.firstName} {formData.lastName}
                          </h3>
                          <p className="text-gray-600">{formData.email}</p>
                          <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-[#14b8a6] to-[#0d9488] text-white rounded-full text-sm font-medium">
                            {roles.find((r) => r.id === formData.role)?.icon && (
                              <span>{roles.find((r) => r.id === formData.role)?.icon && 
                                (() => {
                                  const Icon = roles.find((r) => r.id === formData.role)!.icon;
                                  return <Icon className="w-4 h-4" />;
                                })()
                              }</span>
                            )}
                            {roles.find((r) => r.id === formData.role)?.name}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Phone Number</p>
                            <p className="text-sm font-medium text-gray-800">{formData.phone}</p>
                          </div>
                          
                          {formData.role === "student" && (
                            <>
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Student ID</p>
                                <p className="text-sm font-medium text-gray-800">{formData.studentId}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Course</p>
                                <p className="text-sm font-medium text-gray-800">{formData.course}</p>
                              </div>
                            </>
                          )}

                          {formData.role === "owner" && (
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Business Name</p>
                              <p className="text-sm font-medium text-gray-800">{formData.businessName}</p>
                            </div>
                          )}
                        </div>

                        <div className="space-y-3">
                          {formData.role === "student" && (
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Year Level</p>
                              <p className="text-sm font-medium text-gray-800">{formData.yearLevel}th Year</p>
                            </div>
                          )}

                          {formData.role === "owner" && (
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Address</p>
                              <p className="text-sm font-medium text-gray-800">{formData.address}</p>
                            </div>
                          )}

                          {formData.interests && formData.interests.length > 0 && (
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Interests</p>
                              <div className="flex flex-wrap gap-1">
                                {formData.interests.map((interest) => (
                                  <span key={interest} className="px-2 py-1 bg-[#14b8a6]/10 text-[#0d9488] text-xs rounded-full font-medium">
                                    {interest}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {formData.bio && (
                        <div className="mt-4 pt-4 border-t border-[#99f6e4]/50">
                          <p className="text-xs text-gray-500 mb-1">Bio</p>
                          <p className="text-sm text-gray-700 italic">"{formData.bio}"</p>
                        </div>
                      )}
                    </motion.div>

                    {/* Terms and Conditions */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="space-y-4"
                    >
                      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-[#99f6e4]">
                        <label className="flex items-start gap-3 cursor-pointer group">
                          <div className="relative flex-shrink-0 mt-0.5">
                            <input
                              type="checkbox"
                              checked={formData.agreeToTerms}
                              onChange={(e) =>
                                updateFormData("agreeToTerms", e.target.checked)
                              }
                              className="w-5 h-5 rounded border-2 border-[#99f6e4] text-[#14b8a6] focus:ring-2 focus:ring-[#14b8a6]/20 cursor-pointer"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                              I agree to the{" "}
                              <button
                                type="button"
                                className="text-[#14b8a6] hover:text-[#0d9488] font-semibold underline"
                              >
                                Terms and Conditions
                              </button>
                              {" "}and{" "}
                              <button
                                type="button"
                                className="text-[#14b8a6] hover:text-[#0d9488] font-semibold underline"
                              >
                                Privacy Policy
                              </button>
                            </p>
                          </div>
                        </label>
                        {errors.agreeToTerms && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-2 text-sm text-red-600 flex items-center gap-1"
                          >
                            <AlertCircle className="w-4 h-4" />
                            {errors.agreeToTerms}
                          </motion.p>
                        )}
                      </div>

                      {/* Benefits Preview */}
                      <div className="bg-gradient-to-br from-[#14b8a6]/5 to-[#0d9488]/5 rounded-2xl p-6 border border-[#14b8a6]/20">
                        <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                          <Zap className="w-5 h-5 text-[#14b8a6]" />
                          What you'll get:
                        </h4>
                        <ul className="space-y-2">
                          {roles.find((r) => r.id === formData.role)?.benefits.map((benefit, idx) => (
                            <motion.li
                              key={idx}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              className="flex items-center gap-2 text-sm text-gray-700"
                            >
                              <CheckCircle2 className="w-4 h-4 text-[#14b8a6] flex-shrink-0" />
                              {benefit}
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex gap-4 mt-8">
                {step > 1 && (
                  <motion.button
                    type="button"
                    onClick={handleBack}
                    whileHover={{ scale: 1.02, x: -2 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isSubmitting}
                    className="flex-1 px-6 py-3 rounded-xl border-2 border-[#99f6e4] text-[#134e4a] font-semibold hover:bg-[#f0fdfa] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    Back
                  </motion.button>
                )}

                {step < 3 ? (
                  <motion.button
                    type="button"
                    onClick={handleNext}
                    whileHover={{ scale: 1.02, x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-[#14b8a6] to-[#0d9488] text-white font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                  >
                    Continue
                    <motion.div
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      →
                    </motion.div>
                  </motion.button>
                ) : (
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isSubmitting || !formData.agreeToTerms}
                    className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-[#14b8a6] to-[#0d9488] text-white font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Sparkles className="w-5 h-5" />
                        </motion.div>
                        Creating Account...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        Create Account
                      </>
                    )}
                  </motion.button>
                )}
              </div>

              {/* Sign In Link */}
              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="text-[#14b8a6] font-semibold hover:text-[#0d9488] transition-colors"
                  >
                    Sign In
                  </button>
                </p>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
