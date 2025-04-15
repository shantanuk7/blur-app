import React, { useEffect, useState } from 'react';
import API from '../api';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { RiPencilLine } from "react-icons/ri"; // Use consistent icon set if possible (e.g., io5)
import { IoCreateOutline } from 'react-icons/io5'; // Example using Io5

const ViewNote = () => {
  const [note, setNote] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    // ... (fetch logic remains the same)
    const fetchNote = async () => {
      try {
        const res = await API.get(`/notes/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setNote(res.data);
      } catch (err) {
        console.error(err);
        navigate('/'); // Navigate home on error
      }
    };
    if (token) {
       fetchNote();
    } else {
       navigate('/login'); // Redirect if no token
    }
  }, [id, navigate, token]);

  const deleteNote = async () => {
    if (!window.confirm("Are you sure you want to delete this note?")) {
        return; // Add confirmation
    }
    try {
      await API.delete(`/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('Error deleting note');
    }
  };

  // Display loading state while fetching
  if (!note) {
      return (
          <>
              <Navbar onBack={() => navigate('/')} /> {/* Show navbar even when loading */}
              <div className="content-wrapper">
                  <p>Loading note...</p>
              </div>
          </>
      );
  }

  return (
    <>
      {/* Pass correct props to Navbar */}
      <Navbar onBack={() => navigate('/')} onDelete={deleteNote} />

      {/* Content area that scrolls */}
      <div className="content-wrapper">
        {/* Optional: Use .container inside if needed */}
        {/* <div className="container"> */}
          <h2>{note.title}</h2>
          {/* Render paragraphs for line breaks */}
          {note.content.split('\n').map((paragraph, index) => (
              <p key={index} style={{ whiteSpace: 'pre-wrap', marginBottom: '1em' }}>{paragraph}</p>
          ))}
        {/* </div> */}
      </div>

      {/* Edit FAB */}
      <button
        onClick={() => navigate(`/edit-note/${id}`)}
        className="fab" // Use class for styling
        aria-label="Edit Note"
      >
        {/* Use consistent icon set */}
        <IoCreateOutline />
      </button>
    </>
  );
};

export default ViewNote;