import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";

interface StaffMember {
  id: string;
  name: string;
  level: string;
  discipline: string;
  skills: string[];
  currentProject?: {
    name: string;
    allocation: number;
    endDate: string;
    role: string;
  };
  availabilityStatus: 'Bench' | '50% Staffed' | '100% Staffed' | 'New Hire';
  location: string;
  startDate: string;
  isLead?: boolean;
  practiceArea?: string;
}

interface Assignment {
  id: string;
  staffId: string;
  requestId?: string;
  projectId: string;
  projectName: string;
  role: string;
  allocation: number;
  startDate: string;
  endDate: string;
  status: 'pending' | 'confirmed' | 'active' | 'completed';
  assignedBy: string;
  assignedDate: string;
}

interface StaffingRequest {
  id: string;
  roleTitle: string;
  level: string;
  practice: string;
  projectName: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  status: 'open' | 'in_progress' | 'filled' | 'escalated';
  assignedStaffIds?: string[];
  filledDate?: string;
}

interface Project {
  id: string;
  name: string;
  status: 'Active' | 'Ending Soon' | 'Starting Soon';
  endDate?: string;
  priority: 'high' | 'medium' | 'low';
}

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-a5f0b89d/health", (c) => {
  return c.json({ status: "ok" });
});

// Initialize data if not exists
app.post("/make-server-a5f0b89d/initialize", async (c) => {
  try {
    const existingStaff = await kv.get("staff_members");
    
    if (!existingStaff) {
      // Initialize with mock data
      const mockStaff: StaffMember[] = [
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
        }
      ];

      const mockProjects: Project[] = [
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
        }
      ];

      const mockStaffingRequests: StaffingRequest[] = [
        {
          id: "req-1",
          roleTitle: "UX Researcher",
          level: "D4",
          practice: "UX Generalist",
          projectName: "Digital Benefits Platform",
          dueDate: "2024-11-30",
          priority: "high",
          status: "open"
        },
        {
          id: "req-2",
          roleTitle: "Product Designer",
          level: "D5",
          practice: "Product Design",
          projectName: "Claims Processing Redesign",
          dueDate: "2024-12-15",
          priority: "medium",
          status: "open"
        }
      ];

      await kv.set("staff_members", mockStaff);
      await kv.set("projects", mockProjects);
      await kv.set("staffing_requests", mockStaffingRequests);
      await kv.set("assignments", []);
      
      console.log("Database initialized with mock data");
    }

    return c.json({ success: true, message: "Database initialized" });
  } catch (error) {
    console.error("Initialize error:", error);
    return c.json({ error: "Failed to initialize database" }, 500);
  }
});

// Staff members endpoints
app.get("/make-server-a5f0b89d/staff", async (c) => {
  try {
    const staff = await kv.get("staff_members") || [];
    return c.json(staff);
  } catch (error) {
    console.error("Get staff error:", error);
    return c.json({ error: "Failed to fetch staff members" }, 500);
  }
});

app.post("/make-server-a5f0b89d/staff", async (c) => {
  try {
    const newStaff = await c.req.json();
    const staff = await kv.get("staff_members") || [];
    const updatedStaff = [...staff, { ...newStaff, id: `staff-${Date.now()}` }];
    await kv.set("staff_members", updatedStaff);
    return c.json(updatedStaff[updatedStaff.length - 1]);
  } catch (error) {
    console.error("Create staff error:", error);
    return c.json({ error: "Failed to create staff member" }, 500);
  }
});

app.put("/make-server-a5f0b89d/staff/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const updates = await c.req.json();
    const staff = await kv.get("staff_members") || [];
    const updatedStaff = staff.map((member: StaffMember) => 
      member.id === id ? { ...member, ...updates } : member
    );
    await kv.set("staff_members", updatedStaff);
    return c.json({ success: true });
  } catch (error) {
    console.error("Update staff error:", error);
    return c.json({ error: "Failed to update staff member" }, 500);
  }
});

// Projects endpoints
app.get("/make-server-a5f0b89d/projects", async (c) => {
  try {
    const projects = await kv.get("projects") || [];
    return c.json(projects);
  } catch (error) {
    console.error("Get projects error:", error);
    return c.json({ error: "Failed to fetch projects" }, 500);
  }
});

app.post("/make-server-a5f0b89d/projects", async (c) => {
  try {
    const newProject = await c.req.json();
    const projects = await kv.get("projects") || [];
    const updatedProjects = [...projects, { ...newProject, id: `proj-${Date.now()}` }];
    await kv.set("projects", updatedProjects);
    return c.json(updatedProjects[updatedProjects.length - 1]);
  } catch (error) {
    console.error("Create project error:", error);
    return c.json({ error: "Failed to create project" }, 500);
  }
});

// Assignments endpoints
app.get("/make-server-a5f0b89d/assignments", async (c) => {
  try {
    const assignments = await kv.get("assignments") || [];
    return c.json(assignments);
  } catch (error) {
    console.error("Get assignments error:", error);
    return c.json({ error: "Failed to fetch assignments" }, 500);
  }
});

app.post("/make-server-a5f0b89d/assignments", async (c) => {
  try {
    const assignmentData = await c.req.json();
    const assignments = await kv.get("assignments") || [];
    
    const newAssignment: Assignment = {
      ...assignmentData,
      id: `assign-${Date.now()}`,
      assignedDate: new Date().toISOString(),
      assignedBy: 'Current User'
    };
    
    const updatedAssignments = [...assignments, newAssignment];
    await kv.set("assignments", updatedAssignments);
    
    // Update staffing request status if applicable
    if (assignmentData.requestId) {
      const requests = await kv.get("staffing_requests") || [];
      const updatedRequests = requests.map((req: StaffingRequest) =>
        req.id === assignmentData.requestId 
          ? { ...req, status: 'filled', filledDate: new Date().toISOString() }
          : req
      );
      await kv.set("staffing_requests", updatedRequests);
    }
    
    return c.json(newAssignment);
  } catch (error) {
    console.error("Create assignment error:", error);
    return c.json({ error: "Failed to create assignment" }, 500);
  }
});

// Staffing requests endpoints
app.get("/make-server-a5f0b89d/staffing-requests", async (c) => {
  try {
    const requests = await kv.get("staffing_requests") || [];
    return c.json(requests);
  } catch (error) {
    console.error("Get staffing requests error:", error);
    return c.json({ error: "Failed to fetch staffing requests" }, 500);
  }
});

app.post("/make-server-a5f0b89d/staffing-requests", async (c) => {
  try {
    const requestData = await c.req.json();
    const requests = await kv.get("staffing_requests") || [];
    
    const newRequest: StaffingRequest = {
      ...requestData,
      id: `req-${Date.now()}`,
      status: 'open'
    };
    
    const updatedRequests = [...requests, newRequest];
    await kv.set("staffing_requests", updatedRequests);
    return c.json(newRequest);
  } catch (error) {
    console.error("Create staffing request error:", error);
    return c.json({ error: "Failed to create staffing request" }, 500);
  }
});

app.put("/make-server-a5f0b89d/staffing-requests/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const updates = await c.req.json();
    const requests = await kv.get("staffing_requests") || [];
    const updatedRequests = requests.map((req: StaffingRequest) => 
      req.id === id ? { ...req, ...updates } : req
    );
    await kv.set("staffing_requests", updatedRequests);
    return c.json({ success: true });
  } catch (error) {
    console.error("Update staffing request error:", error);
    return c.json({ error: "Failed to update staffing request" }, 500);
  }
});

Deno.serve(app.fetch);