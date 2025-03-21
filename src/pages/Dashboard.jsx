import React, { useState, useEffect } from 'react';
import { getDashboardStats } from '../services/dashboardService';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Users, BookOpen, Video, FileQuestion, RefreshCw, ChevronRight, Calendar, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const DashboardCard = ({ title, value, icon: Icon, bgColor, color, linkTo }) => (
  <Card className="bg-white hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px] border-none shadow-md overflow-hidden">
    <div className={`absolute top-0 right-0 w-24 h-24 ${bgColor} opacity-5 rounded-full -mr-8 -mt-8`}></div>
    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
      <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
      <div className={`p-2.5 rounded-full ${bgColor}`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
    </CardHeader>
    <CardContent className="relative">
      <div className="text-4xl font-bold text-[#497D74]">{value}</div>
      {linkTo && (
        <div className="mt-4">
          <Link
            to={linkTo}
            className="text-sm text-[#497D74] hover:text-[#3c6a62] hover:underline flex items-center group"
          >
            <span>Lihat detail</span>
            <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      )}
    </CardContent>
  </Card>
);

const RecentItem = ({ title, date, type, id }) => {
  const getLink = () => {
    switch (type) {
      case 'materi':
        return `/materi/${id}`;
      case 'video':
        return `/video/${id}`;
      case 'quiz':
        return `/quiz/${id}`;
      default:
        return '#';
    }
  };

  const getTypeIcon = () => {
    switch (type) {
      case 'materi':
        return <BookOpen size={16} className="text-blue-500" />;
      case 'video':
        return <Video size={16} className="text-red-500" />;
      case 'quiz':
        return <FileQuestion size={16} className="text-purple-500" />;
      default:
        return null;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'materi':
        return 'bg-blue-50';
      case 'video':
        return 'bg-red-50';
      case 'quiz':
        return 'bg-purple-50';
      default:
        return 'bg-gray-100';
    }
  };

  return (
    <Link to={getLink()}>
      <div className="flex items-center justify-between py-3.5 px-3 border-b last:border-0 hover:bg-gray-50 rounded-lg transition-all duration-200 group">
        <div className="flex items-center">
          <div className={`mr-3 p-2 ${getBgColor()} rounded-lg`}>
            {getTypeIcon()}
          </div>
          <div>
            <span className="font-medium text-gray-800 line-clamp-1 group-hover:text-[#497D74] transition-colors">{title}</span>
          </div>
        </div>
        <div className="flex items-center">
          <span className="text-xs text-gray-500 flex items-center bg-gray-100 px-2 py-1 rounded-full">
            <Calendar size={10} className="mr-1" />
            {new Date(date).toLocaleDateString('id-ID')}
          </span>
          <ChevronRight size={16} className="ml-2 text-gray-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    </Link>
  );
};

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
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setRefreshing(true);
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
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <div className="animate-spin rounded-full h-14 w-14 border-b-4 border-[#497D74]"></div>
        <p className="mt-4 text-gray-600 font-medium">Memuat data dashboard...</p>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen">
      {/* Header Card */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#497D74] opacity-5 rounded-full -mr-32 -mt-32"></div>
        <div className="relative">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-[#497D74] mb-2">Dashboard Admin</h1>
              <p className="text-gray-600">Selamat datang di Panel Admin Giat Cerika</p>
            </div>
            <button
              onClick={fetchDashboardData}
              disabled={refreshing}
              className="flex items-center gap-2 bg-[#497D74] text-white px-4 py-2.5 rounded-lg hover:bg-[#3c6a62] transition-colors shadow-sm"
            >
              <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
              <span>{refreshing ? 'Memperbarui...' : 'Perbarui Data'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 mb-10 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Total Materi"
          value={stats.totalMateri}
          icon={BookOpen}
          bgColor="bg-blue-100"
          color="text-blue-600"
          linkTo="/materi"
        />
        <DashboardCard
          title="Total Video"
          value={stats.totalVideo}
          icon={Video}
          bgColor="bg-red-100"
          color="text-red-600"
          linkTo="/video"
        />
        <DashboardCard
          title="Total Pengguna"
          value={stats.totalUser}
          icon={Users}
          bgColor="bg-green-100"
          color="text-green-600"
        />
        <DashboardCard
          title="Total Quiz"
          value={stats.totalQuiz}
          icon={FileQuestion}
          bgColor="bg-purple-100"
          color="text-purple-600"
          linkTo="/quiz"
        />
      </div>

      {/* Recent Items Section */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-[#497D74] mb-4 flex items-center">
          <TrendingUp size={20} className="mr-2" /> Konten Terbaru
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-white hover:shadow-lg transition-all duration-300 border-none shadow-md overflow-hidden">
          <CardHeader className="pb-2 border-b">
            <CardTitle className="text-lg text-[#497D74] flex items-center">
              <div className="mr-3 p-1.5 bg-blue-100 rounded-lg">
                <BookOpen className="h-5 w-5 text-blue-600" />
              </div>
              Materi Terbaru
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="p-3">
              {recent.materi.length > 0 ? (
                recent.materi.map((item) => (
                  <RecentItem
                    key={item._id}
                    id={item._id}
                    title={item.judul}
                    date={item.createdAt}
                    type="materi"
                  />
                ))
              ) : (
                <div className="py-6 text-center text-gray-500">
                  <BookOpen className="mx-auto h-10 w-10 text-gray-300 mb-2" />
                  <p>Belum ada materi tersedia</p>
                </div>
              )}
            </div>
            <div className="mt-2 text-center py-3 border-t bg-gray-50">
              <Link
                to="/materi"
                className="text-sm font-medium text-[#497D74] hover:text-[#3c6a62] flex items-center justify-center"
              >
                Lihat semua materi <ChevronRight size={16} className="ml-1" />
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white hover:shadow-lg transition-all duration-300 border-none shadow-md overflow-hidden">
          <CardHeader className="pb-2 border-b">
            <CardTitle className="text-lg text-[#497D74] flex items-center">
              <div className="mr-3 p-1.5 bg-red-100 rounded-lg">
                <Video className="h-5 w-5 text-red-600" />
              </div>
              Video Terbaru
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="p-3">
              {recent.video.length > 0 ? (
                recent.video.map((item) => (
                  <RecentItem
                    key={item._id}
                    id={item._id}
                    title={item.judul}
                    date={item.createdAt}
                    type="video"
                  />
                ))
              ) : (
                <div className="py-6 text-center text-gray-500">
                  <Video className="mx-auto h-10 w-10 text-gray-300 mb-2" />
                  <p>Belum ada video tersedia</p>
                </div>
              )}
            </div>
            <div className="mt-2 text-center py-3 border-t bg-gray-50">
              <Link
                to="/video"
                className="text-sm font-medium text-[#497D74] hover:text-[#3c6a62] flex items-center justify-center"
              >
                Lihat semua video <ChevronRight size={16} className="ml-1" />
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white hover:shadow-lg transition-all duration-300 border-none shadow-md overflow-hidden">
          <CardHeader className="pb-2 border-b">
            <CardTitle className="text-lg text-[#497D74] flex items-center">
              <div className="mr-3 p-1.5 bg-purple-100 rounded-lg">
                <FileQuestion className="h-5 w-5 text-purple-600" />
              </div>
              Quiz Terbaru
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="p-3">
              {recent.quiz.length > 0 ? (
                recent.quiz.map((item) => (
                  <RecentItem
                    key={item._id}
                    id={item._id}
                    title={item.title}
                    date={item.createdAt}
                    type="quiz"
                  />
                ))
              ) : (
                <div className="py-6 text-center text-gray-500">
                  <FileQuestion className="mx-auto h-10 w-10 text-gray-300 mb-2" />
                  <p>Belum ada quiz tersedia</p>
                </div>
              )}
            </div>
            <div className="mt-2 text-center py-3 border-t bg-gray-50">
              <Link
                to="/quiz"
                className="text-sm font-medium text-[#497D74] hover:text-[#3c6a62] flex items-center justify-center"
              >
                Lihat semua quiz <ChevronRight size={16} className="ml-1" />
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;