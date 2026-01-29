'use client';

import React, { useState, useEffect } from 'react';
import { UserRole, UserProfile } from '@/types';
import { MOCK_USERS, MOCK_ORGS } from '@/constants';
import Layout from '@/components/Layout';
import ManagerDashboard from '@/components/Dashboards/ManagerDashboard';
import UserDashboard from '@/components/Dashboards/UserDashboard';
import AuditorDashboard from '@/components/Dashboards/AuditorDashboard';
import GovernanceDashboard from '@/components/Dashboards/GovernanceDashboard';
import {
  ShieldAlert,
  LogIn,
  Building2,
  ArrowRight,
  ChevronLeft,
  Mail,
  Key,
  Code,
  Beaker,
  Palette,
  Eye,
  ShieldCheck,
  Sun,
  Moon,
  Globe,
  Database,
  CheckCircle2
} from 'lucide-react';
import GlassCard from '@/components/GlassCard';
import { Amplify } from 'aws-amplify';
import { signUp, confirmSignUp, signIn, signOut } from 'aws-amplify/auth';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_AWS_USER_POOL_ID || '',
      userPoolClientId: process.env.NEXT_PUBLIC_AWS_USER_POOL_CLIENT_ID || '',
    }
  }
});

type ViewState = 'LANDING' | 'ORG_SELECT' | 'ROLE_SELECT' | 'LOGIN' | 'REGISTER' | 'USER_REGISTER' | 'VERIFICATION' | 'DASHBOARD';

const ThemeToggle = ({ theme, toggle }: { theme: 'dark' | 'light', toggle: () => void }) => (
  <button
    onClick={toggle}
    className="fixed top-6 right-6 z-50 p-3 rounded-2xl glass hover:scale-110 transition-all active:scale-95 text-indigo-500"
    title="Toggle Light/Dark Mode"
  >
    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
  </button>
);

const LandingView = ({ onEnter, onRegister, onAdmin }: { onEnter: () => void, onRegister: () => void, onAdmin: () => void }) => (
  <div className="max-w-6xl w-full flex flex-col items-center gap-12 animate-in fade-in zoom-in duration-700">
    <div className="text-center space-y-4">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-2xl mb-4">
        <ShieldAlert className="text-white" size={40} />
      </div>
      <h1 className="text-5xl font-black tracking-tighter transition-colors">SecureSphere</h1>
      <p className="text-lg opacity-60 max-w-md mx-auto">Enterprise-grade encrypted file sharing and activity monitoring system.</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full px-6">
      <GlassCard className="flex flex-col items-center text-center p-8 group hover:border-indigo-500/40 transition-all cursor-pointer" onClick={onEnter}>
        <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
          <LogIn size={28} />
        </div>
        <h3 className="text-xl font-bold mb-2">Vault Login</h3>
        <p className="opacity-60 text-sm mb-6">Access your organization's secure file workspace and logs.</p>
        <button className="mt-auto w-full py-3 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center gap-2">
          Enter Vault <ArrowRight size={18} />
        </button>
      </GlassCard>

      <GlassCard className="flex flex-col items-center text-center p-8 group hover:border-purple-500/40 transition-all cursor-pointer" onClick={onRegister}>
        <div className="w-14 h-14 rounded-2xl bg-purple-500/20 flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition-transform">
          <Building2 size={28} />
        </div>
        <h3 className="text-xl font-bold mb-2">Onboard Org</h3>
        <p className="opacity-60 text-sm mb-6">Provision a new isolated environment for enterprise data management.</p>
        <button className="mt-auto w-full py-3 rounded-xl bg-white/5 border border-white/10 font-bold flex items-center justify-center gap-2 transition-colors">
          Register <ArrowRight size={18} />
        </button>
      </GlassCard>

      <GlassCard className="flex flex-col items-center text-center p-8 group hover:border-emerald-500/40 transition-all cursor-pointer" onClick={onAdmin}>
        <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
          <Globe size={28} />
        </div>
        <h3 className="text-xl font-bold mb-2">Governance Hub</h3>
        <p className="opacity-60 text-sm mb-6">Monitor all records, registrations, and cross-org activity.</p>
        <button className="mt-auto w-full py-3 rounded-xl bg-emerald-600/10 border border-emerald-500/30 text-emerald-400 font-bold flex items-center justify-center gap-2 hover:bg-emerald-600 hover:text-white transition-all">
          Platform Admin <ArrowRight size={18} />
        </button>
      </GlassCard>
    </div>
  </div>
);

const OrgSelectView = ({ onBack, onSelect }: { onBack: () => void, onSelect: (org: any) => void }) => (
  <div className="max-w-2xl w-full animate-in slide-in-from-bottom-8 duration-600 text-center">
    <button onClick={onBack} className="flex items-center gap-2 opacity-40 hover:opacity-100 mb-6 text-xs font-bold uppercase tracking-widest transition-all mx-auto">
      <ChevronLeft size={16} /> Back
    </button>
    <h2 className="text-3xl font-black mb-2">Select Organization</h2>
    <p className="opacity-40 mb-10">Which vault entity are you identifying with?</p>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {MOCK_ORGS.map((org) => (
        <div
          key={org.id} onClick={() => onSelect(org)}
          className="glass p-8 rounded-3xl border border-white/10 hover:border-indigo-500/50 hover:bg-white/5 cursor-pointer transition-all group flex flex-col items-center"
        >
          <div className={`w-16 h-16 rounded-2xl bg-indigo-500 flex items-center justify-center text-white font-black text-xl mb-4 shadow-xl group-hover:scale-110 transition-transform`}>
            {org.name.charAt(0)}
          </div>
          <h3 className="font-bold text-sm truncate w-full">{org.name}</h3>
          <span className="text-[10px] opacity-40 uppercase font-bold mt-2 tracking-widest">Enterprise</span>
        </div>
      ))}
    </div>
  </div>
);

const RoleSelectView = ({ org, onBack, onSelect }: { org: any, onBack: () => void, onSelect: (role: UserRole) => void }) => (
  <div className="max-w-3xl w-full animate-in zoom-in duration-500">
    <button onClick={onBack} className="flex items-center gap-2 opacity-40 hover:opacity-100 mb-6 text-xs font-bold uppercase tracking-widest transition-all">
      <ChevronLeft size={16} /> Change Organization
    </button>
    <div className="text-center mb-10">
      <h2 className="text-3xl font-black mb-2">Select Portal Mode</h2>
      <p className="opacity-40">Accessing <span className="text-indigo-500 font-bold">{org?.name}</span> infrastructure.</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <button onClick={() => onSelect(UserRole.MANAGER)} className="p-6 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 hover:bg-indigo-500/20 transition-all flex items-center gap-5 group text-left">
        <div className="w-12 h-12 rounded-xl bg-indigo-500 flex items-center justify-center text-white"><ShieldCheck size={24} /></div>
        <div><p className="font-bold text-lg">Manager</p><p className="text-xs opacity-40">Admin & Analytics</p></div>
      </button>
      <button onClick={() => onSelect(UserRole.AUDITOR)} className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 transition-all flex items-center gap-5 group text-left">
        <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center text-white"><Eye size={24} /></div>
        <div><p className="font-bold text-lg">Auditor</p><p className="text-xs opacity-40">Logs & Monitoring</p></div>
      </button>
      <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
        <button onClick={() => onSelect(UserRole.USER)} className="p-5 rounded-2xl glass border-white/10 hover:bg-indigo-500/10 transition-all text-center">
          <Code className="mx-auto mb-3 text-purple-400" size={32} />
          <p className="font-bold">Developer</p>
        </button>
        <button onClick={() => onSelect(UserRole.USER)} className="p-5 rounded-2xl glass border-white/10 hover:bg-indigo-500/10 transition-all text-center">
          <Beaker className="mx-auto mb-3 text-blue-400" size={32} />
          <p className="font-bold">Tester</p>
        </button>
        <button onClick={() => onSelect(UserRole.USER)} className="p-5 rounded-2xl glass border-white/10 hover:bg-indigo-500/10 transition-all text-center">
          <Palette className="mx-auto mb-3 text-pink-400" size={32} />
          <p className="font-bold">Designer</p>
        </button>
      </div>
    </div>
  </div>
);

const LoginView = ({
  org,
  role,
  onBack,
  onSubmit,
  onRegister,
  isProcessing,
  email,
  setEmail,
  password,
  setPassword,
  error
}: any) => (
  <div className="max-w-md w-full animate-in slide-in-from-right-8 duration-500">
    <button onClick={onBack} className="flex items-center gap-2 opacity-40 hover:opacity-100 mb-6 text-xs font-bold uppercase tracking-widest transition-all">
      <ChevronLeft size={16} /> Back
    </button>
    <GlassCard className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-1">Authorization</h2>
        <p className="opacity-40 text-sm">Logging into {org?.name || 'Platform'} as <span className="font-bold">{role}</span>.</p>
      </div>
      <form onSubmit={onSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <label className="text-[10px] font-black opacity-40 uppercase tracking-widest ml-1">Email</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 opacity-20" size={18} />
            <input
              type="email" required placeholder="admin@securesphere.com" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 outline-none focus:border-indigo-500/50 transition-all"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-black opacity-40 uppercase tracking-widest ml-1">Security Key</label>
          <div className="relative">
            <Key className="absolute left-4 top-1/2 -translate-y-1/2 opacity-20" size={18} />
            <input
              type="password" required placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 outline-none focus:border-indigo-500/50 transition-all"
            />
          </div>
        </div>
        {error && <p className="text-rose-400 text-xs font-medium bg-rose-500/10 p-3 rounded-lg border border-rose-500/20">{error}</p>}
        <button
          type="submit" disabled={isProcessing}
          className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all disabled:opacity-50"
        >
          {isProcessing ? 'Authenticating...' : 'Unlock Portal'}
        </button>
        <div className="text-center">
          <button type="button" onClick={onRegister} className="text-xs opacity-40 hover:opacity-100 hover:text-indigo-400 transition-all font-bold uppercase tracking-widest">
            Don't have an account? Register
          </button>
        </div>
      </form>
    </GlassCard>
  </div>
);

const UserRegisterView = ({ onBack, onSubmit, isProcessing }: any) => (
  <div className="max-w-md w-full animate-in slide-in-from-right-8 duration-500">
    <button onClick={onBack} className="flex items-center gap-2 opacity-40 hover:opacity-100 mb-6 text-xs font-bold uppercase tracking-widest transition-all">
      <ChevronLeft size={16} /> Back to Login
    </button>
    <GlassCard className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-1">Create Account</h2>
        <p className="opacity-40 text-sm">Register a new user profile.</p>
      </div>
      <form onSubmit={onSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <label className="text-[10px] font-black opacity-40 uppercase tracking-widest ml-1">Email</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 opacity-20" size={18} />
            <input
              type="email" name="email" required placeholder="user@company.com"
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 outline-none focus:border-indigo-500/50 transition-all"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-black opacity-40 uppercase tracking-widest ml-1">Password</label>
          <div className="relative">
            <Key className="absolute left-4 top-1/2 -translate-y-1/2 opacity-20" size={18} />
            <input
              type="password" name="password" required placeholder="Create a secure password"
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 outline-none focus:border-indigo-500/50 transition-all"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-black opacity-40 uppercase tracking-widest ml-1">Confirm Password</label>
          <div className="relative">
            <Key className="absolute left-4 top-1/2 -translate-y-1/2 opacity-20" size={18} />
            <input
              type="password" required placeholder="Confirm your password"
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 outline-none focus:border-indigo-500/50 transition-all"
            />
          </div>
        </div>

        <button
          type="submit" disabled={isProcessing}
          className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all disabled:opacity-50 mt-2"
        >
          {isProcessing ? 'Creating Account...' : 'Register'}
        </button>
      </form>
    </GlassCard>
  </div>
);

const VerificationView = ({ onBack, onSubmit, isProcessing, email }: any) => (
  <div className="max-w-md w-full animate-in slide-in-from-right-8 duration-500">
    <button onClick={onBack} className="flex items-center gap-2 opacity-40 hover:opacity-100 mb-6 text-xs font-bold uppercase tracking-widest transition-all">
      <ChevronLeft size={16} /> Back
    </button>
    <GlassCard className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-1">Verify Email</h2>
        <p className="opacity-40 text-sm">Enter the code sent to <span className="font-bold text-indigo-400">{email}</span></p>
      </div>
      <form onSubmit={onSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <label className="text-[10px] font-black opacity-40 uppercase tracking-widest ml-1">Verification Code</label>
          <div className="relative">
            <CheckCircle2 className="absolute left-4 top-1/2 -translate-y-1/2 opacity-20" size={18} />
            <input
              type="text" required placeholder="123456"
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 outline-none focus:border-indigo-500/50 transition-all text-center tracking-widest text-lg font-bold"
            />
          </div>
        </div>

        <button
          type="submit" disabled={isProcessing}
          className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all disabled:opacity-50 mt-2"
        >
          {isProcessing ? 'Verifying...' : 'Confirm Account'}
        </button>
      </form>
    </GlassCard>
  </div>
);

const RegisterView = ({ onBack, onSubmit, isProcessing }: any) => (
  <div className="max-w-xl w-full animate-in slide-in-from-right-8 duration-500">
    <button onClick={onBack} className="flex items-center gap-2 opacity-40 hover:opacity-100 mb-6 text-xs font-bold uppercase tracking-widest transition-all">
      <ChevronLeft size={16} /> Back
    </button>
    <GlassCard className="p-8">
      <h2 className="text-2xl font-bold mb-2">Organization Registration</h2>
      <p className="opacity-40 text-sm mb-8">Onboard your enterprise into the SecureSphere network.</p>
      <form onSubmit={onSubmit} className="space-y-4">
        <input name="orgName" required type="text" placeholder="Organization Legal Name" className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-4 outline-none focus:border-purple-500/50" />
        <input name="adminEmail" required type="email" placeholder="Administrator Work Email" className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-4 outline-none focus:border-purple-500/50" />
        <select name="industry" className="w-full bg-indigo-900/40 border border-white/10 rounded-xl py-3.5 px-4 outline-none text-inherit">
          <option className="text-slate-900">Financial Services</option>
          <option className="text-slate-900">Tech & Engineering</option>
          <option className="text-slate-900">Healthcare / Pharma</option>
        </select>
        <button type="submit" disabled={isProcessing} className="w-full py-4 rounded-xl bg-purple-600 text-white font-bold mt-4 shadow-xl shadow-purple-500/20 active:scale-95 transition-all">
          {isProcessing ? 'Processing Request...' : 'Submit Onboarding Request'}
        </button>
      </form>
    </GlassCard>
  </div>
);

export default function Home() {
  const [view, setView] = useState<ViewState>('LANDING');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [selectedOrg, setSelectedOrg] = useState<any>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isProcessing, setIsProcessing] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    if (theme === 'light') document.body.classList.add('light-mode');
    else document.body.classList.remove('light-mode');
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const [registerError, setRegisterError] = useState('');



  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setLoginError('');

    try {
      // Allow super admin login bypass (optional, keeping existing logic check)
      if (selectedRole === UserRole.SUPER_ADMIN && email === 'admin@securesphere.com' && password === 'admin123') {
        setUser(MOCK_USERS[0]);
        setView('DASHBOARD');
        setActiveTab('dashboard');
        setIsProcessing(false);
        return;
      }

      const { isSignedIn, nextStep } = await signIn({ username: email, password });

      if (isSignedIn) {
        // Check if user is pending approval (Simulated DB check)
        /* 
        const pendingRequests = JSON.parse(localStorage.getItem('pending_registrations') || '[]');
        const isPending = pendingRequests.find((r: any) => r.email === email && r.status === 'PENDING');

        if (isPending) {
          signOut();
          setLoginError('Account is pending Manager approval.');
          setIsProcessing(false);
          return;
        }
        */

        // In a real app, you'd fetch the user attributes here
        const mockUserForNow = MOCK_USERS.find(u => u.email === email) || {
          ...MOCK_USERS[0],
          name: email.split('@')[0],
          email: email,
          role: selectedRole || UserRole.USER,
          organization: selectedOrg?.name || 'Unknown Org'
        };

        setUser(mockUserForNow);
        setView('DASHBOARD');
        setActiveTab('dashboard');
      } else {
        if (nextStep.signInStep === 'CONFIRM_SIGN_UP') {
          setView('VERIFICATION');
        } else {
          setLoginError(`Additional step required: ${nextStep.signInStep}`);
        }
      }
    } catch (error: any) {
      console.error('Login error', error);
      setLoginError(error.message || 'Failed to login');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRegisterSubmit = async (e: any) => {
    e.preventDefault();
    setIsProcessing(true);
    setRegisterError('');

    const formData = new FormData(e.target);
    const regEmail = formData.get('email') as string || email;
    const regPass = formData.get('password') as string || password;

    setEmail(regEmail);

    // Generate Unique IDs
    const timestamp = Date.now().toString().slice(-4);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const newUserId = `USR-${timestamp}-${random}`;

    // Group ID based on Role and Org
    const rolePrefix = selectedRole ? selectedRole.substring(0, 3).toUpperCase() : 'USR';
    const orgPrefix = selectedOrg ? selectedOrg.name.substring(0, 3).toUpperCase() : 'UNK';
    const newGroupId = `GRP-${orgPrefix}-${rolePrefix}-${random}`;

    try {
      // 1. Register with Cognito (Sending custom attributes needs them to be mutable in AWS Console)
      await signUp({
        username: regEmail,
        password: regPass,
        options: {
          userAttributes: {
            email: regEmail,
            'custom:user_id': newUserId,
            'custom:group_id': newGroupId,
            'custom:org_id': selectedOrg?.id || 'org_unknown'
          }
        }
      });

      // 2. Simulate "Sending IDs to Email" logic
      alert(`System IDs Generated:\nUser ID: ${newUserId}\nGroup ID: ${newGroupId}\nOrganization ID: ${selectedOrg?.id}\n\nThese have been sent to ${regEmail}.`);

      // 3. Create a "Pending Request" for the Manager Dashboard (Simulated DB)
      const newRequest = {
        id: newUserId,
        email: regEmail,
        role: selectedRole,
        organization: selectedOrg?.name,
        groupId: newGroupId,
        timestamp: new Date().toISOString(),
        status: 'PENDING'
      };

      const existingRequests = JSON.parse(localStorage.getItem('pending_registrations') || '[]');
      localStorage.setItem('pending_registrations', JSON.stringify([...existingRequests, newRequest]));

      setView('VERIFICATION');
    } catch (error: any) {
      console.error('Registration error', error);
      // Fallback if custom attributes are not configured in the pool yet
      if (error.message.includes('attributes')) {
        alert('Registration failed due to missing custom attributes in Cognito Pool. Please ensure custom:user_id, custom:group_id, and custom:org_id are created in AWS Cognito Console. Falling back to standard registration for demo.');
        // Retry without custom attributes for demo continuity
        try {
          await signUp({ username: regEmail, password: regPass, options: { userAttributes: { email: regEmail } } });
          setView('VERIFICATION');
        } catch (retryError: any) {
          alert(retryError.message);
        }
      } else {
        alert(error.message || 'Registration failed');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleOrgOnboardSubmit = (e: any) => {
    e.preventDefault();
    setIsProcessing(true);

    const formData = new FormData(e.target);
    const orgName = formData.get('orgName') as string;
    const adminEmail = formData.get('adminEmail') as string;
    const industry = formData.get('industry') as string;

    // Generate Unique Org ID
    const timestamp = Date.now().toString().slice(-4);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');

    // ORG-IND-XXX
    const typeCode = industry.substring(0, 3).toUpperCase();
    const newOrgId = `ORG-${typeCode}-${timestamp}-${random}`;

    // Generate Admin ID
    const newAdminId = `ADM-${timestamp}-${random}`;

    setTimeout(() => {
      setIsProcessing(false);
      alert(`Organization Onboarding Successful!\n\nOrganization ID: ${newOrgId}\nAdmin ID: ${newAdminId}\n\nCredentials sent to ${adminEmail}. Please wait for Platform Admin approval.`);
      setView('LANDING');
    }, 1500);
  };

  const handleVerificationSubmit = async (e: any) => {
    e.preventDefault();
    setIsProcessing(true);
    const code = e.target[0].value; // First input is code

    try {
      await confirmSignUp({
        username: email,
        confirmationCode: code
      });
      alert('Verification successful! You can now login.');
      setView('LOGIN');
    } catch (error: any) {
      console.error('Verification error', error);
      alert(error.message || 'Verification failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (err) {
      console.log('Error signing out', err);
    }
    setUser(null);
    setSelectedOrg(null);
    setSelectedRole(null);
    setView('LANDING');
    setEmail('');
    setPassword('');
  };

  if (view !== 'DASHBOARD' || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 overflow-hidden">
        <ThemeToggle theme={theme} toggle={toggleTheme} />
        {view === 'LANDING' && (
          <LandingView
            onEnter={() => setView('ORG_SELECT')}
            onRegister={() => setView('REGISTER')}
            onAdmin={() => { setSelectedRole(UserRole.SUPER_ADMIN); setView('LOGIN'); }}
          />
        )}
        {view === 'ORG_SELECT' && (
          <OrgSelectView onBack={() => setView('LANDING')} onSelect={(org) => { setSelectedOrg(org); setView('ROLE_SELECT'); }} />
        )}
        {view === 'ROLE_SELECT' && (
          <RoleSelectView org={selectedOrg} onBack={() => setView('ORG_SELECT')} onSelect={(role) => { setSelectedRole(role); setView('LOGIN'); }} />
        )}
        {view === 'LOGIN' && (
          <LoginView
            org={selectedOrg} role={selectedRole} email={email} setEmail={setEmail}
            password={password} setPassword={setPassword} error={loginError} isProcessing={isProcessing}
            onBack={() => selectedRole === UserRole.SUPER_ADMIN ? setView('LANDING') : setView('ROLE_SELECT')}
            onRegister={() => setView('USER_REGISTER')}
            onSubmit={handleLoginSubmit}
          />
        )}
        {view === 'USER_REGISTER' && (
          <UserRegisterView
            onBack={() => setView('LOGIN')}
            onSubmit={handleRegisterSubmit}
            isProcessing={isProcessing}
          />
        )}
        {view === 'VERIFICATION' && (
          <VerificationView
            onBack={() => setView('USER_REGISTER')}
            onSubmit={handleVerificationSubmit}
            isProcessing={isProcessing}
            email={email}
          />
        )}
        {view === 'REGISTER' && (
          <RegisterView
            onBack={() => setView('LANDING')}
            onSubmit={handleOrgOnboardSubmit}
            isProcessing={isProcessing}
          />
        )}
      </div>
    );
  }

  const renderDashboard = () => {
    switch (user.role) {
      case UserRole.SUPER_ADMIN: return <GovernanceDashboard />;
      case UserRole.MANAGER: return <ManagerDashboard />;
      case UserRole.AUDITOR: return <AuditorDashboard />;
      case UserRole.USER: return <UserDashboard />;
      default: return <div className="p-10">Access Denied</div>;
    }
  };

  return (
    <Layout user={user} activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} theme={theme} toggleTheme={toggleTheme}>
      {activeTab === 'dashboard' ? renderDashboard() : (
        <div className="py-20 text-center opacity-40">
          <h3 className="text-2xl font-bold mb-2">Module Partition: {activeTab.toUpperCase()}</h3>
          <p className="font-medium">Accessing encrypted storage partitions.</p>
        </div>
      )}
    </Layout>
  );
}
