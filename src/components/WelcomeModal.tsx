import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { NautilusLogo } from "./NautilusLogo";
import { 
  Users, 
  Brain, 
  Eye, 
  PieChart, 
  Calendar,
  Sparkles
} from "lucide-react";

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartTour?: () => void;
}

export function WelcomeModal({ isOpen, onClose, onStartTour }: WelcomeModalProps) {
  const features = [
    {
      icon: Eye,
      title: "Staffing requests visualized with role details",
      color: "text-blue-600"
    },
    {
      icon: Brain,
      title: "AI-style candidate recommendations with trade-offs",
      color: "text-teal-600"
    },
    {
      icon: Users,
      title: "A live roster view across design disciplines",
      color: "text-green-600"
    },
    {
      icon: PieChart,
      title: "A team builder for planning allocations",
      color: "text-purple-600"
    },
    {
      icon: Calendar,
      title: "Forecasting that looks ahead at horizon roles and capacity",
      color: "text-orange-600"
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-2xl p-0 gap-0">
        {/* Header */}
        <DialogHeader className="p-6 pb-4">
          <div className="flex items-center gap-3 mb-4">
            <NautilusLogo size="lg" showText={false} />
            <div>
              <DialogTitle className="text-2xl">Welcome to Nautilus</DialogTitle>
              <DialogDescription className="sr-only">
                Introduction to the Nautilus AI-powered staffing tool prototype
              </DialogDescription>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 mt-1">
                <Sparkles className="h-3 w-3 mr-1" />
                Prototype
              </Badge>
            </div>
          </div>
          
          <p className="text-gray-600 leading-relaxed">
            This is a prototype I built to imagine what staffing could look like if we treated it more like 
            <span className="font-medium text-gray-900"> crew management</span>. All the data is fictional, 
            but it shows how we might bring more visibility, velocity, and intelligence into staffing.
          </p>
        </DialogHeader>

        <Separator />

        {/* Features */}
        <div className="p-6">
          <h3 className="font-medium text-gray-900 mb-4">You'll see:</h3>
          <div className="space-y-4">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="flex items-start gap-3">
                  <div className={`${feature.color} mt-0.5`}>
                    <IconComponent className="h-4 w-4" />
                  </div>
                  <span className="text-gray-700 leading-relaxed">{feature.title}</span>
                </div>
              );
            })}
          </div>
        </div>

        <Separator />

        {/* Footer */}
        <div className="p-6 pt-4 bg-gray-50">
          <div className="bg-white p-4 rounded-lg border-l-4 border-blue-500">
            <p className="text-gray-700 leading-relaxed mb-3">
              Think of this as a glimpse of what could be, not what is. It's rough, but I wanted to make 
              the future state tangible.
            </p>
            <p className="text-gray-600 text-sm">
              Looking forward to your feedback! 
              <span className="font-medium text-gray-900 ml-1">- Ron</span>
            </p>
          </div>
          
          <div className="flex justify-between items-center mt-4">
            {onStartTour && (
              <Button 
                variant="outline" 
                onClick={() => {
                  onClose();
                  onStartTour();
                }} 
                className="flex items-center gap-2 text-blue-600 border-blue-200 hover:bg-blue-50"
              >
                <Sparkles className="h-4 w-4" />
                Take the Tour
              </Button>
            )}
            <Button onClick={onClose} className="bg-blue-600 hover:bg-blue-700 ml-auto">
              Let's explore Nautilus
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}