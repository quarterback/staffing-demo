import { projectId, publicAnonKey } from './supabase/info';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-a5f0b89d`;

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${publicAnonKey}`,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Initialize database with mock data
  async initialize(): Promise<{ success: boolean; message: string }> {
    return this.request('/initialize', { method: 'POST' });
  }

  // Staff members
  async getStaff(): Promise<StaffMember[]> {
    return this.request('/staff');
  }

  async createStaff(staff: Omit<StaffMember, 'id'>): Promise<StaffMember> {
    return this.request('/staff', {
      method: 'POST',
      body: JSON.stringify(staff),
    });
  }

  async updateStaff(id: string, updates: Partial<StaffMember>): Promise<{ success: boolean }> {
    return this.request(`/staff/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // Projects
  async getProjects(): Promise<Project[]> {
    return this.request('/projects');
  }

  async createProject(project: Omit<Project, 'id'>): Promise<Project> {
    return this.request('/projects', {
      method: 'POST',
      body: JSON.stringify(project),
    });
  }

  // Assignments
  async getAssignments(): Promise<Assignment[]> {
    return this.request('/assignments');
  }

  async createAssignment(assignment: Omit<Assignment, 'id' | 'assignedDate' | 'assignedBy'>): Promise<Assignment> {
    return this.request('/assignments', {
      method: 'POST',
      body: JSON.stringify(assignment),
    });
  }

  // Staffing requests
  async getStaffingRequests(): Promise<StaffingRequestWithStatus[]> {
    return this.request('/staffing-requests');
  }

  async createStaffingRequest(request: Omit<StaffingRequestWithStatus, 'id' | 'status'>): Promise<StaffingRequestWithStatus> {
    return this.request('/staffing-requests', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async updateStaffingRequest(id: string, updates: Partial<StaffingRequestWithStatus>): Promise<{ success: boolean }> {
    return this.request(`/staffing-requests/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }
}

// Export singleton instance
export const apiService = new ApiService();

// Export types for use in components
export interface StaffMember {
  id: string;
  name: string;
  level: string;
  discipline: string;
  skills: string[];
  currentProject?: {
    name: string;
    allocation: number;
    endDate: string;
    role: string;
  };
  availabilityStatus: 'Bench' | '50% Staffed' | '100% Staffed' | 'New Hire';
  location: string;
  startDate: string;
  isLead?: boolean;
  practiceArea?: string;
}

export interface Assignment {
  id: string;
  staffId: string;
  requestId?: string;
  projectId: string;
  projectName: string;
  role: string;
  allocation: number;
  startDate: string;
  endDate: string;
  status: 'pending' | 'confirmed' | 'active' | 'completed';
  assignedBy: string;
  assignedDate: string;
}

export interface StaffingRequestWithStatus {
  id: string;
  roleTitle: string;
  level: string;
  practice: string;
  projectName: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  status: 'open' | 'in_progress' | 'filled' | 'escalated';
  assignedStaffIds?: string[];
  filledDate?: string;
}

export interface Project {
  id: string;
  name: string;
  status: 'Active' | 'Ending Soon' | 'Starting Soon';
  endDate?: string;
  priority: 'high' | 'medium' | 'low';
}