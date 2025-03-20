import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { getAllMateri, deleteMateri } from '../services/materiService';
import MateriForm from '../components/materi/MateriForm';

const MateriPage = () => {
  const [materis, setMateris] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedMateri, setSelectedMateri] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMateris = async () => {
    try {
      const response = await getAllMateri();
      setMateris(response.data);
    } catch (error) {
      console.error('Error fetching materi:', error);
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
        await deleteMateri(id);
        fetchMateris();
      } catch (error) {
        console.error('Error deleting materi:', error);
      }
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedMateri(null);
    fetchMateris();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#497D74]"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#FFF8DC] min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#497D74]">Manajemen Materi</h1>
        <button
          onClick={handleAdd}
          className="bg-[#497D74] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#5c8f86]"
        >
          <Plus size={20} />
          Tambah Materi
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {materis.map((materi) => (
          <div
            key={materi._id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            {materi.thumbnail && (
              <img
                src={`${materi.thumbnail}`}
                alt={materi.judul}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2 text-[#497D74]">{materi.judul}</h3>
              <p className="text-gray-600 mb-4 line-clamp-3">{materi.konten}</p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => handleEdit(materi)}
                  className="p-2 text-[#497D74] hover:bg-[#497D74] hover:text-white rounded-lg transition-colors"
                >
                  <Pencil size={20} />
                </button>
                <button
                  onClick={() => handleDelete(materi._id)}
                  className="p-2 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isFormOpen && (
        <MateriForm
          materi={selectedMateri}
          onClose={handleFormClose}
        />
      )}
    </div>
  );
};

export default MateriPage;