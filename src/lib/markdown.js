// Simple markdown → HTML string renderer.
// Supported: # ## headings, - * lists, **bold**, *italic*, [text](url)
export function renderMd(text) {
  if (!text) return '';

  let s = String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Links (before bold/italic)
  s = s.replace(
    /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noreferrer" class="md-link">$1</a>'
  );
  s = s.replace(
    /\[([^\]]+)\]\(mailto:([^)]+)\)/g,
    '<a href="mailto:$2" class="md-link">$1</a>'
  );
  s = s.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" class="md-link">$1</a>'
  );

  // Bold and italic
  s = s.replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/\*([^*\n]+)\*/g, '<em>$1</em>');

  const lines = s.split('\n');
  const out = [];
  let inList = false;

  const closeList = () => {
    if (inList) { out.push('</ul>'); inList = false; }
  };

  for (const line of lines) {
    const t = line.trim();
    if (t === '') {
      closeList();
    } else if (t.startsWith('## ')) {
      closeList();
      out.push(`<h3 class="md-h3">${t.slice(3)}</h3>`);
    } else if (t.startsWith('# ')) {
      closeList();
      out.push(`<h2 class="md-h2">${t.slice(2)}</h2>`);
    } else if (/^[-*] /.test(t)) {
      if (!inList) { out.push('<ul class="md-ul">'); inList = true; }
      out.push(`<li class="md-li">${t.slice(2)}</li>`);
    } else {
      closeList();
      out.push(`<p class="md-p">${line}</p>`);
    }
  }
  closeList();

  return out.join('\n');
}
