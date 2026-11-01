import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  User, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  Sparkles, 
  Wrench, 
  MapPin, 
  Smartphone,
  LogOut,
  AlertCircle
} from 'lucide-react';
import { AuthUser, saveUserSession, clearUserSession } from '../utils/auth';
import { CITIES } from '../components/Navbar';

interface SignInPageProps {
  currentUser: AuthUser | null;
  setCurrentUser: (user: AuthUser | null) => void;
  onNavigateAfterLogin: (tab: string) => void;
  selectedCity: string;
}

export const SignInPage: React.FC<SignInPageProps> = ({
  currentUser,
  setCurrentUser,
  onNavigateAfterLogin,
  selectedCity,
}) => {
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<AuthUser['role']>('Consumer / Device Owner');
  const [city, setCity] = useState(selectedCity || 'Indore');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  
  // State
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  // Quick Instant Fill
  const handleQuickSignIn = (roleType: 'technician' | 'consumer') => {
    setLoading(true);
    setErrorMessage('');
    setTimeout(() => {
      let user: AuthUser;
      if (roleType === 'technician') {
        user = {
          id: 'usr-tech-01',
          fullName: 'Vikramaditya Sharma',
          email: 'vikram.tech@revtech.in',
          role: 'Hardware Repair Technician',
          city: selectedCity,
          memberSince: 'March 2023',
          verifiedAccount: true,
        };
      } else {
        user = {
          id: 'usr-cons-02',
          fullName: 'Samarth Batra',
          email: 'samarth.batra@revtech.in',
          role: 'Consumer / Device Owner',
          city: selectedCity,
          memberSince: 'October 2023',
          verifiedAccount: true,
        };
      }
      saveUserSession(user);
      setCurrentUser(user);
      setLoading(false);
      setSuccessMessage(`Welcome back, ${user.fullName}!`);
      setTimeout(() => {
        onNavigateAfterLogin('garage');
      }, 700);
    }, 450);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email || !password) {
      setErrorMessage('Please provide both email address and password.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const user: AuthUser = {
        id: `usr-${Date.now()}`,
        fullName: authMode === 'signup' ? (fullName.trim() || 'RevTech Member') : (email.split('@')[0].replace(/[._]/g, ' ') || 'RevTech Member'),
        email: email.toLowerCase().trim(),
        role: authMode === 'signup' ? role : 'Consumer / Device Owner',
        city,
        memberSince: 'Today',
        verifiedAccount: true,
      };

      saveUserSession(user);
      setCurrentUser(user);
      setLoading(false);
      setSuccessMessage(authMode === 'signup' ? 'Account created successfully! Syncing your garage...' : `Signed in as ${user.fullName}`);
      setTimeout(() => {
        onNavigateAfterLogin('garage');
      }, 700);
    }, 500);
  };

  const handleSignOut = () => {
    clearUserSession();
    setCurrentUser(null);
    setSuccessMessage('You have been signed out successfully.');
  };

  const handleSocialAuth = (provider: 'Google' | 'Apple') => {
    setLoading(true);
    setTimeout(() => {
      const user: AuthUser = {
        id: `usr-${provider.toLowerCase()}-${Date.now()}`,
        fullName: provider === 'Google' ? 'Samarth Batra (Google)' : 'Samarth Batra (Apple)',
        email: provider === 'Google' ? 'samarthbatra264@gmail.com' : 'samarth.apple@privaterelay.appleid.com',
        role: 'Consumer / Device Owner',
        city: selectedCity,
        memberSince: 'Today',
        verifiedAccount: true,
      };
      saveUserSession(user);
      setCurrentUser(user);
      setLoading(false);
      setSuccessMessage(`Authenticated via ${provider}!`);
      setTimeout(() => {
        onNavigateAfterLogin('garage');
      }, 700);
    }, 400);
  };

  const handlePasswordResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setResetSent(true);
  };

  // If already logged in, show user profile card with actions
  if (currentUser) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="bg-white rounded-3xl border border-[#DCE4DC] p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 pb-6 border-b border-[#EFF3EE]">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-2xl bg-[#174C3C] text-white flex items-center justify-center text-xl font-bold font-mono shadow-md">
                {currentUser.fullName.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-xl font-bold text-[#10382D]">{currentUser.fullName}</h2>
                  {currentUser.verifiedAccount && (
                    <span className="px-2 py-0.5 rounded-full bg-[#EEF5EF] text-[#23734D] text-[10px] font-bold border border-[#DCE9DF]">
                      Verified
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#5D6B63]">{currentUser.email}</p>
                <p className="text-[11px] text-[#78857D] mt-0.5">
                  Member since {currentUser.memberSince} • {currentUser.city} Hub
                </p>
              </div>
            </div>

            <button
              onClick={handleSignOut}
              className="py-2 px-3.5 bg-[#F8FAF7] hover:bg-[#EEF5EF] text-[#B42318] border border-[#DCE4DC] rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>

          {/* Account Tier & Perks */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-[#F8FAF7] border border-[#EFF3EE] space-y-1">
              <span className="text-[#78857D] font-bold uppercase tracking-wider text-[10px] block">
                Account Role
              </span>
              <p className="font-extrabold text-[#10382D]">{currentUser.role}</p>
            </div>
            <div className="p-4 rounded-xl bg-[#F8FAF7] border border-[#EFF3EE] space-y-1">
              <span className="text-[#78857D] font-bold uppercase tracking-wider text-[10px] block">
                Synced Hardware Fleet
              </span>
              <p className="font-extrabold text-[#174C3C]">Active in Garage</p>
            </div>
            <div className="p-4 rounded-xl bg-[#F8FAF7] border border-[#EFF3EE] space-y-1">
              <span className="text-[#78857D] font-bold uppercase tracking-wider text-[10px] block">
                Repair Intelligence Tier
              </span>
              <p className="font-extrabold text-[#23734D]">RevTech Pro Access</p>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => onNavigateAfterLogin('garage')}
              className="flex-1 py-3 bg-[#174C3C] text-white text-xs font-bold rounded-xl hover:bg-[#10382D] transition-colors flex items-center justify-center space-x-1.5"
            >
              <Smartphone className="w-4 h-4" />
              <span>Go to My Devices Garage</span>
            </button>
            <button
              onClick={() => onNavigateAfterLogin('ai-agent')}
              className="flex-1 py-3 bg-[#EEF5EF] text-[#174C3C] text-xs font-bold rounded-xl hover:bg-[#DCE9DF] transition-colors flex items-center justify-center space-x-1.5"
            >
              <Sparkles className="w-4 h-4 text-[#174C3C]" />
              <span>Launch RevTech AI Advisor</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        
        {/* Left Side: Brand Value Proposition & Trust Badges */}
        <div className="lg:col-span-6 space-y-8">
          
          <div>
            <div className="inline-flex items-center space-x-2 text-xs font-bold text-[#174C3C] uppercase tracking-wider px-3 py-1 bg-[#EEF5EF] border border-[#DCE9DF] rounded-full mb-3">
              <ShieldCheck className="w-4 h-4 text-[#174C3C]" />
              <span>RevTech Secure Consumer Portal</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#10382D] tracking-tight leading-tight">
              Sign in to manage your devices, parts, and repair economics.
            </h1>
            <p className="text-sm text-[#5D6B63] mt-3 leading-relaxed">
              Create an account or sign in to synchronize your smartphone maintenance history, access trade discounts on OEM spare parts, and save custom RevTech AI decision reports.
            </p>
          </div>

          {/* Key Member Perks */}
          <div className="space-y-3.5">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-xl bg-[#EEF5EF] text-[#174C3C] flex items-center justify-center shrink-0 mt-0.5">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#10382D]">Cloud-Synced Device Garage</h4>
                <p className="text-[11px] text-[#5D6B63] leading-relaxed">
                  Log your smartphone purchase date, track battery health intervals, and monitor total cost-per-day.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-xl bg-[#EEF5EF] text-[#174C3C] flex items-center justify-center shrink-0 mt-0.5">
                <Wrench className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#10382D]">Verified Technician & Distributor Rates</h4>
                <p className="text-[11px] text-[#5D6B63] leading-relaxed">
                  Registered technicians unlock distributor catalog prices across Silver Mall, Orbit Mall, and Yashwant Plaza.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-xl bg-[#EEF5EF] text-[#174C3C] flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#10382D]">Personalized AI Decision Audits</h4>
                <p className="text-[11px] text-[#5D6B63] leading-relaxed">
                  Archive multiple Repair vs Replace scenarios and download binding written quote checklists.
                </p>
              </div>
            </div>
          </div>

          {/* Fast One-Click Demo Logins for Hackathon Evaluators */}
          <div className="p-4 rounded-2xl bg-[#EEF5EF] border border-[#DCE9DF] space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#174C3C] block">
              1-Click Instant Evaluator Sign-In
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleQuickSignIn('consumer')}
                className="py-1.5 px-3 bg-white hover:bg-[#DCE9DF] text-[#10382D] border border-[#DCE4DC] text-xs font-bold rounded-lg transition-colors flex items-center space-x-1"
              >
                <span>Sign in as Consumer (Samarth)</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickSignIn('technician')}
                className="py-1.5 px-3 bg-[#174C3C] hover:bg-[#10382D] text-white text-xs font-bold rounded-lg transition-colors flex items-center space-x-1"
              >
                <span>Sign in as Technician (Vikram)</span>
              </button>
            </div>
          </div>

        </div>

        {/* Right Side: Auth Form Card */}
        <div className="lg:col-span-6">
          <div className="bg-white rounded-3xl border border-[#DCE4DC] p-6 sm:p-8 shadow-sm space-y-6">
            
            {/* Tab Switcher: Sign In vs Sign Up */}
            <div className="grid grid-cols-2 p-1 bg-[#F8FAF7] rounded-xl border border-[#DCE4DC]">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('signin');
                  setErrorMessage('');
                  setSuccessMessage('');
                }}
                className={`py-2 text-xs font-bold rounded-lg transition-all ${
                  authMode === 'signin'
                    ? 'bg-white text-[#10382D] shadow-xs'
                    : 'text-[#78857D] hover:text-[#10382D]'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('signup');
                  setErrorMessage('');
                  setSuccessMessage('');
                }}
                className={`py-2 text-xs font-bold rounded-lg transition-all ${
                  authMode === 'signup'
                    ? 'bg-white text-[#10382D] shadow-xs'
                    : 'text-[#78857D] hover:text-[#10382D]'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Social Logins */}
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleSocialAuth('Google')}
                  className="py-2.5 px-3 bg-[#F8FAF7] hover:bg-[#EEF5EF] border border-[#DCE4DC] rounded-xl text-xs font-bold text-[#1B2722] flex items-center justify-center space-x-2 transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSocialAuth('Apple')}
                  className="py-2.5 px-3 bg-[#F8FAF7] hover:bg-[#EEF5EF] border border-[#DCE4DC] rounded-xl text-xs font-bold text-[#1B2722] flex items-center justify-center space-x-2 transition-colors"
                >
                  <svg className="w-4 h-4 fill-current text-black" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.87c.65-.79 1.1-1.89.98-2.99-.95.04-2.1.64-2.77 1.43-.59.68-1.12 1.79-.98 2.87 1.06.08 2.14-.54 2.77-1.31z" />
                  </svg>
                  <span>Apple ID</span>
                </button>
              </div>

              <div className="relative flex py-2 items-center">
                <div className="grow border-t border-[#EFF3EE]"></div>
                <span className="shrink mx-3 text-[10px] uppercase font-bold text-[#78857D]">
                  or with email credentials
                </span>
                <div className="grow border-t border-[#EFF3EE]"></div>
              </div>
            </div>

            {/* Error or Success notification */}
            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
            {successMessage && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              {/* Full Name (Sign Up only) */}
              {authMode === 'signup' && (
                <div>
                  <label className="font-bold text-[#78857D] uppercase tracking-wider block mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#78857D] absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Samarth Batra"
                      className="w-full font-semibold bg-[#F8FAF7] border border-[#DCE4DC] rounded-xl pl-9 pr-3 py-2 text-[#10382D] focus:border-[#174C3C]"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Email Address */}
              <div>
                <label className="font-bold text-[#78857D] uppercase tracking-wider block mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#78857D] absolute left-3 top-2.5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@domain.com"
                    className="w-full font-semibold bg-[#F8FAF7] border border-[#DCE4DC] rounded-xl pl-9 pr-3 py-2 text-[#10382D] focus:border-[#174C3C]"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-[#78857D] uppercase tracking-wider">
                    Password
                  </label>
                  {authMode === 'signin' && (
                    <button
                      type="button"
                      onClick={() => {
                        setShowForgotPasswordModal(true);
                        setForgotEmail(email);
                        setResetSent(false);
                      }}
                      className="text-[11px] font-semibold text-[#174C3C] hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#78857D] absolute left-3 top-2.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full font-semibold bg-[#F8FAF7] border border-[#DCE4DC] rounded-xl pl-9 pr-9 py-2 text-[#10382D] focus:border-[#174C3C]"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-[#78857D] hover:text-[#10382D]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Role & City (Sign Up only) */}
              {authMode === 'signup' && (
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="font-bold text-[#78857D] uppercase tracking-wider block mb-1">
                      Account Type
                    </label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as any)}
                      className="w-full font-semibold bg-[#F8FAF7] border border-[#DCE4DC] rounded-xl px-2.5 py-2 text-[#10382D]"
                    >
                      <option value="Consumer / Device Owner">Consumer</option>
                      <option value="Hardware Repair Technician">Technician</option>
                      <option value="Spare Parts Stockist">Stockist</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-[#78857D] uppercase tracking-wider block mb-1">
                      City Hub
                    </label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full font-semibold bg-[#F8FAF7] border border-[#DCE4DC] rounded-xl px-2.5 py-2 text-[#10382D]"
                    >
                      {CITIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Remember Me Checkbox */}
              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-[#DCE4DC] text-[#174C3C] focus:ring-[#174C3C]"
                />
                <label htmlFor="rememberMe" className="text-xs text-[#5D6B63] cursor-pointer">
                  Remember this device for 30 days
                </label>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#174C3C] hover:bg-[#10382D] text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <span>{loading ? 'Authenticating...' : authMode === 'signin' ? 'Sign In to RevTech' : 'Create Free Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </form>

            <div className="text-center text-[11px] text-[#78857D]">
              By signing in, you agree to RevTech's{' '}
              <span className="text-[#174C3C] underline cursor-pointer">Consumer Data Privacy Policy</span>{' '}
              and Right to Repair Standards.
            </div>

          </div>
        </div>

      </div>

      {/* Forgot Password Modal */}
      {showForgotPasswordModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#DCE4DC] space-y-4 animate-in fade-in zoom-in-95">
            <h3 className="text-base font-bold text-[#10382D]">Reset RevTech Account Password</h3>
            <p className="text-xs text-[#5D6B63]">
              Enter your registered email address. We will simulate sending a secure reset link.
            </p>

            {resetSent ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2 text-xs text-emerald-900">
                <div className="flex items-center space-x-1.5 font-bold text-[#23734D]">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Password Reset Link Dispatched</span>
                </div>
                <p>
                  A recovery link has been sent to <strong>{forgotEmail}</strong>. In production, check your inbox within 2 minutes.
                </p>
                <button
                  type="button"
                  onClick={() => setShowForgotPasswordModal(false)}
                  className="w-full mt-2 py-2 bg-[#174C3C] text-white font-bold rounded-xl text-xs"
                >
                  Back to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handlePasswordResetSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-[#78857D] block mb-1">Email Address</label>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="name@domain.com"
                    className="w-full font-semibold bg-[#F8FAF7] border border-[#DCE4DC] rounded-xl px-3 py-2 text-[#10382D]"
                    required
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-[#174C3C] text-white font-bold rounded-xl hover:bg-[#10382D]"
                  >
                    Send Recovery Email
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForgotPasswordModal(false)}
                    className="px-4 py-2.5 bg-[#EFF3EE] text-[#5D6B63] font-bold rounded-xl"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
