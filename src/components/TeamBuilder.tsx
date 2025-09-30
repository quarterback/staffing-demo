import { useState, useEffect, useMemo, useCallback } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Avatar } from "./ui/avatar";
import { Progress } from "./ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Input } from "./ui/input";
import { Users, Plus, Calendar, MapPin, Briefcase, UserCheck, AlertCircle } from "lucide-react";
import { apiService, type StaffMember, type Project } from "../utils/api";
import { toast } from "sonner@2.0.3";

interface TeamBuilderProps {
  filters: {
    disciplines: string[];
    levels: string[];
    availability: string[];
  };
}

export function TeamBuilder({ filters }: TeamBuilderProps) {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [selectedAllocation, setSelectedAllocation] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [isCreatingNewRequest, setIsCreatingNewRequest] = useState(false);
  const [newRequestTitle, setNewRequestTitle] = useState<string>('');
  const [newProjectName, setNewProjectName] = useState<string>('');

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [staffData, projectsData] = await Promise.all([
          apiService.getStaff(),
          apiService.getProjects()
        ]);
        setStaff(staffData);
        setProjects(projectsData);
      } catch (error) {
        console.error('Failed to load team builder data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const getAvailabilityColor = (status: string) => {
    switch (status) {
      case 'Bench': return 'bg-green-100 text-green-800';
      case '50% Staffed': return 'bg-yellow-100 text-yellow-800';
      case '100% Staffed': return 'bg-red-100 text-red-800';
      case 'New Hire': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'D3': return 'bg-emerald-100 text-emerald-800';
      case 'D4': return 'bg-blue-100 text-blue-800';
      case 'D5': return 'bg-indigo-100 text-indigo-800';
      case 'D6': return 'bg-purple-100 text-purple-800';
      case 'E3': return 'bg-red-100 text-red-800';
      case 'E4': return 'bg-red-200 text-red-900';
      case 'E5': return 'bg-red-300 text-red-900';
      case 'E6': return 'bg-red-400 text-red-900';
      case 'P4': return 'bg-violet-100 text-violet-800';
      case 'P5': return 'bg-violet-200 text-violet-900';
      case 'P6': return 'bg-violet-300 text-violet-900';
      case 'PM4': return 'bg-slate-100 text-slate-800';
      case 'PM5': return 'bg-slate-200 text-slate-900';
      case 'PM6': return 'bg-slate-300 text-slate-900';
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
      case 'Product Management': return 'bg-purple-100 text-purple-800';
      case 'Engineering': return 'bg-red-100 text-red-800';
      case 'Program Management': return 'bg-indigo-100 text-indigo-800';
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

  // Filter staff based on current filters
  const filteredStaff = staff.filter(member => {
    if (filters.disciplines.length > 0 && !filters.disciplines.includes(member.discipline)) {
      return false;
    }
    if (filters.levels.length > 0 && !filters.levels.includes(member.level)) {
      return false;
    }
    if (filters.availability.length > 0 && !filters.availability.includes(member.availabilityStatus)) {
      return false;
    }

    return true;
  });

  // Group staff by availability
  const benchedStaff = filteredStaff.filter(s => s.availabilityStatus === 'Bench');
  const newHires = filteredStaff.filter(s => s.availabilityStatus === 'New Hire');
  const partiallyStaffed = filteredStaff.filter(s => s.availabilityStatus === '50% Staffed');
  const fullyStaffed = filteredStaff.filter(s => s.availabilityStatus === '100% Staffed');

  // Get utilization statistics
  const totalStaff = filteredStaff.length;
  const utilizationRate = totalStaff > 0 ? ((fullyStaffed.length + partiallyStaffed.length * 0.5) / totalStaff * 100) : 0;

  const handleAssignStaff = (staff: StaffMember) => {
    setSelectedStaff(staff);
    setSelectedProject('');
    setSelectedAllocation('');
    setSelectedRole(staff.discipline);
    setIsCreatingNewRequest(false);
    setNewRequestTitle('');
    setNewProjectName('');
    setIsAssignDialogOpen(true);
  };

  const handleProjectChange = (value: string) => {
    setSelectedProject(value);
    if (value === 'new-request') {
      setIsCreatingNewRequest(true);
      setNewRequestTitle(selectedStaff?.discipline + ' - ' + selectedStaff?.level || '');
    } else {
      setIsCreatingNewRequest(false);
      setNewRequestTitle('');
      setNewProjectName('');
    }
  };

  const handleAssignment = async () => {
    if (!selectedStaff || !selectedAllocation) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (isCreatingNewRequest && (!newRequestTitle || !newProjectName)) {
      toast.error('Please fill in the request title and project name');
      return;
    }

    if (!isCreatingNewRequest && !selectedProject) {
      toast.error('Please select a project');
      return;
    }

    let projectId = selectedProject;
    let projectName = '';
    let requestId: string | undefined = undefined;

    if (isCreatingNewRequest) {
      // Create a new request/project
      requestId = Math.random().toString(36).substr(2, 9);
      projectId = requestId; // Use the same ID for project and request
      projectName = newProjectName;
      
      toast.info(`New staffing request created: ${newRequestTitle}`);
    } else {
      // Find existing project
      const project = projects.find(p => p.id === selectedProject);
      projectName = project ? project.name : 'Unknown Project';
    }

    // Create the assignment using the API service
    const assignment = await apiService.createAssignment({
      staffId: selectedStaff.id,
      requestId: requestId,
      projectId: projectId,
      projectName: projectName,
      role: selectedRole || selectedStaff.discipline,
      allocation: parseInt(selectedAllocation),
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days from now
      status: 'confirmed'
    });

    toast.success(`✅ ${selectedStaff.name} successfully assigned to ${projectName} at ${selectedAllocation}% allocation!`);
    setIsAssignDialogOpen(false);
    setSelectedStaff(null);
  };

  const renderStaffSection = (title: string, staff: StaffMember[], icon: any, description: string) => {
    if (staff.length === 0) return null;

    return (
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            {icon}
            <div>
              <h3 className="font-semibold text-gray-900">{title}</h3>
              <p className="text-sm text-gray-600">{description}</p>
            </div>
          </div>
          <Badge variant="outline" className="bg-blue-100 text-blue-800">
            {staff.length} people
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {staff.map((member) => (
            <Card key={member.id} className="p-3 bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8 bg-gray-200 flex items-center justify-center">
                    <span className="text-xs font-medium text-gray-700">
                      {getInitials(member.name)}
                    </span>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <p className="font-medium text-sm text-gray-900 truncate">{member.name}</p>
                      {member.isLead && (
                        <Badge variant="outline" className="text-xs bg-yellow-100 text-yellow-800">
                          Lead
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-1">
                      <Badge variant="outline" className={`text-xs ${getLevelColor(member.level)}`}>
                        {member.level}
                      </Badge>
                      <Badge variant="outline" className={`text-xs ${getDisciplineColor(member.discipline)}`}>
                        {member.discipline}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-1 text-xs text-gray-600">
                  <MapPin className="h-3 w-3" />
                  <span>{member.location}</span>
                </div>

                {member.currentProject && (
                  <div className="space-y-1">
                    <div className="flex items-center space-x-1">
                      <Briefcase className="h-3 w-3 text-gray-500" />
                      <p className="text-xs font-medium text-gray-700 truncate">
                        {member.currentProject.name}
                      </p>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-600">Allocation</span>
                      <span className="font-medium">{member.currentProject.allocation}%</span>
                    </div>
                    <Progress value={member.currentProject.allocation} className="h-1" />
                    <div className="flex items-center space-x-1 text-xs text-gray-600">
                      <Calendar className="h-3 w-3" />
                      <span>Ends {formatDate(member.currentProject.endDate)}</span>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t">
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getAvailabilityColor(member.availabilityStatus)}`}
                  >
                    {member.availabilityStatus}
                  </Badge>
                  
                  {(member.availabilityStatus === 'Bench' || 
                    member.availabilityStatus === 'New Hire' || 
                    member.availabilityStatus === '50% Staffed') && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleAssignStaff(member)}
                      className="text-xs h-6 px-2"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Assign
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading team builder...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter Results Indicator */}
      {(filters.disciplines.length > 0 || filters.levels.length > 0 || filters.availability.length > 0) && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            Showing {filteredStaff.length} of {staff.length} team members matching current filters
          </p>
        </div>
      )}

      {/* Header with utilization stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Total Designers</p>
              <p className="text-2xl font-semibold">{totalStaff}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <UserCheck className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Utilization Rate</p>
              <p className="text-2xl font-semibold">{utilizationRate.toFixed(1)}%</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-orange-600" />
            <div>
              <p className="text-sm text-gray-600">Available Now</p>
              <p className="text-2xl font-semibold">{benchedStaff.length + newHires.length}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <Plus className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Partial Capacity</p>
              <p className="text-2xl font-semibold">{partiallyStaffed.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Staff sections */}
      <div className="space-y-6">
        {renderStaffSection(
          "Available Team Members", 
          benchedStaff, 
          <Users className="h-5 w-5 text-green-600" />,
          "Ready for immediate assignment"
        )}
        
        {renderStaffSection(
          "New Hires", 
          newHires, 
          <Plus className="h-5 w-5 text-blue-600" />,
          "Recently joined, available for first assignment"
        )}
        
        {renderStaffSection(
          "Partially Staffed", 
          partiallyStaffed, 
          <AlertCircle className="h-5 w-5 text-yellow-600" />,
          "50% allocated, can take additional work"
        )}
        
        {renderStaffSection(
          "Fully Staffed", 
          fullyStaffed, 
          <Briefcase className="h-5 w-5 text-red-600" />,
          "Currently at full capacity"
        )}
      </div>

      {/* Assignment Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign {selectedStaff?.name} to Project</DialogTitle>
            <DialogDescription>
              Select a project and allocation percentage for {selectedStaff?.name}.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Project</label>
              <Select value={selectedProject} onValueChange={handleProjectChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                  <SelectItem value="new-request">+ Create New Staffing Request</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* New Request Fields */}
            {isCreatingNewRequest && (
              <>
                <div>
                  <label className="text-sm font-medium text-gray-700">Request Title</label>
                  <Input
                    value={newRequestTitle}
                    onChange={(e) => setNewRequestTitle(e.target.value)}
                    placeholder="e.g., Product Designer - D5"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Project Name</label>
                  <Input
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    placeholder="e.g., Digital Services Platform"
                  />
                </div>
              </>
            )}
            
            <div>
              <label className="text-sm font-medium text-gray-700">Allocation</label>
              <Select value={selectedAllocation} onValueChange={setSelectedAllocation}>
                <SelectTrigger>
                  <SelectValue placeholder="Select allocation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="50">50%</SelectItem>
                  <SelectItem value="100">100%</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700">Role</label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Service Design">Service Designer</SelectItem>
                  <SelectItem value="UX Generalist">UX Designer</SelectItem>
                  <SelectItem value="Product Design">Product Designer</SelectItem>
                  <SelectItem value="Front-end Design">Front-end Designer</SelectItem>
                  <SelectItem value="Developer Experience">DX Designer</SelectItem>
                  <SelectItem value="Content Strategy">Content Strategist</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAssignment}>
                Assign to Project
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {filteredStaff.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No designers match the current filters.</p>
        </div>
      )}
    </div>
  );
}