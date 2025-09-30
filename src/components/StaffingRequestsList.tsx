import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Clock, Calendar, CheckCircle, ArrowUpCircle, AlertTriangle, Plus } from "lucide-react";
import { apiService, type StaffingRequestWithStatus } from "../utils/api";





interface Filters {
  disciplines: string[];
  levels: string[];
  availability: string[];
}

interface StaffingRequestsListProps {
  onRequestClick: (request: StaffingRequestWithStatus) => void;
  selectedRequestId?: string;
  filters: Filters;
  onCreateRequest?: () => void;
}

export function StaffingRequestsList({ onRequestClick, selectedRequestId, filters, onCreateRequest }: StaffingRequestsListProps) {
  const [requests, setRequests] = useState<StaffingRequestWithStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadRequests = async () => {
      try {
        setIsLoading(true);
        const requestsData = await apiService.getStaffingRequests();
        setRequests(requestsData);
      } catch (error) {
        console.error('Failed to load staffing requests:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRequests();
  }, []);
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'filled': return 'bg-green-100 text-green-800';
      case 'escalated': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'filled': return <CheckCircle className="h-4 w-4" />;
      case 'escalated': return <ArrowUpCircle className="h-4 w-4" />;
      case 'in_progress': return <Clock className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'D3': return 'bg-emerald-100 text-emerald-800';
      case 'D4': return 'bg-blue-100 text-blue-800';
      case 'D5': return 'bg-indigo-100 text-indigo-800';
      case 'D6': return 'bg-purple-100 text-purple-800';
      case 'E3': return 'bg-emerald-100 text-emerald-800';
      case 'E4': return 'bg-blue-100 text-blue-800';
      case 'E5': return 'bg-indigo-100 text-indigo-800';
      case 'E6': return 'bg-purple-100 text-purple-800';
      case 'P3': return 'bg-emerald-100 text-emerald-800';
      case 'P4': return 'bg-blue-100 text-blue-800';
      case 'P5': return 'bg-indigo-100 text-indigo-800';
      case 'P6': return 'bg-purple-100 text-purple-800';
      case 'PM3': return 'bg-emerald-100 text-emerald-800';
      case 'PM4': return 'bg-blue-100 text-blue-800';
      case 'PM5': return 'bg-indigo-100 text-indigo-800';
      case 'PM6': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPracticeColor = (practice: string) => {
    switch (practice) {
      case 'Service Design': return 'bg-teal-100 text-teal-800';
      case 'UX Generalist': return 'bg-blue-100 text-blue-800';
      case 'Product Design': return 'bg-green-100 text-green-800';
      case 'Front-end Design': return 'bg-amber-100 text-amber-800';
      case 'Developer Experience': return 'bg-orange-100 text-orange-800';
      case 'Content Strategy': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getDaysUntilDue = (dateString: string) => {
    const today = new Date();
    const dueDate = new Date(dateString);
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Filter requests based on current filters
  const filteredRequests = requests.filter(request => {
    // Filter by discipline
    if (filters.disciplines.length > 0 && !filters.disciplines.includes(request.practice)) {
      return false;
    }
    
    // Filter by level
    if (filters.levels.length > 0 && !filters.levels.includes(request.level)) {
      return false;
    }
    
    return true;
  });

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading staffing requests...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Filter Results Indicator */}
      {(filters.disciplines.length > 0 || filters.levels.length > 0) && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            Showing {filteredRequests.length} of {requests.length} requests matching current filters
          </p>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Active Staffing Requests</h1>
          <p className="text-gray-600 mt-1">Primary staffing queue requiring immediate attention</p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="secondary" className="text-sm px-3 py-1">
            {filteredRequests.length} active requests
          </Badge>
          {onCreateRequest && (
            <Button onClick={onCreateRequest} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Request
            </Button>
          )}
        </div>
      </div>
      
      {filteredRequests.map((request) => {
        const daysUntilDue = getDaysUntilDue(request.dueDate);
        const isSelected = selectedRequestId === request.id;
        const status = request.status;
        
        return (
          <Card 
            key={request.id} 
            className={`staffing-request-card p-5 cursor-pointer transition-all hover:shadow-lg border-l-4 ${
              isSelected ? 'ring-2 ring-blue-500 bg-blue-50 border-l-blue-500' : 'border-l-gray-200 hover:border-l-blue-300'
            }`}
            data-testid="staffing-request"
            onClick={() => onRequestClick(request)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="font-medium text-gray-900">{request.roleTitle}</h3>
                  <Badge className={getPriorityColor(request.priority)} variant="secondary">
                    {request.priority}
                  </Badge>
                  <Badge className={getStatusColor(status)} variant="secondary">
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(status)}
                      <span className="capitalize">{status.replace('_', ' ')}</span>
                    </div>
                  </Badge>
                </div>
                
                <div className="flex items-center space-x-3 mb-3">
                  <Badge className={getLevelColor(request.level)} variant="secondary">
                    {request.level}
                  </Badge>
                  <Badge className={getPracticeColor(request.practice)} variant="secondary">
                    {request.practice}
                  </Badge>
                </div>
                
                <p className="text-sm text-gray-600 mb-2">{request.projectName}</p>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span>Due {formatDate(request.dueDate)}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <Clock className="h-4 w-4" />
                    <span>
                      {daysUntilDue > 0 ? `${daysUntilDue} days left` : 
                       daysUntilDue === 0 ? 'Due today' : 
                       `${Math.abs(daysUntilDue)} days overdue`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}