import { useState, memo, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { 
  ExternalLink, 
  Settings, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle,
  Clock,
  FileText,
  Users
} from "lucide-react";

interface JiraIntegrationProps {
  projectName: string;
}

interface JiraTicket {
  id: string;
  key: string;
  title: string;
  status: 'To Do' | 'In Progress' | 'Review' | 'Done';
  priority: 'High' | 'Medium' | 'Low';
  assignee: string;
  type: 'Story' | 'Task' | 'Bug' | 'Epic';
  storyPoints?: number;
}

const mockJiraTickets: JiraTicket[] = [
  {
    id: "1",
    key: "VAH-123",
    title: "User research for health portal navigation",
    status: "In Progress",
    priority: "High",
    assignee: "Sarah Chen",
    type: "Story",
    storyPoints: 8
  },
  {
    id: "2", 
    key: "VAH-124",
    title: "Design system component for medical forms",
    status: "Review",
    priority: "Medium",
    assignee: "Alex Thompson",
    type: "Task",
    storyPoints: 5
  },
  {
    id: "3",
    key: "VAH-125", 
    title: "Accessibility audit of current portal",
    status: "Done",
    priority: "High",
    assignee: "Jordan Lee",
    type: "Story",
    storyPoints: 13
  },
  {
    id: "4",
    key: "VAH-126",
    title: "Prototype patient dashboard wireframes",
    status: "To Do",
    priority: "Medium",
    assignee: "Marcus Rodriguez",
    type: "Story",
    storyPoints: 3
  }
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'Done': return <CheckCircle className="h-4 w-4 text-green-600" />;
    case 'In Progress': return <RefreshCw className="h-4 w-4 text-blue-600" />;
    case 'Review': return <Clock className="h-4 w-4 text-yellow-600" />;
    default: return <AlertCircle className="h-4 w-4 text-gray-400" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Done': return 'default';
    case 'In Progress': return 'default'; 
    case 'Review': return 'secondary';
    default: return 'outline';
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'High': return 'destructive';
    case 'Medium': return 'default';
    case 'Low': return 'secondary';
    default: return 'outline';
  }
};

export const JiraIntegration = memo(function JiraIntegration({ projectName }: JiraIntegrationProps) {
  const [isConnected, setIsConnected] = useState(true);
  const [autoSync, setAutoSync] = useState(true);
  const [showCompleted, setShowCompleted] = useState(false);

  const filteredTickets = useMemo(() => {
    return showCompleted 
      ? mockJiraTickets 
      : mockJiraTickets.filter(ticket => ticket.status !== 'Done');
  }, [showCompleted]);

  const handleSync = useCallback(() => {
    // Mock sync functionality
    console.log("Syncing with Jira...");
  }, []);

  const handleConnect = useCallback(() => {
    setIsConnected(!isConnected);
  }, [isConnected]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
              <FileText className="h-3 w-3 text-white" />
            </div>
            Jira Integration
          </CardTitle>
          
          <div className="flex items-center gap-2">
            <Badge variant={isConnected ? "default" : "destructive"}>
              {isConnected ? "Connected" : "Disconnected"}
            </Badge>
            <Button variant="outline" size="sm" onClick={handleConnect}>
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {isConnected ? (
          <>
            {/* Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="auto-sync"
                    checked={autoSync}
                    onCheckedChange={setAutoSync}
                  />
                  <Label htmlFor="auto-sync" className="text-sm">Auto-sync</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="show-completed"
                    checked={showCompleted}
                    onCheckedChange={setShowCompleted}
                  />
                  <Label htmlFor="show-completed" className="text-sm">Show completed</Label>
                </div>
              </div>
              
              <Button variant="outline" size="sm" onClick={handleSync} className="self-start sm:self-auto">
                <RefreshCw className="h-4 w-4 mr-1" />
                Sync
              </Button>
            </div>

            <Separator />

            {/* Project Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
              <div className="text-center">
                <p className="text-2xl font-semibold text-blue-600">
                  {mockJiraTickets.filter(t => t.status === 'To Do').length}
                </p>
                <p className="text-xs text-gray-600">To Do</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-semibold text-yellow-600">
                  {mockJiraTickets.filter(t => t.status === 'In Progress').length}
                </p>
                <p className="text-xs text-gray-600">In Progress</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-semibold text-orange-600">
                  {mockJiraTickets.filter(t => t.status === 'Review').length}
                </p>
                <p className="text-xs text-gray-600">Review</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-semibold text-green-600">
                  {mockJiraTickets.filter(t => t.status === 'Done').length}
                </p>
                <p className="text-xs text-gray-600">Done</p>
              </div>
            </div>

            <Separator />

            {/* Recent Tickets */}
            <div>
              <h5 className="font-medium mb-3">Recent Tickets</h5>
              <div className="space-y-2">
                {filteredTickets.slice(0, 5).map(ticket => (
                  <div key={ticket.id} className="flex items-start sm:items-center gap-2 sm:gap-3 p-2 bg-gray-50 rounded-lg">
                    <div className="pt-1 sm:pt-0">
                      {getStatusIcon(ticket.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-1">
                        <span className="font-mono text-xs sm:text-sm text-blue-600">{ticket.key}</span>
                        <Badge variant={getPriorityColor(ticket.priority)} className="text-xs">
                          {ticket.priority}
                        </Badge>
                        {ticket.storyPoints && (
                          <Badge variant="outline" className="text-xs">
                            {ticket.storyPoints} pts
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm leading-tight mb-1">{ticket.title}</p>
                      <p className="text-xs text-gray-600">{ticket.assignee}</p>
                    </div>
                    
                    <Button variant="ghost" size="sm" className="shrink-0">
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2 pt-2">
              <Button variant="outline" size="sm" className="flex-1">
                <Users className="h-4 w-4 mr-1" />
                View Board
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <FileText className="h-4 w-4 mr-1" />
                Create Ticket
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="h-6 w-6 text-gray-400" />
            </div>
            <h5 className="font-medium mb-2">Connect to Jira</h5>
            <p className="text-sm text-gray-600 mb-4">
              Connect your Jira workspace to sync project tickets and track progress.
            </p>
            <Button onClick={handleConnect}>
              Connect Jira
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
});