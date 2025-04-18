import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../api';
import Navbar from '../components/Navbar';
import TextEditor from '../components/TextEditor';

const EditNote = () => {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [blurEnabled, setBlurEnabled] = useState(true);
  const toggleBlur = () => setBlurEnabled((prev) => !prev);
  
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

  const saveNote = async () => {
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

  const handleBack = () => {
    navigate(`/view-note/${id}`);
  };

  const isLoading = title === '' && content === '';

  return (
    <>
      <Navbar
        onSave={saveNote}
        onBack={handleBack}
        blurEnabled={blurEnabled}
        toggleBlur={toggleBlur}
      />

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
              className="note-title-input"
            />
            <TextEditor
              content={content}
              setContent={setContent}
              blurEnabled={blurEnabled}
              toggleBlur={toggleBlur}
            />
          </>
        )}
      </div>
    </>
  );
};

export default EditNote;
