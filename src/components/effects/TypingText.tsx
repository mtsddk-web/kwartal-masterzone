'use client';

import { useState, useEffect } from 'react';

interface TypingTextProps {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
  onComplete?: () => void;
  cursor?: boolean;
}

export default function TypingText({
  text,
  speed = 50,
  delay = 0,
  className = '',
  onComplete,
  cursor = true,
}: TypingTextProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const delayTimeout = setTimeout(() => {
      setIsTyping(true);
    }, delay);

    return () => clearTimeout(delayTimeout);
  }, [delay]);

  useEffect(() => {
    if (!isTyping) return;

    if (displayedText.length < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(text.slice(0, displayedText.length + 1));
      }, speed);

      return () => clearTimeout(timeout);
    } else {
      onComplete?.();
      // Keep cursor blinking for a bit then hide
      setTimeout(() => setShowCursor(false), 2000);
    }
  }, [displayedText, isTyping, text, speed, onComplete]);

  // Cursor blink effect
  useEffect(() => {
    if (!cursor) return;

    const interval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);

    return () => clearInterval(interval);
  }, [cursor]);

  return (
    <span className={className}>
      {displayedText}
      {cursor && isTyping && (
        <span
          className={`inline-block w-[3px] h-[1em] bg-ember-400 ml-1 align-middle transition-opacity ${
            showCursor ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
    </span>
  );
}
