import { useState, useEffect, useMemo, useCallback } from "react";
import { Header } from "./components/Header";
import { WelcomeModal } from "./components/WelcomeModal";
import { InteractiveTour } from "./components/InteractiveTour";
import { Sidebar } from "./components/Sidebar";
import { FilterBar } from "./components/FilterBar";
import { DashboardSnapshot } from "./components/DashboardSnapshot";
import { StaffingRequestsList } from "./components/StaffingRequestsList";
import { StaffingRequestDetail } from "./components/StaffingRequestDetail";
import { AIRecommendationCard } from "./components/AIRecommendationCard";
import { ForecastWidget } from "./components/ForecastWidget";
import { PeopleRoster } from "./components/PeopleRoster";
import { TeamBuilder } from "./components/TeamBuilder";
import { MeetingCostEstimator } from "./components/MeetingCostEstimator";
import { StaffingNavametrics } from "./components/StaffingNavametrics";
import { ProjectsView } from "./components/ProjectsView";
import { IntegrationsHub } from "./components/IntegrationsHub";
import { CreateStaffingRequestDialog } from "./components/CreateStaffingRequestDialog";
import { apiService, type StaffingRequestWithStatus } from "./utils/api";
import { toast } from "sonner@2.0.3";



interface Filters {
  disciplines: string[];
  levels: string[];
  availability: string[];
}

export default function App() {
  const [selectedRequest, setSelectedRequest] = useState<StaffingRequestWithStatus | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'detail' | 'recommendations'>('list');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showWelcome, setShowWelcome] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    disciplines: [],
    levels: [],
    availability: []
  });
  const [showCreateRequestDialog, setShowCreateRequestDialog] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize database and check if user has seen welcome modal
  useEffect(() => {
    const initializeApp = async () => {
      try {
        setIsLoading(true);
        
        // Initialize the database with mock data
        await apiService.initialize();
        setIsInitialized(true);
        
        // Check if user has seen the welcome modal
        const hasSeenWelcome = localStorage.getItem('nautilus-welcome-seen');
        if (!hasSeenWelcome) {
          setShowWelcome(true);
        }
      } catch (error) {
        console.error('Failed to initialize app:', error);
        toast.error('Failed to initialize application. Please refresh the page.');
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  const handleCloseWelcome = () => {
    setShowWelcome(false);
    localStorage.setItem('nautilus-welcome-seen', 'true');
  };

  const handleRequestClick = (request: StaffingRequestWithStatus) => {
    setSelectedRequest(request);
    setViewMode('detail');
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedRequest(null);
  };

  const handleViewRecommendations = () => {
    setViewMode('recommendations');
  };

  const handleLogoClick = () => {
    setActiveTab('dashboard');
    setViewMode('list');
    setSelectedRequest(null);
  };

  const handleAssignCandidate = useCallback(async (candidateId: string) => {
    if (!selectedRequest) return;
    
    try {
      // Create the assignment
      await apiService.createAssignment({
        staffId: candidateId,
        requestId: selectedRequest.id,
        projectId: selectedRequest.id, // Using request ID as project ID for simplicity
        projectName: selectedRequest.projectName,
        role: selectedRequest.roleTitle,
        allocation: 100, // Default to 100% allocation
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days from now
        status: 'confirmed'
      });
      
      toast.success("Candidate successfully assigned! Staffing request has been filled.");
      
      // Clear the selected request since it's now filled
      setSelectedRequest(null);
      setViewMode('list');
    } catch (error) {
      console.error('Failed to assign candidate:', error);
      toast.error('Failed to assign candidate. Please try again.');
    }
  }, [selectedRequest]);

  const handleEscalateToTA = useCallback(async () => {
    if (!selectedRequest) return;
    
    try {
      // Update the request status to escalated
      await apiService.updateStaffingRequest(selectedRequest.id, { status: 'escalated' });
      
      toast.info("Request escalated to Talent Acquisition team. TA will handle external recruitment.");
      
      // Clear the selected request since it's been escalated
      setSelectedRequest(null);
      setViewMode('list');
    } catch (error) {
      console.error('Failed to escalate request:', error);
      toast.error('Failed to escalate request. Please try again.');
    }
  }, [selectedRequest]);

  const handleFilterChange = useCallback((filterType: keyof Filters, value: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: checked 
        ? [...prev[filterType], value]
        : prev[filterType].filter(item => item !== value)
    }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({
      disciplines: [],
      levels: [],
      availability: []
    });
  }, []);

  const handleStartTour = () => {
    setShowTour(true);
  };

  const handleCloseTour = () => {
    setShowTour(false);
  };

  const handleFilterDemo = () => {
    // Demo adding a filter for the tour
    setFilters(prev => ({
      ...prev,
      disciplines: ['UX Generalist']
    }));
  };

  const handleResetView = () => {
    // Reset to list view for tour navigation
    setViewMode('list');
    setSelectedRequest(null);
  };

  const handleCreateStaffingRequest = async (newRequest: Omit<StaffingRequestWithStatus, 'id' | 'status'>) => {
    try {
      await apiService.createStaffingRequest(newRequest);
      toast.success("Staffing request created successfully!");
    } catch (error) {
      console.error('Failed to create staffing request:', error);
      toast.error('Failed to create staffing request. Please try again.');
    }
  };

  const renderTabContent = useMemo(() => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6 dashboard-content">
            <DashboardSnapshot 
              onNavigateToStaffing={() => setActiveTab('staffing')}
              onNavigateToPeople={() => setActiveTab('people')}
              onNavigateToForecast={() => setActiveTab('forecast')}
            />
          </div>
        );
      case 'staffing':
        return (
          <div className="space-y-6">
            {/* Filter Bar */}
            <FilterBar 
              filters={filters} 
              onFilterChange={handleFilterChange} 
              onClearFilters={handleClearFilters} 
            />
            
            {viewMode === 'list' && (
              <div className="space-y-6">
                <StaffingRequestsList 
                  onRequestClick={handleRequestClick}
                  selectedRequestId={selectedRequest?.id}
                  filters={filters}
                />
              </div>
            )}
            
            {viewMode === 'detail' && selectedRequest && (
              <div className="space-y-6">
                <StaffingRequestDetail
                  requestId={selectedRequest.id}
                  onAssignCandidate={handleAssignCandidate}
                  onEscalateToTA={handleEscalateToTA}
                  onBack={handleBackToList}
                  onViewRecommendations={handleViewRecommendations}
                />
              </div>
            )}
            
            {viewMode === 'recommendations' && selectedRequest && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <button 
                    onClick={() => setViewMode('detail')}
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    ← Back to Request Details
                  </button>
                </div>
                <AIRecommendationCard
                  requestTitle={selectedRequest.roleTitle}
                  onAssignCandidate={handleAssignCandidate}
                  onEscalateToTA={handleEscalateToTA}
                />
              </div>
            )}
          </div>
        );
      case 'projects':
        return (
          <div className="space-y-6">
            <div className="filter-bar">
              <FilterBar 
                filters={filters} 
                onFilterChange={handleFilterChange} 
                onClearFilters={handleClearFilters} 
              />
            </div>
            <div className="projects-view">
              <ProjectsView filters={filters} />
            </div>
          </div>
        );
      case 'integrations':
        return (
          <div className="integrations-hub">
            <IntegrationsHub />
          </div>
        );
      case 'people':
        return (
          <div className="space-y-6">
            <div className="filter-bar">
              <FilterBar 
                filters={filters} 
                onFilterChange={handleFilterChange} 
                onClearFilters={handleClearFilters} 
              />
            </div>
            <div className="people-roster">
              <PeopleRoster filters={filters} />
            </div>
          </div>
        );
      case 'teambuilder':
        return (
          <div className="space-y-6">
            <div className="filter-bar">
              <FilterBar 
                filters={filters} 
                onFilterChange={handleFilterChange} 
                onClearFilters={handleClearFilters} 
              />
            </div>
            <div className="team-builder">
              <TeamBuilder filters={filters} />
            </div>
          </div>
        );
      case 'meetingcost':
        return <MeetingCostEstimator />;
      case 'navametrics':
        return (
          <div className="navametrics">
            <StaffingNavametrics />
          </div>
        );
      case 'forecast':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">Staffing Forecast</h2>
            <div className="forecast-widget">
              <ForecastWidget />
            </div>
          </div>
        );
      case 'reports':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">Reports & Analytics</h2>
            <div className="bg-white p-8 rounded-lg border text-center">
              <p className="text-gray-500">Reports dashboard coming soon...</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  }, [activeTab, filters, viewMode, selectedRequest, handleFilterChange, handleClearFilters, handleAssignCandidate, handleEscalateToTA]);

  // Show loading state while initializing
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing Nautilus...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        onLogoClick={handleLogoClick}
        onStartTour={handleStartTour}
      />
      
      <main className="p-3 sm:p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {renderTabContent}
        </div>
      </main>

      {/* Welcome Modal */}
      <WelcomeModal 
        isOpen={showWelcome} 
        onClose={handleCloseWelcome}
        onStartTour={handleStartTour}
      />

      {/* Interactive Tour */}
      <InteractiveTour 
        isOpen={showTour}
        onClose={handleCloseTour}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onNavigateToStaffing={() => setActiveTab('staffing')}
        onNavigateToPeople={() => setActiveTab('people')}
        onNavigateToForecast={() => setActiveTab('forecast')}
      />
    </div>
  );
}