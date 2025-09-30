import { apiService, type Assignment, type StaffingRequestWithStatus } from '../utils/api';

// Legacy functions that now use the API service
export const getAssignments = async () => {
  return await apiService.getAssignments();
};

export const addAssignment = async (assignment: Omit<Assignment, 'id' | 'assignedDate' | 'assignedBy'>) => {
  return await apiService.createAssignment(assignment);
};

export const getStaffingRequestStatus = async (requestId: string) => {
  const requests = await apiService.getStaffingRequests();
  const request = requests.find(r => r.id === requestId);
  return request?.status || 'open';
};

export const updateStaffingRequestStatus = async (requestId: string, status: StaffingRequestWithStatus['status']) => {
  return await apiService.updateStaffingRequest(requestId, { status });
};

export const getAssignmentsByStaffId = async (staffId: string) => {
  const assignments = await apiService.getAssignments();
  return assignments.filter(a => a.staffId === staffId);
};

export const getAssignmentsByRequestId = async (requestId: string) => {
  const assignments = await apiService.getAssignments();
  return assignments.filter(a => a.requestId === requestId);
};

// Re-export types
export type { Assignment, StaffingRequestWithStatus };