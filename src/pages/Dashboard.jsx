import { useState, useEffect } from 'react';
import api from '../api';
import RepoCard from '../components/RepoCard';

const Dashboard = () => {
  const [recentRepos, setRecentRepos] = useState([]);
  const [stats, setStats] = useState({
    repos: 0,
    pipelines: 0,
    suggestions: "Released Soon",
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      // Fetch recent repos (keep existing logic)
      const importedRes = await api.get("/repos/imported");
      setRecentRepos(importedRes.data.slice(0, 10));

      //  NEW: Active Repo API
      const activeRepoRes = await api.get("/repos/activeRepo");

      // NEW: Running Pipelines API
      const pipelineRes = await api.get("/ci-status/pipelines/running/");

      // Set real stats from backend
      setStats({
        repos: activeRepoRes.data.activeRepo || 0,
        pipelines: pipelineRes.data.runningPipelines || 0,
        suggestions: "Released Soon",
      });

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  return (
    <>
      <div className="page-header flex justify-between items-center mb-8">
        <h1 className="page-title text-3xl font-bold bg-gradient-to-r from-[var(--accent-color)] to-[var(--accent-color-light)] bg-clip-text text-transparent">
          Dashboard
        </h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[
          { icon: 'github', label: 'Active Repositories', value: stats.repos },
          { icon: 'stream', label: 'Running Pipelines', value: stats.pipelines },
          { icon: 'robot', label: 'AI Suggestions', value: stats.suggestions },
        ].map((stat, idx) => (
          <div key={idx} className="bg-[var(--card-bg)] rounded-xl p-6 shadow-custom hover:-translate-y-1 transition-all animate-fade-in-up" style={{ animationDelay: `${idx * 0.1}s` }}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">{stat.label}</h3>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--accent-color)] to-[var(--accent-color-light)] flex items-center justify-center text-xl">
                <i className={`fas fa-${stat.icon}`}></i>
              </div>
            </div>

            <div className="text-4xl font-bold text-[var(--accent-color)] mb-2">
              {stat.value}
            </div>

            <p className="text-[var(--text-secondary)] text-sm">
              Connected GitHub repositories
            </p>
          </div>
        ))}
      </div>

      {/* Recent Repositories */}
      <div className="section-header flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Recent Repositories</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {recentRepos.map(repo => (
          <RepoCard key={repo.id} repo={repo} />
        ))}
      </div>
    </>
  );
};

export default Dashboard;