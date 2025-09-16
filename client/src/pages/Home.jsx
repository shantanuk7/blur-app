// src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { IoAdd, IoDocumentTextOutline } from 'react-icons/io5';

// Helper function to format dates
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric'
  });
};

const Home = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    const fetchNotes = async () => {
      try {
        const res = await API.get('/notes', {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Sort notes by most recently updated
        const sortedNotes = res.data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        setNotes(sortedNotes);
      } catch (err) {
        console.error(err);
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, [navigate]);

  const truncate = (text, limit = 100) => {
    return text.length <= limit ? text : text.slice(0, limit) + '...';
  };

  return (
    <>
      <Navbar />
      <div className="content-wrapper">
        {loading ? (
          <p>Loading...</p>
        ) : notes.length === 0 ? (
          <div className="empty-notes-view">
            <IoDocumentTextOutline />
            <h3>No Notes Yet</h3>
            <p>Tap the + button to create your first note.</p>
          </div>
        ) : (
          <div className="notes-grid">
            {notes.map(note => (
              <div
                key={note._id}
                className="note-card"
                onClick={() => navigate(`/view-note/${note._id}`)}
              >
                <div>
                  <h3>{note.title || 'Untitled Note'}</h3>
                  <p>{truncate(note.content)}</p>
                </div>
                <div className="note-card-footer">
                  {formatDate(note.updatedAt)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={() => navigate('/new-note')}
        className="fab"
        aria-label="Create New Note"
      >
        <IoAdd />
      </button>
    </>
  );
};

export default Home;