import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import Navbar from '../components/Navbar';
import TextEditor from '../components/TextEditor';

const NewNote = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [blurEnabled, setBlurEnabled] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [navigate, token]);

  const saveNote = async () => {
    if (!title.trim() && !content.trim()) {
      alert('Note cannot be empty.');
      return;
    }
    try {
      await API.post(
        '/notes',
        { title: title.trim(), content: content.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate('/');
    } catch (err) {
      console.error('Error saving note:', err);
      alert('Error saving note');
    }
  };

  const handleBack = () => {
    if (title || content) {
      if (!window.confirm('Discard unsaved changes?')) {
        return;
      }
    }
    navigate('/');
  };

  const toggleBlur = () => setBlurEnabled((prev) => !prev);

  return (
    <>
      <Navbar onSave={saveNote} onBack={handleBack} blurEnabled={blurEnabled} toggleBlur={toggleBlur} />
      <div className="note-editor-wrapper">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="note-title-input"
        />
        <TextEditor
          content={content}
          setContent={setContent}
          blurEnabled={blurEnabled}
          toggleBlur={toggleBlur}
        />
      </div>
    </>
  );
};

export default NewNote;
