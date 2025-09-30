import React, { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Progress } from "./ui/progress";
import { Sparkles, User, TrendingUp, Calendar, Briefcase } from "lucide-react";
import { apiService, type StaffMember } from "../utils/api";

interface Candidate {
  id: string;
  name: string;
  role: string;
  level: string;
  currentAllocation: number;
  skills: string[];
  confidence: 'high' | 'medium' | 'low';
  tradeoffs: string;
  currentProject?: {
    name: string;
    allocation: number;
    endDate: string;
    role: string;
  };
  score: number;
}

// Generate AI recommendations based on actual staff data
const generateRecommendations = (requestTitle: string, staff: StaffMember[]): Candidate[] => {
  // Simple AI logic to match staff to requests based on title keywords and availability
  const keywords = requestTitle.toLowerCase();
  
  return staff
    .filter(staff => staff.availabilityStatus !== '100% Staffed')
    .map(staff => {
      let confidence: 'high' | 'medium' | 'low' = 'medium';
      let score = 0;
      
      // Score based on discipline match
      if (keywords.includes('product') && staff.discipline === 'Product Design') score += 3;
      if (keywords.includes('ux') && staff.discipline === 'UX Generalist') score += 3;
      if (keywords.includes('service') && staff.discipline === 'Service Design') score += 3;
      if (keywords.includes('content') && staff.discipline === 'Content Strategy') score += 3;
      if (keywords.includes('front-end') && staff.discipline === 'Front-end Design') score += 3;
      if (keywords.includes('developer') && staff.discipline === 'Developer Experience') score += 3;
      
      // Score based on level appropriateness
      if (staff.level === 'D5' || staff.level === 'D6') score += 2;
      if (staff.level === 'D4') score += 1;
      
      // Score based on availability
      if (staff.availabilityStatus === 'Benched') score += 3;
      if (staff.availabilityStatus === 'New Hire') score += 2;
      if (staff.availabilityStatus === '50% Staffed') score += 1;
      
      // Determine confidence
      if (score >= 6) confidence = 'high';
      else if (score >= 3) confidence = 'medium';
      else confidence = 'low';
      
      // Generate tradeoffs based on actual data
      let tradeoffs = '';
      if (staff.availabilityStatus === 'Benched') {
        tradeoffs = `Fully available and strong ${staff.discipline.toLowerCase()} skills. Ready to start immediately.`;
      } else if (staff.availabilityStatus === 'New Hire') {
        tradeoffs = `New hire with fresh perspective and strong ${staff.discipline.toLowerCase()} skills. Ready for first major project assignment.`;
      } else if (staff.currentProject) {
        const allocation = staff.currentProject.allocation;
        const endDate = new Date(staff.currentProject.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        tradeoffs = `Currently ${allocation}% allocated to ${staff.currentProject.name}, ending ${endDate}. `;
        if (allocation < 70) {
          tradeoffs += `Has capacity for additional work.`;
        } else {
          tradeoffs += `Limited capacity until project completion.`;
        }
      }
      
      return {
        id: staff.id,
        name: staff.name,
        role: staff.discipline,
        level: staff.level,
        currentAllocation: staff.currentProject?.allocation || 0,
        skills: staff.skills,
        confidence,
        tradeoffs,
        currentProject: staff.currentProject,
        score
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
};

interface AIRecommendationCardProps {
  requestTitle: string;
  onAssignCandidate: (candidateId: string) => void;
  onEscalateToTA: () => void;
}

export function AIRecommendationCard({ requestTitle, onAssignCandidate, onEscalateToTA }: AIRecommendationCardProps) {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStaffAndGenerateRecommendations = async () => {
      try {
        setIsLoading(true);
        const staffData = await apiService.getStaff();
        setStaff(staffData);
        const recommendations = generateRecommendations(requestTitle, staffData);
        setCandidates(recommendations);
      } catch (error) {
        console.error('Failed to load staff for recommendations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStaffAndGenerateRecommendations();
  }, [requestTitle]);

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Generating AI recommendations...</p>
          </div>
        </div>
      </Card>
    );
  }
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    });
  };
  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getConfidenceIcon = (confidence: string) => {
    switch (confidence) {
      case 'high': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'medium': return <TrendingUp className="h-4 w-4 text-yellow-600" />;
      case 'low': return <TrendingUp className="h-4 w-4 text-red-600" />;
      default: return <TrendingUp className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <Card className="ai-recommendations p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200" data-testid="ai-recommendations">
      <div className="flex items-center space-x-2 mb-4">
        <Sparkles className="h-5 w-5 text-blue-600" />
        <h3 className="font-semibold text-gray-900">AI Recommendations</h3>
        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
          for {requestTitle}
        </Badge>
      </div>
      
      <div className="space-y-4">
        {candidates.map((candidate, index) => (
          <Card key={candidate.id} className="p-4 bg-white border-gray-200">
            <div className="flex items-start space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-gray-200 text-gray-700">
                  {getInitials(candidate.name)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-medium text-gray-900">{candidate.name}</h4>
                    <p className="text-sm text-gray-600">{candidate.role} • {candidate.level}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getConfidenceIcon(candidate.confidence)}
                    <Badge className={getConfidenceColor(candidate.confidence)} variant="secondary">
                      {candidate.confidence} confidence
                    </Badge>
                  </div>
                </div>
                
                {candidate.currentProject && (
                  <div className="mb-3 p-2 bg-gray-50 rounded-md">
                    <div className="flex items-center space-x-1 mb-1">
                      <Briefcase className="h-3 w-3 text-gray-500" />
                      <span className="text-xs font-medium text-gray-700">{candidate.currentProject.name}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-gray-600">Allocation: {candidate.currentProject.allocation}%</span>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3 text-gray-500" />
                        <span className="text-gray-600">Ends {formatDate(candidate.currentProject.endDate)}</span>
                      </div>
                    </div>
                    <Progress value={candidate.currentProject.allocation} className="h-1" />
                  </div>
                )}
                
                {!candidate.currentProject && (
                  <div className="mb-3 p-2 bg-green-50 rounded-md">
                    <p className="text-xs text-green-800 font-medium">✨ Available for immediate assignment</p>
                  </div>
                )}
                
                <div className="mb-3">
                  <p className="text-xs text-gray-600 mb-1">Skills</p>
                  <div className="flex flex-wrap gap-1">
                    {candidate.skills.map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="mb-3">
                  <p className="text-xs text-gray-600 mb-1">Trade-offs</p>
                  <p className="text-sm text-gray-700">{candidate.tradeoffs}</p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button 
                    size="sm" 
                    onClick={() => onAssignCandidate(candidate.id)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Assign Candidate
                  </Button>
                  {index === 0 && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                      Best Match
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <Button 
          variant="outline" 
          onClick={onEscalateToTA}
          className="w-full"
        >
          <User className="h-4 w-4 mr-2" />
          Escalate to Talent Acquisition
        </Button>
      </div>
    </Card>
  );
}