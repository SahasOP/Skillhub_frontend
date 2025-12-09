import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';

// StatsCard subcomponent with flexible styling
const StatsCard = ({ title, value, subtitle, icon, className = "" }) => (
  <div className={`bg-white rounded-lg p-4 shadow-sm ${className}`}>
    <div className="flex items-center gap-2">
      {icon && <span className="text-xl">{icon}</span>}
      <h3 className="text-gray-600 text-sm">{title}</h3>
    </div>
    <p className="text-3xl font-bold mt-1">{value}</p>
    {subtitle && <p className="text-gray-500 text-xs mt-1">{subtitle}</p>}
  </div>
);

// Contribution calendar component
const ContributionCalendar = ({ contributions }) => {
  // Default data is passed from parent component
  const data = contributions;

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center mb-4">
          <h3 className="text-base font-medium text-gray-700">
            {data.totalContributions} contributions in past 6 months
          </h3>
          <div className="flex gap-4 text-sm mt-2 md:mt-0">
            <div>Max Streak <span className="font-bold">{data.maxStreak}</span></div>
            <div>Current Streak <span className="font-bold">{data.currentStreak}</span></div>
          </div>
        </div>

        <div className="flex flex-wrap justify-center md:justify-start space-x-2">
          {data.months.map((month, monthIndex) => (
            <div key={month} className="flex flex-col items-center mb-2">
              <div className="grid grid-cols-5 gap-1">
                {data.contributions[monthIndex].map((value, i) => (
                  <div
                    key={`${month}-${i}`}
                    className={`w-3 h-3 rounded-sm ${value > 0 ? 'bg-green-500' : 'bg-gray-200'}`}
                  />
                ))}
              </div>
              <span className="text-xs mt-1 text-gray-500">{month}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Languages component
const Languages = ({ data }) => {
  // Get colors for languages
  const getLanguageColor = (language) => {
    const colors = {
      "JavaScript": "#F7DF1E",
      "HTML": "#E34F26",
      "CSS": "#1572B6",
      "Python": "#3776AB",
      "Java": "#B07219",
      "TypeScript": "#3178C6",
      "Go": "#00ADD8",
      "Jupyter Notebook": "#DA5B0B"
    };

    return colors[language] || `hsl(${language.length * 10 % 360}, 70%, 50%)`;
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-6">Languages</h3>

        <div className="mb-4">
          <div className="h-4 w-full rounded-full flex overflow-hidden">
            {data.map((lang, index) => (
              <div
                key={index}
                className="h-full"
                style={{
                  width: `${lang.percentage}%`,
                  backgroundColor: getLanguageColor(lang.language)
                }}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3">
          {data.map((lang, index) => (
            <div key={index} className="flex items-center">
              <div
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: getLanguageColor(lang.language) }}
              />
              <span className="font-medium">{lang.language}</span>
              <span className="ml-2 text-gray-500">{lang.percentage}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Stats component
const Stats = ({ data }) => {
  const icons = {
    stars: "⭐",
    commits: "🔄",
    prs: "🔀",
    issues: "⚠️"
  };

  const labels = {
    stars: "Stars",
    commits: "Commits",
    prs: "PRs",
    issues: "Issues"
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">Stats</h3>
        <div className="space-y-4">
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-xl">{icons[key]}</span>
                <span className="text-gray-700">{labels[key]}</span>
              </div>
              <span className="font-bold text-xl">{value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const GithubStats = ({ githubData }) => {
  if (!githubData) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <CardTitle>Loading...</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="h-24 bg-gray-200 rounded-lg" />
          <div className="h-24 bg-gray-200 rounded-lg" />
        </CardContent>
      </Card>
    );
  }
  // Transform GitHub API data to our component's format
  const processedData = useMemo(() => {
    if (!githubData) {
      return {
        handle: "",
        name: "",
        avatarUrl: "",
        bio: "",
        recentRepos: []
      };
    }

    // Extract user information
    const userData = githubData.find(item => item.login && item.avatar_url) || {};

    // Extract repositories
    const repos = githubData.filter(item => item.name && item.html_url);

    return {
      handle: userData.login || "",
      name: userData.name || "",
      avatarUrl: userData.avatar_url || "",
      bio: userData.bio || "",
      createdAt: userData.created_at,
      recentRepos: repos.map(repo => ({
        name: repo.name,
        description: repo.description,
        language: repo.language,
        stars: repo.stargazers_count || 0,
        forks: repo.forks_count || 0,
        url: repo.html_url,
        homepage: repo.homepage
      }))
    };
  }, [githubData]);

  // Extract star count from repos
  const totalStars = useMemo(() => {
    return processedData.recentRepos.reduce((sum, repo) => sum + repo.stars, 0);
  }, [processedData.recentRepos]);

  // Extract language statistics
  const languageStats = useMemo(() => {
    const languages = {};
    processedData.recentRepos.forEach(repo => {
      if (repo.language) {
        languages[repo.language] = (languages[repo.language] || 0) + 1;
      }
    });

    const languageArray = Object.entries(languages).map(([name, count]) => ({ name, count }));
    languageArray.sort((a, b) => b.count - a.count);

    return languageArray;
  }, [processedData.recentRepos]);

  // Calculate language percentages
  const languagePercentages = useMemo(() => {
    const totalRepos = processedData.recentRepos.length;
    if (totalRepos === 0) return [];

    return languageStats.map(lang => ({
      language: lang.name,
      percentage: Math.round((lang.count / totalRepos) * 100)
    }));
  }, [processedData.recentRepos, languageStats]);

  // Calculate total commits (placeholder as we don't have this data)
  const totalCommits = useMemo(() => {
    return 9; // Placeholder value
  }, []);

  // Custom colors for the pie chart
  const chartColors = [
    '#4DA0FF', '#4CAF50', '#FF6347', '#9C27B0',
    '#FF9800', '#00BCD4', '#795548', '#673AB7'
  ];

  // Create contribution data
  const contributionData = useMemo(() => {
    // This would typically come from the GitHub API
    // For now, we'll use the placeholder data
    return {
      months: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
      contributions: [
        [0, 0, 0, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 1, 0, 0, 0],
        [0, 0, 0, 0, 0]
      ],
      maxStreak: 1,
      currentStreak: 0,
      totalContributions: 7
    };
  }, []);

  // Stats data
  const statsData = useMemo(() => {
    return {
      stars: totalStars,
      commits: totalCommits,
      prs: 0, // Placeholder
      issues: 0  // Placeholder
    };
  }, [totalStars, totalCommits]);

  // Generate pie data based on languages
  const pieData = useMemo(() => {
    return languageStats.map(lang => ({
      name: lang.name,
      value: lang.count
    }));
  }, [languageStats]);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      year: 'numeric'
    }).format(date);
  };

  // Member since
  const memberSince = useMemo(() => {
    return formatDate(processedData.createdAt);
  }, [processedData.createdAt]);

  return (
    <div className="space-y-6 p-4 bg-gray-50 rounded-lg">
      {/* Profile Summary */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-3 sm:space-y-0 sm:space-x-4 mb-6">
        {processedData.avatarUrl && (
          <img
            src={processedData.avatarUrl}
            alt={`${processedData.handle}'s avatar`}
            className="w-16 h-16 rounded-full border-2 border-gray-200"
          />
        )}
        <div className="text-center sm:text-left">
          <h2 className="text-xl font-bold">{processedData.name || processedData.handle}</h2>
          <p className="text-gray-600">@{processedData.handle}</p>
          {processedData.bio && <p className="text-sm text-gray-500 mt-1">{processedData.bio}</p>}
          {memberSince && <p className="text-xs text-gray-500 mt-1">Member since {memberSince}</p>}
        </div>
      </div>

      {/* Top Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatsCard
          title="Total Repositories"
          value={processedData.recentRepos.length}
          icon="📁"
        />
        <StatsCard
          title="Total Contributions"
          value={contributionData.totalContributions}
          icon="🔄"
        />
      </div>

      {/* Contribution Calendar */}
      <ContributionCalendar contributions={contributionData} />

      {/* Bottom Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Languages data={languagePercentages} />
        <Stats data={statsData} />
      </div>

      {/* Charts and Detailed Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Language Distribution Chart */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">
              Language Distribution
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={chartColors[index % chartColors.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [`${value} repos`, name]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Repositories */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">
              Recent Repositories
            </h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {processedData.recentRepos?.map((repo, index) => (
                <div key={index} className="border-b pb-2 last:border-0">
                  <div className="flex justify-between">
                    <p className="font-medium">{repo.name}</p>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">{repo.language || 'No language'}</span>
                      <span className="text-xs flex items-center">⭐ {repo.stars}</span>
                    </div>
                  </div>
                  {repo.description && (
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{repo.description}</p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GithubStats;