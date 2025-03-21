import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Play, Search, RefreshCw, Calendar, X, AlertTriangle, ExternalLink } from 'lucide-react';
import VideoForm from '../components/video/VideoForm';
import { getAllVideos, deleteVideo } from '../services/videoService';

const VideoPage = () => {
  const [videos, setVideos] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllVideos();
      setVideos(Array.isArray(response) ? response : response.data.data || []);
    } catch (error) {
      console.error('Error fetching videos:', error);
      setError('Gagal memuat data video. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleAdd = () => {
    setSelectedVideo(null);
    setIsFormOpen(true);
  };

  const handleEdit = (video) => {
    setSelectedVideo(video);
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus video ini?')) {
      try {
        setIsDeleting(true);
        await deleteVideo(id);
        fetchVideos();
      } catch (error) {
        console.error('Error deleting video:', error);
        setError('Gagal menghapus video. Silakan coba lagi.');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedVideo(null);
    fetchVideos();
  };

  // Fungsi untuk mendapatkan ID video dari URL YouTube
  const getVideoId = (url) => {
    try {
      const urlParams = new URLSearchParams(new URL(url).search);
      return urlParams.get('v');
    } catch (error) {
      console.error('Invalid URL:', error);
      return '';
    }
  };

  // Fungsi untuk mendapatkan thumbnail YouTube
  const getYoutubeThumbnail = (url) => {
    const videoId = getVideoId(url);
    return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : '';
  };

  const filteredVideos = videos.filter(video =>
    video.judul.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading && videos.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#497D74]"></div>
        <p className="mt-4 text-gray-600">Memuat data video...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#FFF8DC] min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-[#e8e1c8]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <h1 className="text-2xl font-bold text-[#497D74]">Manajemen Video</h1>
          <button
            onClick={handleAdd}
            className="bg-[#497D74] text-white px-5 py-2.5 rounded-lg flex items-center gap-2 hover:bg-[#3c6a62] transition-colors shadow-sm"
          >
            <Plus size={20} />
            <span>Tambah Video</span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Cari video berdasarkan judul..."
              className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#497D74] focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <button
            onClick={fetchVideos}
            className="flex items-center justify-center gap-2 text-[#497D74] border border-[#497D74] px-4 py-2.5 rounded-lg hover:bg-[#497D74] hover:text-white transition-colors"
            disabled={loading}
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            <span>{loading ? "Memuat..." : "Refresh"}</span>
          </button>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6 flex items-start">
          <AlertTriangle className="h-5 w-5 mr-2 mt-0.5" />
          <div>{error}</div>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-500 hover:text-red-700"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* Content */}
      {filteredVideos.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <div className="bg-gray-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle size={28} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            {searchQuery ? 'Tidak ada video yang sesuai dengan pencarian' : 'Belum ada video tersedia'}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchQuery
              ? 'Coba gunakan kata kunci lain atau kurangi filter pencarian.'
              : 'Silakan tambahkan video baru dengan menekan tombol "Tambah Video" di atas.'}
          </p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="bg-[#497D74] text-white px-4 py-2 rounded-lg hover:bg-[#3c6a62] transition-colors"
            >
              Clear Search
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => (
            <div
              key={video._id}
              className="bg-white rounded-xl shadow-md overflow-hidden border border-[#e8e1c8] hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px]"
            >
              <div className="relative group">
                <img
                  src={getYoutubeThumbnail(video.youtube_url)}
                  alt={video.judul}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/640x360?text=Video+Thumbnail';
                  }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <a
                    href={video.youtube_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white p-4 rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-300 shadow-lg"
                  >
                    <Play size={24} className="text-red-600" />
                  </a>
                </div>
                <div className="absolute top-3 left-3 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                  YouTube
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-center text-xs text-gray-500 mb-2">
                  <Calendar size={14} className="mr-1" />
                  <span>{new Date(video.createdAt).toLocaleDateString('id-ID')}</span>
                </div>

                <h3 className="text-xl font-bold mb-3 text-[#497D74] line-clamp-2">{video.judul}</h3>

                <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">

                  <a
                    href={video.youtube_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#497D74] text-sm font-medium hover:underline flex items-center"
                  >
                    <ExternalLink size={16} className="mr-1" /> Buka di YouTube
                  </a>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(video)}
                      className="p-2 text-[#497D74] hover:bg-[#497D74] hover:text-white rounded-md transition-colors"
                      title="Edit Video"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(video._id)}
                      className="p-2 text-red-500 hover:bg-red-500 hover:text-white rounded-md transition-colors"
                      title="Hapus Video"
                      disabled={isDeleting}
                    >
                      <Trash2 size={18} className={isDeleting ? "opacity-50" : ""} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <VideoForm
              video={selectedVideo}
              onClose={handleFormClose}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPage;