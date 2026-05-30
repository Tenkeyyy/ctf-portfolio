import React, { useEffect } from 'react';
import BorderGlow from '../components/BorderGlow';
import './BlogPost.css';

/**
 * A tiny Markdown renderer – covers the subset we need for CTF write-ups:
 *   headings, bold, italic, inline code, fenced code blocks, hr, paragraphs.
 * For production, swap this for 'react-markdown' + 'rehype-highlight'.
 */
function renderMarkdown(md) {
  const lines = md.split('\n');
  const elements = [];
  let i = 0;
  let key = 0;

  const nextKey = () => ++key;

  // inline formatting
  const inline = (text) => {
    // inline code
    const parts = text.split(/(`[^`]+`)/g);
    return parts.map((p, pi) => {
      if (p.startsWith('`') && p.endsWith('`')) {
        return <code key={pi} className="inline-code">{p.slice(1, -1)}</code>;
      }
      // bold
      const bold = p.split(/(\*\*[^*]+\*\*)/g);
      return bold.map((b, bi) => {
        if (b.startsWith('**') && b.endsWith('**')) {
          return <strong key={bi}>{b.slice(2, -2)}</strong>;
        }
        return b;
      });
    });
  };

  while (i < lines.length) {
    const line = lines[i];

    // fenced code block
    if (line.startsWith('```')) {
      const lang = line.slice(3).trim() || 'text';
      const codeLines = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      elements.push(
        <div key={nextKey()} className="code-block-wrap">
          <div className="code-block-header">
            <span className="code-lang">{lang}</span>
            <div className="code-dots">
              <span /><span /><span />
            </div>
          </div>
          <pre className="code-block"><code>{codeLines.join('\n')}</code></pre>
        </div>
      );
      i++;
      continue;
    }

    // headings
    const h = line.match(/^(#{1,4})\s+(.+)/);
    if (h) {
      const level = h[1].length;
      const Tag = `h${level}`;
      elements.push(<Tag key={nextKey()} className={`md-h${level}`}>{inline(h[2])}</Tag>);
      i++;
      continue;
    }

    // hr
    if (/^---+$/.test(line.trim())) {
      elements.push(<hr key={nextKey()} className="md-hr" />);
      i++;
      continue;
    }

    // blank line
    if (line.trim() === '') {
      i++;
      continue;
    }

    // paragraph
    elements.push(<p key={nextKey()} className="md-p">{inline(line)}</p>);
    i++;
  }

  return elements;
}

export default function BlogPost({ post, navigate }) {
  useEffect(() => {
    document.title = `${post.title} – 0xPortfolio`;
    return () => { document.title = '0xPortfolio'; };
  }, [post]);

  return (
    <div className="blogpost fade-up">
      {/* ── Navigation bar ────────────────────────────────── */}
      <BorderGlow
        edgeSensitivity={28}
        backgroundColor="#1a1625"
        borderRadius={12}
        glowRadius={30}
        glowIntensity={0.7}
        colors={['#c084fc', '#f472b6', '#38bdf8']}
        className="post-nav-wrap"
      >
        <div className="post-nav">
          <button className="nav-back" onClick={() => navigate('blog')}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Back
          </button>
          {post.github && (
            <a href={post.github} target="_blank" rel="noopener noreferrer" className="nav-github">
              View on GitHub
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>
              </svg>
            </a>
          )}
        </div>
      </BorderGlow>

      {/* ── Post header ───────────────────────────────────── */}
      <BorderGlow
        edgeSensitivity={30}
        backgroundColor="#1a1625"
        borderRadius={16}
        glowRadius={40}
        glowIntensity={0.9}
        colors={['#c084fc', '#f472b6', '#38bdf8']}
        className="post-header-wrap fade-up fade-up-1"
      >
        <div className="post-header">
          <h1 className="post-full-title">{post.title}</h1>
          <div className="post-header-meta">
            <span className="meta-mono">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              your_handle
            </span>
            <span className="meta-separator">·</span>
            <span className="meta-mono">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              {post.date}
            </span>
            {post.comments && (
              <>
                <span className="meta-separator">·</span>
                <span className="meta-mono">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                  {post.comments} comments
                </span>
              </>
            )}
            <div className="post-tags-inline">
              <span className={`tag tag-${post.category}`}>{post.category.toUpperCase()}</span>
              <span className="post-ctf-badge">{post.ctf}</span>
              {post.points && <span className="post-pts-badge">{post.points}pts</span>}
            </div>
          </div>
        </div>
      </BorderGlow>

      {/* ── Post body ─────────────────────────────────────── */}
      <BorderGlow
        edgeSensitivity={30}
        backgroundColor="#1a1625"
        borderRadius={16}
        glowRadius={40}
        glowIntensity={0.9}
        colors={['#c084fc', '#f472b6', '#38bdf8']}
        className="post-body-wrap fade-up fade-up-2"
      >
        <article className="post-body">
          {renderMarkdown(post.body)}
        </article>
      </BorderGlow>
    </div>
  );
}
