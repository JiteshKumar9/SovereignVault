
import { UserRole, FileMetadata, ActivityLog, UserProfile, OrganizationInfo } from './types';

export const MOCK_ORGS: OrganizationInfo[] = [
  { id: 'org1', name: 'SecureCorp Global', industry: 'Financial Services', status: 'active', onboardedDate: '2024-01-10', totalUsers: 45, totalFiles: 1200 },
  { id: 'org2', name: 'TechNode Industries', industry: 'Tech & Engineering', status: 'active', onboardedDate: '2024-02-15', totalUsers: 28, totalFiles: 850 },
  { id: 'org3', name: 'CyberDyne Systems', industry: 'Healthcare / Pharma', status: 'pending', onboardedDate: '2024-03-22', totalUsers: 5, totalFiles: 12 },
];

export const MOCK_USERS: UserProfile[] = [
  { id: 'admin1', name: 'Platform Master', email: 'admin@securesphere.com', role: UserRole.SUPER_ADMIN, organization: 'SecureSphere Platform' },
  { id: 'u1', name: 'Sarah Manager', email: 'sarah@org.com', role: UserRole.MANAGER, organization: 'SecureSphere' },
  { id: 'u2', name: 'John Dev', email: 'john@org.com', role: UserRole.USER, organization: 'SecureSphere' },
  { id: 'u3', name: 'Alice Auditor', email: 'alice@security.com', role: UserRole.AUDITOR, organization: 'SecureSphere' },
];

export const MOCK_FILES: FileMetadata[] = [
  { 
    id: 'f1', name: 'Project_Alpha_Spec.pdf', size: 1024 * 1024 * 2.5, type: 'pdf', 
    uploaderId: 'u2', uploaderName: 'John Dev', timestamp: '2024-03-20T10:30:00Z', 
    status: 'active', permissions: ['u2', 'u4'],
    scanStatus: 'clean', encryptionLevel: 'AES-256-GCM', watermarked: true 
  },
  { 
    id: 'f2', name: 'Annual_Report_2023.xlsx', size: 1024 * 512, type: 'xlsx', 
    uploaderId: 'u1', uploaderName: 'Sarah Manager', timestamp: '2024-03-19T14:20:00Z', 
    status: 'active', permissions: ['all'],
    scanStatus: 'clean', encryptionLevel: 'AES-256-GCM', watermarked: true 
  }
];

export const MOCK_LOGS: ActivityLog[] = [
  { id: 'l1', userId: 'u1', userName: 'Sarah Manager', action: 'LOGIN', timestamp: '2024-03-21T08:00:00Z', details: 'User logged in from IP 192.168.1.1', severity: 'low', orgId: 'org1' },
  { id: 'l7', userId: 'u2', userName: 'John Dev', action: 'SECURITY_SCAN', fileName: 'Project_Alpha_Spec.pdf', timestamp: '2024-03-20T10:28:00Z', details: 'GuardDuty Malware Scan: Passed', severity: 'low', orgId: 'org1' },
  { id: 'l2', userId: 'u2', userName: 'John Dev', action: 'UPLOAD', fileId: 'f1', fileName: 'Project_Alpha_Spec.pdf', timestamp: '2024-03-20T10:30:00Z', details: 'AES-256-GCM Encrypted file stored in S3', severity: 'low', orgId: 'org1' },
  { id: 'l9', userId: 'u9', userName: 'Marcus Chief', action: 'SECURITY_REJECTION', fileName: 'Suspicious_File.exe', timestamp: '2024-03-22T11:45:00Z', details: 'Infection detected in org: TechNode. Process blocked.', severity: 'high', orgId: 'org2' },
];
