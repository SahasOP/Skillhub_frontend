import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Trophy, Award, Target, Star, Flag } from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const HackerRankStats = ({ data }) => {
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
  const {
    username,
    name,
    country,
    category,
    rank,
    contestRating,
    competitions,
    gold,
    silver,
    bronze,
    totalSubmissions = 0,
    skills = [],
    recentSubmissions = [],
  } = data;
  const colors = {
    gold: "#FFD700",
    silver: "#C0C0C0",
    bronze: "#CD7F32",
    accent: "#3B82F6",
    category: "#00b8a3",
  };

  // Format badge data for pie chart
  const badgeData = [
    { name: "Gold", value: gold },
    { name: "Silver", value: silver },
    { name: "Bronze", value: bronze },
  ];

  return (
    <div className="space-y-6 p-6 bg-gray-50">
      {/* Profile Header */}
      <Card className="bg-white">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <img
              src="/api/placeholder/64/64"
              alt={name}
              className="rounded-full"
            />
            <div>
              <h2 className="text-2xl font-bold">{name || username}</h2>
              <p className="text-gray-600">
                {country} • {category}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Trophy className="w-8 h-8 text-yellow-500" />
              <div>
                <p className="text-sm text-gray-600">Global Rank</p>
                <p className="text-2xl font-bold">#{rank?.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Star className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Contest Rating</p>
                <p className="text-2xl font-bold">{contestRating}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Flag className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Competitions</p>
                <p className="text-2xl font-bold">{competitions}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Award className="w-8 h-8 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">Total Submissions</p>
                <p className="text-2xl font-bold">{totalSubmissions}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Badge Distribution */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Badge Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={badgeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    <Cell fill={colors.gold} />
                    <Cell fill={colors.silver} />
                    <Cell fill={colors.bronze} />
                  </Pie>
                  <Tooltip
                    content={({ payload }) => {
                      if (payload && payload[0]) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-2 shadow-lg rounded-md">
                            <p className="font-semibold">{data.name}</p>
                            <p>Count: {data.value}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-4">
              {[
                { label: "Gold", value: gold, color: colors.gold },
                { label: "Silver", value: silver, color: colors.silver },
                { label: "Bronze", value: bronze, color: colors.bronze },
              ].map(({ label, value, color }) => (
                <div key={label} className="text-center">
                  <Trophy className="w-6 h-6 mx-auto mb-1" style={{ color }} />
                  <div className="text-sm text-gray-600">{label}</div>
                  <div className="font-bold">{value}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Skills */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Skills</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {skills.map((skill) => (
              <div key={skill.name}>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">{skill.name}</span>
                  <span className="text-gray-600">{skill.level}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all duration-1000 ease-out"
                    style={{
                      width: `${skill.level}%`,
                      backgroundColor: colors.accent,
                    }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Submissions */}
        <Card className="bg-white md:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={recentSubmissions}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
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

export default HackerRankStats;
