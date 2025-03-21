import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Search, RefreshCw, Calendar, Eye, X, AlertTriangle } from 'lucide-react';
import { getAllMateri, deleteMateri } from '../services/materiService';
import MateriForm from '../components/materi/MateriForm';

const MateriPage = () => {
  const [materis, setMateris] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedMateri, setSelectedMateri] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);

  const fetchMateris = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllMateri();
      setMateris(response.data);
    } catch (error) {
      console.error('Error fetching materi:', error);
      setError('Gagal memuat data materi. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMateris();
  }, []);

  const handleAdd = () => {
    setSelectedMateri(null);
    setIsFormOpen(true);
  };

  const handleEdit = (materi) => {
    setSelectedMateri(materi);
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus materi ini?')) {
      try {
        setIsDeleting(true);
        await deleteMateri(id);
        fetchMateris();
      } catch (error) {
        console.error('Error deleting materi:', error);
        setError('Gagal menghapus materi. Silakan coba lagi.');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedMateri(null);
    fetchMateris();
  };

  const filteredMateris = materis.filter(materi =>
    materi.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
    materi.konten.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewMateri = (materi) => {
    // In a real app, this would navigate to a detail view
    window.open(`/materi/${materi._id}`, '_blank');
  };

  if (loading && materis.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#497D74]"></div>
        <p className="mt-4 text-gray-600">Memuat data materi...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#FFF8DC] min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-[#e8e1c8]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <h1 className="text-2xl font-bold text-[#497D74]">Manajemen Materi</h1>
          <button
            onClick={handleAdd}
            className="bg-[#497D74] text-white px-5 py-2.5 rounded-lg flex items-center gap-2 hover:bg-[#3c6a62] transition-colors shadow-sm"
          >
            <Plus size={20} />
            <span>Tambah Materi</span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Cari materi berdasarkan judul atau konten..."
              className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#497D74] focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <button
            onClick={fetchMateris}
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
      {filteredMateris.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <div className="bg-gray-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle size={28} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            {searchQuery ? 'Tidak ada materi yang sesuai dengan pencarian' : 'Belum ada materi tersedia'}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchQuery
              ? 'Coba gunakan kata kunci lain atau kurangi filter pencarian.'
              : 'Silakan tambahkan materi baru dengan menekan tombol "Tambah Materi" di atas.'}
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
          {filteredMateris.map((materi) => (
            <div
              key={materi._id}
              className="bg-white rounded-xl shadow-md overflow-hidden border border-[#e8e1c8] hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px]"
            >
              {materi.thumbnail ? (
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={`${materi.thumbnail}`}
                    alt={materi.judul}
                    className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              ) : (
                <div className="h-32 bg-gradient-to-r from-[#497D74]/20 to-[#5c8f86]/10 flex items-center justify-center">
                  <BookOpen className="h-12 w-12 text-[#497D74]/30" />
                </div>
              )}

              <div className="p-5">
                <div className="flex items-center text-xs text-gray-500 mb-2">
                  <Calendar size={14} className="mr-1" />
                  <span>{new Date(materi.createdAt).toLocaleDateString('id-ID')}</span>
                </div>

                <h3 className="text-xl font-bold mb-2 text-[#497D74] line-clamp-2">{materi.judul}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{materi.konten.replace(/<[^>]*>/g, '')}</p>

                <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => handleViewMateri(materi)}
                    className="text-[#497D74] text-sm font-medium hover:underline flex items-center"
                  >
                    <Eye size={16} className="mr-1" /> Lihat Detail
                  </button>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(materi)}
                      className="p-2 text-[#497D74] hover:bg-[#497D74] hover:text-white rounded-md transition-colors"
                      title="Edit Materi"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(materi._id)}
                      className="p-2 text-red-500 hover:bg-red-500 hover:text-white rounded-md transition-colors"
                      title="Hapus Materi"
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

      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <MateriForm
              materi={selectedMateri}
              onClose={handleFormClose}
            />
          </div>
        </div>
      )}
    </div>
  );
};


import { BookOpen } from 'lucide-react';

export default MateriPage;