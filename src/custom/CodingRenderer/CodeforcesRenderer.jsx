import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { Trophy, Star, Users, Activity } from 'lucide-react';

const CodeforcesStats = ({ data }) => {
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
  const colors = {
    newbie: '#808080',
    pupil: '#008000',
    specialist: '#03A89E',
    expert: '#0000FF',
    candidateMaster: '#AA00AA',
    master: '#FF8C00',
    internationalMaster: '#FF8C00',
    grandmaster: '#FF0000',
    internationalGrandmaster: '#FF0000',
    legendaryGrandmaster: '#FF0000'
  };

  const getRankColor = (rank) => colors[rank] || colors.newbie;

  // Process rating history for the chart
  const ratingHistory = data.ratingHistory.map(entry => ({
    contestId: entry.contestId,
    date: new Date(entry.ratingUpdateTimeSeconds * 1000).toLocaleDateString(),
    rating: entry.newRating,
    change: entry.newRating - entry.oldRating
  }));

  // Calculate win/loss ratio from recent submissions
  const recentStats = data.recentSubmissions.reduce((acc, submission) => {
    if (submission.verdict === 'OK') acc.accepted++;
    acc.total++;
    return acc;
  }, { accepted: 0, total: 0 });

  return (
    <div className="space-y-6 p-6 bg-gray-50">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Trophy className="w-8 h-8 text-yellow-500" />
              <div>
                <p className="text-sm text-gray-600">Current Rating</p>
                <p className="text-2xl font-bold" style={{ color: getRankColor(data.rank) }}>
                  {data.rating}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Star className="w-8 h-8 text-yellow-500" />
              <div>
                <p className="text-sm text-gray-600">Max Rating</p>
                <p className="text-2xl font-bold">
                  {data.maxRating}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Rank</p>
                <p className="text-2xl font-bold capitalize" style={{ color: getRankColor(data.rank) }}>
                  {data.rank}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Recent Success Rate</p>
                <p className="text-2xl font-bold">
                  {((recentStats.accepted / recentStats.total) * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rating History Chart */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle>Rating History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ratingHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis />
                <Tooltip
                  content={({ payload, label }) => {
                    if (payload && payload[0]) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-2 shadow-lg rounded-md">
                          <p className="font-semibold">{label}</p>
                          <p>Rating: {data.rating}</p>
                          <p className={data.change >= 0 ? "text-green-500" : "text-red-500"}>
                            Change: {data.change >= 0 ? "+" : ""}{data.change}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="rating"
                  stroke={getRankColor(data.rank)}
                  strokeWidth={2}
                  dot={{ stroke: getRankColor(data.rank), strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Recent Submissions */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle>Recent Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.recentSubmissions.slice(0, 5).map((submission, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{submission.problemName}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(submission.creationTimeSeconds * 1000).toLocaleString()}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${submission.verdict === 'OK'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                  }`}>
                  {submission.verdict}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CodeforcesStats;