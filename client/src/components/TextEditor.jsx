import React, { useEffect, useRef, useState, useCallback } from 'react';

const TextEditor = ({
  content,
  setContent,
  blurEnabled,
  toggleBlur
}) => {
  const [activeWordIndex, setActiveWordIndex] = useState(null);
  const editableRef = useRef(null);
  const overlayRef = useRef(null);

  const tokenize = (txt) => txt.split(/([\s\n]+)/);

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
      if (/\s+/.test(token)) return token;
  
      const nextToken = tokens[index + 1];
      const isComplete =
      (nextToken && (/^\s+$/.test(nextToken) || nextToken.includes('\n'))) ||
      content.endsWith(' ') || content.endsWith('\n');
        
      const shouldBlur = blurEnabled && isComplete && wordCounter !== activeWordIndex;
  
      const element = (
        <span key={wordCounter} className={shouldBlur ? 'blurred' : ''}>
        {token}
        </span>
      );
  
      wordCounter++;
      return element;
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

  useEffect(() => {
    if (editableRef.current) {
      editableRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (editableRef.current && editableRef.current.innerText !== content) {
      editableRef.current.innerText = content;
      setCaretToEnd(); // Set cursor after content is inserted
    }
  }, [content]);  

  const setCaretToEnd = () => {
    const el = editableRef.current;
    if (!el) return;
    const range = document.createRange();
    const sel = window.getSelection();
    range.selectNodeContents(el);
    range.collapse(false); // Move to end
    sel.removeAllRanges();
    sel.addRange(range);
  };
  

  return (
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
  );
};

export default TextEditor;
