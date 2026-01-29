
import React, { useState, useEffect } from 'react';
import GlassCard from '../GlassCard';
import { MOCK_FILES } from '../../constants';
import {
  Upload,
  FileText,
  Download,
  Share2,
  MoreVertical,
  Search,
  Plus,
  CheckCircle,
  Inbox,
  ArrowDownToLine,
  MailCheck,
  ShieldCheck,
  Lock,
  Stamp,
  RefreshCcw,
  X,
  Bug,
  ShieldAlert,
  Ban,
  UserCheck,
  Building,
  KeyRound,
  Send
} from 'lucide-react';

type UploadStep = 'IDLE' | 'SCANNING' | 'ENCRYPTING' | 'WATERMARKING' | 'UPLOADING' | 'COMPLETE' | 'ERROR';

interface SessionLog {
  id: string;
  fileName: string;
  status: 'Clean' | 'Infected';
  timestamp: string;
}

const UserDashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [acknowledgedFiles, setAcknowledgedFiles] = useState<Set<string>>(new Set());
  const [receivedFiles, setReceivedFiles] = useState<Set<string>>(new Set());

  // Upload Wizard State
  const [uploadStep, setUploadStep] = useState<UploadStep>('IDLE');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [simulateInfection, setSimulateInfection] = useState(false);
  const [sessionLogs, setSessionLogs] = useState<SessionLog[]>([]);

  // Share Modal State
  const [showShareModal, setShowShareModal] = useState(false);
  const [fileToShare, setFileToShare] = useState<string | null>(null);
  const [shareFormData, setShareFormData] = useState({
    orgId: '',
    receiverOrgId: '',
    userId: '',
    encryptionText: ''
  });

  const startUpload = () => {
    setUploadStep('SCANNING');
    setUploadProgress(0);
  };

  useEffect(() => {
    let interval: any;
    if (uploadStep !== 'IDLE' && uploadStep !== 'COMPLETE' && uploadStep !== 'ERROR') {
      interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            if (uploadStep === 'SCANNING') {
              if (simulateInfection) {
                setUploadStep('ERROR');
                setSessionLogs(prev => [{
                  id: Math.random().toString(36),
                  fileName: 'Suspicious_Payload.zip',
                  status: 'Infected',
                  timestamp: new Date().toLocaleTimeString()
                }, ...prev]);
                return 0;
              }
              setUploadStep('ENCRYPTING');
            }
            else if (uploadStep === 'ENCRYPTING') setUploadStep('WATERMARKING');
            else if (uploadStep === 'WATERMARKING') setUploadStep('UPLOADING');
            else if (uploadStep === 'UPLOADING') {
              setUploadStep('COMPLETE');
              setSessionLogs(prev => [{
                id: Math.random().toString(36),
                fileName: 'Secure_Asset_Final.pdf',
                status: 'Clean',
                timestamp: new Date().toLocaleTimeString()
              }, ...prev]);
            }
            return 0;
          }
          return prev + 10;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [uploadStep, simulateInfection]);

  const toggleAcknowledge = (id: string) => {
    const next = new Set(acknowledgedFiles);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setAcknowledgedFiles(next);
  };

  const toggleReceive = (id: string) => {
    const next = new Set(receivedFiles);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setReceivedFiles(next);
  };

  const filteredFiles = MOCK_FILES.filter(f =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleShare = (fileName: string) => {
    setFileToShare(fileName);
    setShareFormData({ orgId: '', receiverOrgId: '', userId: '', encryptionText: '' });
    setShowShareModal(true);
  };

  const submitShare = (e: React.FormEvent) => {
    e.preventDefault();
    setShowShareModal(false);
    alert(`Securely encrypted and shared ${fileToShare} with User ${shareFormData.userId} (Org: ${shareFormData.receiverOrgId})`);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Upload Wizard Modal */}
      {uploadStep !== 'IDLE' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <GlassCard className={`max-w-md w-full p-8 transition-all duration-500 shadow-2xl ${uploadStep === 'ERROR' ? 'border-rose-500/50 shadow-rose-500/10' : 'border-indigo-500/30 shadow-indigo-500/10'}`}>
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${uploadStep === 'ERROR' ? 'bg-rose-500/20 text-rose-500' : 'bg-indigo-500/20 text-indigo-400'}`}>
                  {uploadStep === 'ERROR' ? <ShieldAlert size={20} /> : <RefreshCcw size={20} className="animate-spin" />}
                </div>
                <h3 className="text-xl font-bold">Security Pipeline</h3>
              </div>
              {(uploadStep === 'COMPLETE' || uploadStep === 'ERROR') && (
                <button onClick={() => setUploadStep('IDLE')} className="text-white/40 hover:text-white transition-colors"><X size={20} /></button>
              )}
            </div>

            <div className="space-y-6 relative">
              <div className="absolute left-5 top-5 bottom-5 w-[1px] bg-white/5 z-0" />

              {/* Step 1: Scan */}
              <div className={`flex items-center gap-4 relative z-10 transition-all ${uploadStep === 'SCANNING' ? 'scale-105' : ''}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${uploadStep === 'SCANNING' ? 'bg-indigo-500 border-indigo-400 animate-pulse' :
                  (['ENCRYPTING', 'WATERMARKING', 'UPLOADING', 'COMPLETE'].includes(uploadStep) ? 'bg-emerald-500 border-emerald-400' :
                    (uploadStep === 'ERROR' ? 'bg-rose-500 border-rose-400' : 'bg-white/5 border-white/10 opacity-40'))
                  }`}>
                  {uploadStep === 'ERROR' ? <Bug size={20} /> : (['ENCRYPTING', 'WATERMARKING', 'UPLOADING', 'COMPLETE'].includes(uploadStep) ? <CheckCircle size={20} /> : <ShieldCheck size={20} />)}
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-bold ${uploadStep === 'ERROR' ? 'text-rose-400' : 'text-white'}`}>1. Malware Analysis</p>
                  <p className="text-xs opacity-50">GuardDuty & ClamAV Engine</p>
                </div>
              </div>

              {/* Sequential blocking logic */}
              <div className={`flex items-center gap-4 relative z-10 transition-all ${uploadStep === 'ERROR' ? 'opacity-20 grayscale' : (uploadStep === 'ENCRYPTING' ? 'scale-105' : 'opacity-40')}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${uploadStep === 'ENCRYPTING' ? 'bg-indigo-500 border-indigo-400 animate-pulse opacity-100' :
                  (['WATERMARKING', 'UPLOADING', 'COMPLETE'].includes(uploadStep) ? 'bg-emerald-500 border-emerald-400 opacity-100' : 'bg-white/5 border-white/10')
                  }`}>
                  {['WATERMARKING', 'UPLOADING', 'COMPLETE'].includes(uploadStep) ? <CheckCircle size={20} /> : <Lock size={20} />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold">2. AES-256-GCM Vault</p>
                  <p className="text-xs opacity-50">Cryptographic Locking</p>
                </div>
                {uploadStep === 'ERROR' && <Ban size={16} className="text-rose-500 ml-auto" />}
              </div>

              <div className={`flex items-center gap-4 relative z-10 transition-all ${uploadStep === 'ERROR' ? 'opacity-20 grayscale' : (uploadStep === 'WATERMARKING' ? 'scale-105' : 'opacity-40')}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${uploadStep === 'WATERMARKING' ? 'bg-indigo-500 border-indigo-400 animate-pulse opacity-100' :
                  (['UPLOADING', 'COMPLETE'].includes(uploadStep) ? 'bg-emerald-500 border-emerald-400 opacity-100' : 'bg-white/5 border-white/10')
                  }`}>
                  {['UPLOADING', 'COMPLETE'].includes(uploadStep) ? <CheckCircle size={20} /> : <Stamp size={20} />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold">3. Ownership Stamp</p>
                  <p className="text-xs opacity-50">Dynamic Org Watermark</p>
                </div>
                {uploadStep === 'ERROR' && <Ban size={16} className="text-rose-500 ml-auto" />}
              </div>

              <div className={`flex items-center gap-4 relative z-10 transition-all ${uploadStep === 'ERROR' ? 'opacity-20 grayscale' : (uploadStep === 'UPLOADING' ? 'scale-105' : 'opacity-40')}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${uploadStep === 'UPLOADING' ? 'bg-indigo-500 border-indigo-400 animate-pulse opacity-100' :
                  (uploadStep === 'COMPLETE' ? 'bg-emerald-500 border-emerald-400 opacity-100' : 'bg-white/5 border-white/10')
                  }`}>
                  {uploadStep === 'COMPLETE' ? <CheckCircle size={20} /> : <Upload size={20} />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold">4. Cloud Finalization</p>
                  <p className="text-xs opacity-50">Storage in Isolated S3</p>
                </div>
                {uploadStep === 'ERROR' && <Ban size={16} className="text-rose-500 ml-auto" />}
              </div>
            </div>

            <div className="mt-10">
              <div className={`w-full h-2 rounded-full overflow-hidden ${uploadStep === 'ERROR' ? 'bg-rose-900/20' : 'bg-white/10'}`}>
                <div
                  className={`h-full transition-all duration-300 ease-linear ${uploadStep === 'ERROR' ? 'bg-rose-500 w-full' : 'bg-indigo-500'}`}
                  style={{ width: uploadStep === 'COMPLETE' || uploadStep === 'ERROR' ? '100%' : `${uploadProgress}%` }}
                />
              </div>
              <div className="flex items-center justify-center gap-2 mt-4">
                {uploadStep === 'ERROR' && <ShieldAlert size={14} className="text-rose-400" />}
                <p className={`text-xs uppercase font-black tracking-widest text-center ${uploadStep === 'ERROR' ? 'text-rose-400' : 'text-indigo-400'}`}>
                  {uploadStep === 'COMPLETE' ? 'Secure Transfer Successful' :
                    uploadStep === 'ERROR' ? 'Infection Blocked - Access Denied' :
                      `Step ${['SCANNING', 'ENCRYPTING', 'WATERMARKING', 'UPLOADING'].indexOf(uploadStep) + 1} In Progress...`}
                </p>
              </div>
            </div>

            {(uploadStep === 'COMPLETE' || uploadStep === 'ERROR') && (
              <button
                onClick={() => setUploadStep('IDLE')}
                className={`w-full mt-8 py-4 rounded-2xl text-white font-bold transition-all shadow-xl active:scale-95 ${uploadStep === 'ERROR' ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-500/20' : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/20'
                  }`}
              >
                {uploadStep === 'ERROR' ? 'Discard Malicious File' : 'Continue to Workspace'}
              </button>
            )}
          </GlassCard>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <GlassCard className="max-w-md w-full p-8 border-purple-500/30 shadow-2xl shadow-purple-500/10">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
                  <Share2 size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Secure Share</h3>
                  <p className="text-xs opacity-50">Encrypting: {fileToShare}</p>
                </div>
              </div>
              <button onClick={() => setShowShareModal(false)} className="text-white/40 hover:text-white transition-colors"><X size={20} /></button>
            </div>

            <form onSubmit={submitShare} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black opacity-40 uppercase tracking-widest ml-1">Org ID</label>
                <div className="relative">
                  <Building size={16} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" />
                  <input
                    required
                    type="text"
                    placeholder="Source Organization ID"
                    value={shareFormData.orgId}
                    onChange={e => setShareFormData({ ...shareFormData, orgId: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-purple-500/50 transition-all text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black opacity-40 uppercase tracking-widest ml-1">Receiver Org ID</label>
                <div className="relative">
                  <Building size={16} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" />
                  <input
                    required
                    type="text"
                    placeholder="Target Organization ID"
                    value={shareFormData.receiverOrgId}
                    onChange={e => setShareFormData({ ...shareFormData, receiverOrgId: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-purple-500/50 transition-all text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black opacity-40 uppercase tracking-widest ml-1">User ID</label>
                <div className="relative">
                  <UserCheck size={16} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" />
                  <input
                    required
                    type="text"
                    placeholder="Recipient User ID"
                    value={shareFormData.userId}
                    onChange={e => setShareFormData({ ...shareFormData, userId: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-purple-500/50 transition-all text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black opacity-40 uppercase tracking-widest ml-1">Encryption Key / Note</label>
                <div className="relative">
                  <KeyRound size={16} className="absolute left-4 top-3 opacity-30" />
                  <textarea
                    required
                    rows={3}
                    placeholder="Enter custom encryption key or secure note..."
                    value={shareFormData.encryptionText}
                    onChange={e => setShareFormData({ ...shareFormData, encryptionText: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-purple-500/50 transition-all text-sm resize-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-4 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition-all shadow-xl shadow-purple-500/20 active:scale-95 flex items-center justify-center gap-2"
              >
                <Send size={18} /> Encrypt & Share
              </button>
            </form>
          </GlassCard>
        </div>
      )}

      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Secure Workspace</h2>
          <p className="opacity-40 text-sm">Centralized vault for organizational file operations.</p>
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer glass px-3 py-2 rounded-xl border border-white/10 hover:bg-white/10 transition-all">
            <input
              type="checkbox"
              checked={simulateInfection}
              onChange={() => setSimulateInfection(!simulateInfection)}
              className="w-4 h-4 rounded border-white/20 bg-black/40 text-rose-500 focus:ring-rose-500/30"
            />
            <span className="text-[10px] font-black opacity-60 uppercase tracking-widest flex items-center gap-2">
              <Bug size={14} className={simulateInfection ? 'text-rose-500' : 'text-inherit'} />
              Simulate Infection
            </span>
          </label>
          <button
            onClick={startUpload}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all shadow-xl shadow-indigo-500/20 active:scale-95"
          >
            <Plus size={20} /> Safe Upload
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-6">
          {/* Search Bar */}
          <div className="flex items-center gap-4 glass px-4 py-2 rounded-2xl border border-white/10 shadow-inner">
            <Search className="opacity-40" size={20} />
            <input
              type="text"
              placeholder="Search in vault..."
              className="bg-transparent border-none outline-none w-full py-2 placeholder:opacity-20 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Shared with Me Section */}
          <GlassCard title="Shared with Me" className="border-indigo-500/20">
            <div className="space-y-4">
              {MOCK_FILES.filter(f => f.uploaderName !== 'John Dev').map((file) => (
                <div key={file.id} className="p-4 rounded-2xl glass border border-white/5 hover:border-indigo-500/30 transition-all flex flex-col sm:flex-row sm:items-center gap-4 group">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500 group-hover:bg-purple-500/20 transition-colors">
                      <Inbox size={24} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold truncate text-sm">{file.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="opacity-40 text-xs uppercase tracking-tighter font-bold">From: {file.uploaderName}</p>
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1 font-black">
                          <Lock size={10} /> AES-256-GCM
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleReceive(file.id)}
                      className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${receivedFiles.has(file.id) ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-white/5 border border-white/10 opacity-60 hover:opacity-100 hover:bg-white/10'}`}
                    >
                      {receivedFiles.has(file.id) ? <MailCheck size={14} /> : <ArrowDownToLine size={14} />}
                      {receivedFiles.has(file.id) ? 'Received' : 'Receive'}
                    </button>
                    <button
                      onClick={() => toggleAcknowledge(file.id)}
                      className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${acknowledgedFiles.has(file.id) ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'bg-white/5 border border-white/10 opacity-60 hover:opacity-100 hover:bg-white/10'}`}
                    >
                      {acknowledgedFiles.has(file.id) ? <CheckCircle size={14} /> : <UserCheck size={14} />}
                      {acknowledgedFiles.has(file.id) ? 'Acknowledged' : 'Acknowledge'}
                    </button>
                    <button
                      onClick={() => handleShare(file.name)}
                      className="p-2 hover:bg-purple-500/20 rounded-xl text-purple-400 transition-colors" title="Forward/Share within Team">
                      <Share2 size={18} />
                    </button>
                    <button className="p-2 hover:bg-indigo-500/20 rounded-xl text-indigo-500 transition-colors" title="Download Decrypted Asset">
                      <Download size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* My Files Section */}
          <GlassCard title="My File Library (Safe Library)">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredFiles.map((file) => (
                <div key={file.id} className="p-4 rounded-2xl glass border border-white/5 hover:border-white/20 transition-all group flex items-start gap-4 shadow-sm">
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 relative group-hover:bg-indigo-500/20 transition-colors">
                    <FileText size={24} />
                    <div className="absolute -top-1 -right-1 bg-emerald-500 text-white rounded-full p-0.5 border-2 border-slate-900 shadow-lg">
                      <CheckCircle size={10} />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold truncate text-sm">{file.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="opacity-30 text-[10px] uppercase font-bold tracking-tighter">
                        {(file.size / (1024 * 1024)).toFixed(1)} MB • AES-256-GCM
                      </p>
                      {file.watermarked && (
                        <span className="text-[9px] text-purple-400 border border-purple-400/30 px-1 rounded uppercase font-black">Watermarked</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleShare(file.name)}
                      className="p-2 hover:bg-white/10 rounded-lg text-purple-400" title="Share with Team">
                      <Share2 size={16} />
                    </button>
                    <button className="p-2 hover:bg-white/10 rounded-lg text-indigo-400" title="Secure Download">
                      <Download size={16} />
                    </button>
                    <button className="p-2 hover:bg-white/10 rounded-lg opacity-40">
                      <MoreVertical size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Session Security Logs */}
          <GlassCard title="Security Transmission Logs">
            <div className="space-y-3">
              {sessionLogs.length === 0 ? (
                <div className="py-8 text-center border-2 border-dashed border-white/5 rounded-2xl">
                  <p className="text-sm opacity-20 italic">No recent upload activity in this session.</p>
                </div>
              ) : (
                sessionLogs.map(log => (
                  <div key={log.id} className={`p-4 rounded-xl border flex items-center justify-between transition-all ${log.status === 'Infected' ? 'bg-rose-500/5 border-rose-500/20 shadow-lg shadow-rose-500/5' : 'bg-emerald-500/5 border-emerald-500/20'}`}>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${log.status === 'Infected' ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                        {log.status === 'Infected' ? <ShieldAlert size={16} /> : <CheckCircle size={16} />}
                      </div>
                      <div>
                        <p className="text-sm font-bold">{log.fileName}</p>
                        <p className="text-[10px] opacity-40 uppercase tracking-widest font-black">{log.timestamp} • Outcome: {log.status}</p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${log.status === 'Infected' ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                      {log.status === 'Infected' ? 'Upload Rejected' : 'Storage Verified'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </GlassCard>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-8">
          <GlassCard title="System Integrity">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-inner">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold">Endpoint Scan</p>
                  <p className="text-[10px] opacity-40 uppercase font-black">Active Guard Active</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-inner">
                  <Lock size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold">Stream Lock</p>
                  <p className="text-[10px] opacity-40 uppercase font-black">AES-256-GCM Handshake</p>
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard title="Vault Status">
            <div className="space-y-4 mt-2">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-1">
                <span className="opacity-40">Bucket Integrity</span>
                <span className="text-emerald-400">99.9% Optimal</span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden shadow-inner">
                <div className="h-full bg-emerald-500 w-[100%] shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              </div>
              <p className="text-[10px] opacity-30 italic leading-relaxed">Cross-region backup enabled. Deleted files are retained in the vault for 90 days for auditing purposes.</p>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
