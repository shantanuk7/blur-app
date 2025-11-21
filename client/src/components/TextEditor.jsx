import React, { useEffect, useRef, useState, useCallback, useLayoutEffect } from "react";

const TextEditor = ({ content, setContent, blurEnabled }) => {
  const editableRef = useRef(null);
  const overlayRef = useRef(null);
  const rafRef = useRef(null);
  
  // We track the active word index to know which one to reveal
  const [activeWordIndex, setActiveWordIndex] = useState(null);

  // Helper: Normalize newlines to avoid innerText/React drift
  const normalizeText = (text) => {
    return text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  };

  // 1. Build word ranges. 
  // A "word" is any sequence of non-whitespace characters.
  const buildWordRanges = useCallback((rawText = "") => {
    const text = normalizeText(rawText);
    const ranges = [];
    const re = /\S+/g;
    let match;
    
    while ((match = re.exec(text)) !== null) {
      ranges.push({
        start: match.index,
        end: match.index + match[0].length,
        text: match[0]
      });
    }
    return ranges;
  }, []);

  // 2. Get precise caret offset
  const getCaretOffset = (element) => {
    let caretOffset = 0;
    const sel = window.getSelection();
    if (sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      const preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(element);
      preCaretRange.setEnd(range.endContainer, range.endOffset);
      caretOffset = preCaretRange.toString().length;
    }
    return caretOffset;
  };

  // 3. Core Logic: Determine which word is active
  const computeActiveWord = useCallback(() => {
    const el = editableRef.current;
    if (!el) return;

    // If editor isn't focused, blur everything (optional preference)
    if (document.activeElement !== el) {
      setActiveWordIndex(null);
      return;
    }

    const text = normalizeText(el.innerText);
    const caret = getCaretOffset(el);
    const ranges = buildWordRanges(text);

    let activeIdx = null;

    for (let i = 0; i < ranges.length; i++) {
      const r = ranges[i];
      // LOGIC: A word is active if the caret is anywhere inside it, 
      // OR at the immediate edges (start or end).
      // Example: Word is indices 0-5. 
      // Caret at 0, 1, 2, 3, 4, 5 -> Active. 
      // Caret at 6 (after space) -> Inactive.
      if (caret >= r.start && caret <= r.end) {
        activeIdx = i;
        break;
      }
    }
    setActiveWordIndex(activeIdx);
  }, [buildWordRanges]);

  const scheduleCompute = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(computeActiveWord);
  }, [computeActiveWord]);

  // 4. Input Handler
  const handleInput = (e) => {
    const text = e.currentTarget.innerText;
    setContent(text); // Update parent state
    scheduleCompute();
  };

  // 5. Sync Scrolling (Crucial for alignment)
  const syncScroll = () => {
    if (editableRef.current && overlayRef.current) {
      overlayRef.current.scrollTop = editableRef.current.scrollTop;
    }
  };

  // 6. Render the Overlay
  // We reconstruct the text exactly, applying classes to words
  const renderOverlay = () => {
    const text = normalizeText(content);
    const ranges = buildWordRanges(text);
    const elements = [];
    let lastIndex = 0;

    ranges.forEach((r, idx) => {
      // Push the whitespace/separators before the word
      const separator = text.slice(lastIndex, r.start);
      if (separator) {
        elements.push(<span key={`sep-${idx}`}>{separator}</span>);
      }

      // Determine if this specific word is revealed
      // It is revealed if: Blur is disabled OR It is the active word
      const isActive = idx === activeWordIndex;
      const isRevealed = !blurEnabled || isActive;

      elements.push(
        <span 
          key={`word-${idx}`} 
          className={isRevealed ? "revealed" : "blurred"}
        >
          {r.text}
        </span>
      );

      lastIndex = r.end;
    });

    // Push remaining trailing text (spaces/newlines at end of file)
    const tail = text.slice(lastIndex);
    if (tail) {
      elements.push(<span key="tail">{tail}</span>);
    }

    return elements;
  };

  // --- Effects ---

  // Sync selection changes (arrow keys, clicks)
  useEffect(() => {
    document.addEventListener("selectionchange", scheduleCompute);
    return () => document.removeEventListener("selectionchange", scheduleCompute);
  }, [scheduleCompute]);

  // Keep DOM valid when content changes externally
  useLayoutEffect(() => {
    if (editableRef.current && editableRef.current.innerText !== content) {
      // Only update if strictly necessary to avoid resetting caret
      if (document.activeElement !== editableRef.current) {
        editableRef.current.innerText = content;
      }
    }
  }, [content]);

  return (
    <div className="editor-container">
      {/* Overlay: Handles Visuals */}
      <div 
        className="editor-common overlay" 
        ref={overlayRef} 
        aria-hidden="true"
      >
        {renderOverlay()}
      </div>

      {/* Editor: Handles Input */}
      <div
        className="editor-common editor"
        contentEditable
        ref={editableRef}
        onInput={handleInput}
        onScroll={syncScroll}
        onBlur={() => setActiveWordIndex(null)} // Blur current word when losing focus
        onFocus={scheduleCompute} // Reveal word when gaining focus
        suppressContentEditableWarning={true}
        spellCheck={false}
      />
    </div>
  );
};

export default TextEditor;