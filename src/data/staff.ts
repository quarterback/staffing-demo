import { apiService, type StaffMember, type Project } from '../utils/api';

// Functions that now use the API service
export const getStaff = async () => {
  return await apiService.getStaff();
};

export const getProjects = async () => {
  return await apiService.getProjects();
};

export const createStaff = async (staff: Omit<StaffMember, 'id'>) => {
  return await apiService.createStaff(staff);
};

export const updateStaff = async (id: string, updates: Partial<StaffMember>) => {
  return await apiService.updateStaff(id, updates);
};

export const createProject = async (project: Omit<Project, 'id'>) => {
  return await apiService.createProject(project);
};

// Re-export types
export type { StaffMember, Project };

export const mockStaff: StaffMember[] = [
  {
    id: "1",
    name: "Sarah Chen",
    level: "D5",
    discipline: "Product Design",
    skills: ["User Research", "Prototyping", "Design Systems", "Accessibility"],
    currentProject: {
      name: "VA Health Portal Redesign",
      allocation: 100,
      endDate: "2024-11-15",
      role: "Lead Product Designer"
    },
    availabilityStatus: "100% Staffed",
    location: "San Francisco",
    startDate: "2022-03-15",
    isLead: true
  },
  {
    id: "2",
    name: "Marcus Rodriguez",
    level: "D4",
    discipline: "UX Generalist",
    skills: ["User Research", "Usability Testing", "Information Architecture", "Visual Design"],
    currentProject: {
      name: "Medicare Claims Portal",
      allocation: 50,
      endDate: "2024-10-30",
      role: "UX Designer"
    },
    availabilityStatus: "50% Staffed",
    location: "Austin",
    startDate: "2023-01-10"
  },
  {
    id: "3",
    name: "Jennifer Kim",
    level: "D6",
    discipline: "Service Design",
    skills: ["Service Blueprints", "User Journey Mapping", "Design Strategy", "Cross-functional Collaboration"],
    currentProject: {
      name: "Benefits Modernization Initiative",
      allocation: 100,
      endDate: "2025-02-28",
      role: "Principal Service Designer"
    },
    availabilityStatus: "100% Staffed",
    location: "Washington DC",
    startDate: "2021-06-01",
    isLead: true
  },
  {
    id: "4",
    name: "Alex Thompson",
    level: "D4",
    discipline: "Front-end Design",
    skills: ["Design Systems", "Component Libraries", "Prototyping", "Accessibility"],
    currentProject: {
      name: "Design System Implementation",
      allocation: 100,
      endDate: "2024-12-01",
      role: "Design Systems Designer"
    },
    availabilityStatus: "100% Staffed",
    location: "Remote",
    startDate: "2022-09-12"
  },
  {
    id: "5",
    name: "Maya Patel",
    level: "D5",
    discipline: "Content Strategy",
    skills: ["Content Design", "UX Writing", "Information Architecture", "Content Strategy"],
    currentProject: {
      name: "Digital Services Content Audit",
      allocation: 50,
      endDate: "2024-11-30",
      role: "Content Strategist"
    },
    availabilityStatus: "50% Staffed",
    location: "Denver",
    startDate: "2021-11-08"
  },
  {
    id: "6",
    name: "Jordan Lee",
    level: "D3",
    discipline: "UX Generalist",
    skills: ["User Research", "Wireframing", "Prototyping", "Usability Testing"],
    currentProject: {
      name: "Accessibility Audit Project",
      allocation: 75,
      endDate: "2024-11-05",
      role: "UX Researcher"
    },
    availabilityStatus: "100% Staffed",
    location: "Chicago",
    startDate: "2024-02-01"
  },
  {
    id: "7",
    name: "Taylor Swift",
    level: "D5",
    discipline: "Developer Experience",
    skills: ["Developer Tools", "API Design", "Technical Documentation", "Design Systems"],
    currentProject: {
      name: "Internal Tools Optimization",
      allocation: 100,
      endDate: "2024-11-15",
      role: "DX Designer"
    },
    availabilityStatus: "100% Staffed",
    location: "Seattle",
    startDate: "2022-07-20"
  },
  {
    id: "8",
    name: "Robin Martinez",
    level: "D4",
    discipline: "Product Design",
    skills: ["Interaction Design", "Visual Design", "User Research", "Prototyping"],
    currentProject: {
      name: "Mobile App Redesign",
      allocation: 100,
      endDate: "2024-10-25",
      role: "Product Designer"
    },
    availabilityStatus: "100% Staffed",
    location: "Los Angeles",
    startDate: "2023-05-15"
  },
  {
    id: "9",
    name: "Casey Johnson",
    level: "D3",
    discipline: "Service Design",
    skills: ["Service Blueprints", "User Journey Mapping", "Research Synthesis"],
    availabilityStatus: "Bench",
    location: "Portland",
    startDate: "2023-08-01"
  },
  {
    id: "10",
    name: "Sam Wilson",
    level: "D6",
    discipline: "Product Design",
    skills: ["Design Strategy", "Team Leadership", "Design Systems", "Product Strategy"],
    currentProject: {
      name: "Platform Consolidation",
      allocation: 50,
      endDate: "2025-01-31",
      role: "Design Lead"
    },
    availabilityStatus: "50% Staffed",
    location: "New York",
    startDate: "2020-04-01"
  },
  {
    id: "11",
    name: "Riley Davis",
    level: "D4",
    discipline: "Content Strategy",
    skills: ["UX Writing", "Content Design", "Voice & Tone", "Accessibility"],
    availabilityStatus: "New Hire",
    location: "Remote",
    startDate: "2024-09-01"
  },
  {
    id: "12",
    name: "Morgan Clarke",
    level: "D3",
    discipline: "Front-end Design",
    skills: ["Visual Design", "Prototyping", "Design Systems", "CSS/HTML"],
    availabilityStatus: "New Hire",
    location: "Miami",
    startDate: "2024-08-15"
  },
  {
    id: "13",
    name: "Avery Kim",
    level: "D4",
    discipline: "UX Generalist",
    skills: ["User Research", "Information Architecture", "Prototyping", "Usability Testing"],
    currentProject: {
      name: "User Testing Platform",
      allocation: 100,
      endDate: "2024-11-08",
      role: "UX Researcher"
    },
    availabilityStatus: "100% Staffed",
    location: "Boston",
    startDate: "2023-12-01"
  },
  {
    id: "14",
    name: "Drew Chen",
    level: "D3",
    discipline: "Product Design",
    skills: ["Visual Design", "Interaction Design", "Prototyping"],
    availabilityStatus: "New Hire",
    location: "San Diego",
    startDate: "2024-09-15"
  },
  {
    id: "15",
    name: "Quinn Torres",
    level: "D4",
    discipline: "Service Design",
    skills: ["Service Blueprints", "Journey Mapping", "Design Research", "Process Design"],
    currentProject: {
      name: "Citizen Services Redesign",
      allocation: 75,
      endDate: "2024-10-28",
      role: "Service Designer"
    },
    availabilityStatus: "100% Staffed",
    location: "Austin",
    startDate: "2023-03-01"
  },
  {
    id: "16",
    name: "Blake Anderson",
    level: "D5",
    discipline: "Front-end Design",
    skills: ["Design Systems", "Component Design", "Prototyping", "CSS/HTML"],
    currentProject: {
      name: "Component Library Migration",
      allocation: 50,
      endDate: "2024-11-12",
      role: "Design Systems Lead"
    },
    availabilityStatus: "50% Staffed",
    location: "Remote",
    startDate: "2021-09-15",
    isLead: true
  },
  // Product Team Members
  {
    id: "17",
    name: "Priya Sharma",
    level: "P6",
    discipline: "Product Management",
    skills: ["Product Strategy", "Roadmap Planning", "Stakeholder Management", "User Research"],
    currentProject: {
      name: "VA Health Portal Redesign",
      allocation: 100,
      endDate: "2024-11-15",
      role: "Senior Product Manager"
    },
    availabilityStatus: "100% Staffed",
    location: "San Francisco",
    startDate: "2020-01-15",
    isLead: true,
    practiceArea: "Product"
  },
  {
    id: "18",
    name: "Michael Chen",
    level: "P4",
    discipline: "Product Management",
    skills: ["Feature Planning", "User Analytics", "A/B Testing", "Market Research"],
    currentProject: {
      name: "Mobile App Redesign",
      allocation: 50,
      endDate: "2024-10-25",
      role: "Product Manager"
    },
    availabilityStatus: "50% Staffed",
    location: "Austin",
    startDate: "2022-06-01",
    practiceArea: "Product"
  },
  {
    id: "19",
    name: "Jessica Liu",
    level: "P5",
    discipline: "Product Management",
    skills: ["Product Strategy", "Data Analysis", "Customer Research", "Go-to-Market"],
    availabilityStatus: "Bench",
    location: "Seattle",
    startDate: "2021-08-10",
    practiceArea: "Product"
  },
  // Engineering Team Members
  {
    id: "20",
    name: "David Kumar",
    level: "E6",
    discipline: "Engineering",
    skills: ["React", "Node.js", "System Architecture", "Team Leadership"],
    currentProject: {
      name: "Platform Consolidation",
      allocation: 100,
      endDate: "2025-01-31",
      role: "Engineering Lead"
    },
    availabilityStatus: "100% Staffed",
    location: "New York",
    startDate: "2019-03-01",
    isLead: true,
    practiceArea: "Engineering"
  },
  {
    id: "21",
    name: "Maria Rodriguez",
    level: "E5",
    discipline: "Engineering",
    skills: ["Full-Stack Development", "API Design", "Database Design", "DevOps"],
    currentProject: {
      name: "Benefits Modernization Initiative",
      allocation: 75,
      endDate: "2025-02-28",
      role: "Full-Stack Engineer"
    },
    availabilityStatus: "100% Staffed",
    location: "Denver",
    startDate: "2021-01-20",
    practiceArea: "Engineering"
  },
  {
    id: "22",
    name: "James Park",
    level: "E4",
    discipline: "Engineering",
    skills: ["Frontend Development", "JavaScript", "React", "Testing"],
    currentProject: {
      name: "Component Library Migration",
      allocation: 50,
      endDate: "2024-11-12",
      role: "Frontend Engineer"
    },
    availabilityStatus: "50% Staffed",
    location: "Los Angeles",
    startDate: "2022-09-15",
    practiceArea: "Engineering"
  },
  {
    id: "23",
    name: "Aisha Thompson",
    level: "E3",
    discipline: "Engineering",
    skills: ["Backend Development", "Python", "API Development", "Database Management"],
    availabilityStatus: "New Hire",
    location: "Chicago",
    startDate: "2024-08-01",
    practiceArea: "Engineering"
  },
  {
    id: "24",
    name: "Ryan O'Connor",
    level: "E5",
    discipline: "Engineering",
    skills: ["DevOps", "Cloud Infrastructure", "CI/CD", "Security"],
    availabilityStatus: "Bench",
    location: "Remote",
    startDate: "2020-11-12",
    practiceArea: "Engineering"
  },
  // Program Management Team Members
  {
    id: "25",
    name: "Amanda Foster",
    level: "PM6",
    discipline: "Program Management",
    skills: ["Program Strategy", "Cross-functional Leadership", "Risk Management", "Stakeholder Alignment"],
    currentProject: {
      name: "Digital Transformation Initiative",
      allocation: 100,
      endDate: "2025-03-31",
      role: "Senior Program Manager"
    },
    availabilityStatus: "100% Staffed",
    location: "Washington DC",
    startDate: "2018-05-01",
    isLead: true,
    practiceArea: "Program Management"
  },
  {
    id: "26",
    name: "Carlos Martinez",
    level: "PM4",
    discipline: "Program Management",
    skills: ["Project Coordination", "Agile Management", "Resource Planning", "Communication"],
    currentProject: {
      name: "Accessibility Audit Project",
      allocation: 75,
      endDate: "2024-11-05",
      role: "Program Manager"
    },
    availabilityStatus: "100% Staffed",
    location: "Miami",
    startDate: "2022-02-14",
    practiceArea: "Program Management"
  },
  {
    id: "27",
    name: "Nicole Kim",
    level: "PM5",
    discipline: "Program Management",
    skills: ["Strategic Planning", "Process Improvement", "Team Management", "Budget Management"],
    availabilityStatus: "Bench",
    location: "Portland",
    startDate: "2021-07-08",
    practiceArea: "Program Management"
  }
];

export const mockProjects: Project[] = [
  {
    id: "1",
    name: "VA Health Portal Redesign",
    status: "Active",
    endDate: "2024-11-15",
    priority: "high"
  },
  {
    id: "2",
    name: "Medicare Claims Portal",
    status: "Ending Soon",
    endDate: "2024-10-30",
    priority: "medium"
  },
  {
    id: "3",
    name: "Benefits Modernization Initiative",
    status: "Active",
    endDate: "2025-02-28",
    priority: "high"
  },
  {
    id: "4",
    name: "Mobile App Redesign",
    status: "Ending Soon",
    endDate: "2024-10-25",
    priority: "medium"
  },
  {
    id: "5",
    name: "Onboarding Experience Redesign",
    status: "Ending Soon",
    endDate: "2024-10-15",
    priority: "low"
  }
];