// Landing Engine v4.0 — Core Types

export interface Tenant {
  id: string;
  domain: string;
  basePath: string;
  name: string;
  config: TenantConfig;
  createdAt: string;
  status: 'active' | 'inactive' | 'suspended';
}

export interface TenantConfig {
  theme: 'light' | 'dark';
  primaryColor: string;
  analyticsId?: string;
  customCSS?: string;
}

export interface Page {
  id: string;
  tenantId: string;
  slug: string;
  title: string;
  content: string;
  metadata: PageMetadata;
  status: 'draft' | 'published' | 'archived';
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface PageMetadata {
  description: string;
  ogImage?: string;
  substitutionTable?: string;
  abVariants?: ABVariant[];
}

export interface ABVariant {
  id: string;
  name: string;
  substitutionTable: string;
  weight: number;
  impressions: number;
  conversions: number;
}

export interface SubstitutionTable {
  id: string;
  tenantId: string;
  name: string;
  data: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

export interface UIBlock {
  id: string;
  name: string;
  description: string;
  propsSchema: Record<string, string>;
  template: string;
  styles: string;
  version: number;
}

export interface KeywordEmbedding {
  id: string;
  tenantId: string;
  keyword: string;
  substitutionTableId: string;
  similarity: number;
}

export interface AnalyticsEvent {
  id: string;
  tenantId: string;
  pageId: string;
  type: 'view' | 'click' | 'conversion' | 'scroll';
  timestamp: string;
  metadata: Record<string, string>;
}

export interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
}
