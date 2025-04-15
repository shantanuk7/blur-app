import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import Navbar from '../components/Navbar';

const NewNote = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [activeWordIndex, setActiveWordIndex] = useState(null);
  const [blurEnabled, setBlurEnabled] = useState(true);
  const editableRef = useRef(null);
  const overlayRef = useRef(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [navigate, token]);

  useEffect(() => {
    if (editableRef.current) {
      editableRef.current.focus();
    }
  }, []);

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

  const getCaretCharacterOffsetWithin = (element) => {
    let caretOffset = 0;
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(element);
      preCaretRange.setEnd(range.endContainer, range.endOffset);
      caretOffset = preCaretRange.toString().length;
    }
    return caretOffset;
  };

  const tokenize = (txt) => txt.split(/(\s+)/);

  const updateActiveWord = (currentText) => {
    if (!editableRef.current) return;
    const caretOffset = getCaretCharacterOffsetWithin(editableRef.current);
    const tokens = tokenize(currentText);
    let charCount = 0;
    let wordCounter = 0;
    let currentActive = null;
    tokens.forEach((token) => {
      if (!/\s+/.test(token)) {
        const start = charCount;
        const end = charCount + token.length;
        if (caretOffset >= start && caretOffset <= end) {
          currentActive = wordCounter;
        }
        wordCounter++;
      }
      charCount += token.length;
    });
    setActiveWordIndex(currentActive);
  };

  const handleInput = () => {
    const newText = editableRef.current.innerText;
    setContent(newText);
    updateActiveWord(newText);
  };

  const renderOverlay = () => {
    const tokens = tokenize(content);
    let wordCounter = 0;
    return tokens.map((token, index) => {
      if (/\s+/.test(token)) {
        return token;
      } else {
        const nextToken = tokens[index + 1];
        const isComplete = (nextToken && /\s+/.test(nextToken)) || content.endsWith(' ');
        const shouldBlur = blurEnabled && isComplete && wordCounter !== activeWordIndex;
        const element = (
          <span key={wordCounter} className={shouldBlur ? 'blurred' : ''}>
            {token}
          </span>
        );
        wordCounter++;
        return element;
      }
    });
  };

  const syncScroll = () => {
    if (editableRef.current && overlayRef.current) {
      overlayRef.current.scrollTop = editableRef.current.scrollTop;
      overlayRef.current.scrollLeft = editableRef.current.scrollLeft;
    }
  };

  useEffect(() => {
    const currentEditable = editableRef.current;
    if (currentEditable) {
      currentEditable.addEventListener('scroll', syncScroll);
    }
    return () => {
      if (currentEditable) {
        currentEditable.removeEventListener('scroll', syncScroll);
      }
    };
  }, []);

  const handleSelectionChange = useCallback(() => {
    updateActiveWord(content);
  }, [content]);

  useEffect(() => {
    document.addEventListener('selectionchange', handleSelectionChange);
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, [handleSelectionChange]);

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
        <div className="editor-container">
          <div className="overlay" ref={overlayRef}>
            {renderOverlay()}
          </div>
          <div
            className="editor"
            contentEditable
            ref={editableRef}
            onInput={handleInput}
            suppressContentEditableWarning={true}
            spellCheck={false}
          ></div>
        </div>
      </div>
    </>
  );
};

export default NewNote;