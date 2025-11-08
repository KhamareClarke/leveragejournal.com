'use client';

import { BookOpen, Smartphone, Target, Calendar, TrendingUp, Star, Flame, Trophy, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function ProductMockup() {
  const [currentScreen, setCurrentScreen] = useState(0);
  
  const phoneScreens = [
    {
      title: "Daily Planning",
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-white">Today's Focus</h4>
            <div className="flex items-center space-x-1">
              <Flame className="w-4 h-4 text-orange-400" />
              <span className="text-xs text-orange-400">23</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2 p-2 bg-green-500/20 rounded-lg">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-xs text-white">Morning reflection completed</span>
            </div>
            <div className="flex items-center space-x-2 p-2 bg-yellow-500/20 rounded-lg">
              <Target className="w-4 h-4 text-yellow-400" />
              <span className="text-xs text-white">3 priority tasks identified</span>
            </div>
            <div className="flex items-center space-x-2 p-2 bg-blue-500/20 rounded-lg">
              <Calendar className="w-4 h-4 text-blue-400" />
              <span className="text-xs text-white">Day 23 of 90 planned</span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Progress Tracking",
      content: (
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">94%</div>
            <div className="text-xs text-gray-400">Goal Completion</div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-300">Health Goals</span>
              <div className="w-16 h-1 bg-gray-700 rounded-full">
                <div className="w-14 h-1 bg-green-400 rounded-full"></div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-300">Career Goals</span>
              <div className="w-16 h-1 bg-gray-700 rounded-full">
                <div className="w-12 h-1 bg-blue-400 rounded-full"></div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-300">Personal</span>
              <div className="w-16 h-1 bg-gray-700 rounded-full">
                <div className="w-10 h-1 bg-purple-400 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Achievement Hub",
      content: (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <span className="text-sm font-semibold text-white">Recent Wins</span>
          </div>
          <div className="space-y-2">
            <div className="p-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <div className="text-xs text-yellow-300 font-medium">Week 3 Complete!</div>
              <div className="text-xs text-gray-400">All daily goals achieved</div>
            </div>
            <div className="p-2 bg-green-500/10 border border-green-500/30 rounded-lg">
              <div className="text-xs text-green-300 font-medium">Habit Streak: 21 days</div>
              <div className="text-xs text-gray-400">Morning routine mastered</div>
            </div>
            <div className="p-2 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <div className="text-xs text-blue-300 font-medium">Milestone Reached</div>
              <div className="text-xs text-gray-400">First month goals: 95% complete</div>
            </div>
          </div>
        </div>
      )
    }
  ];

  // Auto-cycle through screens
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentScreen((prev) => (prev + 1) % phoneScreens.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [phoneScreens.length]);

  return (
    <div className="relative flex items-center justify-center space-x-8">
      {/* Book Cover Mockup */}
      <div className="relative group">
        {/* Glow Effect */}
        <div className="absolute -inset-8 bg-gradient-to-r from-yellow-600/30 via-yellow-500/20 to-yellow-600/30 rounded-3xl blur-2xl opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
        
        {/* Book */}
        <div className="relative w-72 h-96 transform rotate-3 group-hover:rotate-0 transition-transform duration-500">
          {/* Book Spine Shadow */}
          <div className="absolute -left-2 top-2 w-72 h-96 bg-gradient-to-br from-neutral-800 to-black rounded-2xl opacity-40"></div>
          
          {/* Main Book Cover */}
          <div className="relative w-72 h-96 bg-gradient-to-br from-neutral-900 via-neutral-800 to-black rounded-2xl border border-yellow-600/40 overflow-hidden shadow-2xl">
            {/* Cover Design */}
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-600/10 to-transparent"></div>
            
            {/* Geometric Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-8 left-8 w-32 h-32 border border-yellow-500 rotate-45"></div>
              <div className="absolute bottom-8 right-8 w-24 h-24 border border-yellow-500 rotate-12"></div>
            </div>
            
            {/* Content */}
            <div className="relative p-8 h-full flex flex-col justify-between">
              {/* Top Section */}
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                  <BookOpen className="w-8 h-8 text-black" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-yellow-200 to-yellow-400 bg-clip-text text-transparent">
                    LEVERAGE
                  </h3>
                  <h4 className="text-xl font-bold bg-gradient-to-r from-yellow-300 to-yellow-500 bg-clip-text text-transparent">
                    JOURNAL™
                  </h4>
                  <div className="w-24 h-px bg-gradient-to-r from-transparent via-yellow-500 to-transparent mx-auto"></div>
                  <p className="text-sm text-yellow-300 font-medium tracking-wider">90-DAY TRANSFORMATION</p>
                </div>
              </div>
              
              {/* Middle Section - Features */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-xs text-gray-300">
                  <Target className="w-3 h-3 text-yellow-400" />
                  <span>Psychology-Backed Planning</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-300">
                  <Smartphone className="w-3 h-3 text-yellow-400" />
                  <span>Real-Time App Sync</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-300">
                  <TrendingUp className="w-3 h-3 text-yellow-400" />
                  <span>Progress Analytics</span>
                </div>
              </div>
              
              {/* Bottom Section */}
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-xs text-gray-400">Rated 4.9/5 by 10,000+ users</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Phone App Mockup */}
      <div className="relative group">
        {/* Phone Glow */}
        <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 rounded-3xl blur-xl opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
        
        {/* Phone Frame */}
        <div className="relative w-64 h-[520px] bg-gradient-to-b from-neutral-800 to-neutral-900 rounded-[3rem] p-2 shadow-2xl">
          {/* Screen */}
          <div className="w-full h-full bg-black rounded-[2.5rem] overflow-hidden relative">
            {/* Status Bar */}
            <div className="flex justify-between items-center px-6 py-2 text-white">
              <div className="text-sm font-medium">9:41</div>
              <div className="flex items-center space-x-1">
                <div className="w-4 h-2 border border-white rounded-sm">
                  <div className="w-3 h-1 bg-green-400 rounded-sm"></div>
                </div>
              </div>
            </div>
            
            {/* App Header */}
            <div className="px-6 py-4 border-b border-gray-800">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-black" />
                </div>
                <div>
                  <h4 className="text-white font-semibold text-sm">Leverage Journal</h4>
                  <p className="text-gray-400 text-xs">Day 23 of 90</p>
                </div>
              </div>
            </div>
            
            {/* Dynamic Content */}
            <div className="px-6 py-6 h-full">
              <div className="space-y-4">
                <h3 className="text-white font-semibold">{phoneScreens[currentScreen].title}</h3>
                {phoneScreens[currentScreen].content}
              </div>
            </div>
            
            {/* Screen Indicators */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {phoneScreens.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                    index === currentScreen ? 'bg-yellow-400' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>
          
          {/* Home Indicator */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white rounded-full opacity-60"></div>
        </div>
      </div>
    </div>
  );
}
