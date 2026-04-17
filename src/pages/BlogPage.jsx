import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { blogPosts } from '../data/content';

const allTags = ['All', 'Biology', 'Finance', 'Startups', 'General', 'Photography', 'Personal'];

export default function BlogPage({ isDark }) {
  const [filter, setFilter] = useState('All');
  const [activePost, setActivePost] = useState(null);

  const textColor = isDark ? '#E8E8E8' : '#1A1A1A';
  const muted = isDark ? '#888' : '#6B6B6B';
  const border = isDark ? '#2A2A2A' : '#E5E5E5';
  const cardBg = isDark ? '#1A1A1A' : '#FAFAFA';

  const filtered = filter === 'All'
    ? blogPosts
    : blogPosts.filter(p => p.tags.includes(filter));

  if (activePost) {
    return <BlogPostView post={activePost} isDark={isDark} onBack={() => setActivePost(null)} />;
  }

  return (
    <div className="min-h-screen w-full max-w-4xl mx-auto px-4 sm:px-8 py-20" style={{ color: textColor }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <p style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '0.6rem',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: '#00BFA6',
          marginBottom: 12,
        }}>
          // journal.md
        </p>
        <h1 style={{
          fontFamily: "'Space Mono', monospace",
          fontWeight: 700,
          fontSize: 'clamp(1.8rem, 4vw, 3rem)',
          color: textColor,
          lineHeight: 1.2,
          marginBottom: 16,
        }}>
          Lab Journal
        </h1>
        <p style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '0.85rem',
          lineHeight: 1.75,
          color: muted,
          maxWidth: 520,
          marginBottom: 40,
        }}>
          Long-form thinking across biology, finance, and the space between.
          Written slowly, read carefully.
        </p>
      </motion.div>

      {/* Tags */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap gap-2 mb-12"
      >
        {allTags.filter(t => t === 'All' || blogPosts.some(p => p.tags.includes(t))).map(tag => (
          <button
            key={tag}
            onClick={() => setFilter(tag)}
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.65rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              padding: '6px 14px',
              borderRadius: 6,
              border: `1px solid ${filter === tag ? '#00BFA6' : border}`,
              color: filter === tag ? '#00BFA6' : muted,
              background: 'transparent',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {tag}
          </button>
        ))}
      </motion.div>

      {/* Posts grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={filter}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {filtered.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -2, boxShadow: '0 0 0 1.5px #00BFA6' }}
              onClick={() => setActivePost(post)}
              style={{
                background: cardBg,
                border: `1px solid ${border}`,
                borderRadius: 12,
                padding: '24px',
                cursor: 'pointer',
                transition: 'box-shadow 0.2s',
              }}
            >
              <div style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.62rem',
                color: muted,
                marginBottom: 10,
                letterSpacing: '0.1em',
              }}>
                {post.date} · {post.readTime} read
              </div>
              <h2 style={{
                fontFamily: "'Space Mono', monospace",
                fontWeight: 700,
                fontSize: '0.95rem',
                color: textColor,
                lineHeight: 1.4,
                marginBottom: 10,
              }}>
                {post.title}
              </h2>
              <p style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.75rem',
                lineHeight: 1.75,
                color: muted,
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
              }}>
                {post.excerpt}
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                {post.tags.map(tag => (
                  <span key={tag} style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '0.58rem',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    padding: '2px 7px',
                    borderRadius: 4,
                    border: '1px solid #00BFA6',
                    color: '#00BFA6',
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function BlogPostView({ post, isDark, onBack }) {
  const textColor = isDark ? '#E8E8E8' : '#1A1A1A';
  const muted = isDark ? '#888' : '#6B6B6B';
  const border = isDark ? '#2A2A2A' : '#E5E5E5';
  const codeBg = isDark ? '#1A1A1A' : '#F5F5F5';

  const fullContent = {
    'molecular-logic-markets': `There is a strange isomorphism between the allosteric regulation of enzymes and the feedback mechanisms of financial markets.

Both systems exhibit non-linear responses to input signals. Both have evolved saturation kinetics — the Michaelis-Menten curve finds its analogue in the diminishing returns of capital deployment. And both can be hijacked by competitive inhibitors: the short-seller and the competitive antagonist occupy structurally similar logical positions.

\`\`\`python
# Michaelis-Menten kinetics
def reaction_rate(substrate, Vmax, Km):
    return (Vmax * substrate) / (Km + substrate)

# Market saturation analogy
def alpha_decay(capital, max_alpha, saturation_point):
    return (max_alpha * capital) / (saturation_point + capital)
\`\`\`

The enzyme doesn't know it's being inhibited. The market doesn't know it's being gamed. What distinguishes the biologist from the biochemist from the trader is simply the variable names — the underlying algebra is the same.

**Allostery and Information Cascades**

In allosteric regulation, binding at one site changes the conformation of the protein at a distant site. A signal travels through structure. In markets, information propagates through networks of correlated assets — a credit event in one corner of the market changes the "conformation" of risk-taking across the system.

The key insight from enzymology: allosteric systems are inherently non-equilibrium. They require continuous energy input to maintain their regulatory states. Markets, similarly, require continuous information input to maintain price discovery. In a market without new information, prices don't stay still — they drift, they decay, they return to some prior state.

**What this means for investing**

If you accept the analogy, then finding alpha requires identifying either:

1. Mischaracterised substrates (assets the market is pricing as low-value because it lacks the right assay)
2. Allosteric effects the market hasn't priced (second-order consequences of known information)
3. Competitive inhibitors (structural changes to market microstructure that suppress true price discovery)

The molecular biologist's toolkit — careful characterisation, systematic variation of conditions, patience with slow reactions — translates surprisingly well to equity research.`,
    'why-i-photograph': `Photography and microscopy are the same act at different scales.

Both demand you slow down enough to really look — to notice the specimen before you name it. I started photographing as a discipline in observation, not aesthetics. The camera was a tool for training attention.

**The microscope teaches you to look**

Before I could photograph anything worth photographing, I had to learn how to prepare a slide. That process — the fixing, the staining, the mounting — forces you to think about what you're trying to see before you try to see it. You ask: what structure am I looking for? What will obscure it? What will reveal it?

The camera asks the same questions. What am I photographing? What is in the way? What light will make the thing visible?

**Observation as practice**

There's a difference between looking and seeing. A microscope doesn't make you see — it makes you look. You can spend thirty minutes at 400x magnification and notice almost nothing, because you haven't yet learned what to look for.

Experienced microscopists talk about the "gestalt" of a preparation — a sense of the whole field before the specific detail. Experienced photographers talk about "seeing the shot" before pressing the shutter. These are the same cognitive operation: pattern recognition trained by repetition.

**On documentation vs. aesthetics**

I'm suspicious of photography that's primarily aesthetic. The most interesting photographs document something that would otherwise go unrecorded — the precise angle of light at 4:47am in Kolkata in October, the exact geometry of a cell undergoing mitosis, the specific expression on a face that couldn't be recreated.

Documentation is not opposed to beauty. It is its own form of beauty: the beauty of accuracy.`,
    'balance-sheet-genome': `A genome is a compressed programme for building a living system. A balance sheet is a compressed programme for understanding a firm's biochemistry.

Both are written in their own syntax. Both reward careful reading. And both hide as much as they reveal.

**The genome problem**

When the first genomes were sequenced, biologists expected to find a relatively transparent map from gene to function. The reality was more frustrating and more interesting: most of the genome didn't code for anything obvious. Large stretches of what was initially dismissed as "junk DNA" turned out to be regulatory — not genes, but instructions for when and how to read the genes.

Balance sheets have the same structure. The stated numbers — assets, liabilities, equity — are the coding sequences. The footnotes, the accounting choices, the off-balance-sheet exposures — these are the regulatory sequences. Most analysts read the coding sequences and skip the regulatory architecture. This is like sequencing a genome and ignoring the promoters.

**Reading regulatory sequences**

What are the balance sheet equivalents of regulatory sequences?

- **Operating lease commitments**: These are off-balance-sheet liabilities that create real future obligations. Companies with heavy lease structures are running on borrowed space.
- **Pension obligations**: The actuarial assumptions embedded in pension calculations can dramatically change the picture of a company's liabilities.
- **Deferred revenue**: A liability that isn't really a liability — it represents future earnings already paid for by customers.
- **Goodwill impairment history**: Every large write-down is a confession that a previous acquisition was overpriced.

\`\`\`
Asset Quality Score = f(
  receivables_aging,
  inventory_turns,
  goodwill_as_pct_of_assets,
  capex_as_pct_of_depreciation
)
\`\`\`

**The epigenetics of accounting**

Epigenetics is the study of heritable changes in gene expression that don't involve changes to the DNA sequence itself. The genome is the same; what changes is which parts of it are readable.

Accounting changes do something similar. A shift from FIFO to LIFO inventory accounting doesn't change the underlying physical inventory — it changes how that inventory appears in the financial statements. The "genome" of assets is unchanged; what changes is the accounting "epigenome" that determines how they're expressed on paper.

Understanding this layer is what separates financial analysts from financial readers.`,
    'intellectual-polyglotism': `The most interesting problems tend to live at disciplinary boundaries.

Not because they are too hard for any one field, but because they are invisible from within any single tradition. This is an argument for cultivating genuine fluency across domains — not tourism, but residency.

**The boundary problem**

Every discipline develops its own vocabulary, its own standard models, its own set of questions it considers worth asking. This specialisation is productive — it allows for depth. But it creates blind spots at the edges.

Antibiotic resistance was a biological problem until it became an economic problem (the incentive structure for developing new antibiotics is broken), until it became a game-theoretic problem (individual rational choices lead to collective catastrophe), until it became a logistics problem (how do you distribute restricted-use antibiotics globally?).

The biologists had all the molecular tools. The economists had all the incentive models. Neither field, working alone, could see the whole problem.

**On genuine fluency**

There's a difference between knowing about a field and being fluent in it. Tourism is knowing about. Fluency is thinking in the native concepts.

I know *about* French Impressionism. I am not fluent in it — I can't generate a novel observation within the tradition, I can't tell when a painting is doing something unexpected within its context.

I am fluent in molecular biology and developing fluency in financial analysis. The test of fluency is whether you can generate novel questions in the field — not just answer the existing ones.

**Cross-domain transfer**

The most productive intellectual moves I've made have come from asking: does this mechanism have an analogue in the other field?

Allosteric regulation → information cascades in markets. Network topology → contagion in financial systems. Phase transitions in physics → tipping points in ecological and social systems. The mathematical structure is sometimes identical; sometimes the analogy breaks down in interesting ways.

Both outcomes are useful. Successful transfer gives you a new tool. Failed transfer tells you something interesting about where the fields actually diverge.`,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="min-h-screen w-full max-w-2xl mx-auto px-4 sm:px-8 py-20"
      style={{ color: textColor }}
    >
      {/* Back */}
      <button
        onClick={onBack}
        style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '0.65rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: muted,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          marginBottom: 40,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: 0,
        }}
      >
        ← journal.md
      </button>

      {/* Meta */}
      <div style={{
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: '0.62rem',
        color: muted,
        marginBottom: 12,
        letterSpacing: '0.1em',
      }}>
        {post.date} · {post.readTime} read
      </div>

      <h1 style={{
        fontFamily: "'Space Mono', monospace",
        fontWeight: 700,
        fontSize: 'clamp(1.4rem, 3vw, 2rem)',
        color: textColor,
        lineHeight: 1.3,
        marginBottom: 16,
      }}>
        {post.title}
      </h1>

      <div className="flex flex-wrap gap-2 mb-12">
        {post.tags.map(tag => (
          <span key={tag} style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '0.58rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            padding: '2px 8px',
            borderRadius: 4,
            border: '1px solid #00BFA6',
            color: '#00BFA6',
          }}>
            {tag}
          </span>
        ))}
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: border, marginBottom: 40 }} />

      {/* Content */}
      <PostContent content={fullContent[post.slug] || post.excerpt} isDark={isDark} />
    </motion.div>
  );
}

function PostContent({ content, isDark }) {
  const textColor = isDark ? '#E8E8E8' : '#1A1A1A';
  const muted = isDark ? '#888' : '#6B6B6B';
  const codeBg = isDark ? '#1A1A1A' : '#F5F5F5';
  const codeText = '#00BFA6';

  const lines = content.split('\n');
  const elements = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith('```')) {
      // Code block
      const codeLines = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      elements.push(
        <pre key={i} style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '0.75rem',
          lineHeight: 1.7,
          padding: '20px 24px',
          borderRadius: 8,
          background: codeBg,
          border: `1px solid ${isDark ? '#2A2A2A' : '#E5E5E5'}`,
          color: codeText,
          overflowX: 'auto',
          marginBottom: 24,
        }}>
          {codeLines.join('\n')}
        </pre>
      );
    } else if (line.startsWith('**') && line.endsWith('**')) {
      elements.push(
        <h3 key={i} style={{
          fontFamily: "'Space Mono', monospace",
          fontWeight: 700,
          fontSize: '0.95rem',
          color: textColor,
          marginBottom: 12,
          marginTop: 32,
        }}>
          {line.slice(2, -2)}
        </h3>
      );
    } else if (line.startsWith('- ')) {
      elements.push(
        <div key={i} style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '0.8rem',
          lineHeight: 1.75,
          color: textColor,
          paddingLeft: 16,
          marginBottom: 6,
          borderLeft: '2px solid #00BFA6',
        }}>
          {line.slice(2)}
        </div>
      );
    } else if (line.trim() === '') {
      elements.push(<div key={i} style={{ height: 16 }} />);
    } else {
      elements.push(
        <p key={i} style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '0.82rem',
          lineHeight: 1.85,
          color: textColor,
          marginBottom: 16,
        }}>
          {line}
        </p>
      );
    }

    i++;
  }

  return <div>{elements}</div>;
}
