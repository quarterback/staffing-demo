import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { 
  Calendar, 
  Clock, 
  Users, 
  TrendingUp, 
  Target, 
  Award, 
  Activity,
  BarChart3,
  Timer,
  UserCheck,
  Briefcase
} from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface Filters {
  practice: string;
  roleType: string;
  timeHorizon: string;
}

// Mock data for charts and metrics
const decisionLatencyData = [
  { month: 'Jan', days: 8.2 },
  { month: 'Feb', days: 7.5 },
  { month: 'Mar', days: 6.8 },
  { month: 'Apr', days: 7.1 },
  { month: 'May', days: 5.9 },
  { month: 'Jun', days: 6.3 }
];

const horizonConversionData = [
  { month: 'Jan', '30day': 68, '60day': 84 },
  { month: 'Feb', '30day': 72, '60day': 88 },
  { month: 'Mar', '30day': 75, '60day': 91 },
  { month: 'Apr', '30day': 71, '60day': 87 },
  { month: 'May', '30day': 78, '60day': 93 },
  { month: 'Jun', '30day': 82, '60day': 95 }
];

const rosterMetricsData = [
  { metric: 'New Hire Assimilation', days: 12.3, target: 10 },
  { metric: '1099 Velocity', days: 4.8, target: 5 },
  { metric: 'Provisional Conversion', percentage: 67, target: 70 }
];

export function StaffingSabermetrics() {
  const [filters, setFilters] = useState<Filters>({
    practice: 'all',
    roleType: 'all',
    timeHorizon: 'all'
  });

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const kpiCards = [
    {
      title: "Time-to-Staff",
      value: "6.3",
      unit: "days",
      change: "-0.8",
      trend: "down",
      icon: Timer,
      color: "text-blue-600"
    },
    {
      title: "Role Vacancy Duration",
      value: "14.2",
      unit: "avg days",
      change: "+1.2",
      trend: "up",
      icon: Calendar,
      color: "text-orange-600"
    },
    {
      title: "Offer Conversion Rate",
      value: "87",
      unit: "%",
      change: "+3.2",
      trend: "down",
      icon: Target,
      color: "text-green-600"
    },
    {
      title: "Bench Utilization",
      value: "92",
      unit: "%",
      change: "+5.1",
      trend: "down",
      icon: Users,
      color: "text-teal-600"
    }
  ];

  const sabermetrics = [
    {
      title: "Staffing WAR",
      subtitle: "Wins Above Replacement",
      value: "2.34",
      description: "Index of how fast staff moves vs baseline",
      benchmark: "League Avg: 1.85",
      color: "text-green-600",
      icon: Award
    },
    {
      title: "Staffing ERA",
      subtitle: "Efficiency Rate Average",
      value: "94.2%",
      description: "% of staffing decisions resolved without rework",
      benchmark: "Target: 95%",
      color: "text-blue-600",
      icon: Activity
    },
    {
      title: "Lineup Stability Index",
      subtitle: "Crew Continuity Score",
      value: "78.5%",
      description: "% of project crews that remain intact across contracts",
      benchmark: "Industry: 72%",
      color: "text-teal-600",
      icon: UserCheck
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Staffing Sabermetrics</h2>
          <p className="text-gray-600 mt-1">Advanced analytics and performance metrics for crew management</p>
        </div>
        
        {/* Filter Panel */}
        <div className="flex items-center space-x-4">
          <Select value={filters.practice} onValueChange={(value) => handleFilterChange('practice', value)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Practice" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Practices</SelectItem>
              <SelectItem value="design">Design</SelectItem>
              <SelectItem value="product">Product</SelectItem>
              <SelectItem value="engineering">Engineering</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={filters.roleType} onValueChange={(value) => handleFilterChange('roleType', value)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Role Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="ic">IC/Practitioner</SelectItem>
              <SelectItem value="lead">Manager/Lead</SelectItem>
              <SelectItem value="director">Director</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={filters.timeHorizon} onValueChange={(value) => handleFilterChange('timeHorizon', value)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Time Horizon" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="active">Active Only</SelectItem>
              <SelectItem value="horizon">Horizon Only</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Top Summary Row - KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((kpi, index) => {
          const IconComponent = kpi.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">{kpi.title}</p>
                    <div className="flex items-baseline space-x-1">
                      <span className="text-2xl font-semibold text-gray-900">{kpi.value}</span>
                      <span className="text-sm text-gray-500">{kpi.unit}</span>
                    </div>
                    <div className="flex items-center mt-2">
                      <Badge 
                        variant={kpi.trend === 'down' ? 'default' : 'secondary'}
                        className={kpi.trend === 'down' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}
                      >
                        {kpi.change}
                      </Badge>
                    </div>
                  </div>
                  <div className={`${kpi.color} opacity-80`}>
                    <IconComponent className="h-8 w-8" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Trend Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              Decision Latency Trend
            </CardTitle>
            <p className="text-sm text-gray-600">Days between candidate identified and staffed</p>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={decisionLatencyData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`${value} days`, 'Decision Latency']}
                    labelStyle={{ color: '#374151' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="days" 
                    stroke="#2563eb" 
                    fill="#3b82f6" 
                    fillOpacity={0.1} 
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-teal-600" />
              Horizon Conversion Rate
            </CardTitle>
            <p className="text-sm text-gray-600">% of forecasted roles that become active</p>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={horizonConversionData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [`${value}%`, name === '30day' ? '30-day' : '60-day']}
                    labelStyle={{ color: '#374151' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="30day" 
                    stroke="#0d9488" 
                    strokeWidth={2}
                    dot={{ fill: '#0d9488', strokeWidth: 2, r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="60day" 
                    stroke="#06b6d4" 
                    strokeWidth={2}
                    dot={{ fill: '#06b6d4', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Roster Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-green-600" />
            Roster Performance Metrics
          </CardTitle>
          <p className="text-sm text-gray-600">Key onboarding and conversion metrics</p>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rosterMetricsData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis type="number" />
                <YAxis dataKey="metric" type="category" width={120} />
                <Tooltip 
                  formatter={(value, name, props) => [
                    `${value}${props.payload.metric.includes('Conversion') ? '%' : ' days'}`, 
                    'Current'
                  ]}
                  labelStyle={{ color: '#374151' }}
                />
                <Bar dataKey="days" fill="#10b981" />
                <Bar dataKey="percentage" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Sabermetrics Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-purple-600" />
            Advanced Sabermetrics
          </CardTitle>
          <p className="text-sm text-gray-600">Baseball-inspired analytics for staffing performance</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {sabermetrics.map((metric, index) => {
              const IconComponent = metric.icon;
              return (
                <div key={index} className="p-6 bg-gradient-to-br from-gray-50 to-white rounded-lg border">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{metric.title}</h4>
                      <p className="text-sm text-gray-600">{metric.subtitle}</p>
                    </div>
                    <div className={`${metric.color} opacity-80`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-gray-900">{metric.value}</span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{metric.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {metric.benchmark}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}