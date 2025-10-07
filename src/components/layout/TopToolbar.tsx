import { memo, useState } from 'react';
import {
  Upload,
  Download,
  Trash2,
  Undo,
  Redo,
  RotateCcw,
  Eye,
  ZoomIn,
  ZoomOut,
  Menu,
} from 'lucide-react';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { isMacPlatform } from '../../lib/utils/platform';
import { MobileMenu } from './MobileMenu';

export interface FileOperations {
  onUpload: () => void;
  onDownload: () => void;
  onClear: () => void;
}

export interface EditOperations {
  onUndo: () => void;
  onRedo: () => void;
  onReset: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export interface ViewOperations {
  onToggleLeftSidebar: () => void;
  onToggleRightPanel: () => void;
  onToggleStatusBar: () => void;
}

export interface ZoomControls {
  level: number;
  onChange: (zoom: number) => void;
}

export interface TopToolbarProps {
  file: FileOperations;
  edit: EditOperations;
  view: ViewOperations;
  zoom: ZoomControls;
  /**
   * Show hamburger menu instead of dropdown menus (for mobile)
   * Default: false (show dropdown menus)
   */
  showHamburgerMenu?: boolean;
}

// Zoom constants
const MIN_ZOOM = 25;
const MAX_ZOOM = 200;
const ZOOM_INCREMENT = 25;
const ZOOM_PRESETS = [25, 50, 75, 100, 150, 200];

// Menu data structures (shared between mobile and desktop)
interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
  disabled?: boolean;
  shortcut?: string;
}

interface MenuSection {
  id: string;
  title: string;
  items: MenuItem[];
}

/**
 * TopToolbar - Main toolbar with file operations, editing, view controls, and zoom
 *
 * Features:
 * - File menu (Upload, Download, Clear)
 * - Edit menu (Undo, Redo, Reset)
 * - View menu (Toggle panels, Zoom presets)
 * - Zoom control with presets
 * - Keyboard shortcuts (via menu access keys)
 * - Disabled states for undo/redo
 * - Responsive:
 *   - Desktop/Tablet: Dropdown menus
 *   - Mobile: Hamburger menu
 */
export const TopToolbar = memo(function TopToolbar({
  file,
  edit,
  view,
  zoom,
  showHamburgerMenu = false,
}: TopToolbarProps) {
  const isMac = isMacPlatform();
  const modKey = isMac ? '⌘' : 'Ctrl';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Define menu structure once (DRY principle)
  const menuSections: MenuSection[] = [
    {
      id: 'file',
      title: 'File',
      items: [
        { id: 'upload', label: 'Upload', icon: Upload, action: file.onUpload },
        { id: 'download', label: 'Download', icon: Download, action: file.onDownload },
        { id: 'clear', label: 'Clear', icon: Trash2, action: file.onClear },
      ],
    },
    {
      id: 'edit',
      title: 'Edit',
      items: [
        { id: 'undo', label: 'Undo', icon: Undo, action: edit.onUndo, disabled: !edit.canUndo },
        { id: 'redo', label: 'Redo', icon: Redo, action: edit.onRedo, disabled: !edit.canRedo },
        { id: 'reset', label: 'Reset', icon: RotateCcw, action: edit.onReset },
      ],
    },
    {
      id: 'view',
      title: 'View',
      items: [
        {
          id: 'left-sidebar',
          label: 'Left Sidebar',
          icon: Eye,
          action: view.onToggleLeftSidebar,
          shortcut: `${modKey}+B`,
        },
        {
          id: 'right-panel',
          label: 'Right Panel',
          icon: Eye,
          action: view.onToggleRightPanel,
          shortcut: `${modKey}+1`,
        },
        {
          id: 'status-bar',
          label: 'Status Bar',
          icon: Eye,
          action: view.onToggleStatusBar,
          shortcut: `${modKey}+Shift+/`,
        },
      ],
    },
  ];

  // Render mobile menu sections
  const renderMobileMenuSections = () =>
    menuSections.map((section, index) => (
      <div key={section.id} className={index < menuSections.length - 1 ? 'mb-4' : ''}>
        <h3 className="font-semibold mb-2 px-2">{section.title}</h3>
        <div className="flex flex-col gap-1">
          {section.items.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant="ghost"
                className="justify-start"
                onClick={() => {
                  item.action();
                  setIsMobileMenuOpen(false);
                }}
                disabled={item.disabled}
              >
                <Icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            );
          })}
        </div>
      </div>
    ));

  // Render desktop dropdown menus
  const renderDesktopMenus = () =>
    menuSections.map((section) => (
      <DropdownMenu key={section.id}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            {section.title}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {section.items.map((item, index) => {
            const Icon = item.icon;
            const showSeparator = section.id === 'file' && index === 1; // Separator after Download in File menu
            const showSeparatorEdit = section.id === 'edit' && index === 1; // Separator after Redo in Edit menu

            return (
              <div key={item.id}>
                {showSeparator && <DropdownMenuSeparator />}
                {showSeparatorEdit && <DropdownMenuSeparator />}
                <DropdownMenuItem onClick={item.action} disabled={item.disabled}>
                  <Icon className="mr-2 h-4 w-4" />
                  {item.label}
                  {item.shortcut && <DropdownMenuShortcut>{item.shortcut}</DropdownMenuShortcut>}
                </DropdownMenuItem>
              </div>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    ));

  return (
    <div className="border-b bg-background" role="toolbar" aria-label="Main toolbar">
      <div className="flex items-center justify-between px-2 sm:px-4 py-2 gap-2">
        {/* Left section: File, Edit, View menus OR hamburger menu */}
        <div className="flex items-center gap-1">
          {showHamburgerMenu ? (
            <>
              {/* Hamburger menu button for mobile */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </Button>

              {/* Mobile menu drawer */}
              <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)}>
                {renderMobileMenuSections()}
              </MobileMenu>
            </>
          ) : (
            <>{renderDesktopMenus()}</>
          )}
        </div>

        {/* Right section: Zoom controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="iconLarge"
            onClick={() => zoom.onChange(Math.max(MIN_ZOOM, zoom.level - ZOOM_INCREMENT))}
            aria-label="Zoom out"
            title="Zoom out"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>

          {/* Zoom level dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="min-w-[60px]" title="Select zoom level">
                {zoom.level}%
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {ZOOM_PRESETS.map((preset) => (
                <DropdownMenuItem key={preset} onClick={() => zoom.onChange(preset)}>
                  {preset}%
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            size="iconLarge"
            onClick={() => zoom.onChange(Math.min(MAX_ZOOM, zoom.level + ZOOM_INCREMENT))}
            aria-label="Zoom in"
            title="Zoom in"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
});
