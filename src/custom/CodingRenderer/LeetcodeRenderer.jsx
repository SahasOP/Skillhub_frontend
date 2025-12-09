import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import { Trophy, Target, Brain, Flame } from 'lucide-react';

const LeetCodeStats = ({ data }) => {
  if (!data) {
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
  const getPieData = () => [
    { name: "Easy", value: data.easySolved, total: data.totalEasy },
    { name: "Medium", value: data.mediumSolved, total: data.totalMedium },
    { name: "Hard", value: data.hardSolved, total: data.totalHard },
  ];

  const colors = {
    easy: '#00b8a3',
    medium: '#ffc01e',
    hard: '#ff375f',
    accent: '#3b82f6'
  };

  // Calculate percentages and streaks
  const totalSolvedPercentage = ((data.totalSolved / data.totalQuestions) * 100).toFixed(1);
  const submissionDates = Object.entries(data.submissionCalendar)
    .map(([timestamp, count]) => ({
      date: new Date(parseInt(timestamp) * 1000),
      count
    }))
    .sort((a, b) => b.date - a.date);

  const currentStreak = submissionDates.reduce((streak, entry) => {
    if (streak.counting &&
      entry.count > 0 &&
      entry.date.getTime() === streak.lastDate - 24 * 60 * 60 * 1000) {
      return {
        count: streak.count + 1,
        counting: true,
        lastDate: entry.date.getTime()
      };
    }
    return streak;
  }, { count: 1, counting: true, lastDate: submissionDates[0].date.getTime() }).count;

  return (
    <div className="space-y-6 p-6 bg-gray-50">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Trophy className="w-8 h-8 text-yellow-500" />
              <div>
                <p className="text-sm text-gray-600">Ranking</p>
                <p className="text-2xl font-bold">{data.ranking.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Problems Solved</p>
                <p className="text-2xl font-bold">{totalSolvedPercentage}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Brain className="w-8 h-8 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">Contribution Points</p>
                <p className="text-2xl font-bold">{data.contributionPoint}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Flame className="w-8 h-8 text-red-500" />
              <div>
                <p className="text-sm text-gray-600">Current Streak</p>
                <p className="text-2xl font-bold">{currentStreak} days</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Problems Distribution */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Problems Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={getPieData()}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {getPieData().map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={Object.values(colors)[index]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ payload }) => {
                      if (payload && payload[0]) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-2 shadow-lg rounded-md">
                            <p className="font-semibold">{data.name}</p>
                            <p>
                              Solved: {data.value}/{data.total} ({((data.value / data.total) * 100).toFixed(1)}%)
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Progress Bars */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Difficulty Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { name: 'Easy', solved: data.easySolved, total: data.totalEasy, color: colors.easy },
              { name: 'Medium', solved: data.mediumSolved, total: data.totalMedium, color: colors.medium },
              { name: 'Hard', solved: data.hardSolved, total: data.totalHard, color: colors.hard }
            ].map(({ name, solved, total, color }) => (
              <div key={name}>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">{name}</span>
                  <span className="text-gray-600">
                    {solved}/{total} ({((solved / total) * 100).toFixed(1)}%)
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all duration-1000 ease-out"
                    style={{
                      width: `${(solved / total) * 100}%`,
                      backgroundColor: color,
                    }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-white md:col-span-2">
          <CardHeader>
            <CardTitle>Recent Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={Object.entries(data.submissionCalendar)
                    .slice(-30)
                    .map(([date, count]) => ({
                      date: new Date(parseInt(date) * 1000).toLocaleDateString(),
                      submissions: count
                    }))}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" angle={-45} textAnchor="end" height={60} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="submissions" fill={colors.accent} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LeetCodeStats;