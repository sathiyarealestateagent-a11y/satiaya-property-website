'use client';

import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Check,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  ExternalLink,
  Eye,
  EyeOff,
  GripVertical,
  ImageIcon,
  Layers3,
  LoaderCircle,
  Monitor,
  MousePointer2,
  Palette,
  Redo2,
  RotateCcw,
  Save,
  Search,
  Smartphone,
  Tablet,
  Trash2,
  Type,
  Undo2,
  Upload,
} from 'lucide-react';
import type { ChangeEvent, DragEvent, RefObject } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  pageSectionIds,
  type EditorElementStyle,
  type PageSectionId,
  type SiteContent,
} from '@/src/content/schema';

type PathPart = string | number;
type Viewport = 'desktop' | 'tablet' | 'mobile';
type DetailTab = 'identity' | 'homepage' | 'services' | 'properties';

type EditableEntry = {
  path: string;
  label: string;
  value: string | number | boolean;
  section: string;
};

type DesignNode = {
  key: string;
  label: string;
  section: string;
  kind: 'container' | 'icon';
};

const designNodes: DesignNode[] = [
  {
    key: 'header.section',
    label: 'Header bar',
    section: 'Header',
    kind: 'container',
  },
  {
    key: 'header.container',
    label: 'Header content',
    section: 'Header',
    kind: 'container',
  },
  { key: 'header.logo', label: 'Logo shape', section: 'Header', kind: 'icon' },
  {
    key: 'header.navigation',
    label: 'Navigation group',
    section: 'Header',
    kind: 'container',
  },
  {
    key: 'hero.section',
    label: 'Hero canvas',
    section: 'Hero',
    kind: 'container',
  },
  {
    key: 'hero.background',
    label: 'Hero background',
    section: 'Hero',
    kind: 'container',
  },
  {
    key: 'hero.content',
    label: 'Hero content group',
    section: 'Hero',
    kind: 'container',
  },
  {
    key: 'hero.actions',
    label: 'Hero buttons group',
    section: 'Hero',
    kind: 'container',
  },
  {
    key: 'search.card',
    label: 'Search card',
    section: 'Search',
    kind: 'container',
  },
  {
    key: 'properties.section',
    label: 'Properties section',
    section: 'Properties',
    kind: 'container',
  },
  {
    key: 'properties.heading',
    label: 'Properties heading group',
    section: 'Properties',
    kind: 'container',
  },
  {
    key: 'properties.grid',
    label: 'Property grid',
    section: 'Properties',
    kind: 'container',
  },
  {
    key: 'owners.section',
    label: 'Owner section',
    section: 'Owners',
    kind: 'container',
  },
  {
    key: 'owners.image',
    label: 'Owner image frame',
    section: 'Owners',
    kind: 'container',
  },
  {
    key: 'services.section',
    label: 'Services section',
    section: 'Services',
    kind: 'container',
  },
  {
    key: 'services.heading',
    label: 'Services heading group',
    section: 'Services',
    kind: 'container',
  },
  {
    key: 'services.grid',
    label: 'Services grid',
    section: 'Services',
    kind: 'container',
  },
  {
    key: 'about.section',
    label: 'About section',
    section: 'About',
    kind: 'container',
  },
  {
    key: 'about.image',
    label: 'Agent image frame',
    section: 'About',
    kind: 'container',
  },
  {
    key: 'about.stats',
    label: 'Statistics row',
    section: 'About',
    kind: 'container',
  },
  {
    key: 'contact.section',
    label: 'Contact section',
    section: 'Contact',
    kind: 'container',
  },
  {
    key: 'contact.card',
    label: 'Contact card',
    section: 'Contact',
    kind: 'container',
  },
  {
    key: 'contact.form',
    label: 'Contact form',
    section: 'Contact',
    kind: 'container',
  },
  {
    key: 'footer.section',
    label: 'Footer',
    section: 'Footer',
    kind: 'container',
  },
  {
    key: 'footer.container',
    label: 'Footer content',
    section: 'Footer',
    kind: 'container',
  },
];

const sectionLabels: Record<string, string> = {
  agent: 'Agent profile',
  logo: 'Logo',
  contact: 'Contact details',
  whatsapp: 'WhatsApp',
  header: 'Header',
  hero: 'Hero section',
  search: 'Property search',
  featured: 'Featured properties',
  ownerSection: 'Owner section',
  servicesSection: 'Services',
  about: 'About',
  contactSection: 'Contact form',
  footer: 'Footer',
  social: 'Social media',
  navigation: 'Navigation',
  properties: 'Property listings',
};

const pageSectionDetails: Record<
  PageSectionId,
  { label: string; selectionPath: string }
> = {
  hero: { label: 'Hero & search', selectionPath: 'hero.section' },
  properties: {
    label: 'Featured properties',
    selectionPath: 'properties.section',
  },
  owners: { label: 'Owner sell / rent', selectionPath: 'owners.section' },
  services: { label: 'Services', selectionPath: 'services.section' },
  about: { label: 'About agent', selectionPath: 'about.section' },
  contact: { label: 'Contact form', selectionPath: 'contact.section' },
};

function pageSectionForPath(path: string): PageSectionId | undefined {
  if (path.startsWith('hero.') || path.startsWith('search.')) return 'hero';
  if (path.startsWith('featured.') || path.startsWith('properties.'))
    return 'properties';
  if (path.startsWith('ownerSection.')) return 'owners';
  if (path.startsWith('servicesSection.')) return 'services';
  if (path.startsWith('about.')) return 'about';
  if (path.startsWith('contactSection.')) return 'contact';
  return undefined;
}

function titleCase(value: string) {
  return value
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[-_]/g, ' ')
    .replace(/^./, (letter) => letter.toUpperCase());
}

function collectEditable(
  value: unknown,
  path: PathPart[] = [],
  entries: EditableEntry[] = [],
) {
  if (path[0] === 'pageLayout') return entries;
  if (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  ) {
    if (path.at(-1) === 'id') return entries;
    const first = String(path[0] ?? 'content');
    const last = path.at(-1);
    const parent = path.length > 2 ? path.at(-2) : undefined;
    entries.push({
      path: path.join('.'),
      label:
        typeof parent === 'number'
          ? `${titleCase(String(last))} ${parent + 1}`
          : titleCase(String(last)),
      value,
      section: sectionLabels[first] ?? titleCase(first),
    });
    return entries;
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) =>
      collectEditable(item, [...path, index], entries),
    );
  } else if (value && typeof value === 'object') {
    Object.entries(value).forEach(([key, nested]) =>
      collectEditable(nested, [...path, key], entries),
    );
  }
  return entries;
}

function parsePath(path: string): PathPart[] {
  return path
    .split('.')
    .map((part) => (/^\d+$/.test(part) ? Number(part) : part));
}

function getAtPath(content: SiteContent, path: string): unknown {
  return parsePath(path).reduce<unknown>((current, part) => {
    if (!current || typeof current !== 'object') return undefined;
    return Reflect.get(current, part);
  }, content);
}

function isMediaPath(path: string) {
  return /(^|\.)(image|video|profilePhoto)$/.test(path);
}

function detailTabFor(path: string): DetailTab {
  if (path.startsWith('properties.')) return 'properties';
  if (path.startsWith('servicesSection.')) return 'services';
  if (
    path.startsWith('agent.') ||
    path.startsWith('contact.') ||
    path.startsWith('logo.') ||
    path.startsWith('social.') ||
    path.startsWith('whatsapp.')
  ) {
    return 'identity';
  }
  return 'homepage';
}

function EditorIcon({ path }: { path: string }) {
  return isMediaPath(path) ? (
    <ImageIcon className="size-3.5" />
  ) : (
    <Type className="size-3.5" />
  );
}

function VisualMediaInput({
  path,
  value,
  onChange,
}: {
  path: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  async function upload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setUploading(true);
    setError('');
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await fetch('/api/admin/media', {
        method: 'POST',
        body: formData,
      });
      const result = (await response.json()) as {
        url?: string;
        error?: string;
      };
      if (!response.ok || !result.url) {
        throw new Error(result.error ?? 'Upload failed.');
      }
      onChange(result.url);
    } catch (uploadError) {
      setError(
        uploadError instanceof Error ? uploadError.message : 'Upload failed.',
      );
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="grid gap-3">
      <div className="overflow-hidden rounded-xl border border-[#D9E6E7] bg-[#F5F8F9]">
        {value ? (
          path.endsWith('video') ? (
            <video
              src={value}
              muted
              className="aspect-video w-full object-cover"
            />
          ) : (
            // The visual editor accepts Supabase and external image URLs.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={value}
              alt="Selected media"
              className="aspect-video w-full object-cover"
            />
          )
        ) : (
          <div className="grid aspect-video place-items-center text-muted-foreground">
            <ImageIcon className="size-7" />
          </div>
        )}
      </div>
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label="Media URL"
        placeholder="Paste an image or video URL"
        className="h-11 rounded-xl bg-white"
      />
      <label className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#173F4A] px-4 text-sm font-semibold text-white transition hover:bg-[#16807F]">
        {uploading ? (
          <LoaderCircle className="size-4 animate-spin" />
        ) : (
          <Upload className="size-4" />
        )}
        {uploading ? 'Uploading…' : 'Upload replacement'}
        <input
          type="file"
          className="sr-only"
          accept={path.endsWith('video') ? 'video/mp4,video/webm' : 'image/*'}
          disabled={uploading}
          onChange={(event) => void upload(event)}
        />
      </label>
      {error && (
        <p className="text-xs font-semibold text-destructive">{error}</p>
      )}
    </div>
  );
}

function NumberControl({
  label,
  value,
  min,
  max,
  step = 1,
  suffix = 'px',
  onChange,
}: {
  label: string;
  value?: number;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
  onChange: (value: number | undefined) => void;
}) {
  const id = `style-${label.toLowerCase().replace(/\s+/g, '-')}`;
  return (
    <label
      htmlFor={id}
      className="grid gap-1 text-[11px] font-semibold text-[#5F7077]"
    >
      {label}
      <span className="relative">
        <Input
          id={id}
          type="number"
          value={value ?? ''}
          min={min}
          max={max}
          step={step}
          placeholder="Auto"
          onChange={(event) =>
            onChange(
              event.target.value === ''
                ? undefined
                : Number(event.target.value),
            )
          }
          className="h-9 rounded-lg bg-white pr-8 text-xs"
        />
        <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground">
          {suffix}
        </span>
      </span>
    </label>
  );
}

function StyleControls({
  style,
  kind,
  allowTypography,
  onChange,
  onReset,
}: {
  style: EditorElementStyle;
  kind: DesignNode['kind'] | 'text' | 'media';
  allowTypography: boolean;
  onChange: <Key extends keyof EditorElementStyle>(
    key: Key,
    value: EditorElementStyle[Key],
  ) => void;
  onReset: () => void;
}) {
  const hasOverrides = Object.keys(style).length > 0;
  return (
    <div className="overflow-hidden rounded-xl border border-[#D9E6E7] bg-[#F5F8F9]">
      <div className="flex items-center justify-between border-b border-[#D9E6E7] px-3 py-2.5">
        <p className="flex items-center gap-2 text-xs font-bold text-[#173F4A]">
          <Palette className="size-3.5 text-[#16807F]" /> Design
        </p>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onReset}
          disabled={!hasOverrides}
          className="h-7 rounded-lg px-2 text-[11px]"
        >
          <RotateCcw className="size-3" /> Reset
        </Button>
      </div>

      {allowTypography && (
        <div className="grid gap-3 border-b border-[#D9E6E7] p-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#5F7077]">
            Typography
          </p>
          <div className="grid grid-cols-2 gap-2">
            <NumberControl
              label="Font size"
              value={style.fontSize}
              min={8}
              max={120}
              onChange={(value) => onChange('fontSize', value)}
            />
            <label className="grid gap-1 text-[11px] font-semibold text-[#5F7077]">
              Weight
              <select
                value={style.fontWeight ?? ''}
                onChange={(event) =>
                  onChange(
                    'fontWeight',
                    event.target.value ? Number(event.target.value) : undefined,
                  )
                }
                className="h-9 rounded-lg border border-border bg-white px-2 text-xs outline-none focus:ring-2 focus:ring-[#16807F]/30"
              >
                <option value="">Default</option>
                <option value="300">Light</option>
                <option value="400">Regular</option>
                <option value="500">Medium</option>
                <option value="600">Semibold</option>
                <option value="700">Bold</option>
                <option value="800">Extra bold</option>
              </select>
            </label>
            <NumberControl
              label="Tracking"
              value={style.letterSpacing}
              min={-3}
              max={12}
              step={0.1}
              onChange={(value) => onChange('letterSpacing', value)}
            />
            <NumberControl
              label="Line height"
              value={style.lineHeight}
              min={0.8}
              max={3}
              step={0.05}
              suffix="×"
              onChange={(value) => onChange('lineHeight', value)}
            />
          </div>
          <div className="grid grid-cols-[1fr_auto] gap-2">
            <label className="flex h-9 items-center gap-2 rounded-lg border border-border bg-white px-2 text-[11px] font-semibold text-[#5F7077]">
              <input
                type="color"
                value={style.color ?? '#173F4A'}
                onChange={(event) => onChange('color', event.target.value)}
                className="size-6 cursor-pointer rounded border-0 bg-transparent p-0"
                aria-label="Text colour"
              />
              Text colour
            </label>
            <div className="flex rounded-lg border border-border bg-white p-0.5">
              {(
                [
                  ['left', AlignLeft],
                  ['center', AlignCenter],
                  ['right', AlignRight],
                ] as const
              ).map(([alignment, Icon]) => (
                <Button
                  key={alignment}
                  type="button"
                  variant={
                    style.textAlign === alignment ? 'secondary' : 'ghost'
                  }
                  size="icon"
                  onClick={() => onChange('textAlign', alignment)}
                  aria-label={`Align ${alignment}`}
                  aria-pressed={style.textAlign === alignment}
                  className="size-7 rounded-md"
                >
                  <Icon className="size-3.5" />
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-3 p-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#5F7077]">
          Size & spacing
        </p>
        <div className="grid grid-cols-2 gap-2">
          {kind === 'icon' && (
            <NumberControl
              label="Icon size"
              value={style.iconSize}
              min={8}
              max={160}
              onChange={(value) => onChange('iconSize', value)}
            />
          )}
          {kind !== 'icon' && (
            <NumberControl
              label="Width"
              value={style.widthPercent}
              min={10}
              max={100}
              suffix="%"
              onChange={(value) => onChange('widthPercent', value)}
            />
          )}
          <NumberControl
            label="Padding X"
            value={style.paddingX}
            min={0}
            max={160}
            onChange={(value) => onChange('paddingX', value)}
          />
          <NumberControl
            label="Padding Y"
            value={style.paddingY}
            min={0}
            max={160}
            onChange={(value) => onChange('paddingY', value)}
          />
          <NumberControl
            label="Margin top"
            value={style.marginTop}
            min={-100}
            max={240}
            onChange={(value) => onChange('marginTop', value)}
          />
          <NumberControl
            label="Margin bottom"
            value={style.marginBottom}
            min={-100}
            max={240}
            onChange={(value) => onChange('marginBottom', value)}
          />
          <NumberControl
            label="Corner radius"
            value={style.borderRadius}
            min={0}
            max={120}
            onChange={(value) => onChange('borderRadius', value)}
          />
          <NumberControl
            label="Opacity"
            value={style.opacity}
            min={10}
            max={100}
            suffix="%"
            onChange={(value) => onChange('opacity', value)}
          />
        </div>
        <label className="flex h-9 items-center gap-2 rounded-lg border border-border bg-white px-2 text-[11px] font-semibold text-[#5F7077]">
          <input
            type="color"
            value={
              style.backgroundColor && style.backgroundColor !== 'transparent'
                ? style.backgroundColor
                : '#FFFFFF'
            }
            onChange={(event) =>
              onChange('backgroundColor', event.target.value)
            }
            className="size-6 cursor-pointer rounded border-0 bg-transparent p-0"
            aria-label="Background colour"
          />
          Background colour
          <button
            type="button"
            onClick={() => onChange('backgroundColor', 'transparent')}
            className="ml-auto cursor-pointer text-[10px] font-bold text-[#16807F] hover:underline"
          >
            Clear
          </button>
        </label>
      </div>
    </div>
  );
}

export default function VisualEditor({
  draft,
  dirty,
  saving,
  canUndo,
  canRedo,
  onUpdate,
  onUndo,
  onRedo,
  onSave,
  onOpenDetails,
}: {
  draft: SiteContent;
  dirty: boolean;
  saving: boolean;
  canUndo: boolean;
  canRedo: boolean;
  onUpdate: (path: PathPart[], value: unknown) => void;
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => Promise<void>;
  onOpenDetails: (tab: DetailTab) => void;
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [viewport, setViewport] = useState<Viewport>('desktop');
  const [selectedPath, setSelectedPath] = useState('hero.title');
  const [query, setQuery] = useState('');
  const [previewReady, setPreviewReady] = useState(false);
  const [draggedSection, setDraggedSection] = useState<PageSectionId | null>(
    null,
  );

  const entries = useMemo(() => collectEditable(draft), [draft]);
  const availableDesignNodes = useMemo(
    () => [
      ...designNodes,
      ...draft.servicesSection.items.flatMap((_, index): DesignNode[] => [
        {
          key: `services.card.${index}`,
          label: `Service card ${index + 1}`,
          section: 'Services',
          kind: 'container',
        },
        {
          key: `services.icon.${index}`,
          label: `Service icon ${index + 1}`,
          section: 'Services',
          kind: 'icon',
        },
      ]),
      ...draft.properties.map(
        (property): DesignNode => ({
          key: `properties.card.${property.id}`,
          label: property.title || `Property card ${property.id}`,
          section: 'Properties',
          kind: 'container',
        }),
      ),
    ],
    [draft.properties, draft.servicesSection.items],
  );
  const visibleEntries = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return needle
      ? entries.filter((entry) =>
          `${entry.section} ${entry.label} ${String(entry.value)}`
            .toLowerCase()
            .includes(needle),
        )
      : entries;
  }, [entries, query]);
  const visibleDesignNodes = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return needle
      ? availableDesignNodes.filter((node) =>
          `${node.section} ${node.label}`.toLowerCase().includes(needle),
        )
      : availableDesignNodes;
  }, [availableDesignNodes, query]);
  const groupedEntries = useMemo(() => {
    return visibleEntries.reduce<Record<string, EditableEntry[]>>(
      (groups, entry) => {
        (groups[entry.section] ??= []).push(entry);
        return groups;
      },
      {},
    );
  }, [visibleEntries]);
  const selectedEntry = entries.find((entry) => entry.path === selectedPath);
  const selectedNode = availableDesignNodes.find(
    (node) => node.key === selectedPath,
  );
  const selectedSection = pageSectionForPath(selectedPath);
  const selectedValue = getAtPath(draft, selectedPath);
  const selectedText = typeof selectedValue === 'string' ? selectedValue : '';
  const selectedElementHidden =
    draft.pageLayout.hiddenElements.includes(selectedPath);
  const selectedStyle = draft.pageLayout.elementStyles[selectedPath] ?? {};
  const selectedKind: DesignNode['kind'] | 'text' | 'media' = selectedNode
    ? selectedNode.kind
    : isMediaPath(selectedPath)
      ? 'media'
      : 'text';

  const sendToPreview = useCallback(() => {
    iframeRef.current?.contentWindow?.postMessage(
      {
        type: 'satiaya-editor-content',
        content: draft,
        selectedPath,
      },
      window.location.origin,
    );
  }, [draft, selectedPath]);

  useEffect(() => {
    function receive(event: MessageEvent) {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type === 'satiaya-editor-ready') {
        setPreviewReady(true);
      }
      if (
        event.data?.type === 'satiaya-editor-select' &&
        typeof event.data.path === 'string'
      ) {
        setSelectedPath(event.data.path);
      }
    }
    window.addEventListener('message', receive);
    return () => window.removeEventListener('message', receive);
  }, []);

  useEffect(() => {
    if (previewReady) sendToPreview();
  }, [previewReady, sendToPreview]);

  useEffect(() => {
    function handleShortcut(event: KeyboardEvent) {
      if (!(event.ctrlKey || event.metaKey) || event.key.toLowerCase() !== 'z')
        return;
      event.preventDefault();
      if (event.shiftKey) onRedo();
      else onUndo();
    }
    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, [onRedo, onUndo]);

  function updateSelected(value: unknown) {
    onUpdate(parsePath(selectedPath), value);
  }

  function selectSection(section: PageSectionId) {
    setSelectedPath(pageSectionDetails[section].selectionPath);
  }

  function moveSection(section: PageSectionId, offset: -1 | 1) {
    const order = [...draft.pageLayout.order];
    const currentIndex = order.indexOf(section);
    const nextIndex = currentIndex + offset;
    if (currentIndex < 0 || nextIndex < 0 || nextIndex >= order.length) return;
    [order[currentIndex], order[nextIndex]] = [
      order[nextIndex],
      order[currentIndex],
    ];
    onUpdate(['pageLayout', 'order'], order);
  }

  function placeSection(source: PageSectionId, target: PageSectionId) {
    if (source === target) return;
    const order = draft.pageLayout.order.filter((item) => item !== source);
    const targetIndex = order.indexOf(target);
    order.splice(targetIndex, 0, source);
    onUpdate(['pageLayout', 'order'], order);
  }

  function toggleSection(section: PageSectionId) {
    const hidden = draft.pageLayout.hidden.includes(section)
      ? draft.pageLayout.hidden.filter((item) => item !== section)
      : [...draft.pageLayout.hidden, section];
    onUpdate(['pageLayout', 'hidden'], hidden);
  }

  function toggleSelectedElement() {
    const hiddenElements = selectedElementHidden
      ? draft.pageLayout.hiddenElements.filter((path) => path !== selectedPath)
      : [...draft.pageLayout.hiddenElements, selectedPath];
    onUpdate(['pageLayout', 'hiddenElements'], hiddenElements);
  }

  function updateSelectedStyle<Key extends keyof EditorElementStyle>(
    key: Key,
    value: EditorElementStyle[Key],
  ) {
    const elementStyles = structuredClone(draft.pageLayout.elementStyles);
    const nextStyle = { ...elementStyles[selectedPath] };
    if (value === undefined) delete nextStyle[key];
    else nextStyle[key] = value;
    if (Object.keys(nextStyle).length > 0)
      elementStyles[selectedPath] = nextStyle;
    else delete elementStyles[selectedPath];
    onUpdate(['pageLayout', 'elementStyles'], elementStyles);
  }

  function resetSelectedStyle() {
    const elementStyles = structuredClone(draft.pageLayout.elementStyles);
    delete elementStyles[selectedPath];
    onUpdate(['pageLayout', 'elementStyles'], elementStyles);
  }

  const viewportWidth = {
    desktop: '100%',
    tablet: '820px',
    mobile: '390px',
  }[viewport];

  return (
    <section className="overflow-hidden rounded-[26px] border border-[#D9E6E7] bg-[#EAF2F3] shadow-[0_18px_55px_rgba(23,63,74,.1)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#D9E6E7] bg-white px-3 py-3 sm:px-4">
        <div className="flex items-center gap-1">
          <span className="mr-2 hidden items-center gap-2 px-2 text-sm font-bold text-[#173F4A] sm:flex">
            <MousePointer2 className="size-4 text-[#16807F]" /> Visual editor
          </span>
          {(['desktop', 'tablet', 'mobile'] as const).map((device) => {
            const Icon =
              device === 'desktop'
                ? Monitor
                : device === 'tablet'
                  ? Tablet
                  : Smartphone;
            return (
              <Button
                key={device}
                type="button"
                variant={viewport === device ? 'secondary' : 'ghost'}
                size="icon"
                onClick={() => setViewport(device)}
                aria-label={`${titleCase(device)} preview`}
                aria-pressed={viewport === device}
                className="size-10 rounded-xl"
              >
                <Icon />
              </Button>
            );
          })}
          <span className="mx-1 h-6 w-px bg-[#D9E6E7]" />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onUndo}
            disabled={!canUndo}
            aria-label="Undo"
            className="size-10 rounded-xl"
          >
            <Undo2 />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onRedo}
            disabled={!canRedo}
            aria-label="Redo"
            className="size-10 rounded-xl"
          >
            <Redo2 />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#D9E6E7] bg-white px-3 text-sm font-semibold text-[#173F4A] hover:bg-[#F5F8F9]"
          >
            Open website <ExternalLink className="size-4" />
          </a>
          <Button
            type="button"
            onClick={() => void onSave()}
            disabled={saving || !dirty}
            className="h-10 rounded-xl px-4"
          >
            {saving ? (
              <LoaderCircle className="animate-spin" />
            ) : dirty ? (
              <Save />
            ) : (
              <Check />
            )}
            {saving ? 'Publishing…' : dirty ? 'Save & publish' : 'Published'}
          </Button>
        </div>
      </div>

      <div className="grid min-h-[760px] lg:grid-cols-[210px_minmax(0,1fr)_280px]">
        <aside className="border-b border-[#D9E6E7] bg-white lg:border-b-0 lg:border-r">
          <div className="border-b border-[#D9E6E7] p-4">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-[#5F7077]">
              <Layers3 className="size-4" /> Page layers
            </p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              Drag sections or use the arrows. Removed sections stay available
              here to restore.
            </p>
            <div className="mt-3 grid gap-1.5">
              {draft.pageLayout.order.map((section, index) => {
                const hidden = draft.pageLayout.hidden.includes(section);
                return (
                  <div
                    key={section}
                    draggable
                    onDragStart={() => setDraggedSection(section)}
                    onDragEnd={() => setDraggedSection(null)}
                    onDragOver={(event: DragEvent<HTMLDivElement>) =>
                      event.preventDefault()
                    }
                    onDrop={(event: DragEvent<HTMLDivElement>) => {
                      event.preventDefault();
                      if (draggedSection) placeSection(draggedSection, section);
                      setDraggedSection(null);
                    }}
                    className={`group flex items-center gap-1 rounded-xl border px-1.5 py-1.5 transition ${
                      selectedSection === section
                        ? 'border-[#77D9D4] bg-[#E2F7F5]'
                        : 'border-[#D9E6E7] bg-white hover:border-[#8EAFB2]'
                    } ${hidden ? 'opacity-60' : ''}`}
                  >
                    <button
                      type="button"
                      onClick={() => selectSection(section)}
                      className="flex min-w-0 flex-1 cursor-pointer items-center gap-1.5 rounded-lg px-1 py-1.5 text-left text-xs font-semibold text-[#173F4A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16807F]"
                    >
                      <GripVertical className="size-3.5 shrink-0 text-[#8EAFB2]" />
                      <span
                        className={`truncate ${hidden ? 'line-through' : ''}`}
                      >
                        {pageSectionDetails[section].label}
                      </span>
                    </button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => moveSection(section, -1)}
                      disabled={index === 0}
                      aria-label={`Move ${pageSectionDetails[section].label} up`}
                      className="size-7 rounded-lg"
                    >
                      <ChevronUp className="size-3.5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => moveSection(section, 1)}
                      disabled={index === draft.pageLayout.order.length - 1}
                      aria-label={`Move ${pageSectionDetails[section].label} down`}
                      className="size-7 rounded-lg"
                    >
                      <ChevronDown className="size-3.5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleSection(section)}
                      aria-label={`${hidden ? 'Restore' : 'Remove'} ${pageSectionDetails[section].label}`}
                      className={`size-7 rounded-lg ${
                        hidden
                          ? 'text-[#16807F] hover:bg-[#E2F7F5]'
                          : 'text-destructive hover:bg-destructive/10 hover:text-destructive'
                      }`}
                    >
                      {hidden ? (
                        <Eye className="size-3.5" />
                      ) : (
                        <Trash2 className="size-3.5" />
                      )}
                    </Button>
                  </div>
                );
              })}
            </div>
            <p className="mt-2 text-[11px] font-medium text-[#5F7077]">
              {pageSectionIds.length - draft.pageLayout.hidden.length} of{' '}
              {pageSectionIds.length} sections visible
            </p>
            <details className="mt-3 rounded-xl border border-[#D9E6E7] bg-[#F5F8F9]">
              <summary className="cursor-pointer px-3 py-2 text-[11px] font-bold text-[#173F4A]">
                Containers & icons
              </summary>
              <div className="max-h-48 overflow-y-auto border-t border-[#D9E6E7] p-1.5">
                {visibleDesignNodes.map((node) => {
                  const hidden = draft.pageLayout.hiddenElements.includes(
                    node.key,
                  );
                  return (
                    <button
                      key={node.key}
                      type="button"
                      onClick={() => setSelectedPath(node.key)}
                      className={`flex w-full cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-left text-[11px] transition ${
                        selectedPath === node.key
                          ? 'bg-[#E2F7F5] font-bold text-[#173F4A]'
                          : 'text-[#5F7077] hover:bg-white hover:text-[#173F4A]'
                      } ${hidden ? 'opacity-55' : ''}`}
                    >
                      {node.kind === 'icon' ? (
                        <ImageIcon className="size-3.5 shrink-0" />
                      ) : (
                        <Layers3 className="size-3.5 shrink-0" />
                      )}
                      <span
                        className={`min-w-0 flex-1 truncate ${hidden ? 'line-through' : ''}`}
                      >
                        {node.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </details>
            <div className="relative mt-3 block">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Find text or image"
                aria-label="Search editable content"
                className="h-10 rounded-xl bg-[#F5F8F9] pl-9"
              />
            </div>
          </div>
          <div className="max-h-[680px] overflow-y-auto p-2">
            {Object.entries(groupedEntries).map(([section, sectionEntries]) => (
              <div key={section} className="mb-3">
                <p className="px-2 pb-1 pt-2 text-[11px] font-bold uppercase tracking-[0.1em] text-[#5F7077]">
                  {section}
                </p>
                {sectionEntries.map((entry) => {
                  const hidden = draft.pageLayout.hiddenElements.includes(
                    entry.path,
                  );
                  return (
                    <button
                      key={entry.path}
                      type="button"
                      onClick={() => setSelectedPath(entry.path)}
                      className={`flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-xs transition ${
                        selectedPath === entry.path
                          ? 'bg-[#E2F7F5] font-bold text-[#173F4A]'
                          : 'text-[#5F7077] hover:bg-[#F5F8F9] hover:text-[#173F4A]'
                      } ${hidden ? 'opacity-55' : ''}`}
                    >
                      {hidden ? (
                        <EyeOff className="size-3.5 shrink-0" />
                      ) : (
                        <EditorIcon path={entry.path} />
                      )}
                      <span
                        className={`min-w-0 flex-1 truncate ${hidden ? 'line-through' : ''}`}
                      >
                        {entry.label}
                      </span>
                      {selectedPath === entry.path && (
                        <ChevronRight className="size-3.5" />
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
            {visibleEntries.length === 0 && (
              <p className="px-3 py-8 text-center text-xs leading-5 text-muted-foreground">
                No editable content matches your search.
              </p>
            )}
          </div>
        </aside>

        <div className="min-w-0 overflow-auto bg-[#DDE7E9] p-4 sm:p-6">
          <div className="mb-3 flex items-center justify-between text-xs font-semibold text-[#5F7077]">
            <span>Click any highlighted item to edit it</span>
            <span>{titleCase(viewport)} view</span>
          </div>
          <div
            className="mx-auto overflow-hidden rounded-2xl bg-white shadow-[0_22px_70px_rgba(23,63,74,.2)] ring-1 ring-black/5 transition-[width] duration-300"
            style={{
              width: viewportWidth,
              minWidth: viewport === 'desktop' ? '920px' : viewportWidth,
            }}
          >
            <iframe
              ref={iframeRef as RefObject<HTMLIFrameElement>}
              src="/?visualEditor=1"
              title="Live website editor preview"
              onLoad={() => {
                setPreviewReady(true);
                window.setTimeout(sendToPreview, 100);
              }}
              className="h-[700px] w-full border-0 bg-white"
            />
          </div>
        </div>

        <aside className="border-t border-[#D9E6E7] bg-white p-5 lg:border-l lg:border-t-0">
          <div className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto pr-1">
            <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#5F7077]">
              Inspector
            </p>
            {selectedEntry || selectedNode ? (
              <div className="mt-4 grid gap-5">
                <div>
                  <p className="font-heading text-lg font-bold text-[#173F4A]">
                    {selectedEntry?.label ?? selectedNode?.label}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {selectedEntry?.section ?? selectedNode?.section}
                  </p>
                </div>

                {selectedSection && (
                  <div className="rounded-xl border border-[#D9E6E7] bg-[#F5F8F9] p-3">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="text-xs font-bold text-[#173F4A]">
                          {pageSectionDetails[selectedSection].label}
                        </p>
                        <p className="mt-0.5 text-[11px] text-muted-foreground">
                          Move or remove the complete section
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => moveSection(selectedSection, -1)}
                          disabled={
                            draft.pageLayout.order.indexOf(selectedSection) ===
                            0
                          }
                          aria-label={`Move ${pageSectionDetails[selectedSection].label} up`}
                          className="size-9 rounded-lg bg-white"
                        >
                          <ChevronUp className="size-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => moveSection(selectedSection, 1)}
                          disabled={
                            draft.pageLayout.order.indexOf(selectedSection) ===
                            draft.pageLayout.order.length - 1
                          }
                          aria-label={`Move ${pageSectionDetails[selectedSection].label} down`}
                          className="size-9 rounded-lg bg-white"
                        >
                          <ChevronDown className="size-4" />
                        </Button>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => toggleSection(selectedSection)}
                      className={`mt-3 h-10 w-full justify-start rounded-lg bg-white ${
                        draft.pageLayout.hidden.includes(selectedSection)
                          ? 'text-[#16807F]'
                          : 'border-destructive/25 text-destructive hover:bg-destructive/5 hover:text-destructive'
                      }`}
                    >
                      {draft.pageLayout.hidden.includes(selectedSection) ? (
                        <>
                          <Eye className="size-4" /> Restore on website
                        </>
                      ) : (
                        <>
                          <EyeOff className="size-4" /> Remove from website
                        </>
                      )}
                    </Button>
                  </div>
                )}

                <div className="flex items-center justify-between gap-3 rounded-xl border border-[#D9E6E7] bg-white p-3">
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#173F4A]">
                      Selected element
                    </p>
                    <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                      {selectedElementHidden
                        ? 'Removed from the public page'
                        : 'Visible on the public page'}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={toggleSelectedElement}
                    className={`shrink-0 rounded-lg ${
                      selectedElementHidden
                        ? 'text-[#16807F]'
                        : 'border-destructive/25 text-destructive hover:bg-destructive/5 hover:text-destructive'
                    }`}
                  >
                    {selectedElementHidden ? (
                      <>
                        <Eye className="size-4" /> Restore
                      </>
                    ) : (
                      <>
                        <Trash2 className="size-4" /> Remove
                      </>
                    )}
                  </Button>
                </div>

                {selectedEntry &&
                  (isMediaPath(selectedPath) &&
                  typeof selectedValue === 'string' ? (
                    <VisualMediaInput
                      path={selectedPath}
                      value={selectedValue}
                      onChange={updateSelected}
                    />
                  ) : typeof selectedValue === 'boolean' ? (
                    <label className="flex items-center justify-between rounded-xl border border-[#D9E6E7] bg-[#F5F8F9] px-4 py-3 text-sm font-semibold">
                      Enabled
                      <input
                        type="checkbox"
                        checked={selectedValue}
                        onChange={(event) =>
                          updateSelected(event.target.checked)
                        }
                        className="size-5 accent-[#16807F]"
                      />
                    </label>
                  ) : typeof selectedValue === 'number' ? (
                    <Input
                      type="number"
                      value={selectedValue}
                      onChange={(event) =>
                        updateSelected(Number(event.target.value))
                      }
                      aria-label={selectedEntry.label}
                      className="h-12 rounded-xl bg-[#F5F8F9]"
                    />
                  ) : (
                    <Textarea
                      value={selectedText}
                      onChange={(event) => updateSelected(event.target.value)}
                      aria-label={selectedEntry.label}
                      rows={selectedText.length > 80 ? 7 : 4}
                      className="resize-none rounded-xl bg-[#F5F8F9] leading-6"
                    />
                  ))}

                <StyleControls
                  style={selectedStyle}
                  kind={selectedKind}
                  allowTypography={selectedKind === 'text'}
                  onChange={updateSelectedStyle}
                  onReset={resetSelectedStyle}
                />

                <div className="rounded-xl bg-[#EAF2F3] p-3 text-xs leading-5 text-[#5F7077]">
                  Your change appears in the preview immediately. It becomes
                  public only after you select{' '}
                  <strong>Save &amp; publish</strong>.
                </div>
                {selectedEntry && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenDetails(detailTabFor(selectedPath))}
                    className="h-11 justify-between rounded-xl bg-white"
                  >
                    Open detailed controls <ChevronRight />
                  </Button>
                )}
              </div>
            ) : (
              <div className="mt-5 rounded-xl border border-dashed border-[#D9E6E7] p-5 text-center text-sm text-muted-foreground">
                Select an item in the preview or layers panel.
              </div>
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}
