import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Menu, Play, HelpCircle } from "lucide-react";
import { NautilusLogo } from "./NautilusLogo";

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogoClick?: () => void;
  onStartTour?: () => void;
}

const tabs = [
  { value: "dashboard", label: "Dashboard" },
  { value: "staffing", label: "Staffing Requests" },
  { value: "projects", label: "Projects" },
  { value: "people", label: "People" },
  { value: "integrations", label: "Integrations" },
  { value: "teambuilder", label: "Team Builder" },
  { value: "meetingcost", label: "Meeting Cost" },
  { value: "navametrics", label: "Navametrics" },
  { value: "forecast", label: "Forecast" },
  { value: "reports", label: "Reports" }
];

export function Header({ activeTab, onTabChange, onLogoClick, onStartTour }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleTabChange = (tab: string) => {
    onTabChange(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="border-b bg-white px-4 sm:px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <button 
          onClick={onLogoClick}
          className="hover:opacity-80 transition-opacity"
        >
          <NautilusLogo size="md" showText={true} />
        </button>
        
        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-8">
          <Tabs value={activeTab} onValueChange={onTabChange} className="w-auto">
            <TabsList className="bg-gray-100 p-1">
              {tabs.map((tab) => (
                <TabsTrigger 
                  key={tab.value} 
                  value={tab.value} 
                  className="text-sm px-3 py-2 whitespace-nowrap"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Mobile/Tablet Navigation */}
        <div className="lg:hidden">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 px-3 p-2">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex items-center justify-between mb-6">
                <NautilusLogo size="sm" showText={true} />
              </div>
              
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.value}
                    onClick={() => handleTabChange(tab.value)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab.value
                        ? 'bg-blue-100 text-blue-900 font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
                
                {onStartTour && (
                  <>
                    <div className="border-t pt-3 mt-3">
                      <button
                        onClick={() => {
                          onStartTour();
                          setMobileMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-3 rounded-lg transition-colors text-blue-600 hover:bg-blue-50 flex items-center gap-2"
                      >
                        <Play className="h-4 w-4" />
                        Start Guided Tour
                      </button>
                    </div>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* User Actions */}
        <div className="hidden sm:flex items-center space-x-3">
          {onStartTour && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onStartTour}
              className="flex items-center gap-2 text-blue-600 border-blue-200 hover:bg-blue-50"
            >
              <Play className="h-4 w-4" />
              Tour
            </Button>
          )}
          <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
        </div>
      </div>

      {/* Tablet Navigation (md to lg) */}
      <div className="hidden md:block lg:hidden mt-4 border-t pt-4">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => onTabChange(tab.value)}
              className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                activeTab === tab.value
                  ? 'bg-blue-100 text-blue-900 font-medium'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}