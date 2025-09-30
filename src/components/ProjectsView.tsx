import { useState, useEffect, useMemo, useCallback, memo } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Separator } from "./ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { 
  Users, 
  Calendar, 
  Crown, 
  AlertCircle, 
  ExternalLink, 
  MessageSquare,
  UserMinus,
  UserPlus,
  RefreshCw,
  Settings
} from "lucide-react";
import { apiService, type StaffMember, type Project } from "../utils/api";
import { RestaffDialog } from "./RestaffDialog";
import { JiraIntegration } from "./JiraIntegration";
import { SlackIntegration } from "./SlackIntegration";

interface Filters {
  disciplines: string[];
  levels: string[];
  availability: string[];
}

interface ProjectsViewProps {
  filters: Filters;
}

interface ProjectTeam {
  project: Project;
  teamMembers: StaffMember[];
  totalAllocation: number;
  disciplines: string[];
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return 'destructive';
    case 'medium': return 'default';
    case 'low': return 'secondary';
    default: return 'default';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Active': return 'default';
    case 'Ending Soon': return 'destructive';
    case 'Starting Soon': return 'secondary';
    default: return 'default';
  }
};

const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
};

export const ProjectsView = memo(function ProjectsView({ filters }: ProjectsViewProps) {
  const [selectedView, setSelectedView] = useState<'grid' | 'list'>('grid');
  const [showIntegrations, setShowIntegrations] = useState(true); // Show by default
  const [restaffDialogOpen, setRestaffDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<StaffMember | null>(null);
  const [selectedProject, setSelectedProject] = useState<string | null>("1"); // Show first project by default
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
        console.error('Failed to load projects data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Group staff by projects - memoized for performance
  const projectTeams: ProjectTeam[] = useMemo(() => {
    return projects.map(project => {
      const teamMembers = staff.filter(staffMember => 
        staffMember.currentProject?.name === project.name
      );
      
      const totalAllocation = teamMembers.reduce((sum, member) => 
        sum + (member.currentProject?.allocation || 0), 0
      );
      
      const disciplines = [...new Set(teamMembers.map(member => member.discipline))];
      
      return {
        project,
        teamMembers,
        totalAllocation,
        disciplines
      };
    });
  }, [projects, staff]);

  // Apply filters - memoized for performance
  const filteredProjectTeams = useMemo(() => {
    return projectTeams.filter(team => {
      if (filters.disciplines.length > 0) {
        const hasMatchingDiscipline = team.teamMembers.some(member =>
          filters.disciplines.includes(member.discipline)
        );
        if (!hasMatchingDiscipline) return false;
      }
      
      if (filters.levels.length > 0) {
        const hasMatchingLevel = team.teamMembers.some(member =>
          filters.levels.includes(member.level)
        );
        if (!hasMatchingLevel) return false;
      }
      
      return true;
    });
  }, [projectTeams, filters.disciplines, filters.levels]);

  const handleRestaffMember = useCallback((member: StaffMember) => {
    setSelectedMember(member);
    setRestaffDialogOpen(true);
  }, []);

  const ProjectCard = ({ team }: { team: ProjectTeam }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="flex flex-wrap items-center gap-2 mb-2 text-base md:text-lg">
              <span className="truncate">{team.project.name}</span>
              <Badge variant={getStatusColor(team.project.status)} className="text-xs">
                {team.project.status}
              </Badge>
              <Badge variant={getPriorityColor(team.project.priority)} className="text-xs">
                {team.project.priority}
              </Badge>
            </CardTitle>
            
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {team.teamMembers.length} members
              </div>
              {team.project.endDate && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Ends {new Date(team.project.endDate).toLocaleDateString()}
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-1 mb-3">
              {team.disciplines.map(discipline => (
                <Badge key={discipline} variant="outline" className="text-xs">
                  {discipline}
                </Badge>
              ))}
            </div>
          </div>
          
          {/* Project Actions */}
          <div className="flex gap-2 shrink-0">
            <Button
              variant={selectedProject === team.project.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedProject(selectedProject === team.project.id ? null : team.project.id)}
              className="flex items-center gap-1 text-xs md:text-sm whitespace-nowrap"
            >
              <ExternalLink className="h-3 w-3 md:h-4 md:w-4" />
              <span className="hidden sm:inline">
                {selectedProject === team.project.id ? 'Hide' : 'Show'} Integrations
              </span>
              <span className="sm:hidden">
                {selectedProject === team.project.id ? 'Hide' : 'Show'}
              </span>
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Show integrations if this project is selected and integrations are enabled */}
        {showIntegrations && selectedProject === team.project.id && (
          <div className="mb-6 space-y-4 p-3 md:p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
            <h4 className="font-semibold text-blue-900 flex items-center gap-2 text-sm md:text-base">
              <ExternalLink className="h-4 w-4" />
              Project Integrations
            </h4>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 md:gap-4">
              <JiraIntegration projectName={team.project.name} />
              <SlackIntegration projectName={team.project.name} />
            </div>
          </div>
        )}

        {/* Team Members */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Team Members</h4>
            {team.teamMembers.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1 text-blue-600 border-blue-200 hover:bg-blue-50"
              >
                <UserPlus className="h-3 w-3" />
                Add Member
              </Button>
            )}
          </div>
          
          {team.teamMembers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No team members assigned</p>
              <Button variant="outline" size="sm" className="mt-2">
                <UserPlus className="h-4 w-4 mr-1" />
                Add First Member
              </Button>
            </div>
          ) : (
            team.teamMembers.map(member => (
              <div key={member.id} className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback className="text-xs">
                      {getInitials(member.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1 md:gap-2 mb-1">
                      <span className="font-medium text-sm md:text-base truncate">{member.name}</span>
                      {member.isLead && (
                        <Crown className="h-3 w-3 md:h-4 md:w-4 text-yellow-600" title="Practice Lead" />
                      )}
                      <Badge variant="outline" className="text-xs">
                        {member.level}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {member.discipline}
                      </Badge>
                    </div>
                    <div className="text-xs md:text-sm text-gray-600">
                      {member.currentProject?.role} • {member.currentProject?.allocation}% allocated
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRestaffMember(member)}
                    className="flex items-center gap-1 text-orange-600 border-orange-200 hover:bg-orange-50 text-xs"
                  >
                    <RefreshCw className="h-3 w-3" />
                    <span className="hidden sm:inline">Restaff</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1 text-red-600 border-red-200 hover:bg-red-50 text-xs"
                  >
                    <UserMinus className="h-3 w-3" />
                    <span className="hidden sm:inline">Remove</span>
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:justify-between">
        <div>
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900">Project Teams</h2>
          <p className="text-sm md:text-base text-gray-600">View and manage complete project teams across all disciplines</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex items-center space-x-2">
            <Switch
              id="integrations"
              checked={showIntegrations}
              onCheckedChange={setShowIntegrations}
            />
            <Label htmlFor="integrations" className="text-sm">Show Integrations</Label>
          </div>
          
          <Select value={selectedView} onValueChange={(v: 'grid' | 'list') => setSelectedView(v)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="grid">Grid View</SelectItem>
              <SelectItem value="list">List View</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Integration Status Banner */}
      {showIntegrations && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-3 md:p-4">
            <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:justify-between">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 md:w-8 md:h-8 bg-blue-600 rounded flex items-center justify-center">
                    <ExternalLink className="h-3 w-3 md:h-4 md:w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-900 text-sm md:text-base">External Integrations Active</h3>
                    <p className="text-xs md:text-sm text-blue-700">Jira and Slack integrations are connected and syncing</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 sm:gap-4 text-xs md:text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-blue-800">Jira Connected</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-blue-800">Slack Connected</span>
                  </div>
                </div>
              </div>
              
              <Button variant="outline" size="sm" className="text-blue-600 border-blue-300 text-xs md:text-sm self-start lg:self-auto">
                <Settings className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                <span className="hidden sm:inline">Manage Integrations</span>
                <span className="sm:hidden">Manage</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions Bar */}
      <Card>
        <CardContent className="p-3 md:p-4">
          <div className="flex flex-col md:flex-row md:items-center gap-3 md:justify-between">
            <div className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4 md:h-5 md:w-5 text-orange-600" />
              <span className="font-medium text-sm md:text-base">Restaff Personnel Quick Actions</span>
              <Badge variant="secondary" className="text-xs">Available on all team members</Badge>
            </div>
            
            <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600">
              <MessageSquare className="h-3 w-3 md:h-4 md:w-4" />
              <span className="hidden sm:inline">Click "Show Integrations" on any project to view Jira tickets & Slack channels</span>
              <span className="sm:hidden">Toggle integrations to view Jira & Slack data</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-semibold">{filteredProjectTeams.length}</p>
                <p className="text-sm text-gray-600">Active Projects</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-2xl font-semibold">
                  {filteredProjectTeams.reduce((sum, team) => 
                    sum + team.teamMembers.filter(m => m.isLead).length, 0
                  )}
                </p>
                <p className="text-sm text-gray-600">Practice Leads</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-2xl font-semibold">
                  {filteredProjectTeams.filter(team => 
                    team.project.status === 'Ending Soon'
                  ).length}
                </p>
                <p className="text-sm text-gray-600">Ending Soon</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-semibold">
                  {filteredProjectTeams.reduce((sum, team) => sum + team.teamMembers.length, 0)}
                </p>
                <p className="text-sm text-gray-600">Total Staff</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Projects Grid */}
      <div className={selectedView === 'grid' 
        ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6"
        : "space-y-4"
      }>
        {filteredProjectTeams.map(team => (
          <ProjectCard key={team.project.id} team={team} />
        ))}
      </div>

      {filteredProjectTeams.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
            <p className="text-gray-600">Try adjusting your filters to see more projects.</p>
          </CardContent>
        </Card>
      )}

      {/* Restaff Dialog */}
      <RestaffDialog 
        isOpen={restaffDialogOpen}
        onClose={() => {
          setRestaffDialogOpen(false);
          setSelectedMember(null);
        }}
        member={selectedMember}
        projects={projects}
      />
    </div>
  );
});