import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../api';
import Navbar from '../components/Navbar';

const EditNote = () => {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();
  const textareaRef = useRef(null);
  const token = localStorage.getItem('token');

  // Fetch existing note
  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await API.get(`/notes/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTitle(res.data.title);
        setContent(res.data.content);
      } catch (err) {
        console.error("Error fetching note:", err);
        alert('Failed to load note for editing.');
        navigate('/');
      }
    };
    if (token) {
      fetchNote();
    } else {
      navigate('/login');
    }
  }, [id, navigate, token]);

  // Save the updated note
  const saveNote = async () => {
    // Allow saving even if only title or content exists, but not neither
    if (!title.trim() && !content.trim()) {
        alert('Note cannot be empty.');
        return;
    }
    try {
      await API.put(
        `/notes/${id}`,
        { title: title.trim(), content: content.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate(`/view-note/${id}`);
    } catch (err) {
      console.error("Error updating note:", err);
      alert('Error updating note');
    }
  };

  // Navigate back to the view page
  const handleBack = () => {
    navigate(`/view-note/${id}`);
  };

  // Basic loading state
  // A more robust check might be needed if empty notes are valid
  const isLoading = title === '' && content === '';


  return (
    <>
      {/* Navbar configured for edit screen */}
      <Navbar onSave={saveNote} onBack={handleBack} />

      {/* Use the new wrapper class for flex layout */}
      <div className="note-editor-wrapper">
        {isLoading ? (
           <p>Loading note...</p>
        ) : (
          <>
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="note-title-input" // Apply new class
            />
            <textarea
              placeholder="Edit your note..."
              value={content}
              onChange={e => setContent(e.target.value)}
              ref={textareaRef}
              className="note-content-textarea" // Apply new class
            />
          </>
        )}
      </div>
    </>
  );
};

export default EditNote;