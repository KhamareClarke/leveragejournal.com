'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import PWAInstallPrompt from '@/components/PWAInstallPrompt';
import { 
  Home, 
  Building2, 
  Target, 
  BookOpen, 
  Trophy, 
  BarChart3, 
  Settings,
  LogOut,
  User,
  Plus,
  Calendar,
  Clock,
  Star,
  CheckCircle,
  Edit,
  Save,
  ChevronDown,
  ChevronUp,
  Menu,
  X,
  Bell,
  Search,
  Zap,
  Brain,
  Sparkles,
  TrendingUp,
  Activity
} from 'lucide-react';

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [currentDay, setCurrentDay] = useState(1);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});
  
  // Sample user data
  const userData = {
    name: 'Khamare Clarke',
    email: 'khamareclarke@gmail.com',
    userId: '27f52a4d-4c40-4869-87bd-40222a620070',
    goalsSet: 12,
    daysLogged: 23,
    lastActivity: 'Today',
    nextMilestone: 'Week 4 Review',
    aiScore: 94,
    momentum: 'High'
  };

  const navigationItems = [
    { id: 'home', label: 'AI Dashboard', icon: Brain, badge: null, description: 'Intelligent overview' },
    { id: 'foundation', label: 'Foundation', icon: Building2, badge: null, description: 'Core values & vision' },
    { id: 'plan', label: 'Smart Goals', icon: Target, badge: '4', description: 'AI-powered planning' },
    { id: 'do', label: 'Daily Flow', icon: BookOpen, badge: null, description: 'Execution tracking' },
    { id: 'achieve', label: 'Progress AI', icon: Trophy, badge: null, description: 'Performance analytics' },
    { id: 'stats', label: 'Insights', icon: BarChart3, badge: 'NEW', description: 'Advanced metrics' },
    { id: 'settings', label: 'Settings', icon: Settings, badge: null, description: 'Preferences' }
  ];

  const renderHomeTab = () => (
    <div className="space-y-8">
      {/* AI-Powered Welcome */}
      <div className="relative overflow-hidden bg-gradient-to-r from-yellow-500/10 via-yellow-400/5 to-yellow-500/10 border border-yellow-500/30 rounded-3xl p-8">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 to-transparent"></div>
        <div className="relative z-10">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-yellow-500/30">
              <Brain className="w-8 h-8 text-black" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-yellow-200 to-yellow-400 bg-clip-text text-transparent">
                Welcome back, {userData.name}
              </h1>
              <p className="text-gray-400 text-lg">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 font-medium">AI Active</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-400 font-medium">High Performance Mode</span>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/30 p-6 group hover:shadow-xl hover:shadow-blue-500/20 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Target className="w-6 h-6 text-blue-400" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">{userData.goalsSet}</div>
          <div className="text-sm text-gray-400 mb-2">Active Goals</div>
          <div className="text-xs text-green-400">+2 this week</div>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/30 p-6 group hover:shadow-xl hover:shadow-green-500/20 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Calendar className="w-6 h-6 text-green-400" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">{userData.daysLogged}</div>
          <div className="text-sm text-gray-400 mb-2">Days Logged</div>
          <div className="text-xs text-green-400">23-day streak 🔥</div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/30 p-6 group hover:shadow-xl hover:shadow-purple-500/20 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Brain className="w-6 h-6 text-purple-400" />
            </div>
            <Sparkles className="w-5 h-5 text-yellow-400" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">{userData.aiScore}</div>
          <div className="text-sm text-gray-400 mb-2">AI Score</div>
          <div className="text-xs text-yellow-400">Elite Performance</div>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border border-yellow-500/30 p-6 group hover:shadow-xl hover:shadow-yellow-500/20 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Trophy className="w-6 h-6 text-yellow-400" />
            </div>
            <Activity className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">67%</div>
          <div className="text-sm text-gray-400 mb-2">Weekly Progress</div>
          <div className="text-xs text-green-400">Above average</div>
        </Card>
      </div>

      {/* AI Insights & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-yellow-500/10 via-yellow-400/5 to-yellow-500/10 border border-yellow-500/30 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-black" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">AI Recommendations</h3>
              <p className="text-xs text-gray-400">Powered by your data patterns</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-3 bg-white/5 rounded-lg">
              <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
              <div>
                <p className="text-white font-medium">Focus on your 3 priorities today</p>
                <p className="text-gray-400 text-sm">You're 67% through weekly goals - maintain momentum!</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-white/5 rounded-lg">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
              <div>
                <p className="text-white font-medium">Schedule your weekly review</p>
                <p className="text-gray-400 text-sm">Best time: Tomorrow at 2 PM based on your patterns</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/30 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-black" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Performance Insights</h3>
              <p className="text-xs text-gray-400">Real-time analytics</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-300">Weekly Momentum</span>
                <span className="text-sm font-bold text-green-400">+15%</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div className="bg-gradient-to-r from-green-500 to-green-400 h-2 rounded-full" style={{width: '82%'}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-300">Goal Completion Rate</span>
                <span className="text-sm font-bold text-yellow-400">94%</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div className="bg-gradient-to-r from-yellow-500 to-yellow-400 h-2 rounded-full" style={{width: '94%'}}></div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderFoundationTab = () => {
    const foundationSections = [
      { id: 'why', title: 'My Why', placeholder: 'What drives you? Your deeper purpose...' },
      { id: 'vision', title: 'My Vision', placeholder: 'Where do you see yourself in 5 years?' },
      { id: 'values', title: 'My Values', placeholder: 'What principles guide your decisions?' },
      { id: 'skills', title: 'My Skills & Talents', placeholder: 'What are you naturally good at?' },
      { id: 'influences', title: 'Influences', placeholder: 'Who inspires you and why?' },
      { id: 'lessons', title: 'Lessons Learned', placeholder: 'Key insights from your journey...' },
      { id: 'accountability', title: 'Accountability Partner', placeholder: 'Who keeps you accountable?' }
    ];

    const toggleSection = (id) => {
      setExpandedSections(prev => ({ ...prev, [id]: !prev[id] }));
    };

    return (
      <div className="space-y-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-yellow-400 bg-clip-text text-transparent mb-2">Sacred Commitment</h2>
          <p className="text-gray-400">Chapter 1 - Build your foundation for transformation</p>
        </div>

        {foundationSections.map((section) => (
          <Card key={section.id} className="bg-neutral-900/50 border border-yellow-600/20">
            <div 
              className="flex items-center justify-between p-6 cursor-pointer"
              onClick={() => toggleSection(section.id)}
            >
              <h3 className="text-xl font-bold text-white">{section.title}</h3>
              {expandedSections[section.id] ? 
                <ChevronUp className="w-5 h-5 text-yellow-400" /> : 
                <ChevronDown className="w-5 h-5 text-yellow-400" />
              }
            </div>
            {expandedSections[section.id] && (
              <div className="px-6 pb-6">
                <textarea
                  data-testid={`foundation-${section.id}`}
                  className="w-full h-32 bg-neutral-800 border border-gray-700 rounded-lg p-4 text-white resize-none focus:outline-none focus:border-yellow-500"
                  placeholder={section.placeholder}
                />
                <div className="flex justify-end mt-4">
                  <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white flex">
      {/* Modern Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-20' : 'w-80'} transition-all duration-300 bg-gradient-to-b from-gray-900/90 to-black/90 backdrop-blur-xl border-r border-yellow-500/20 flex flex-col`}>
        {/* Sidebar Header */}
        <div className="p-6 border-b border-yellow-500/20">
          <div className="flex items-center justify-between">
            <div className={`flex items-center space-x-3 ${sidebarCollapsed ? 'justify-center' : ''}`}>
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-500/30">
                <Brain className="w-5 h-5 text-black" />
              </div>
              {!sidebarCollapsed && (
                <div>
                  <h1 className="text-lg font-bold bg-gradient-to-r from-yellow-200 via-yellow-300 to-yellow-400 bg-clip-text text-transparent">
                    Leverage AI™
                  </h1>
                  <p className="text-xs text-gray-400">Digital Command Center</p>
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="text-gray-400 hover:text-yellow-400 hover:bg-yellow-500/10"
            >
              {sidebarCollapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* AI Status Card */}
        {!sidebarCollapsed && (
          <div className="p-4">
            <Card className="bg-gradient-to-r from-yellow-500/10 via-yellow-400/5 to-yellow-500/10 border border-yellow-500/30 p-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-black" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-white">AI Score</span>
                    <span className="text-lg font-bold text-yellow-400">{userData.aiScore}</span>
                  </div>
                  <p className="text-xs text-gray-400">Momentum: {userData.momentum}</p>
                </div>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
            </Card>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all group ${
                activeTab === item.id
                  ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-black shadow-lg shadow-yellow-500/30'
                  : 'text-gray-300 hover:text-white hover:bg-white/5 hover:shadow-lg'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                activeTab === item.id
                  ? 'bg-black/20'
                  : 'bg-white/10 group-hover:bg-white/20'
              }`}>
                <item.icon className="w-4 h-4" />
              </div>
              {!sidebarCollapsed && (
                <div className="flex-1 text-left">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{item.label}</span>
                    {item.badge && (
                      <span className={`px-2 py-0.5 text-xs rounded-full ${
                        activeTab === item.id
                          ? 'bg-black/30 text-black'
                          : 'bg-yellow-500 text-black'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p className={`text-xs ${
                    activeTab === item.id ? 'text-black/70' : 'text-gray-500'
                  }`}>
                    {item.description}
                  </p>
                </div>
              )}
            </button>
          ))}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-yellow-500/20">
          <div className={`flex items-center space-x-3 ${sidebarCollapsed ? 'justify-center' : ''}`}>
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center">
              <User className="w-5 h-5 text-black" />
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1">
                <p className="text-sm font-medium text-white">{userData.name}</p>
                <p className="text-xs text-gray-400">{userData.email}</p>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={signOut}
              className="text-gray-400 hover:text-red-400 hover:bg-red-500/10"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-black/20 backdrop-blur-xl border-b border-white/10 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">
                {navigationItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
              </h2>
              <p className="text-gray-400">
                {navigationItems.find(item => item.id === activeTab)?.description || 'Welcome back'}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500/50 focus:bg-white/10"
                />
              </div>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-yellow-400 hover:bg-yellow-500/10">
                <Bell className="w-4 h-4" />
              </Button>
              <div className="flex items-center space-x-2 bg-gradient-to-r from-green-500/10 to-green-400/10 border border-green-500/30 rounded-xl px-3 py-2">
                <Activity className="w-4 h-4 text-green-400" />
                <span className="text-sm font-medium text-green-400">Live</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {/* Tab Content */}
          {activeTab === 'home' && renderHomeTab()}
          {activeTab === 'foundation' && renderFoundationTab()}
        {activeTab === 'plan' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-yellow-400 bg-clip-text text-transparent mb-2">Goal Timeline Framework</h2>
                <p className="text-gray-400">Strategic goal planning with AI-powered insights</p>
              </div>
              <Button className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-bold shadow-lg">
                <Plus className="w-4 h-4 mr-2" />
                Create New Goal
              </Button>
            </div>

            {/* Create New Goal Interface */}
            <Card className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border border-yellow-500/30 p-6">
              <h3 className="text-xl font-bold text-white mb-6">Create New Goal</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Goal Title</label>
                    <input
                      data-testid="goal-title"
                      className="w-full bg-black/20 border border-yellow-500/30 rounded-lg p-3 text-white focus:outline-none focus:border-yellow-500"
                      placeholder="Enter your goal title..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">What (Specific Outcome)</label>
                    <textarea
                      data-testid="goal-what"
                      className="w-full h-20 bg-black/20 border border-yellow-500/30 rounded-lg p-3 text-white resize-none focus:outline-none focus:border-yellow-500"
                      placeholder="What exactly do you want to achieve?"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Why (Your Motivation)</label>
                    <textarea
                      data-testid="goal-why"
                      className="w-full h-20 bg-black/20 border border-yellow-500/30 rounded-lg p-3 text-white resize-none focus:outline-none focus:border-yellow-500"
                      placeholder="Why is this goal important to you?"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">When (Timeline)</label>
                    <input
                      data-testid="goal-when"
                      type="date"
                      className="w-full bg-black/20 border border-yellow-500/30 rounded-lg p-3 text-white focus:outline-none focus:border-yellow-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">How (Action Steps)</label>
                    <textarea
                      data-testid="goal-how"
                      className="w-full h-20 bg-black/20 border border-yellow-500/30 rounded-lg p-3 text-white resize-none focus:outline-none focus:border-yellow-500"
                      placeholder="How will you achieve this goal?"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Reward</label>
                    <input
                      data-testid="goal-reward"
                      className="w-full bg-black/20 border border-yellow-500/30 rounded-lg p-3 text-white focus:outline-none focus:border-yellow-500"
                      placeholder="How will you celebrate achieving this?"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">Key Milestones</label>
                <div className="space-y-2">
                  {[1, 2, 3].map((milestone) => (
                    <div key={milestone} className="flex items-center space-x-3">
                      <input type="checkbox" className="w-4 h-4 text-yellow-500" />
                      <input
                        data-testid={`milestone-${milestone}`}
                        className="flex-1 bg-black/20 border border-yellow-500/30 rounded p-2 text-white text-sm focus:outline-none focus:border-yellow-500"
                        placeholder={`Milestone ${milestone}...`}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold">
                  <Save className="w-4 h-4 mr-2" />
                  Save Goal
                </Button>
              </div>
            </Card>

            {/* Goal Categories */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { category: 'Short-Term', color: 'green', goals: [
                  { title: 'Complete Morning Routine', progress: 85, due: 'This Week', description: 'Establish consistent 6 AM wake-up and exercise routine' },
                  { title: 'Read 2 Books', progress: 60, due: 'End of Month', description: 'Focus on personal development and leadership books' }
                ]},
                { category: 'Medium-Term', color: 'blue', goals: [
                  { title: 'Launch Side Business', progress: 40, due: '3 Months', description: 'Build and launch digital product with $5K revenue goal' },
                  { title: 'Fitness Transformation', progress: 70, due: '6 Months', description: 'Lose 20 pounds and build lean muscle mass' }
                ]},
                { category: 'Long-Term', color: 'purple', goals: [
                  { title: 'Career Advancement', progress: 25, due: '1 Year', description: 'Secure promotion to senior leadership position' },
                  { title: 'Financial Freedom', progress: 15, due: '5 Years', description: 'Build $100K investment portfolio and passive income' }
                ]}
              ].map(({ category, color, goals }) => (
                <Card key={category} className={`bg-gradient-to-br from-${color}-500/10 to-${color}-600/5 border border-${color}-500/30 p-6`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white">{category} Goals</h3>
                    <div className={`w-3 h-3 bg-${color}-400 rounded-full`}></div>
                  </div>
                  <div className="space-y-4">
                    {goals.map((goal, index) => (
                      <div key={index} className="bg-black/20 p-4 rounded-lg border border-white/10">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-white">{goal.title}</h4>
                          <CheckCircle className={`w-4 h-4 text-${color}-400`} />
                        </div>
                        <p className="text-sm text-gray-400 mb-3">{goal.description}</p>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-yellow-400">Due: {goal.due}</span>
                            <span className={`text-${color}-400 font-medium`}>{goal.progress}% Complete</span>
                          </div>
                          <div className="w-full bg-gray-800 rounded-full h-2">
                            <div 
                              className={`bg-gradient-to-r from-${color}-500 to-${color}-400 h-2 rounded-full transition-all`}
                              style={{ width: `${goal.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
        {activeTab === 'do' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-yellow-400 bg-clip-text text-transparent mb-2">Tactical Execution</h2>
                <p className="text-gray-400">Digital version of your 180 daily pages - 90-day transformation</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-r from-yellow-500/20 to-yellow-600/10 border border-yellow-500/30 rounded-xl px-4 py-2">
                  <span className="text-yellow-400 font-bold text-lg">Day {currentDay} of 90</span>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setCurrentDay(Math.max(1, currentDay - 1))}
                    className="border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10"
                    disabled={currentDay === 1}
                  >
                    ← Previous
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setCurrentDay(Math.min(90, currentDay + 1))}
                    className="border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10"
                    disabled={currentDay === 90}
                  >
                    Next →
                  </Button>
                </div>
              </div>
            </div>

            {/* Day Progress Indicator */}
            <div className="bg-gradient-to-r from-yellow-500/10 to-yellow-600/5 border border-yellow-500/30 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">90-Day Journey Progress</h3>
                <span className="text-yellow-400 font-bold">{Math.round((currentDay / 90) * 100)}% Complete</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${(currentDay / 90) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-2">
                <span>Day 1</span>
                <span>Day 30</span>
                <span>Day 60</span>
                <span>Day 90</span>
              </div>
            </div>

            {/* Daily Journal Interface */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-neutral-900/50 border border-yellow-600/20 p-6">
                <h3 className="text-lg font-bold text-white mb-4">Today I am grateful for...</h3>
                <textarea
                  data-testid="gratitude-input"
                  className="w-full h-32 bg-neutral-800 border border-gray-700 rounded-lg p-4 text-white resize-none focus:outline-none focus:border-yellow-500"
                  placeholder="Write 3 things you're grateful for today..."
                />
              </Card>

              <Card className="bg-neutral-900/50 border border-yellow-600/20 p-6">
                <h3 className="text-lg font-bold text-white mb-4">3 Priorities</h3>
                <div className="space-y-3">
                  {[1, 2, 3].map((priority) => (
                    <input
                      key={priority}
                      data-testid={`priority-${priority}`}
                      className="w-full bg-neutral-800 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-yellow-500"
                      placeholder={`Priority ${priority}...`}
                    />
                  ))}
                </div>
              </Card>

              <Card className="bg-neutral-900/50 border border-yellow-600/20 p-6">
                <h3 className="text-lg font-bold text-white mb-4">Top Tasks</h3>
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5].map((task) => (
                    <div key={task} className="flex items-center space-x-3">
                      <input type="checkbox" className="w-4 h-4 text-yellow-500" />
                      <input
                        data-testid={`task-${task}`}
                        className="flex-1 bg-neutral-800 border border-gray-700 rounded p-2 text-white text-sm focus:outline-none focus:border-yellow-500"
                        placeholder={`Task ${task}...`}
                      />
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="bg-neutral-900/50 border border-yellow-600/20 p-6">
                <h3 className="text-lg font-bold text-white mb-4">End-of-Day Reflection</h3>
                <textarea
                  data-testid="reflection-input"
                  className="w-full h-32 bg-neutral-800 border border-gray-700 rounded-lg p-4 text-white resize-none focus:outline-none focus:border-yellow-500"
                  placeholder="How did today go? What did you learn?"
                />
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-400">Today's Mood:</span>
                    <div className="flex space-x-1">
                      {['😔', '😐', '😊', '😄', '🚀'].map((emoji) => (
                        <button key={emoji} className="text-xl hover:scale-110 transition-transform">
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="text-sm text-yellow-400">Streak: 23 days 🔥</div>
                </div>
              </Card>
            </div>

            <div className="text-center">
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-black px-8">
                <Save className="w-4 h-4 mr-2" />
                Save Day {currentDay}
              </Button>
            </div>
          </div>
        )}
        {activeTab === 'achieve' && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-yellow-400 bg-clip-text text-transparent mb-2">Freedom Through Focus</h2>
              <p className="text-gray-400">Review / Refine - Weekly and monthly reflection system</p>
            </div>

            {/* Weekly Review */}
            <Card className="bg-neutral-900/50 border border-yellow-600/20 p-6">
              <h3 className="text-xl font-bold text-white mb-6">Week 4 Review</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Wins this week</label>
                  <textarea
                    data-testid="weekly-wins"
                    className="w-full h-24 bg-neutral-800 border border-gray-700 rounded-lg p-3 text-white resize-none focus:outline-none focus:border-yellow-500"
                    placeholder="What went well this week?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Obstacles</label>
                  <textarea
                    data-testid="weekly-obstacles"
                    className="w-full h-24 bg-neutral-800 border border-gray-700 rounded-lg p-3 text-white resize-none focus:outline-none focus:border-yellow-500"
                    placeholder="What challenges did you face?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">What I learned</label>
                  <textarea
                    data-testid="weekly-lessons"
                    className="w-full h-24 bg-neutral-800 border border-gray-700 rounded-lg p-3 text-white resize-none focus:outline-none focus:border-yellow-500"
                    placeholder="Key insights and learnings..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Adjustments</label>
                  <textarea
                    data-testid="weekly-adjustments"
                    className="w-full h-24 bg-neutral-800 border border-gray-700 rounded-lg p-3 text-white resize-none focus:outline-none focus:border-yellow-500"
                    placeholder="What will you do differently?"
                  />
                </div>
              </div>
            </Card>

            {/* Progress Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-neutral-900/50 border border-yellow-600/20 p-6 text-center">
                <h4 className="text-lg font-bold text-white mb-2">Weekly Progress</h4>
                <div className="text-3xl font-bold text-yellow-400 mb-2">67%</div>
                <div className="w-full bg-neutral-800 rounded-full h-2">
                  <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-2 rounded-full" style={{width: '67%'}}></div>
                </div>
              </Card>
              <Card className="bg-neutral-900/50 border border-yellow-600/20 p-6 text-center">
                <h4 className="text-lg font-bold text-white mb-2">Monthly Progress</h4>
                <div className="text-3xl font-bold text-yellow-400 mb-2">23/30</div>
                <div className="text-sm text-gray-400">Days Completed</div>
              </Card>
              <Card className="bg-neutral-900/50 border border-yellow-600/20 p-6 text-center">
                <h4 className="text-lg font-bold text-white mb-2">90-Day Progress</h4>
                <div className="text-3xl font-bold text-yellow-400 mb-2">Day 23</div>
                <div className="text-sm text-gray-400">of 90 Days</div>
              </Card>
            </div>
          </div>
        )}
        {activeTab === 'stats' && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Momentum Dashboard</h2>
              <p className="text-gray-400">Track your transformation progress</p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-neutral-900/50 border border-yellow-600/20 p-6 text-center">
                <div className="text-3xl font-bold text-yellow-400 mb-2">23</div>
                <div className="text-sm text-gray-400">Days Completed</div>
                <div className="text-xs text-green-400 mt-1">+1 from yesterday</div>
              </Card>
              <Card className="bg-neutral-900/50 border border-yellow-600/20 p-6 text-center">
                <div className="text-3xl font-bold text-yellow-400 mb-2">8/12</div>
                <div className="text-sm text-gray-400">Goals Achieved</div>
                <div className="text-xs text-green-400 mt-1">67% completion</div>
              </Card>
              <Card className="bg-neutral-900/50 border border-yellow-600/20 p-6 text-center">
                <div className="text-3xl font-bold text-yellow-400 mb-2">23</div>
                <div className="text-sm text-gray-400">Current Streak</div>
                <div className="text-xs text-green-400 mt-1">🔥 Personal best!</div>
              </Card>
              <Card className="bg-neutral-900/50 border border-yellow-600/20 p-6 text-center">
                <div className="text-3xl font-bold text-yellow-400 mb-2">85</div>
                <div className="text-sm text-gray-400">Momentum Score</div>
                <div className="text-xs text-green-400 mt-1">AI calculated</div>
              </Card>
            </div>

            {/* Progress Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-neutral-900/50 border border-yellow-600/20 p-6">
                <h3 className="text-lg font-bold text-white mb-4">Weekly Progress</h3>
                <div className="space-y-3">
                  {['Week 1', 'Week 2', 'Week 3', 'Week 4'].map((week, index) => (
                    <div key={week} className="flex items-center space-x-4">
                      <span className="text-sm text-gray-400 w-16">{week}</span>
                      <div className="flex-1 bg-neutral-800 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-3 rounded-full"
                          style={{ width: `${[85, 92, 78, 67][index]}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-yellow-400 w-12">{[85, 92, 78, 67][index]}%</span>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="bg-neutral-900/50 border border-yellow-600/20 p-6">
                <h3 className="text-lg font-bold text-white mb-4">Habit Completion</h3>
                <div className="space-y-3">
                  {['Morning Routine', 'Exercise', 'Journaling', 'Reading'].map((habit, index) => (
                    <div key={habit} className="flex items-center justify-between">
                      <span className="text-sm text-white">{habit}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-neutral-800 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full"
                            style={{ width: `${[95, 80, 100, 60][index]}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-green-400 w-8">{[95, 80, 100, 60][index]}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Goal Timeline */}
            <Card className="bg-neutral-900/50 border border-yellow-600/20 p-6">
              <h3 className="text-lg font-bold text-white mb-4">Goal Timeline</h3>
              <div className="space-y-4">
                {[
                  { goal: 'Complete Foundation Setup', status: 'completed', date: 'Day 5' },
                  { goal: 'Establish Morning Routine', status: 'completed', date: 'Day 12' },
                  { goal: 'First Weekly Review', status: 'completed', date: 'Day 21' },
                  { goal: 'Month 1 Milestone', status: 'in-progress', date: 'Day 30' },
                  { goal: 'Mid-Point Review', status: 'upcoming', date: 'Day 45' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className={`w-4 h-4 rounded-full ${
                      item.status === 'completed' ? 'bg-green-500' :
                      item.status === 'in-progress' ? 'bg-yellow-500' : 'bg-gray-600'
                    }`}></div>
                    <div className="flex-1">
                      <div className="text-white font-medium">{item.goal}</div>
                      <div className="text-sm text-gray-400">{item.date}</div>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs ${
                      item.status === 'completed' ? 'bg-green-500/20 text-green-300' :
                      item.status === 'in-progress' ? 'bg-yellow-500/20 text-yellow-300' :
                      'bg-gray-500/20 text-gray-300'
                    }`}>
                      {item.status.replace('-', ' ')}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Account Settings</h2>
              <p className="text-gray-400">Manage your profile and preferences</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Profile Info */}
              <Card className="bg-neutral-900/50 border border-yellow-600/20 p-6">
                <h3 className="text-xl font-bold text-white mb-6">Profile Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                    <input
                      data-testid="profile-name"
                      className="w-full bg-neutral-800 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-yellow-500"
                      defaultValue={userData.name}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                    <input
                      data-testid="profile-email"
                      className="w-full bg-neutral-800 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-yellow-500"
                      defaultValue={userData.email}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">User ID</label>
                    <input
                      className="w-full bg-neutral-800 border border-gray-700 rounded-lg p-3 text-gray-400"
                      value={userData.userId}
                      disabled
                    />
                  </div>
                  <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
                    <Save className="w-4 h-4 mr-2" />
                    Update Profile
                  </Button>
                </div>
              </Card>

              {/* Security */}
              <Card className="bg-neutral-900/50 border border-yellow-600/20 p-6">
                <h3 className="text-xl font-bold text-white mb-6">Security</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Current Password</label>
                    <input
                      type="password"
                      data-testid="current-password"
                      className="w-full bg-neutral-800 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-yellow-500"
                      placeholder="Enter current password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
                    <input
                      type="password"
                      data-testid="new-password"
                      className="w-full bg-neutral-800 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-yellow-500"
                      placeholder="Enter new password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Confirm New Password</label>
                    <input
                      type="password"
                      data-testid="confirm-password"
                      className="w-full bg-neutral-800 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-yellow-500"
                      placeholder="Confirm new password"
                    />
                  </div>
                  <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
                    Change Password
                  </Button>
                </div>
              </Card>

              {/* QR Code Connection */}
              <Card className="bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 border border-yellow-600/30 p-6">
                <h3 className="text-xl font-bold text-white mb-6">Connect Physical Journal</h3>
                <div className="text-center space-y-4">
                  <div className="w-32 h-32 bg-neutral-800 rounded-lg mx-auto flex items-center justify-center">
                    <div className="text-6xl">📱</div>
                  </div>
                  <p className="text-gray-300 text-sm">
                    Scan the QR code in your physical Leverage Journal™ to sync your progress
                  </p>
                  <Button 
                    className="bg-yellow-500 hover:bg-yellow-600 text-black"
                    onClick={() => window.location.href = '/connect'}
                  >
                    Connect QR Code
                  </Button>
                </div>
              </Card>

              {/* Profile Photo Upload */}
              <Card className="bg-neutral-900/50 border border-yellow-600/20 p-6">
                <h3 className="text-xl font-bold text-white mb-6">Profile Photo</h3>
                <div className="text-center space-y-4">
                  <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full mx-auto flex items-center justify-center">
                    <User className="w-12 h-12 text-black" />
                  </div>
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      data-testid="profile-photo-upload"
                      className="hidden"
                      id="photo-upload"
                    />
                    <label
                      htmlFor="photo-upload"
                      className="cursor-pointer bg-yellow-500 hover:bg-yellow-600 text-black font-medium px-4 py-2 rounded-lg transition-colors"
                    >
                      Upload Photo
                    </label>
                  </div>
                  <p className="text-xs text-gray-400">JPG, PNG or GIF (max 5MB)</p>
                </div>
              </Card>

              {/* Account Status */}
              <Card className="bg-neutral-900/50 border border-yellow-600/20 p-6">
                <h3 className="text-xl font-bold text-white mb-6">Account Status</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Account Type</span>
                    <span className="text-yellow-400 font-semibold">Premium</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Member Since</span>
                    <span className="text-white">January 2024</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Journal Connected</span>
                    <span className="text-green-400">✓ Synced</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Data Backup</span>
                    <span className="text-green-400">✓ Enabled</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
        </main>
      </div>
      
      {/* PWA Install Prompt */}
      <PWAInstallPrompt />
    </div>
  );
}
