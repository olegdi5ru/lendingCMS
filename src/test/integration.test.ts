import { describe, it, expect } from 'vitest';
import { parseLandingMD, semanticSearch } from '../utils/parser';

describe('Integration: Landing-MD Rendering Pipeline', () => {
  describe('Full rendering pipeline', () => {
    it('should render complete landing with substitutions', () => {
      const content = `---
title: "Integration Test Page"
description: "Full pipeline test"
slug: "integration-test"
tenant_id: "test_tenant"
substitution_table: "default"
---

::: hero {variant="gradient"}
# {{h1|Default Title}}

{{intro|Default intro text}}

[{{cta|Click me}}]{.btn-primary #main-cta data-track="hero-click"}
:::

::: pains {title="Common Problems", columns="3"}
- Problem 1
- Problem 2
- Problem 3
:::

::: stats {columns="3"}
| 1000+ | 99% | 24/7 |
| Clients | Success | Support |
:::

::: fold {trigger="scroll"}
::: form {endpoint="/api/lead", title="Get Started"}
Fill the form below
:::
:::`;

      const table = {
        h1: 'Custom Hero Title',
        intro: 'Custom introduction',
        cta: 'Buy Now',
      };

      const result = parseLandingMD(content, table);

      // Frontmatter
      expect(result.frontmatter.title).toBe('Integration Test Page');
      expect(result.frontmatter.slug).toBe('integration-test');

      // Blocks
      expect(result.blocks.length).toBeGreaterThanOrEqual(4);
      expect(result.blocks.some(b => b.name === 'hero')).toBe(true);
      expect(result.blocks.some(b => b.name === 'pains')).toBe(true);
      expect(result.blocks.some(b => b.name === 'stats')).toBe(true);
      expect(result.blocks.some(b => b.name === 'fold')).toBe(true);

      // Substitutions
      expect(result.html).toContain('Custom Hero Title');
      expect(result.html).toContain('Custom introduction');
      expect(result.html).toContain('Buy Now');

      // Deferred content
      expect(result.deferredHtml).toContain('block-form');
      expect(result.deferredHtml).toContain('Get Started');
    });

    it('should handle A/B test variants', () => {
      const content = `---
title: "A/B Test Page"
---

# {{h1|Default}}

{{cta|Default CTA}}`;

      const variantA = { h1: 'Variant A Title', cta: 'Buy A' };
      const variantB = { h1: 'Variant B Title', cta: 'Buy B' };

      const resultA = parseLandingMD(content, variantA);
      const resultB = parseLandingMD(content, variantB);

      expect(resultA.html).toContain('Variant A Title');
      expect(resultA.html).toContain('Buy A');
      expect(resultB.html).toContain('Variant B Title');
      expect(resultB.html).toContain('Buy B');

      expect(resultA.html).not.toBe(resultB.html);
    });
  });

  describe('Semantic search integration', () => {
    it('should match keywords to substitution tables', () => {
      const keywords = [
        { keyword: 'СДВГ у взрослых', substitutionTableId: 'sdvg_adults', embedding: generateTestVec('sdvg adult') },
        { keyword: 'СДВГ у детей', substitutionTableId: 'sdvg_children', embedding: generateTestVec('sdvg children') },
        { keyword: 'диагностика', substitutionTableId: 'default', embedding: generateTestVec('diagnosis') },
      ];

      const results = semanticSearch('СДВГ у взрослых', keywords);

      expect(results.length).toBeGreaterThan(0);
      expect(results[0].similarity).toBeGreaterThan(0);
    });

    it('should rank results by similarity', () => {
      const keywords = [
        { keyword: 'python programming', substitutionTableId: 'python', embedding: generateTestVec('python code') },
        { keyword: 'javascript course', substitutionTableId: 'js', embedding: generateTestVec('javascript') },
        { keyword: 'python tutorial', substitutionTableId: 'python', embedding: generateTestVec('python tutorial') },
      ];

      const results = semanticSearch('python', keywords);

      // Results should be sorted by similarity
      for (let i = 1; i < results.length; i++) {
        expect(results[i - 1].similarity).toBeGreaterThanOrEqual(results[i].similarity);
      }
    });
  });
});

function generateTestVec(text: string): number[] {
  const vec = new Array(32).fill(0);
  for (let i = 0; i < text.length; i++) {
    vec[i % 32] += text.charCodeAt(i) / 255;
  }
  const norm = Math.sqrt(vec.reduce((s, v) => s + v * v, 0));
  return vec.map(v => v / (norm || 1));
}
