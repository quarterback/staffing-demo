import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { TrendingUp, Calendar, Users, ArrowRight } from "lucide-react";
import { apiService, type StaffMember } from "../utils/api";

const forecastData = [
  { month: 'Oct', 'Service Design': 2, 'UX Generalist': 5, 'Product Design': 4, 'Front-end Design': 3, 'Developer Experience': 1, 'Content Strategy': 2 },
  { month: 'Nov', 'Service Design': 3, 'UX Generalist': 6, 'Product Design': 5, 'Front-end Design': 4, 'Developer Experience': 2, 'Content Strategy': 3 },
  { month: 'Dec', 'Service Design': 1, 'UX Generalist': 3, 'Product Design': 3, 'Front-end Design': 2, 'Developer Experience': 1, 'Content Strategy': 1 },
  { month: 'Jan', 'Service Design': 4, 'UX Generalist': 7, 'Product Design': 6, 'Front-end Design': 5, 'Developer Experience': 2, 'Content Strategy': 4 },
  { month: 'Feb', 'Service Design': 2, 'UX Generalist': 5, 'Product Design': 4, 'Front-end Design': 3, 'Developer Experience': 1, 'Content Strategy': 2 },
  { month: 'Mar', 'Service Design': 2, 'UX Generalist': 4, 'Product Design': 3, 'Front-end Design': 2, 'Developer Experience': 1, 'Content Strategy': 2 }
];

const upcomingRoles = [
  { role: "Product Designer (D5)", dueDate: "Oct 15", practice: "Product Design", urgency: "high" },
  { role: "UX Generalist (D4)", dueDate: "Oct 22", practice: "UX Generalist", urgency: "medium" },
  { role: "Service Designer (D6)", dueDate: "Nov 1", practice: "Service Design", urgency: "high" },
  { role: "Content Strategist (D4)", dueDate: "Nov 8", practice: "Content Strategy", urgency: "low" },
  { role: "Front-end Designer (D5)", dueDate: "Nov 15", practice: "Front-end Design", urgency: "medium" },
  { role: "Developer Experience Designer (D5)", dueDate: "Nov 22", practice: "Developer Experience", urgency: "medium" }
];

export function ForecastWidget() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStaff = async () => {
      try {
        setIsLoading(true);
        const staffData = await apiService.getStaff();
        setStaff(staffData);
      } catch (error) {
        console.error('Failed to load staff for forecast:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStaff();
  }, []);

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
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
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    });
  };

  const getDaysUntilEnd = (endDate: string) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Get staff whose projects are ending soon (within 60 days)
  const getTransitioningStaff = () => {
    return staff.filter(staffMember => {
      if (!staffMember.currentProject || staffMember.availabilityStatus === 'Benched' || staffMember.availabilityStatus === 'New Hire') return false;
      const daysUntilEnd = getDaysUntilEnd(staffMember.currentProject.endDate);
      return daysUntilEnd <= 60 && daysUntilEnd > 0;
    }).sort((a, b) => {
      const aDays = getDaysUntilEnd(a.currentProject!.endDate);
      const bDays = getDaysUntilEnd(b.currentProject!.endDate);
      return aDays - bDays;
    });
  };

  const transitioningStaff = getTransitioningStaff();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Card className="p-4">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading forecast...</p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex items-center space-x-2 mb-4">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">6-Month Active & Horizon Forecast</h3>
        </div>
        
        <div className="h-48 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={forecastData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="Service Design" stackId="a" fill="#14b8a6" />
              <Bar dataKey="UX Generalist" stackId="a" fill="#3b82f6" />
              <Bar dataKey="Product Design" stackId="a" fill="#10b981" />
              <Bar dataKey="Front-end Design" stackId="a" fill="#f59e0b" />
              <Bar dataKey="Developer Experience" stackId="a" fill="#f97316" />
              <Bar dataKey="Content Strategy" stackId="a" fill="#ec4899" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-teal-500 rounded"></div>
              <span className="text-gray-600">Service Design</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span className="text-gray-600">UX Generalist</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span className="text-gray-600">Product Design</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-yellow-500 rounded"></div>
              <span className="text-gray-600">Front-end Design</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-orange-500 rounded"></div>
              <span className="text-gray-600">Developer Experience</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-pink-500 rounded"></div>
              <span className="text-gray-600">Content Strategy</span>
            </div>
          </div>
        </div>
      </Card>
      
      <Card className="p-4">
        <div className="flex items-center space-x-2 mb-3">
          <Users className="h-5 w-5 text-orange-600" />
          <h3 className="font-semibold text-gray-900">Staff Transitions</h3>
          <Badge variant="outline" className="bg-orange-100 text-orange-800">
            {transitioningStaff.length} ending soon
          </Badge>
        </div>
        
        {transitioningStaff.length > 0 ? (
          <div className="space-y-3">
            {transitioningStaff.map((staff) => {
              const daysUntilEnd = getDaysUntilEnd(staff.currentProject!.endDate);
              return (
                <div key={staff.id} className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <p className="font-medium text-sm text-gray-900">{staff.name}</p>
                      <Badge variant="outline" className="text-xs bg-gray-100 text-gray-700">
                        {staff.level} {staff.discipline}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      {staff.currentProject!.name} • {staff.currentProject!.allocation}% allocation
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="text-right">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3 text-orange-600" />
                        <span className="text-xs font-medium text-orange-800">
                          {daysUntilEnd} days
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">
                        Ends {formatDate(staff.currentProject!.endDate)}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                    <div className="text-xs text-gray-500">Available</div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-gray-600">No staff transitions in the next 60 days.</p>
        )}
      </Card>

      <Card className="p-4">
        <div className="flex items-center space-x-2 mb-3">
          <Calendar className="h-5 w-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">Horizon Role Pipeline</h3>
        </div>
        <div className="space-y-3">
          {upcomingRoles.map((role, index) => (
            <div key={index} className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0 pr-2">
                  <p className="font-medium text-sm text-gray-900 leading-tight">{role.role}</p>
                  <p className="text-xs text-gray-600 mt-1">Due {role.dueDate}</p>
                </div>
                <Badge className={getUrgencyColor(role.urgency)} variant="secondary">
                  {role.urgency}
                </Badge>
              </div>
              <div className="flex items-center justify-start">
                <Badge className={getPracticeColor(role.practice)} variant="secondary">
                  {role.practice}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}