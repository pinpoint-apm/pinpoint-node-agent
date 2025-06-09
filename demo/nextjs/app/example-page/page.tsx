'use client';

import { useState } from 'react';

export default function Page() {
  const [stack, setStack] = useState<string | null>(null);

  const handleClick = () => {
    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(window as any).notDefinedFunction();
    } catch (err) {
      if (err instanceof Error) {
        console.error('try notDefinedFunction() catch:', err.stack);
        setStack(err.stack || 'No stack trace available');
      } else {
        setStack('Unknown error');
      }
    }
  };

  return (
    <>
      <p>Error Test</p>
      <button
        onClick={handleClick}
        style={{
          padding: '0.75rem 1.5rem',
          fontSize: '1rem',
          fontWeight: 'bold',
          backgroundColor: '#0070f3',
          color: '#fff',
          border: 'none',
          borderRadius: '0.5rem',
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          transition: 'background 0.2s',
        }}
        onMouseOver={e => (e.currentTarget.style.backgroundColor = '#005bb5')}
        onMouseOut={e => (e.currentTarget.style.backgroundColor = '#0070f3')}
      >
        Throw Error
      </button>

      {stack && (
        <div
          style={{
            marginTop: '1rem',
            padding: '1rem',
            backgroundColor: '#fdd',
            color: '#600',
            whiteSpace: 'pre-wrap',
            border: '1px solid #c00',
          }}
        >
          <strong>Call Stack:</strong>
          <br />
          {stack}
        </div>
      )}
    </>
  );
}