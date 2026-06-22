import { useResearch, useBlog } from '../hooks/useContent';

const SANS = 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif';

export default function EverythingPage({ isDark }) {
  const workItems = useResearch();
  const posts     = useBlog();

  const bg      = isDark ? '#111111' : '#FAFAF8';
  const text    = isDark ? '#D4D4D4' : '#2B2B2B';
  const muted   = isDark ? '#646464' : '#6B7280';
  const border  = isDark ? '#2A2A2A' : '#E5E5E5';
  const accent  = '#00BFA6';

  return (
    <div style={{
      background: bg,
      minHeight: '100vh',
      fontFamily: SANS,
      color: text,
      padding: 'clamp(3rem, 8vw, 5rem) clamp(1.5rem, 10vw, 10rem)',
    }}>
      <style>{`
        details > summary {
          list-style: none;
          cursor: pointer;
          padding: 0.55rem 0;
          border-bottom: 1px solid ${border};
          display: flex;
          align-items: baseline;
          gap: 1rem;
        }
        details > summary::-webkit-details-marker { display: none; }
        details > summary::marker { display: none; }
        details > summary:hover .row-title { color: ${accent}; }
        details[open] > summary { border-bottom: none; }
        details[open] > summary .row-arrow { transform: rotate(90deg); }
        .row-arrow {
          display: inline-block;
          transition: transform 0.15s;
          color: ${muted};
          font-size: 0.85rem;
          flex-shrink: 0;
        }
        .row-title {
          flex: 1;
          font-size: 1rem;
          font-weight: 400;
          line-height: 1.5;
          color: ${text};
          transition: color 0.15s;
        }
        .row-category {
          font-size: 0.78rem;
          color: ${accent};
          letter-spacing: 0.04em;
          flex-shrink: 0;
          min-width: 8rem;
        }
        .row-date {
          font-size: 0.8rem;
          color: ${muted};
          flex-shrink: 0;
        }
        .detail-body {
          padding: 0.6rem 0 1.1rem 0;
          border-bottom: 1px solid ${border};
          margin-left: 9rem;
        }
        .detail-body p {
          font-size: 0.92rem;
          line-height: 1.75;
          color: ${muted};
          margin: 0 0 0.75rem;
        }
        .detail-body a {
          display: block;
          font-size: 0.88rem;
          color: ${accent};
          text-decoration: none;
          margin-bottom: 0.2rem;
        }
        .detail-body a:hover { text-decoration: underline; }
        .detail-tags {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
          margin-top: 0.4rem;
        }
        .detail-tag {
          font-size: 0.75rem;
          color: ${muted};
          letter-spacing: 0.06em;
        }
        section h2 {
          font-size: 0.75rem;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: ${muted};
          margin: 0 0 0.4rem;
        }
      `}</style>

      {/* Work */}
      <section style={{ marginBottom: '3.5rem' }}>
        <h2>Work</h2>
        <div style={{ borderTop: `1px solid ${border}` }}>
          {workItems.map(item => (
            <details key={item.id}>
              <summary>
                <span className="row-category">{item.category}</span>
                <span className="row-title">{item.title}</span>
                <span className="row-date">{item.date}</span>
                <span className="row-arrow">›</span>
              </summary>
              <div className="detail-body">
                {item.abstract && <p>{item.abstract}</p>}
                {(item.links ?? []).map((link, i) => (
                  <a
                    key={i}
                    href={link.url}
                    target={link.url.startsWith('http') ? '_blank' : undefined}
                    rel={link.url.startsWith('http') ? 'noreferrer' : undefined}
                  >
                    {link.label} ↗
                  </a>
                ))}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* Writing */}
      <section>
        <h2>Writing</h2>
        <div style={{ borderTop: `1px solid ${border}` }}>
          {posts.map(post => (
            <details key={post.id}>
              <summary>
                <span className="row-category">{post.category}</span>
                <span className="row-title">{post.title}</span>
                <span className="row-date">{post.date}</span>
                <span className="row-arrow">›</span>
              </summary>
              <div className="detail-body">
                {post.excerpt && <p>{post.excerpt}</p>}
                <div className="detail-tags">
                  {post.readTime && <span className="detail-tag">{post.readTime} read</span>}
                  {(post.tags ?? []).map(tag => (
                    <span key={tag} className="detail-tag">{tag}</span>
                  ))}
                </div>
              </div>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
