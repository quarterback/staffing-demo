import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner@2.0.3";

interface CreateStaffingRequestDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (request: any) => void;
}

export function CreateStaffingRequestDialog({ isOpen, onClose, onCreate }: CreateStaffingRequestDialogProps) {
  const [roleTitle, setRoleTitle] = useState('');
  const [level, setLevel] = useState('');
  const [practice, setPractice] = useState('');
  const [projectName, setProjectName] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    if (!roleTitle || !level || !practice || !projectName || !dueDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newRequest = {
      id: Math.random().toString(36).substr(2, 9),
      roleTitle,
      level,
      practice,
      projectName,
      dueDate,
      priority,
      description,
      status: 'open' as const,
      createdDate: new Date().toISOString()
    };

    onCreate(newRequest);
    toast.success(`Staffing request created: ${roleTitle} for ${projectName}`);
    
    // Reset form
    setRoleTitle('');
    setLevel('');
    setPractice('');
    setProjectName('');
    setDueDate('');
    setPriority('medium');
    setDescription('');
    
    onClose();
  };

  const handleClose = () => {
    // Reset form on close
    setRoleTitle('');
    setLevel('');
    setPractice('');
    setProjectName('');
    setDueDate('');
    setPriority('medium');
    setDescription('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Staffing Request</DialogTitle>
          <DialogDescription>
            Add a new staffing request to the queue for assignment.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Role Title *</label>
              <Select value={practice} onValueChange={(value) => {
                setPractice(value);
                setRoleTitle(value === 'UX Generalist' ? 'UX Designer' : 
                           value === 'Product Design' ? 'Product Designer' :
                           value === 'Service Design' ? 'Service Designer' :
                           value === 'Front-end Design' ? 'Front-end Designer' :
                           value === 'Developer Experience' ? 'DX Designer' :
                           value === 'Content Strategy' ? 'Content Strategist' : '');
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select practice area" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Service Design">Service Design</SelectItem>
                  <SelectItem value="UX Generalist">UX Generalist</SelectItem>
                  <SelectItem value="Product Design">Product Design</SelectItem>
                  <SelectItem value="Front-end Design">Front-end Design</SelectItem>
                  <SelectItem value="Developer Experience">Developer Experience</SelectItem>
                  <SelectItem value="Content Strategy">Content Strategy</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700">Level *</label>
              <Select value={level} onValueChange={setLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="D3">D3</SelectItem>
                  <SelectItem value="D4">D4</SelectItem>
                  <SelectItem value="D5">D5</SelectItem>
                  <SelectItem value="D6">D6</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Custom Role Title</label>
            <Input
              value={roleTitle}
              onChange={(e) => setRoleTitle(e.target.value)}
              placeholder="e.g., Senior Product Designer, Lead UX Researcher"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700">Project Name *</label>
            <Input
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="e.g., VA Health Portal Redesign"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Due Date *</label>
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700">Priority</label>
              <Select value={priority} onValueChange={(value: 'high' | 'medium' | 'low') => setPriority(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700">Description (Optional)</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Additional details about the role, project context, or specific requirements..."
              rows={3}
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              Create Request
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}