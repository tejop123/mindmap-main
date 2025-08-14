import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { 
  TrendingUp, 
  Calendar, 
  Target, 
  MessageCircle,
  Smile,
  Award,
  Activity,
  Users,
  Plus,
  ArrowRight
} from 'lucide-react';

export default function Dashboard() {
  const { state } = useApp();
  const { state: authState } = useAuth();
  const { moods, habits } = state;
  const user = authState.user!;

  const [nodes, setNodes] = useState([]);

  // ✅ Fetch backend data when Dashboard loads
  useEffect(() => {
    const fetchNodes = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/nodes`);
        const data = await res.json();
        setNodes(data);
      } catch (err) {
        console.error("Error fetching nodes:", err);
      }
    };
    fetchNodes();
  }, []);

  const completedHabits = habits.filter(h => h.completed).length;
  const totalHabits = habits.length;
  const recentMood = moods[0];
  const avgMoodScore = moods.length > 0 
    ? Math.round(moods.reduce((acc, mood) => acc + mood.intensity, 0) / moods.length)
    : 0;

  const quickStats = [
    {
      label: 'Mood Score',
      value: avgMoodScore || '–',
      max: avgMoodScore ? 10 : null,
      icon: Smile,
      color: 'var(--success-500)',
      bgColor: 'var(--success-50)',
    },
    {
      label: 'Habits Today',
      value: completedHabits,
      max: totalHabits || null,
      icon: Target,
      color: 'var(--primary-500)',
      bgColor: 'var(--primary-50)',
    },
    {
      label: 'Streak Days',
      value: habits.length > 0 ? Math.max(...habits.map(h => h.streak)) : 0,
      max: null,
      icon: Award,
      color: 'var(--warning-500)',
      bgColor: 'var(--warning-50)',
    },
    {
      label: 'Check-ins',
      value: moods.length,
      max: null,
      icon: Activity,
      color: 'var(--secondary-500)',
      bgColor: 'var(--secondary-50)',
    },
  ];

  const quickActions = [
    {
      title: 'Chat with AI',
      description: 'Talk about how you\'re feeling',
      link: '/chat',
      icon: MessageCircle,
      color: 'var(--primary-500)',
    },
    {
      title: 'Track Mood',
      description: 'Log your current mood',
      link: '/mood',
      icon: Smile,
      color: 'var(--success-500)',
    },
    {
      title: 'Build Habits',
      description: 'Create healthy routines',
      link: '/habits',
      icon: Target,
      color: 'var(--warning-500)',
    },
    {
      title: 'Join Support',
      description: 'Connect with others',
      link: '/support',
      icon: Users,
      color: 'var(--secondary-500)',
    },
  ];

  const isNewUser = moods.length === 0 && habits.length === 0;

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 style={{ 
          fontSize: 'var(--font-size-4xl)',
          fontWeight: '700',
          marginBottom: 'var(--space-2)',
          background: 'var(--gradient-primary)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          Welcome back, {user.name}! 👋
        </h1>
        <p style={{ 
          fontSize: 'var(--font-size-lg)',
          color: 'var(--neutral-600)',
          margin: 0,
        }}>
          {isNewUser 
            ? "Let's start your wellness journey together" 
            : "Here's how you're doing today"
          }
        </p>
      </div>

      {/* Show fetched backend data */}
      {nodes.length > 0 && (
        <div className="card" style={{ marginBottom: 'var(--space-8)' }}>
          <h2>Fetched Backend Data</h2>
          <ul>
            {nodes.map((node, index) => (
              <li key={index}>{node.name || JSON.stringify(node)}</li>
            ))}
          </ul>
        </div>
      )}

      {/* New User Welcome */}
      {isNewUser && (
        <div className="card" style={{
          marginBottom: 'var(--space-8)',
          background: 'var(--gradient-primary)',
          color: 'white',
          textAlign: 'center',
        }}>
          <h2 style={{ marginBottom: 'var(--space-4)', color: 'white' }}>
            🎉 Welcome to MindMate!
          </h2>
          <p style={{ 
            fontSize: 'var(--font-size-lg)',
            marginBottom: 'var(--space-6)',
            opacity: 0.9,
          }}>
            You're taking the first step towards better mental wellness. Let's get you started with some simple actions.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link 
              to="/mood" 
              className="btn"
              style={{
                background: 'white',
                color: 'var(--primary-600)',
                fontWeight: '600',
              }}
            >
              <Plus size={20} />
              Log Your First Mood
            </Link>
            <Link 
              to="/chat" 
              className="btn"
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.3)',
              }}
            >
              <MessageCircle size={20} />
              Start Chatting
            </Link>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-6" style={{ marginBottom: 'var(--space-8)' }}>
        {quickStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div 
              key={index}
              className="card"
              style={{
                background: stat.bgColor,
                border: `1px solid ${stat.color}20`,
                textAlign: 'center',
              }}
            >
              <div 
                style={{
                  width: '48px',
                  height: '48px',
                  background: stat.color,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto var(--space-4) auto',
                }}
              >
                <Icon size={24} color="white" />
              </div>
              <h3 style={{
                fontSize: 'var(--font-size-2xl)',
                fontWeight: '700',
                color: stat.color,
                margin: '0 0 var(--space-2) 0',
              }}>
                {stat.value}{stat.max ? `/${stat.max}` : ''}
              </h3>
              <p style={{
                fontSize: 'var(--font-size-sm)',
                color: 'var(--neutral-600)',
                margin: 0,
                fontWeight: '500',
              }}>
                {stat.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h2 style={{ marginBottom: 'var(--space-6)' }}>Quick Actions</h2>
        <div className="grid grid-cols-2 gap-6">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link
                key={index}
                to={action.link}
                className="card"
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  background: `linear-gradient(135deg, ${action.color}10 0%, ${action.color}05 100%)`,
                  border: `1px solid ${action.color}20`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                  <div 
                    style={{
                      width: '56px',
                      height: '56px',
                      background: action.color,
                      borderRadius: 'var(--radius-xl)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon size={28} color="white" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      fontSize: 'var(--font-size-lg)',
                      fontWeight: '600',
                      margin: '0 0 var(--space-1) 0',
                      color: 'var(--neutral-800)',
                    }}>
                      {action.title}
                    </h3>
                    <p style={{
                      fontSize: 'var(--font-size-sm)',
                      color: 'var(--neutral-600)',
                      margin: 0,
                    }}>
                      {action.description}
                    </p>
                  </div>
                  <ArrowRight size={20} color="var(--neutral-400)" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* The rest of your Recent Activity section remains unchanged */}
    </div>
  );
}
