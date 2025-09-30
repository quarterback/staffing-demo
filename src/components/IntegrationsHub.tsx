import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { 
  ExternalLink, 
  Settings, 
  RefreshCw, 
  CheckCircle, 
  FileText,
  MessageSquare,
  AlertCircle,
  Zap,
  Users,
  Calendar,
  BarChart3
} from "lucide-react";
import { JiraIntegration } from "./JiraIntegration";
import { SlackIntegration } from "./SlackIntegration";

export function IntegrationsHub() {
  const [jiraEnabled, setJiraEnabled] = useState(true);
  const [slackEnabled, setSlackEnabled] = useState(true);
  const [autoSync, setAutoSync] = useState(true);
  const [selectedProject, setSelectedProject] = useState("VA Health Portal Redesign");

  const projects = [
    "VA Health Portal Redesign",
    "Benefits Modernization Initiative", 
    "Platform Consolidation",
    "Mobile App Redesign"
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Integrations Hub</h2>
          <p className="text-gray-600">Manage external tool connections and automations</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center space-x-2">
            <Switch
              id="auto-sync"
              checked={autoSync}
              onCheckedChange={setAutoSync}
            />
            <Label htmlFor="auto-sync">Auto-sync All</Label>
          </div>
          
          <Button>
            <Settings className="h-4 w-4 mr-2" />
            Integration Settings
          </Button>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold">Jira</p>
                  <Badge variant={jiraEnabled ? "default" : "destructive"}>
                    {jiraEnabled ? "Connected" : "Disconnected"}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">4 active projects syncing</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold">Slack</p>
                  <Badge variant={slackEnabled ? "default" : "destructive"}>
                    {slackEnabled ? "Connected" : "Disconnected"}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">12 channels monitored</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Zap className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-semibold">Automations</p>
                <p className="text-sm text-gray-600">3 active workflows</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Integration Tabs */}
      <Tabs defaultValue="jira" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="jira">Jira</TabsTrigger>
          <TabsTrigger value="slack">Slack</TabsTrigger>
          <TabsTrigger value="automations">Automations</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="jira" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Project Selection</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {projects.map(project => (
                    <button
                      key={project}
                      onClick={() => setSelectedProject(project)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        selectedProject === project
                          ? 'bg-blue-100 text-blue-900 border-2 border-blue-200'
                          : 'hover:bg-gray-50 border border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{project}</span>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                    </button>
                  ))}
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-2">
              <JiraIntegration projectName={selectedProject} />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="slack" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Project Channels</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {projects.map(project => (
                    <button
                      key={project}
                      onClick={() => setSelectedProject(project)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        selectedProject === project
                          ? 'bg-purple-100 text-purple-900 border-2 border-purple-200'
                          : 'hover:bg-gray-50 border border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">#{project.toLowerCase().replace(/\s+/g, '-')}</span>
                        <MessageSquare className="h-4 w-4 text-purple-600" />
                      </div>
                    </button>
                  ))}
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-2">
              <SlackIntegration projectName={selectedProject} />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="automations" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-green-600" />
                  Active Automations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="font-medium">Auto-sync Jira tickets</p>
                    <p className="text-sm text-gray-600">Every 15 minutes</p>
                  </div>
                  <Switch checked={true} />
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="font-medium">Slack staffing notifications</p>
                    <p className="text-sm text-gray-600">Real-time updates</p>
                  </div>
                  <Switch checked={true} />
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="font-medium">Project status updates</p>
                    <p className="text-sm text-gray-600">Daily at 9 AM</p>
                  </div>
                  <Switch checked={true} />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-blue-600" />
                  Available Automations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Auto-assign based on skills</p>
                    <p className="text-sm text-gray-600">Coming soon</p>
                  </div>
                  <Switch checked={false} disabled />
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Calendar integration</p>
                    <p className="text-sm text-gray-600">Beta</p>
                  </div>
                  <Switch checked={false} />
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Capacity forecasting</p>
                    <p className="text-sm text-gray-600">Coming soon</p>
                  </div>
                  <Switch checked={false} disabled />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-2xl font-semibold">94%</p>
                    <p className="text-sm text-gray-600">Sync Success Rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-2xl font-semibold">2.3m</p>
                    <p className="text-sm text-gray-600">Avg Response Time</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-2xl font-semibold">127</p>
                    <p className="text-sm text-gray-600">Active Connections</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Integration Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Jira API Health</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-600">Excellent</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Slack Webhook Status</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-600">Active</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Data Sync Latency</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm text-yellow-600">Fair (3.2s)</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}