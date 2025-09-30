import { useState, memo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { 
  MessageSquare, 
  Settings, 
  Bell, 
  Hash,
  Users,
  Send,
  ExternalLink
} from "lucide-react";

interface SlackIntegrationProps {
  projectName: string;
}

interface SlackChannel {
  id: string;
  name: string;
  isPrivate: boolean;
  memberCount: number;
  lastActivity: string;
}

interface SlackMessage {
  id: string;
  user: string;
  message: string;
  timestamp: string;
  channel: string;
}

const mockChannels: SlackChannel[] = [
  {
    id: "1",
    name: "va-health-portal-team",
    isPrivate: false,
    memberCount: 8,
    lastActivity: "2 hours ago"
  },
  {
    id: "2", 
    name: "design-reviews",
    isPrivate: false,
    memberCount: 12,
    lastActivity: "30 minutes ago"
  },
  {
    id: "3",
    name: "va-health-stakeholders",
    isPrivate: true,
    memberCount: 5,
    lastActivity: "1 day ago"
  }
];

const mockMessages: SlackMessage[] = [
  {
    id: "1",
    user: "Sarah Chen",
    message: "Just finished the user research findings doc. Ready for review!",
    timestamp: "2:30 PM",
    channel: "va-health-portal-team"
  },
  {
    id: "2",
    user: "Marcus Rodriguez", 
    message: "Can we schedule a design critique for tomorrow?",
    timestamp: "1:45 PM", 
    channel: "design-reviews"
  },
  {
    id: "3",
    user: "Jennifer Kim",
    message: "Stakeholder feedback has been positive on the service blueprint",
    timestamp: "11:20 AM",
    channel: "va-health-stakeholders"
  }
];

const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
};

export const SlackIntegration = memo(function SlackIntegration({ projectName }: SlackIntegrationProps) {
  const [isConnected, setIsConnected] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [autoCreateChannels, setAutoCreateChannels] = useState(false);

  const handleConnect = useCallback(() => {
    setIsConnected(!isConnected);
  }, [isConnected]);

  const handleJoinChannel = useCallback((channelName: string) => {
    console.log(`Joining channel: ${channelName}`);
  }, []);

  const handleCreateChannel = useCallback(() => {
    console.log("Creating project channel...");
  }, []);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <div className="w-6 h-6 bg-purple-600 rounded flex items-center justify-center">
              <MessageSquare className="h-3 w-3 text-white" />
            </div>
            Slack Integration
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
            {/* Settings */}
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
              <div className="flex flex-col sm:flex-row gap-3 sm:space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="notifications"
                    checked={notifications}
                    onCheckedChange={setNotifications}
                  />
                  <Label htmlFor="notifications" className="text-sm">Notifications</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="auto-channels"
                    checked={autoCreateChannels}
                    onCheckedChange={setAutoCreateChannels}
                  />
                  <Label htmlFor="auto-channels" className="text-sm">Auto-create channels</Label>
                </div>
              </div>
            </div>

            <Separator />

            {/* Project Channels */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h5 className="font-medium">Project Channels</h5>
                <Button variant="outline" size="sm" onClick={handleCreateChannel}>
                  <Hash className="h-4 w-4 mr-1" />
                  Create Channel
                </Button>
              </div>
              
              <div className="space-y-2">
                {mockChannels.map(channel => (
                  <div key={channel.id} className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <Hash className="h-4 w-4 text-gray-500 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="font-medium text-sm truncate">#{channel.name}</span>
                          {channel.isPrivate && (
                            <Badge variant="secondary" className="text-xs">Private</Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-600">
                          {channel.memberCount} members • Last activity {channel.lastActivity}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 shrink-0">
                      <Button variant="outline" size="sm" onClick={() => handleJoinChannel(channel.name)} className="text-xs">
                        <Users className="h-3 w-3 mr-1" />
                        <span className="hidden sm:inline">Join</span>
                      </Button>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Recent Messages */}
            <div>
              <h5 className="font-medium mb-3">Recent Messages</h5>
              <div className="space-y-3">
                {mockMessages.map(message => (
                  <div key={message.id} className="flex items-start gap-2 sm:gap-3 p-2 hover:bg-gray-50 rounded-lg">
                    <Avatar className="h-6 w-6 sm:h-8 sm:w-8 mt-1 shrink-0">
                      <AvatarFallback className="text-xs">
                        {getInitials(message.user)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-1">
                        <span className="font-medium text-xs sm:text-sm">{message.user}</span>
                        <span className="text-xs text-gray-500">#{message.channel}</span>
                        <span className="text-xs text-gray-500">{message.timestamp}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-700 leading-tight">{message.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2 pt-2">
              <Button variant="outline" size="sm" className="flex-1">
                <Send className="h-4 w-4 mr-1" />
                Send Update
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <Bell className="h-4 w-4 mr-1" />
                Manage Alerts
              </Button>
            </div>

            {/* Notification Settings */}
            <div className="bg-blue-50 p-3 rounded-lg">
              <h6 className="font-medium text-blue-900 mb-2">Active Notifications</h6>
              <div className="text-sm text-blue-800 space-y-1">
                <p>• Staffing changes and assignments</p>
                <p>• Project milestone updates</p>
                <p>• Team member availability changes</p>
                <p>• Critical project alerts</p>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="h-6 w-6 text-gray-400" />
            </div>
            <h5 className="font-medium mb-2">Connect to Slack</h5>
            <p className="text-sm text-gray-600 mb-4">
              Connect your Slack workspace to enable team notifications and project communications.
            </p>
            <Button onClick={handleConnect}>
              Connect Slack
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
});