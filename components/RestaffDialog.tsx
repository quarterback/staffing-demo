import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Separator } from "./ui/separator";
import { Alert, AlertDescription } from "./ui/alert";
import { 
  User, 
  Calendar, 
  Percent, 
  AlertTriangle, 
  CheckCircle,
  RefreshCw,
  Crown
} from "lucide-react";
import { StaffMember, Project } from "../data/staff";
import { toast } from "sonner@2.0.3";

interface RestaffDialogProps {
  isOpen: boolean;
  onClose: () => void;
  member: StaffMember | null;
  projects: Project[];
}

export function RestaffDialog({ isOpen, onClose, member, projects }: RestaffDialogProps) {
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [newRole, setNewRole] = useState<string>("");
  const [allocation, setAllocation] = useState<string>("100");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [showConflicts, setShowConflicts] = useState(false);

  if (!member) return null;

  const handleRestaff = () => {
    if (!selectedProject || !newRole || !allocation || !startDate || !endDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    // In a real application, this would update the backend
    toast.success(`${member.name} successfully reassigned to ${projects.find(p => p.id === selectedProject)?.name}`);
    
    // Reset form
    setSelectedProject("");
    setNewRole("");
    setAllocation("100");
    setStartDate("");
    setEndDate("");
    setNotes("");
    
    onClose();
  };

  const handleCancel = () => {
    // Reset form
    setSelectedProject("");
    setNewRole("");
    setAllocation("100");
    setStartDate("");
    setEndDate("");
    setNotes("");
    
    onClose();
  };

  // Mock conflict detection
  const hasConflicts = selectedProject && allocation && parseInt(allocation) > 50;

  const availableProjects = projects.filter(p => p.status !== 'Ending Soon');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Reassign Team Member
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Assignment */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <User className="h-4 w-4" />
              Current Assignment
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-medium">{member.name}</span>
                {member.isLead && (
                  <Crown className="h-4 w-4 text-yellow-600" title="Practice Lead" />
                )}
                <Badge variant="outline">{member.level}</Badge>
                <Badge variant="secondary">{member.discipline}</Badge>
              </div>
              
              {member.currentProject ? (
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>Project:</strong> {member.currentProject.name}</p>
                  <p><strong>Role:</strong> {member.currentProject.role}</p>
                  <p><strong>Allocation:</strong> {member.currentProject.allocation}%</p>
                  <p><strong>End Date:</strong> {new Date(member.currentProject.endDate).toLocaleDateString()}</p>
                </div>
              ) : (
                <p className="text-sm text-gray-600">Currently unassigned</p>
              )}
            </div>
          </div>

          <Separator />

          {/* New Assignment Form */}
          <div className="space-y-4">
            <h4 className="font-medium">New Assignment Details</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="project">Target Project *</Label>
                <Select value={selectedProject} onValueChange={setSelectedProject}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a project" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableProjects.map(project => (
                      <SelectItem key={project.id} value={project.id}>
                        <div className="flex items-center gap-2">
                          {project.name}
                          <Badge 
                            variant={project.priority === 'high' ? 'destructive' : 'secondary'}
                            className="text-xs"
                          >
                            {project.priority}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="role">New Role *</Label>
                <Input
                  id="role"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  placeholder="e.g. Senior Product Designer"
                />
              </div>

              <div>
                <Label htmlFor="allocation">Allocation (%) *</Label>
                <Input
                  id="allocation"
                  type="number"
                  min="1"
                  max="100"
                  value={allocation}
                  onChange={(e) => setAllocation(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="endDate">End Date *</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Assignment Notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any notes about this reassignment..."
                rows={3}
              />
            </div>
          </div>

          {/* Conflict Detection */}
          {hasConflicts && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Potential Conflict Detected:</strong> High allocation may conflict with other assignments. 
                Please review team member's capacity.
              </AlertDescription>
            </Alert>
          )}

          {/* Impact Analysis */}
          {selectedProject && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h5 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Assignment Impact
              </h5>
              <div className="text-sm text-blue-800 space-y-1">
                <p>• {member.name} will transition from current project</p>
                <p>• Selected project will gain {member.discipline} expertise</p>
                <p>• Skills match: {member.skills.slice(0, 3).join(', ')}</p>
                {member.isLead && (
                  <p>• <strong>Practice Lead</strong> - Consider impact on current team</p>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            
            <div className="space-x-2">
              <Button variant="outline" onClick={() => setShowConflicts(!showConflicts)}>
                Check Conflicts
              </Button>
              <Button onClick={handleRestaff} disabled={!selectedProject || !newRole}>
                Confirm Reassignment
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}