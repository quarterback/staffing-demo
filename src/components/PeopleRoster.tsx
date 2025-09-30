import React, { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar } from "./ui/avatar";
import { Progress } from "./ui/progress";
import { CalendarDays, MapPin, Briefcase } from "lucide-react";
import { apiService, type StaffMember } from "../utils/api";

interface Filters {
  disciplines: string[];
  levels: string[];
  availability: string[];
}

interface PeopleRosterProps {
  filters: Filters;
}

export function PeopleRoster({ filters }: PeopleRosterProps) {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStaff = async () => {
      try {
        setIsLoading(true);
        const staffData = await apiService.getStaff();
        setStaff(staffData);
      } catch (error) {
        console.error('Failed to load staff:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStaff();
  }, []);

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

  const getDisciplineColor = (discipline: string) => {
    switch (discipline) {
      case 'Service Design': return 'bg-teal-100 text-teal-800';
      case 'UX Generalist': return 'bg-blue-100 text-blue-800';
      case 'Product Design': return 'bg-green-100 text-green-800';
      case 'Front-end Design': return 'bg-amber-100 text-amber-800';
      case 'Developer Experience': return 'bg-orange-100 text-orange-800';
      case 'Content Strategy': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAvailabilityColor = (status: string) => {
    switch (status) {
      case 'Bench': return 'bg-green-100 text-green-800';
      case '50% Staffed': return 'bg-yellow-100 text-yellow-800';
      case '100% Staffed': return 'bg-red-100 text-red-800';
      case 'New Hire': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysUntilProjectEnd = (endDate: string) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Filter staff based on current filters
  const filteredStaff = staff.filter(member => {
    // Filter by discipline
    if (filters.disciplines.length > 0 && !filters.disciplines.includes(member.discipline)) {
      return false;
    }
    
    // Filter by level
    if (filters.levels.length > 0 && !filters.levels.includes(member.level)) {
      return false;
    }
    
    // Filter by availability
    if (filters.availability.length > 0 && !filters.availability.includes(member.availabilityStatus)) {
      return false;
    }
    

    
    return true;
  });

  // Group staff by availability for better organization
  const benchedStaff = filteredStaff.filter(member => member.availabilityStatus === 'Bench');
  const newHires = filteredStaff.filter(member => member.availabilityStatus === 'New Hire');
  const partiallyStaffed = filteredStaff.filter(member => member.availabilityStatus === '50% Staffed');
  const fullyStaffed = filteredStaff.filter(member => member.availabilityStatus === '100% Staffed');

  const renderStaffSection = (title: string, staff: StaffMember[], colorClass: string) => {
    if (staff.length === 0) return null;

    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <Badge variant="outline" className={colorClass}>
            {staff.length} designers
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {staff.map((member) => (
            <Card key={member.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="space-y-3">
                {/* Header with avatar and basic info */}
                <div className="flex items-start space-x-3">
                  <Avatar className="h-10 w-10 bg-gray-200 flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-700">
                      {getInitials(member.name)}
                    </span>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate">{member.name}</h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline" className={`text-xs ${getLevelColor(member.level)}`}>
                        {member.level}
                      </Badge>
                      <Badge variant="outline" className={`text-xs ${getDisciplineColor(member.discipline)}`}>
                        {member.discipline}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center space-x-1 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{member.location}</span>
                </div>

                {/* Current project info */}
                {member.currentProject ? (
                  <div className="space-y-2">
                    <div className="flex items-start space-x-2">
                      <Briefcase className="h-4 w-4 text-gray-500 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {member.currentProject.name}
                        </p>
                        <p className="text-xs text-gray-600">{member.currentProject.role}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-600">Allocation</span>
                        <span className="font-medium">{member.currentProject.allocation}%</span>
                      </div>
                      <Progress value={member.currentProject.allocation} className="h-2" />
                    </div>
                    
                    <div className="flex items-center space-x-1 text-xs text-gray-600">
                      <CalendarDays className="h-3 w-3" />
                      <span>Ends {formatDate(member.currentProject.endDate)}</span>
                      {getDaysUntilProjectEnd(member.currentProject.endDate) <= 30 && (
                        <Badge variant="outline" className="bg-orange-100 text-orange-800 text-xs ml-1">
                          Ending soon
                        </Badge>
                      )}
                    </div>
                  </div>
                ) : member.availabilityStatus === 'New Hire' ? (
                  <div className="p-3 bg-blue-50 rounded-md">
                    <p className="text-sm text-blue-800 font-medium">New hire - ready for first assignment</p>
                  </div>
                ) : (
                  <div className="p-3 bg-green-50 rounded-md">
                    <p className="text-sm text-green-800 font-medium">Available for new projects</p>
                  </div>
                )}

                {/* Skills */}
                <div className="space-y-1">
                  <p className="text-xs font-medium text-gray-700">Skills</p>
                  <div className="flex flex-wrap gap-1">
                    {member.skills.slice(0, 3).map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs px-2 py-0">
                        {skill}
                      </Badge>
                    ))}
                    {member.skills.length > 3 && (
                      <Badge variant="secondary" className="text-xs px-2 py-0">
                        +{member.skills.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Availability status */}
                <div className="pt-2 border-t">
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getAvailabilityColor(member.availabilityStatus)}`}
                  >
                    {member.availabilityStatus}
                  </Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading team roster...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Filter Results Indicator */}
      {(filters.disciplines.length > 0 || filters.levels.length > 0 || filters.availability.length > 0) && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            Showing {filteredStaff.length} of {staff.length} team members matching current filters
          </p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Team Roster</h2>
          <p className="text-gray-600 mt-1">
            {filteredStaff.length} team members across {new Set(filteredStaff.map(s => s.discipline)).size} disciplines
          </p>
        </div>
        
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>{benchedStaff.length} Bench</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>{newHires.length} New Hires</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span>{partiallyStaffed.length} 50% Staffed</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>{fullyStaffed.length} 100% Staffed</span>
          </div>
        </div>
      </div>

      {renderStaffSection("Bench Designers", benchedStaff, "bg-green-100 text-green-800")}
      {renderStaffSection("New Hires", newHires, "bg-blue-100 text-blue-800")}
      {renderStaffSection("50% Staffed Designers", partiallyStaffed, "bg-yellow-100 text-yellow-800")}
      {renderStaffSection("100% Staffed Designers", fullyStaffed, "bg-red-100 text-red-800")}

      {filteredStaff.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No designers match the current filters.</p>
        </div>
      )}
    </div>
  );
}