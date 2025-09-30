import React, { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  Clock,
  AlertTriangle,
  CheckCircle,
  User,
  Briefcase,
  ArrowRight,
  Plus,
  ExternalLink,
  Settings,
  FileText,
  MessageSquare,
  RefreshCw
} from "lucide-react";
import { getStaff, type StaffMember } from "../data/staff";
import { apiService, type StaffingRequestWithStatus } from "../utils/api";

interface DashboardSnapshotProps {
  onNavigateToStaffing: () => void;
  onNavigateToPeople: () => void;
  onNavigateToForecast: () => void;
}

export function DashboardSnapshot({ 
  onNavigateToStaffing, 
  onNavigateToPeople, 
  onNavigateToForecast 
}: DashboardSnapshotProps) {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [requests, setRequests] = useState<StaffingRequestWithStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        const [staffData, requestsData] = await Promise.all([
          apiService.getStaff(),
          apiService.getStaffingRequests()
        ]);
        setStaff(staffData);
        setRequests(requestsData);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }
  
  // Calculate key metrics
  const totalStaff = staff.length;
  const benchedStaff = staff.filter(s => s.availabilityStatus === 'Bench').length;
  const fullyStaffed = staff.filter(s => s.availabilityStatus === '100% Staffed').length;
  const partiallyStaffed = staff.filter(s => s.availabilityStatus === '50% Staffed').length;
  const newHires = staff.filter(s => s.availabilityStatus === 'New Hire').length;
  
  // Calculate utilization percentage
  const utilizationRate = totalStaff > 0 ? ((fullyStaffed + (partiallyStaffed * 0.5)) / totalStaff * 100).toFixed(0) : '0';
  
  // Get staff ending projects soon
  const getDaysUntilEnd = (endDate: string) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const transitioningStaff = staff.filter(staffMember => {
    if (!staffMember.currentProject) return false;
    const daysUntilEnd = getDaysUntilEnd(staffMember.currentProject.endDate);
    return daysUntilEnd <= 30 && daysUntilEnd > 0;
  }).slice(0, 3);

  // Recent activity (mock data)
  const recentActivity = [
    {
      type: 'assignment',
      message: 'Sarah Chen assigned to VA Health Portal Redesign',
      time: '2 hours ago',
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      type: 'request',
      message: 'New staffing request: Senior UX Designer (D5)',
      time: '4 hours ago',
      icon: Plus,
      color: 'text-blue-600'
    },
    {
      type: 'transition',
      message: 'Robin Martinez project ending in 3 days',
      time: '6 hours ago',
      icon: Clock,
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Key Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Staff</p>
              <p className="text-2xl font-semibold text-gray-900">{totalStaff}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Utilization Rate</p>
              <p className="text-2xl font-semibold text-gray-900">{utilizationRate}%</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <User className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Benched</p>
              <p className="text-2xl font-semibold text-gray-900">{benchedStaff}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Briefcase className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Open Requests</p>
              <p className="text-2xl font-semibold text-gray-900">{requests.filter(r => r.status === 'open').length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Team Status Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Team Status Overview</h3>
            <Button variant="ghost" size="sm" onClick={onNavigateToPeople}>
              View All <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Fully Staffed</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-900">{fullyStaffed}</span>
                <span className="text-xs text-gray-500">({((fullyStaffed / totalStaff) * 100).toFixed(0)}%)</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Partially Staffed</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-900">{partiallyStaffed}</span>
                <span className="text-xs text-gray-500">({((partiallyStaffed / totalStaff) * 100).toFixed(0)}%)</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Available</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-900">{benchedStaff}</span>
                <span className="text-xs text-gray-500">({((benchedStaff / totalStaff) * 100).toFixed(0)}%)</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-sm text-gray-700">New Hires</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-900">{newHires}</span>
                <span className="text-xs text-gray-500">({((newHires / totalStaff) * 100).toFixed(0)}%)</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Recent Activity</h3>
          </div>
          
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="mt-0.5">
                  <activity.icon className={`h-4 w-4 ${activity.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Integrations Status */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <ExternalLink className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900">External Integrations</h3>
              <p className="text-sm text-blue-700">Connected tools and automations</p>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="text-blue-600 border-blue-300 hover:bg-blue-100"
            onClick={() => window.location.hash = 'integrations'}
          >
            <Settings className="h-4 w-4 mr-1" />
            Manage
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg">
            <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
              <FileText className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-blue-900">Jira</span>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
              <p className="text-xs text-blue-700">4 projects syncing</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg">
            <div className="w-8 h-8 bg-purple-100 rounded flex items-center justify-center">
              <MessageSquare className="h-4 w-4 text-purple-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-blue-900">Slack</span>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
              <p className="text-xs text-blue-700">12 channels active</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg">
            <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
              <RefreshCw className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-blue-900">Restaff Actions</span>
                <Badge variant="secondary" className="text-xs">Live</Badge>
              </div>
              <p className="text-xs text-blue-700">Quick personnel moves</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Urgent Attention & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <h3 className="font-semibold text-gray-900">Needs Attention</h3>
            </div>
            <Button variant="ghost" size="sm" onClick={onNavigateToForecast}>
              View All <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          
          <div className="space-y-3">
            {transitioningStaff.map((staff) => {
              const daysUntilEnd = getDaysUntilEnd(staff.currentProject!.endDate);
              return (
                <div key={staff.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{staff.name}</p>
                    <p className="text-xs text-gray-600">{staff.currentProject!.name} ending in {daysUntilEnd} days</p>
                  </div>
                  <Badge variant="outline" className="bg-orange-100 text-orange-800 text-xs">
                    {staff.level} {staff.discipline.split(' ')[0]}
                  </Badge>
                </div>
              );
            })}
            
            {transitioningStaff.length === 0 && (
              <p className="text-sm text-gray-600">No immediate staffing concerns</p>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
          
          <div className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={onNavigateToStaffing}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Staffing Request
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={onNavigateToPeople}
            >
              <Users className="h-4 w-4 mr-2" />
              Browse Team Roster
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={onNavigateToForecast}
            >
              <Calendar className="h-4 w-4 mr-2" />
              View 6-Month Forecast
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start text-blue-600 border-blue-200 hover:bg-blue-50"
              onClick={() => window.location.hash = 'integrations'}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Manage Integrations & Restaff
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}