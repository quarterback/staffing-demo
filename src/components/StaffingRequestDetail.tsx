import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { 
  Calendar, 
  Clock, 
  User, 
  Building, 
  Mail, 
  CheckCircle, 
  ArrowUpCircle, 
  AlertTriangle,
  Briefcase,
  Target,
  Users,
  FileText,
  MapPin,
  DollarSign
} from "lucide-react";
import { getStaffingRequestStatus } from "../data/assignments";

interface DetailedStaffingRequest {
  id: string;
  roleTitle: string;
  level: string;
  practice: string;
  projectName: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  requester: {
    name: string;
    email: string;
    role: string;
    department: string;
  };
  description: string;
  responsibilities: string[];
  requiredSkills: string[];
  preferredSkills: string[];
  timeline: {
    startDate: string;
    endDate: string;
    commitment: string;
  };
  budget: {
    allocation: string;
    billable: boolean;
  };
  location: string;
  context: string;
  successCriteria: string[];
  requestDate: string;
}

// Extended mock data with detailed information
const getDetailedRequest = (id: string): DetailedStaffingRequest | null => {
  const detailedRequests: Record<string, DetailedStaffingRequest> = {
    "1": {
      id: "1",
      roleTitle: "Product Designer",
      level: "D5",
      practice: "Product Design",
      projectName: "VA Health Portal Redesign",
      dueDate: "2024-10-15",
      priority: "high",
      requester: {
        name: "Sarah Chen",
        email: "sarah.chen@va.gov",
        role: "Product Manager",
        department: "Digital Health Services"
      },
      description: "We need an experienced product designer to lead the redesign of our veteran health portal. This is a critical initiative to improve healthcare access for 9M+ veterans.",
      responsibilities: [
        "Lead end-to-end design for veteran health portal redesign",
        "Conduct user research with veterans and healthcare providers",
        "Design intuitive workflows for appointment scheduling and medical records",
        "Create accessibility-compliant interfaces (WCAG 2.1 AA)",
        "Collaborate with engineering teams on implementation",
        "Present design recommendations to senior leadership"
      ],
      requiredSkills: [
        "Healthcare UX design experience",
        "Accessibility design expertise",
        "User research and testing",
        "Design systems knowledge",
        "Figma proficiency"
      ],
      preferredSkills: [
        "Government/public sector experience",
        "Medical terminology familiarity",
        "HIPAA compliance knowledge",
        "Veterans Affairs domain knowledge"
      ],
      timeline: {
        startDate: "2024-10-20",
        endDate: "2025-04-15",
        commitment: "Full-time (40 hrs/week)"
      },
      budget: {
        allocation: "100% allocated to project",
        billable: true
      },
      location: "Hybrid (DC Metro + Remote)",
      context: "This redesign is part of the VA's digital transformation initiative to modernize veteran services. The current portal has low user satisfaction scores and accessibility issues.",
      successCriteria: [
        "Improve user satisfaction score from 2.1 to 4.0+",
        "Reduce appointment booking time by 60%",
        "Achieve 100% WCAG 2.1 AA compliance",
        "Complete user testing with 50+ veterans"
      ],
      requestDate: "2024-09-15"
    },
    "2": {
      id: "2",
      roleTitle: "UX Generalist",
      level: "D4",
      practice: "UX Generalist",
      projectName: "Medicare Claims System",
      dueDate: "2024-10-22",
      priority: "medium",
      requester: {
        name: "Michael Rodriguez",
        email: "m.rodriguez@cms.gov",
        role: "Senior Product Owner",
        department: "Medicare Systems"
      },
      description: "Seeking a UX generalist to optimize the Medicare claims processing system used by healthcare providers nationwide.",
      responsibilities: [
        "Conduct usability analysis of current claims system",
        "Design improved workflows for healthcare providers",
        "Create wireframes and prototypes for new features",
        "Facilitate design workshops with stakeholders",
        "Support front-end development team with design specs"
      ],
      requiredSkills: [
        "UX research and analysis",
        "Wireframing and prototyping",
        "Healthcare industry knowledge",
        "Stakeholder collaboration",
        "Design documentation"
      ],
      preferredSkills: [
        "Claims processing experience",
        "B2B interface design",
        "Workshop facilitation",
        "Data visualization"
      ],
      timeline: {
        startDate: "2024-10-25",
        endDate: "2024-12-20",
        commitment: "Part-time (20 hrs/week)"
      },
      budget: {
        allocation: "50% allocated to project",
        billable: true
      },
      location: "Remote",
      context: "The current system processes 1.6M claims daily but has efficiency bottlenecks causing provider frustration and payment delays.",
      successCriteria: [
        "Reduce average claim processing time by 30%",
        "Improve provider satisfaction scores",
        "Decrease error rates in claim submissions",
        "Complete stakeholder alignment on new workflows"
      ],
      requestDate: "2024-09-20"
    },
    "3": {
      id: "3",
      roleTitle: "Service Designer",
      level: "D6",
      practice: "Service Design",
      projectName: "Benefits Modernization",
      dueDate: "2024-10-08",
      priority: "high",
      requester: {
        name: "Dr. Jennifer Park",
        email: "jennifer.park@va.gov",
        role: "Director of Benefits",
        department: "Veterans Benefits Administration"
      },
      description: "Lead service designer needed for comprehensive benefits modernization affecting 4M+ veterans. This role requires strategic thinking and complex systems design.",
      responsibilities: [
        "Map current end-to-end benefits journey",
        "Identify pain points across multiple touchpoints",
        "Design future-state service blueprints",
        "Lead cross-functional design workshops",
        "Create service design artifacts and documentation",
        "Guide implementation roadmap with product teams"
      ],
      requiredSkills: [
        "Service design methodology",
        "Journey mapping expertise",
        "Systems thinking",
        "Workshop facilitation",
        "Stakeholder management",
        "Government services experience"
      ],
      preferredSkills: [
        "Benefits administration knowledge",
        "Change management experience",
        "Policy design understanding",
        "Multi-channel service design"
      ],
      timeline: {
        startDate: "2024-10-10",
        endDate: "2025-06-30",
        commitment: "Full-time (40 hrs/week)"
      },
      budget: {
        allocation: "100% allocated to project",
        billable: true
      },
      location: "Washington, DC (On-site required)",
      context: "Major modernization effort to streamline benefits delivery across disability, education, home loans, and career services.",
      successCriteria: [
        "Complete service blueprint for all benefit types",
        "Reduce benefit application time by 40%",
        "Improve veteran satisfaction scores to 4.5+",
        "Deliver implementation roadmap by Q2 2025"
      ],
      requestDate: "2024-09-01"
    },
    "4": {
      id: "4",
      roleTitle: "Content Strategist",
      level: "D5",
      practice: "Content Strategy",
      projectName: "Digital Services Content Audit",
      dueDate: "2024-11-01",
      priority: "low",
      requester: {
        name: "Emma Thompson",
        email: "emma.thompson@gsa.gov",
        role: "Content Operations Manager",
        department: "Technology Transformation Services"
      },
      description: "Looking for an experienced content strategist to lead a comprehensive audit of digital services content across federal agencies.",
      responsibilities: [
        "Conduct content audit across 15+ federal digital services",
        "Analyze content performance and user engagement metrics",
        "Develop content strategy recommendations",
        "Create content governance framework",
        "Train agency teams on content best practices"
      ],
      requiredSkills: [
        "Content strategy and audit experience",
        "Government digital services knowledge",
        "Content analytics and measurement",
        "Information architecture",
        "Content governance frameworks"
      ],
      preferredSkills: [
        "Federal agency experience",
        "Section 508 compliance knowledge",
        "Multi-agency collaboration",
        "Content management systems"
      ],
      timeline: {
        startDate: "2024-11-05",
        endDate: "2025-02-28",
        commitment: "Part-time (25 hrs/week)"
      },
      budget: {
        allocation: "60% allocated to project",
        billable: true
      },
      location: "Remote with quarterly DC visits",
      context: "Part of the federal digital services modernization initiative to improve citizen experience across government touchpoints.",
      successCriteria: [
        "Complete audit of all target digital services",
        "Deliver comprehensive content strategy framework",
        "Train 50+ government content professionals",
        "Establish measurable content quality standards"
      ],
      requestDate: "2024-09-10"
    },
    "5": {
      id: "5",
      roleTitle: "Front-end Designer",
      level: "D4",
      practice: "Front-end Design",
      projectName: "Design System Implementation",
      dueDate: "2024-10-18",
      priority: "medium",
      requester: {
        name: "Alex Kim",
        email: "alex.kim@usds.gov",
        role: "Engineering Lead",
        department: "U.S. Digital Service"
      },
      description: "Seeking a front-end designer to help implement and scale our government design system across multiple federal applications.",
      responsibilities: [
        "Design and develop reusable component library",
        "Create comprehensive design system documentation",
        "Collaborate with engineering teams on implementation",
        "Ensure accessibility compliance across all components",
        "Support adoption across federal development teams"
      ],
      requiredSkills: [
        "Front-end design and development",
        "Design systems experience",
        "React component development",
        "Accessibility (WCAG 2.1 AA) expertise",
        "Design tokens and tooling"
      ],
      preferredSkills: [
        "Government design system experience",
        "Storybook and documentation tools",
        "Multi-brand design systems",
        "Developer experience optimization"
      ],
      timeline: {
        startDate: "2024-10-21",
        endDate: "2024-12-15",
        commitment: "Full-time (40 hrs/week)"
      },
      budget: {
        allocation: "100% allocated to project",
        billable: false
      },
      location: "Remote",
      context: "Expanding the USWDS design system to support rapid development of citizen-facing federal applications.",
      successCriteria: [
        "Launch 25+ new design system components",
        "Achieve 90%+ adoption rate across target applications",
        "Reduce development time for new features by 40%",
        "Maintain 100% accessibility compliance"
      ],
      requestDate: "2024-09-12"
    },
    "6": {
      id: "6",
      roleTitle: "Developer Experience Designer",
      level: "D5",
      practice: "Developer Experience",
      projectName: "Internal Tools Optimization",
      dueDate: "2024-11-05",
      priority: "medium",
      requester: {
        name: "David Chen",
        email: "david.chen@gsa.gov",
        role: "DevOps Platform Lead",
        department: "Technology Transformation Services"
      },
      description: "Need a developer experience designer to optimize internal development tools and workflows used by 200+ government developers.",
      responsibilities: [
        "Research current developer workflows and pain points",
        "Design improved developer experience for CI/CD pipelines",
        "Create developer onboarding and documentation experiences",
        "Optimize development environment setup and tooling",
        "Design developer portal and self-service capabilities"
      ],
      requiredSkills: [
        "Developer experience design",
        "DevOps and CI/CD understanding",
        "Developer workflow optimization",
        "Technical documentation design",
        "User research with technical audiences"
      ],
      preferredSkills: [
        "Government development environments",
        "Security compliance workflows",
        "Developer portal design",
        "API documentation and tooling"
      ],
      timeline: {
        startDate: "2024-11-10",
        endDate: "2025-01-30",
        commitment: "Part-time (30 hrs/week)"
      },
      budget: {
        allocation: "75% allocated to project",
        billable: false
      },
      location: "Hybrid (DC Metro area)",
      context: "Improving developer productivity and satisfaction across federal development teams to accelerate digital service delivery.",
      successCriteria: [
        "Reduce developer onboarding time by 50%",
        "Improve developer satisfaction scores to 4.0+",
        "Decrease build and deployment times by 30%",
        "Launch self-service developer portal"
      ],
      requestDate: "2024-09-18"
    }
  };

  return detailedRequests[id] || null;
};

interface StaffingRequestDetailProps {
  requestId: string;
  onAssignCandidate: (candidateId: string) => void;
  onEscalateToTA: () => void;
  onBack: () => void;
  onViewRecommendations?: () => void;
}

export function StaffingRequestDetail({ 
  requestId, 
  onAssignCandidate, 
  onEscalateToTA,
  onBack,
  onViewRecommendations
}: StaffingRequestDetailProps) {
  const request = getDetailedRequest(requestId);
  const status = getStaffingRequestStatus(requestId);

  if (!request) {
    return (
      <Card className="p-6">
        <p className="text-gray-500">Request not found</p>
      </Card>
    );
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'filled': return 'bg-green-100 text-green-800';
      case 'escalated': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'filled': return <CheckCircle className="h-4 w-4" />;
      case 'escalated': return <ArrowUpCircle className="h-4 w-4" />;
      case 'in_progress': return <Clock className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'D3': return 'bg-emerald-100 text-emerald-800';
      case 'D4': return 'bg-blue-100 text-blue-800';
      case 'D5': return 'bg-indigo-100 text-indigo-800';
      case 'D6': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric',
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getDaysUntilDue = (dateString: string) => {
    const today = new Date();
    const dueDate = new Date(dateString);
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilDue = getDaysUntilDue(request.dueDate);

  return (
    <div className="space-y-6 request-detail">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack} className="text-sm">
          ← Back to Requests
        </Button>
        <div className="flex items-center space-x-2">
          <Badge className={getStatusColor(status)} variant="secondary">
            <div className="flex items-center space-x-1">
              {getStatusIcon(status)}
              <span className="capitalize">{status.replace('_', ' ')}</span>
            </div>
          </Badge>
        </div>
      </div>

      {/* Main Request Card */}
      <Card className="p-6">
        <div className="space-y-6">
          {/* Title and Basic Info */}
          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900 mb-2">{request.roleTitle}</h1>
                <p className="text-gray-600 mb-3">{request.projectName}</p>
                <div className="flex items-center space-x-3">
                  <Badge className={getLevelColor(request.level)} variant="secondary">
                    {request.level}
                  </Badge>
                  <Badge className={getPriorityColor(request.priority)} variant="secondary">
                    {request.priority} priority
                  </Badge>
                  <Badge variant="outline">
                    {request.practice}
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-1 text-sm text-gray-500 mb-1">
                  <Calendar className="h-4 w-4" />
                  <span>Due {formatDate(request.dueDate)}</span>
                </div>
                <div className="flex items-center space-x-1 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  <span className={daysUntilDue <= 3 ? 'text-red-600 font-medium' : ''}>
                    {daysUntilDue > 0 ? `${daysUntilDue} days left` : 
                     daysUntilDue === 0 ? 'Due today' : 
                     `${Math.abs(daysUntilDue)} days overdue`}
                  </span>
                </div>
              </div>
            </div>
            
            <p className="text-gray-700 leading-relaxed">{request.description}</p>
          </div>

          <Separator />

          {/* Requester Information */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3 flex items-center">
              <User className="h-4 w-4 mr-2" />
              Request Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Requested by:</span>
                  <span className="text-sm font-medium">{request.requester.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{request.requester.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Building className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{request.requester.department}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Requester role:</span>
                  <span className="text-sm font-medium">{request.requester.role}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Requested {formatDate(request.requestDate)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{request.location}</span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Timeline and Budget */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                <Briefcase className="h-4 w-4 mr-2" />
                Timeline & Commitment
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Start Date:</span>
                  <span className="text-sm font-medium">{formatDate(request.timeline.startDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">End Date:</span>
                  <span className="text-sm font-medium">{formatDate(request.timeline.endDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Commitment:</span>
                  <span className="text-sm font-medium">{request.timeline.commitment}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                <DollarSign className="h-4 w-4 mr-2" />
                Budget & Allocation
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Allocation:</span>
                  <span className="text-sm font-medium">{request.budget.allocation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Billable:</span>
                  <span className="text-sm font-medium">{request.budget.billable ? 'Yes' : 'No'}</span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Responsibilities */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3 flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Key Responsibilities
            </h3>
            <ul className="space-y-2">
              {request.responsibilities.map((responsibility, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-teal-500 mt-1">•</span>
                  <span className="text-sm text-gray-700">{responsibility}</span>
                </li>
              ))}
            </ul>
          </div>

          <Separator />

          {/* Skills */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {request.requiredSkills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="bg-red-50 text-red-700">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Preferred Skills</h3>
              <div className="flex flex-wrap gap-2">
                {request.preferredSkills.map((skill, index) => (
                  <Badge key={index} variant="outline" className="border-green-200 text-green-700">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <Separator />

          {/* Context and Success Criteria */}
          <div className="space-y-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Project Context</h3>
              <p className="text-sm text-gray-700 leading-relaxed">{request.context}</p>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                <Target className="h-4 w-4 mr-2" />
                Success Criteria
              </h3>
              <ul className="space-y-2">
                {request.successCriteria.map((criteria, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{criteria}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      {status === 'open' && (
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">Ready to staff this position?</span>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" onClick={onEscalateToTA}>
                Escalate to TA
              </Button>
              <Button 
                onClick={onViewRecommendations} 
                className="bg-teal-600 hover:bg-teal-700 view-recommendations-btn"
              >
                View AI Recommendations
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}