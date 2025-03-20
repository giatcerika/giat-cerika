import React, { useState, useEffect } from 'react';
import { getDashboardStats } from '../services/dashboardService';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Users, BookOpen, Video, FileQuestion } from 'lucide-react';

const DashboardCard = ({ title, value, icon: Icon, trend }) => (
  <Card className="bg-white">
    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
      <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
      <Icon className="w-4 h-4 text-[#497D74]" />
    </CardHeader>
    <CardContent className="flex flex-col items-center justify-center text-center">
      <div className="text-2xl font-bold text-[#497D74]">{value}</div>
      {trend && (
        <p className="text-xs text-gray-600">
          <span className={trend > 0 ? 'text-green-600' : 'text-red-600'}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
          {' '}dari bulan lalu
        </p>
      )}
    </CardContent>
  </Card>
);

const RecentItem = ({ title, date }) => (
  <div className="flex items-center justify-between py-3 border-b last:border-0">
    <span className="font-medium text-gray-700">{title}</span>
    <span className="text-sm text-gray-500">
      {new Date(date).toLocaleDateString('id-ID')}
    </span>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalMateri: 0,
    totalVideo: 0,
    totalUser: 0,
    totalQuiz: 0,
  });
  const [recent, setRecent] = useState({
    materi: [],
    video: [],
    quiz: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const data = await getDashboardStats();
        setStats(data.stats);
        setRecent(data.recent);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setStats({
          totalMateri: 0,
          totalVideo: 0,
          totalUser: 0,
          totalQuiz: 0
        });
        setRecent({
          materi: [],
          video: [],
          quiz: []
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#497D74]"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#FFF8DC] min-h-screen">
      <h1 className="text-2xl font-bold text-[#497D74] mb-6">Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Total Materi"
          value={stats.totalMateri}
          icon={BookOpen}
        />
        <DashboardCard
          title="Total Video"
          value={stats.totalVideo}
          icon={Video}
        />
        <DashboardCard
          title="Total Pengguna"
          value={stats.totalUser}
          icon={Users}
        />
        <DashboardCard
          title="Total Quiz"
          value={stats.totalQuiz}
          icon={FileQuestion}
        />
      </div>

      {/* Recent Items */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-[#497D74]">Materi Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            {recent.materi.map((item) => (
              <RecentItem
                key={item._id}
                title={item.judul}
                date={item.createdAt}
              />
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-[#497D74]">Video Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            {recent.video.map((item) => (
              <RecentItem
                key={item._id}
                title={item.judul}
                date={item.createdAt}
              />
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-[#497D74]">Quiz Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            {recent.quiz.map((item) => (
              <RecentItem
                key={item._id}
                title={item.title}
                date={item.createdAt}
              />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;