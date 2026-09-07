'use client';

import {
  Check,
  ChevronRight,
  ExternalLink,
  ImageIcon,
  Layers3,
  LoaderCircle,
  Monitor,
  MousePointer2,
  Redo2,
  Save,
  Search,
  Smartphone,
  Tablet,
  Type,
  Undo2,
  Upload,
} from 'lucide-react';
import type { ChangeEvent, RefObject } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { SiteContent } from '@/src/content/schema';

type PathPart = string | number;
type Viewport = 'desktop' | 'tablet' | 'mobile';
type DetailTab = 'identity' | 'homepage' | 'services' | 'properties';

type EditableEntry = {
  path: string;
  label: string;
  value: string | number | boolean;
  section: string;
};

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

  const entries = useMemo(() => collectEditable(draft), [draft]);
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
  const selectedValue = getAtPath(draft, selectedPath);
  const selectedText = typeof selectedValue === 'string' ? selectedValue : '';

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
                {sectionEntries.map((entry) => (
                  <button
                    key={entry.path}
                    type="button"
                    onClick={() => setSelectedPath(entry.path)}
                    className={`flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-xs transition ${
                      selectedPath === entry.path
                        ? 'bg-[#E2F7F5] font-bold text-[#173F4A]'
                        : 'text-[#5F7077] hover:bg-[#F5F8F9] hover:text-[#173F4A]'
                    }`}
                  >
                    <EditorIcon path={entry.path} />
                    <span className="min-w-0 flex-1 truncate">
                      {entry.label}
                    </span>
                    {selectedPath === entry.path && (
                      <ChevronRight className="size-3.5" />
                    )}
                  </button>
                ))}
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
          <div className="sticky top-28">
            <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#5F7077]">
              Inspector
            </p>
            {selectedEntry ? (
              <div className="mt-4 grid gap-5">
                <div>
                  <p className="font-heading text-lg font-bold text-[#173F4A]">
                    {selectedEntry.label}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {selectedEntry.section}
                  </p>
                </div>

                {isMediaPath(selectedPath) &&
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
                      onChange={(event) => updateSelected(event.target.checked)}
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
                )}

                <div className="rounded-xl bg-[#EAF2F3] p-3 text-xs leading-5 text-[#5F7077]">
                  Your change appears in the preview immediately. It becomes
                  public only after you select{' '}
                  <strong>Save &amp; publish</strong>.
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenDetails(detailTabFor(selectedPath))}
                  className="h-11 justify-between rounded-xl bg-white"
                >
                  Open detailed controls <ChevronRight />
                </Button>
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
