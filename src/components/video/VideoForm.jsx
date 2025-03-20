import React, { useState } from 'react';
import { X, Play } from 'lucide-react';
import { createVideo, updateVideo } from '../../services/videoService';

const VideoForm = ({ video, onClose }) => {
  const [formData, setFormData] = useState({
    judul: video?.judul || '',
    youtube_url: video?.youtube_url || ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  // Fungsi untuk validasi URL YouTube
  const isValidYoutubeUrl = (url) => {
    try {
      const urlObj = new URL(url);
      const isYoutube = urlObj.hostname === 'www.youtube.com' || urlObj.hostname === 'youtube.com';
      const hasVideoId = urlObj.searchParams.get('v');
      return isYoutube && hasVideoId;
    } catch {
      return false;
    }
  };

  // Fungsi untuk mendapatkan ID video dari URL YouTube
  const getVideoId = (url) => {
    try {
      const urlObj = new URL(url);
      return urlObj.searchParams.get('v');
    } catch {
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validasi judul
    if (!formData.judul.trim()) {
      setError('Judul video tidak boleh kosong');
      return;
    }

    // Validasi URL
    if (!isValidYoutubeUrl(formData.youtube_url)) {
      setError('URL YouTube tidak valid. Gunakan format: https://www.youtube.com/watch?v=...');
      return;
    }

    setLoading(true);
    try {
      if (video) {
        await updateVideo(video._id, formData);
      } else {
        const response = await createVideo(formData);
        console.log('Response:', response);
      }
      onClose();
    } catch (error) {
      console.error('Error detail:', error.response || error);
      setError(
        error.response?.data?.message || 
        'Terjadi kesalahan saat menyimpan video. Silakan cek console untuk detail.'
      );
    } finally {
      setLoading(false);
    }
  };

  const videoId = getVideoId(formData.youtube_url);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">
            {video ? 'Edit Video' : 'Tambah Video'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
            type="button"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Judul</label>
            <input
              type="text"
              name="judul"
              value={formData.judul}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">URL YouTube</label>
            <input
              type="url"
              name="youtube_url"
              value={formData.youtube_url}
              onChange={handleChange}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full p-2 border rounded-lg"
              required
            />
            {error && (
              <p className="text-red-500 text-sm mt-1">{error}</p>
            )}
          </div>

          {/* Preview */}
          {videoId && (
            <div className="mb-4">
              <h3 className="text-sm font-medium mb-2">Preview</h3>
              <div className="aspect-video rounded-lg overflow-hidden">
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title="YouTube video preview"
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
            >
              {loading ? 'Menyimpan...' : video ? 'Update' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VideoForm;