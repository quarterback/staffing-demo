import { useState, useEffect, useRef } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { 
  ArrowRight, 
  ArrowLeft, 
  X, 
  Eye, 
  Brain, 
  Users, 
  PieChart, 
  Calendar,
  BarChart3,
  Target,
  Sparkles,
  CheckCircle,
  Home,
  TrendingUp
} from "lucide-react";

interface TourStep {
  id: string;
  tab: string;
  title: string;
  description: string;
  icon: any;
  target: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  action?: () => void;
  spotlight?: boolean;
}

interface InteractiveTourProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onNavigateToStaffing?: () => void;
  onNavigateToPeople?: () => void;
  onNavigateToForecast?: () => void;
}

export function InteractiveTour({ 
  isOpen, 
  onClose, 
  activeTab, 
  onTabChange,
  onNavigateToStaffing,
  onNavigateToPeople,
  onNavigateToForecast
}: InteractiveTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);

  const tourSteps: TourStep[] = [
    {
      id: 'welcome',
      tab: 'dashboard',
      title: 'Welcome to Nautilus!',
      description: 'This is your AI-powered staffing command center. Let me show you around! Click anywhere outside this tooltip to see the interface.',
      icon: Sparkles,
      target: 'body',
      position: 'bottom'
    },
    {
      id: 'dashboard-overview',
      tab: 'dashboard',
      title: 'Dashboard Snapshot',
      description: 'Your main dashboard gives you a bird\'s eye view of team metrics, utilization, and key staffing insights. Notice the team status breakdown and recent activity.',
      icon: Home,
      target: '.dashboard-content',
      position: 'right',
      spotlight: true
    },
    {
      id: 'team-metrics',
      tab: 'dashboard',
      title: 'Key Metrics at a Glance',
      description: 'These cards show your most important numbers: total staff, utilization rate, available designers, and open requests. Perfect for quick status checks.',
      icon: BarChart3,
      target: '.dashboard-content > div:first-child',
      position: 'bottom',
      spotlight: true
    },
    {
      id: 'quick-actions',
      tab: 'dashboard',
      title: 'Quick Actions',
      description: 'Jump directly to the most common tasks. Let me take you to the staffing requests now.',
      icon: Target,
      target: '.dashboard-content .space-y-6 > div:last-child .space-y-3',
      position: 'left',
      spotlight: true,
      action: () => onNavigateToStaffing?.()
    },
    {
      id: 'staffing-requests',
      tab: 'staffing',
      title: 'Active Staffing Requests',
      description: 'Here are all your open requests that need designers. Each card shows the role, level, project, and urgency. Click on any request to see AI recommendations.',
      icon: Target,
      target: '.staffing-request-card, [data-testid="staffing-request"]',
      position: 'right',
      spotlight: true
    },
    {
      id: 'ai-recommendations',
      tab: 'staffing',
      title: 'AI-Powered Matching',
      description: 'When you click a request, our AI analyzes your entire team to suggest the best candidates with confidence scores and trade-off explanations.',
      icon: Brain,
      target: '.ai-recommendations, [data-testid="ai-recommendations"]',
      position: 'top'
    },
    {
      id: 'projects-view',
      tab: 'projects',
      title: 'Complete Project Teams',
      description: 'View entire project teams across all disciplines - design, engineering, product, and program management. See team composition, integrations, and restaff personnel with quick actions.',
      icon: Users,
      target: '.projects-view',
      position: 'top',
      spotlight: true
    },
    {
      id: 'people-roster',
      tab: 'people',
      title: 'Your Design Team',
      description: 'Browse your complete roster organized by availability. See who\'s on the bench, partially staffed, or fully utilized.',
      icon: Users,
      target: '.people-roster',
      position: 'top',
      spotlight: true
    },
    {
      id: 'team-builder',
      tab: 'teambuilder',
      title: 'Plan Team Compositions',
      description: 'Drag and drop designers to build teams for projects. Perfect for capacity planning and visualizing allocations.',
      icon: PieChart,
      target: '.team-builder',
      position: 'top',
      spotlight: true
    },
    {
      id: 'forecast',
      tab: 'forecast',
      title: 'Look Ahead',
      description: 'See your 6-month forecast, upcoming roles, and staff transitions. Plan proactively instead of reactively.',
      icon: Calendar,
      target: '.forecast-widget',
      position: 'left',
      spotlight: true
    },
    {
      id: 'analytics',
      tab: 'navametrics',
      title: 'Staffing Analytics',
      description: 'Dive deep into metrics and trends. Track utilization, skills gaps, and performance over time.',
      icon: TrendingUp,
      target: '.navametrics',
      position: 'top',
      spotlight: true
    },
    {
      id: 'completion',
      tab: 'dashboard',
      title: 'You\'re All Set!',
      description: 'That\'s the full tour! Every feature is fully interactive with realistic data. Explore and see how Nautilus can transform your staffing workflow.',
      icon: CheckCircle,
      target: 'body',
      position: 'bottom'
    }
  ];

  const currentTourStep = tourSteps[currentStep];
  const progress = ((currentStep + 1) / tourSteps.length) * 100;

  // Update tooltip position when step changes
  useEffect(() => {
    if (!isOpen || !currentTourStep) return;

    const updatePosition = () => {
      const target = document.querySelector(currentTourStep.target);
      if (!target || !tooltipRef.current) return;

      const targetRect = target.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const viewport = { width: window.innerWidth, height: window.innerHeight };

      let x = 0;
      let y = 0;

      switch (currentTourStep.position) {
        case 'top':
          x = targetRect.left + targetRect.width / 2 - tooltipRect.width / 2;
          y = targetRect.top - tooltipRect.height - 12;
          break;
        case 'bottom':
          x = targetRect.left + targetRect.width / 2 - tooltipRect.width / 2;
          y = targetRect.bottom + 12;
          break;
        case 'left':
          x = targetRect.left - tooltipRect.width - 12;
          y = targetRect.top + targetRect.height / 2 - tooltipRect.height / 2;
          break;
        case 'right':
          x = targetRect.right + 12;
          y = targetRect.top + targetRect.height / 2 - tooltipRect.height / 2;
          break;
      }

      // Keep tooltip in viewport
      x = Math.max(12, Math.min(x, viewport.width - tooltipRect.width - 12));
      y = Math.max(12, Math.min(y, viewport.height - tooltipRect.height - 12));

      setTooltipPosition({ x, y });
    };

    // Change tab if needed
    if (currentTourStep.tab !== activeTab) {
      onTabChange(currentTourStep.tab);
    }

    // Execute action if needed
    if (currentTourStep.action) {
      setTimeout(currentTourStep.action, 500);
    }

    // Update position after a small delay to ensure DOM is ready
    setTimeout(updatePosition, 300);

    // Update position on scroll/resize
    window.addEventListener('scroll', updatePosition);
    window.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('scroll', updatePosition);
      window.removeEventListener('resize', updatePosition);
    };
  }, [currentStep, isOpen, currentTourStep, activeTab, onTabChange]);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    localStorage.setItem('nautilus-tour-completed', 'true');
    onClose();
    // Remove any spotlight effects
    document.querySelectorAll('.tour-spotlight').forEach(el => {
      el.classList.remove('tour-spotlight');
    });
  };

  const handleSkip = () => {
    localStorage.setItem('nautilus-tour-skipped', 'true');
    onClose();
    // Remove any spotlight effects
    document.querySelectorAll('.tour-spotlight').forEach(el => {
      el.classList.remove('tour-spotlight');
    });
  };

  // Add spotlight effect
  useEffect(() => {
    if (!isOpen || !currentTourStep?.spotlight) return;

    const target = document.querySelector(currentTourStep.target);
    if (target) {
      // Remove previous spotlight
      document.querySelectorAll('.tour-spotlight').forEach(el => {
        el.classList.remove('tour-spotlight');
      });
      
      // Add spotlight to current target
      target.classList.add('tour-spotlight');
    }

    return () => {
      document.querySelectorAll('.tour-spotlight').forEach(el => {
        el.classList.remove('tour-spotlight');
      });
    };
  }, [currentStep, isOpen, currentTourStep]);

  if (!isOpen) return null;

  const IconComponent = currentTourStep.icon;

  return (
    <>
      {/* Backdrop overlay */}
      <div className="fixed inset-0 bg-black/20 z-40 pointer-events-none" />
      
      {/* Tooltip */}
      <div
        ref={tooltipRef}
        className="fixed z-50 max-w-sm"
        style={{
          left: `${tooltipPosition.x}px`,
          top: `${tooltipPosition.y}px`,
        }}
      >
        <Card className="p-4 shadow-2xl border-2 border-blue-200 bg-white">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 bg-gradient-to-br from-blue-500 to-teal-600 rounded flex items-center justify-center">
                <IconComponent className="h-3 w-3 text-white" />
              </div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                {currentStep + 1} of {tourSteps.length}
              </Badge>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleClose}
              className="h-6 w-6 p-0 hover:bg-gray-100"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>

          <Progress value={progress} className="mb-3 h-1" />

          {/* Content */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900 text-sm">{currentTourStep.title}</h4>
            <p className="text-gray-600 text-sm leading-relaxed">
              {currentTourStep.description}
            </p>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
            <Button 
              variant="ghost" 
              onClick={handleSkip}
              className="text-xs text-gray-500 hover:text-gray-700 h-7 px-2"
            >
              Skip Tour
            </Button>

            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="h-7 px-3 text-xs"
              >
                <ArrowLeft className="h-3 w-3 mr-1" />
                Back
              </Button>
              
              <Button 
                onClick={handleNext}
                className="bg-blue-600 hover:bg-blue-700 h-7 px-3 text-xs"
              >
                {currentStep === tourSteps.length - 1 ? (
                  <>
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Done
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>

        {/* Arrow pointer */}
        <div 
          className={`absolute w-3 h-3 bg-white border-2 border-blue-200 transform rotate-45 ${
            currentTourStep.position === 'top' ? 'bottom-[-7px] left-1/2 -translate-x-1/2' :
            currentTourStep.position === 'bottom' ? 'top-[-7px] left-1/2 -translate-x-1/2' :
            currentTourStep.position === 'left' ? 'right-[-7px] top-1/2 -translate-y-1/2' :
            'left-[-7px] top-1/2 -translate-y-1/2'
          }`}
        />
      </div>


    </>
  );
}