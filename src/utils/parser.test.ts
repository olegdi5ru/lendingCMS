import { describe, it, expect } from 'vitest';
import { parseLandingMD } from '../utils/parser';

describe('Landing-MD v3.0 Parser', () => {
  describe('Frontmatter parsing', () => {
    it('should parse YAML frontmatter correctly', () => {
      const content = `---
title: "Test Page"
description: "Test description"
slug: "test-page"
---

# Hello World`;

      const result = parseLandingMD(content);

      expect(result.frontmatter.title).toBe('Test Page');
      expect(result.frontmatter.description).toBe('Test description');
      expect(result.frontmatter.slug).toBe('test-page');
    });

    it('should handle missing frontmatter', () => {
      const content = '# Hello World';
      const result = parseLandingMD(content);

      expect(result.frontmatter).toEqual({});
    });

    it('should handle frontmatter without quotes', () => {
      const content = `---
title: Test Page
slug: test-page
---

Content`;

      const result = parseLandingMD(content);

      expect(result.frontmatter.title).toBe('Test Page');
      expect(result.frontmatter.slug).toBe('test-page');
    });
  });

  describe('Variable substitution', () => {
    it('should substitute variables from table', () => {
      const content = `---
title: "Test"
---

# {{h1|Default Title}}

{{cta|Click me}}`;

      const table = { h1: 'Custom Title', cta: 'Buy now' };
      const result = parseLandingMD(content, table);

      expect(result.html).toContain('Custom Title');
      expect(result.html).toContain('Buy now');
    });

    it('should use fallback values when variable not in table', () => {
      const content = `# {{h1|Default Title}}`;
      const result = parseLandingMD(content, {});

      expect(result.html).toContain('Default Title');
    });

    it('should handle multiple variables in same line', () => {
      const content = `{{h1|Title}} - {{subtitle|Subtitle}}`;
      const table = { h1: 'My Title', subtitle: 'My Subtitle' };
      const result = parseLandingMD(content, table);

      expect(result.html).toContain('My Title');
      expect(result.html).toContain('My Subtitle');
    });
  });

  describe('Block parsing', () => {
    it('should parse hero block', () => {
      const content = `::: hero {variant="gradient"}
# Welcome
:::`;

      const result = parseLandingMD(content);

      expect(result.blocks).toHaveLength(1);
      expect(result.blocks[0].name).toBe('hero');
      expect(result.blocks[0].attrs.variant).toBe('gradient');
      expect(result.html).toContain('block-hero');
    });

    it('should parse pains block with columns', () => {
      const content = `::: pains {title="Pain Points", columns="3"}
- Pain 1
- Pain 2
:::`;

      const result = parseLandingMD(content);

      expect(result.blocks[0].name).toBe('pains');
      expect(result.blocks[0].attrs.title).toBe('Pain Points');
      expect(result.blocks[0].attrs.columns).toBe('3');
    });

    it('should parse stats block', () => {
      const content = `::: stats {columns="4"}
| 100 | 200 | 300 | 400 |
:::`;

      const result = parseLandingMD(content);

      expect(result.blocks[0].name).toBe('stats');
      expect(result.blocks[0].attrs.columns).toBe('4');
    });

    it('should parse form block', () => {
      const content = `::: form {endpoint="/api/lead", title="Contact Us"}
Fill the form
:::`;

      const result = parseLandingMD(content);

      expect(result.blocks[0].name).toBe('form');
      expect(result.blocks[0].attrs.endpoint).toBe('/api/lead');
      expect(result.blocks[0].attrs.title).toBe('Contact Us');
    });

    it('should parse nested blocks', () => {
      const content = `::: hero
# Title
:::

::: pains
- Pain 1
:::`;

      const result = parseLandingMD(content);

      expect(result.blocks).toHaveLength(2);
      expect(result.blocks[0].name).toBe('hero');
      expect(result.blocks[1].name).toBe('pains');
    });
  });

  describe('Fold (deferred content)', () => {
    it('should separate fold content', () => {
      const content = `# Above fold

::: fold {trigger="scroll"}
# Below fold
:::`;

      const result = parseLandingMD(content);

      expect(result.html).toContain('Above fold');
      expect(result.html).not.toContain('Below fold');
      expect(result.deferredHtml).toContain('Below fold');
    });

    it('should handle fold with nested blocks', () => {
      const content = `::: fold {trigger="scroll"}
::: form {title="Form"}
Content
:::
:::`;

      const result = parseLandingMD(content);

      expect(result.deferredHtml).toContain('block-form');
      expect(result.deferredHtml).toContain('Form');
    });
  });

  describe('Inline markdown', () => {
    it('should parse headings', () => {
      const content = `# H1\n## H2\n### H3`;
      const result = parseLandingMD(content);

      expect(result.html).toContain('<h1>');
      expect(result.html).toContain('<h2>');
      expect(result.html).toContain('<h3>');
    });

    it('should parse bold text', () => {
      const content = `**Bold text**`;
      const result = parseLandingMD(content);

      expect(result.html).toContain('<strong>Bold text</strong>');
    });

    it('should parse links with attributes', () => {
      const content = `[Click me]{.btn-primary #cta data-track="click"}`;
      const result = parseLandingMD(content);

      expect(result.html).toContain('class="btn-primary"');
      expect(result.html).toContain('id="cta"');
      expect(result.html).toContain('data-track="click"');
    });

    it('should parse lists', () => {
      const content = `- Item 1\n- Item 2\n- Item 3`;
      const result = parseLandingMD(content);

      expect(result.html).toContain('<li>');
      expect(result.html).toContain('<ul>');
    });
  });

  describe('Full page parsing', () => {
    it('should parse complete landing page', () => {
      const content = `---
title: "Complete Page"
description: "Full test"
---

::: hero {variant="gradient"}
# {{h1|Welcome}}

{{intro|Description}}

[{{cta|Click}}]{.btn-primary}
:::

::: pains {title="Problems", columns="3"}
- Problem 1
- Problem 2
:::

::: fold {trigger="scroll"}
::: form {endpoint="/submit", title="Form"}
Submit here
:::
:::`;

      const table = { h1: 'Hello', intro: 'Test intro', cta: 'Go' };
      const result = parseLandingMD(content, table);

      expect(result.frontmatter.title).toBe('Complete Page');
      expect(result.blocks.length).toBeGreaterThanOrEqual(3);
      expect(result.html).toContain('Hello');
      expect(result.html).toContain('Test intro');
      expect(result.deferredHtml).toContain('block-form');
    });
  });
});
