import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Play } from 'lucide-react';
import VideoForm from '../components/video/VideoForm';
import { getAllVideos, deleteVideo } from '../services/videoService';

const VideoPage = () => {
  const [videos, setVideos] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchVideos = async () => {
    try {
      const response = await getAllVideos();
      setVideos(Array.isArray(response) ? response : response.data.data || []);
    } catch (error) {
      console.error('Error fetching videos:', error);
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
        await deleteVideo(id);
        fetchVideos();
      } catch (error) {
        console.error('Error deleting video:', error);
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
    const urlParams = new URLSearchParams(new URL(url).search);
    return urlParams.get('v');
  };

  // Fungsi untuk mendapatkan thumbnail YouTube
  const getYoutubeThumbnail = (url) => {
    const videoId = getVideoId(url);
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#497D74]">Manajemen Video</h1>
        <button
          onClick={handleAdd}
          className="bg-[#497D74] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#5c8f86]"
        >
          <Plus size={20} />
          Tambah Video
        </button>
      </div>

      {/* List Video */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {videos.map((video) => (
          <div
            key={video._id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="relative">
              <img
                src={getYoutubeThumbnail(video.youtube_url)}
                alt={video.judul}
                className="w-full h-48 object-cover"
              />
              <a
                href={video.youtube_url}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity"
              >
                <Play size={48} className="text-white" />
              </a>
            </div>
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{video.judul}</h3>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => handleEdit(video)}
                  className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"
                >
                  <Pencil size={20} />
                </button>
                <button
                  onClick={() => handleDelete(video._id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <VideoForm
          video={selectedVideo}
          onClose={handleFormClose}
        />
      )}
    </div>
  );
};

export default VideoPage;