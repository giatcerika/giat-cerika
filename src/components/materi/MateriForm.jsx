import React, { useState } from 'react';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { createMateri, updateMateri } from '../../services/materiService';

const MateriForm = ({ materi, onClose }) => {
  const [formData, setFormData] = useState({
    judul: materi?.judul || '',
    konten: materi?.konten || '',
    thumbnail: null
  });
  const [preview, setPreview] = useState(materi?.thumbnail ? `https://giat-cerika.vercel.app/${materi.thumbnail}` : null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        thumbnail: file
      }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = new FormData();
      submitData.append('judul', formData.judul);
      submitData.append('konten', formData.konten);
      if (formData.thumbnail) {
        submitData.append('thumbnail', formData.thumbnail);
      }

      if (materi) {
        await updateMateri(materi._id, submitData);
      } else {
        await createMateri(submitData);
      }
      onClose();
    } catch (error) {
      console.error('Error submitting materi:', error);
      alert('Terjadi kesalahan saat menyimpan materi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white">
          <h2 className="text-xl font-semibold">
            {materi ? 'Edit Materi' : 'Tambah Materi'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
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
            <label className="block text-sm font-medium mb-1">Konten</label>
            <textarea
              name="konten"
              value={formData.konten}
              onChange={handleChange}
              rows="6"
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Thumbnail</label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200">
                <Upload size={20} />
                <span>Upload Gambar</span>
                <input
                  type="file"
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
              </label>
              {preview && (
                <div className="relative">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPreview(null);
                      setFormData(prev => ({ ...prev, thumbnail: null }));
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Preview */}
          <div className="mb-4">
            <h3 className="text-sm font-medium mb-2">Preview</h3>
            <div className="border rounded-lg p-4">
              <h4 className="text-xl font-semibold mb-2">{formData.judul || 'Judul Materi'}</h4>
              {preview ? (
                <img src={preview} alt="Preview" className="w-full h-48 object-cover rounded-lg mb-4" />
              ) : (
                <div className="w-full h-48 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                  <ImageIcon size={48} className="text-gray-400" />
                </div>
              )}
              <p className="text-gray-600 whitespace-pre-line">
                {formData.konten || 'Konten materi akan ditampilkan di sini'}
              </p>
            </div>
          </div>

          {/* Tombol aksi */}
          <div className="flex justify-end gap-2 sticky bottom-0 bg-white pt-4 border-t">
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
              {loading ? 'Menyimpan...' : materi ? 'Update' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MateriForm;