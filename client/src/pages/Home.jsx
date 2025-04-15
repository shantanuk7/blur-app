import React, { useEffect, useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Home = () => {
  const [notes, setNotes] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    // ... (fetch logic remains the same)
    if (!token) {
        navigate('/login');
        return;
    }
    const fetchNotes = async () => {
      try {
        const res = await API.get('/notes', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setNotes(res.data);
      } catch (err) {
        console.error(err);
        // Handle error appropriately, maybe clear token or show message
        // navigate('/login'); // Might cause loop if token is invalid but present
      }
    };
    fetchNotes();
  }, [navigate, token]);

  const truncate = (text, limit = 50) => {
    return text.length <= limit ? text : text.slice(0, limit) + '...';
  };

  return (
    // Parent element structure managed by #root flexbox
    <>
      <Navbar /> {/* Navbar remains outside the scrollable area */}

      {/* This div takes up remaining space and scrolls */}
      <div className="content-wrapper">
        {/* Optional: Use .container inside if needed for max-width, etc. */}
        {/* <div className="container"> */}
          {notes.length === 0 ? (
            <p style={{ textAlign: 'center', marginTop: '20px' }}>
                No notes yet. Press the + button to add one!
            </p>
          ) : (
            notes.map(note => (
              <div
                key={note._id}
                style={styles.noteCard} // Use inline styles or move to CSS
                onClick={() => navigate(`/view-note/${note._id}`)}
              >
                <h3>{note.title}</h3>
                <p>{truncate(note.content)}</p>
              </div>
            ))
          )}
        {/* </div> */} {/* Optional end .container */}
      </div>

      {/* Floating "+" button remains outside content-wrapper, positioned relative to viewport */}
      <button
        onClick={() => navigate('/new-note')}
        className="fab" // Use class for styling
        aria-label="Create New Note"
      >
        +
      </button>
    </>
  );
};

// Keep or move styles to CSS
const styles = {
  noteCard: {
    border: '1px solid var(--border-color)', // Use variable
    borderRadius: '4px',
    padding: '10px 15px',
    marginBottom: '10px',
    cursor: 'pointer',
    backgroundColor: 'var(--button-bg-color)', // Example background
    transition: 'background-color 0.2s ease',
  },
  // Remove fab style from here if using .fab class in CSS
};


export default Home;