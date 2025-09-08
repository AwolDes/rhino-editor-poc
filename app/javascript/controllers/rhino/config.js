// @flow
// Configuration constants for Rhino Editor plugins

// Timeout values (in milliseconds)
export const TIMEOUTS = {
  SELECTION_UPDATE_DELAY: 50,
  INITIALIZATION_DELAY: 100,
  STARTUP_DELAY: 1000,
  WIDTH_PERSISTENCE_DELAY: 100,
}

// Font configuration
export const FONTS = {
  FAMILIES: [
    { value: "lato", label: "Lato" },
    { value: "Arial", label: "Arial" },
    { value: "Helvetica", label: "Helvetica" },
    { value: "system-ui", label: "System UI" },
    { value: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", label: "Segoe UI" },
    { value: "Tahoma", label: "Tahoma" },
    { value: "'Times New Roman', Times, serif", label: "Times New Roman" },
    { value: "Georgia, serif", label: "Georgia" },
    { value: "Verdana", label: "Verdana" },
    { value: "'Courier New', monospace", label: "Courier New" },
    { value: "monospace", label: "Monospace" },
    { value: "Garamond, serif", label: "Garamond" },
    { value: "Monaco, monospace", label: "Monaco" },
    { value: "'Open Sans', sans-serif", label: "Open Sans" },
    { value: "Roboto, sans-serif", label: "Roboto" },
  ],
  DEFAULT_FAMILY: "lato",
  SIZE: {
    MIN: 8,
    MAX: 72,
    DEFAULT: 14,
    STEP: 1,
  },
}

// Heading configuration
export const HEADINGS = {
  LEVELS: [1, 2, 3, 4, 5, 6],
  OPTIONS: [
    { value: "normal", label: "Normal" },
    { value: "1", label: "Heading 1" },
    { value: "2", label: "Heading 2" },
    { value: "3", label: "Heading 3" },
    { value: "4", label: "Heading 4" },
    { value: "5", label: "Heading 5" },
    { value: "6", label: "Heading 6" },
  ],
  FONT_SIZES: {
    DISPLAY: { "1": "24px", "2": "20px", "3": "18px", "4": "16px", "5": "14px", "6": "12px" },
    BUTTON: { "1": "16px", "2": "15px", "3": "14px", "4": "13px", "5": "12px", "6": "11px" },
  },
  DEFAULT_LEVEL: "normal",
}

// Text alignment configuration
export const ALIGNMENTS = {
  OPTIONS: ["left", "center", "right", "justify"],
  DEFAULT: "left",
  BUTTONS: [
    {
      value: "left",
      title: "Align Left",
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M17 10H3M21 6H3M21 14H3M17 18H3"/>
      </svg>`,
    },
    {
      value: "center",
      title: "Align Center",
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M18 10H6M21 6H3M21 14H3M18 18H6"/>
      </svg>`,
    },
    {
      value: "right",
      title: "Align Right",
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 10H7M21 6H3M21 14H3M21 18H7"/>
      </svg>`,
    },
    {
      value: "justify",
      title: "Justify",
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 10H3M21 6H3M21 14H3M21 18H3"/>
      </svg>`,
    },
  ],
}

// Table configuration
export const TABLE = {
  DEFAULT_DIMENSIONS: {
    ROWS: 3,
    COLS: 3,
    WITH_HEADER: true,
  },
  COLUMN: {
    MIN_WIDTH: 50, // pixels
    RESIZE_EDGE_THRESHOLD: 10, // pixels from edge to show resize cursor
  },
  NODE_TYPES: ["table", "tableRow", "tableCell", "tableHeader"],
  MAX_DEPTH_CHECK: 5, // maximum depth to walk up the node tree
  ICONS: {
    INSERT_TABLE: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M3 3h18v18H3z"/>
      <path d="M21 9H3"/>
      <path d="M21 15H3"/>
      <path d="M12 3v18"/>
    </svg>`,
    ADD_COLUMN_BEFORE: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="14" y="3" width="6" height="18" rx="1"/>
      <rect x="4" y="3" width="6" height="18" rx="1"/>
      <path d="M11 9v6"/>
      <path d="M8 12h6"/>
    </svg>`,
    ADD_COLUMN_AFTER: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="4" y="3" width="6" height="18" rx="1"/>
      <rect x="14" y="3" width="6" height="18" rx="1"/>
      <path d="M17 9v6"/>
      <path d="M14 12h6"/>
    </svg>`,
    DELETE_COLUMN: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="9" y="3" width="6" height="18" rx="1"/>
      <path d="M12 8l-2 2 2 2"/>
      <path d="M12 8l2 2-2 2"/>
      <path d="M4 12h4"/>
      <path d="M16 12h4"/>
    </svg>`,
    ADD_ROW_BEFORE: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="3" y="14" width="18" height="6" rx="1"/>
      <rect x="3" y="4" width="18" height="6" rx="1"/>
      <path d="M9 11h6"/>
      <path d="M12 8v6"/>
    </svg>`,
    ADD_ROW_AFTER: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="3" y="4" width="18" height="6" rx="1"/>
      <rect x="3" y="14" width="18" height="6" rx="1"/>
      <path d="M9 17h6"/>
      <path d="M12 14v6"/>
    </svg>`,
    DELETE_ROW: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="3" y="9" width="18" height="6" rx="1"/>
      <path d="M8 12l2-2 2 2"/>
      <path d="M8 12l2 2 2-2"/>
      <path d="M12 4v4"/>
      <path d="M12 16v4"/>
    </svg>`,
  },
}

// CSS class names used across plugins
export const CSS_CLASSES = {
  CONTAINERS: {
    TABLE_BUTTONS: "table-buttons-container",
    FONT_TOOLS: "font-tools-container",
    ALIGNMENT_TOOLS: "alignment-tools-container",
    HEADING_TOOLS: "heading-tools-container",
  },
  BUTTONS: {
    TOOLBAR: "toolbar__button rhino-toolbar-button",
    ALIGNMENT: "alignment-button",
    CUSTOM_FONT: "rhino-toolbar-button custom-font-button",
  },
  DROPDOWNS: {
    TOOLBAR_SELECT: "toolbar__select rhino-toolbar-button",
    CUSTOM_FONT: "custom-font-dropdown",
    CUSTOM_FONT_MENU: "custom-font-menu",
    CUSTOM_FONT_ITEM: "custom-font-item",
    HIDDEN_SELECT: "hidden-font-select",
  },
  TABLE: {
    RHINO_TABLE: "rhino-table",
    RHINO_HEADING: "rhino-heading",
    RESIZE_CURSOR: "resize-cursor",
  },
}

// DOM attributes
export const ATTRIBUTES = {
  SLOT: "before-undo-button",
  SLOT_BEFORE_BOLD_BUTTON: "before-bold-button",
  TOOLTIP_ROLE: "data-role-tooltip",
  DOM_ROLE: "data-role",
  TABINDEX: "-1",
  ALIGNMENT_DATA: "data-alignment",
  UPDATING_FLAG: "data-updating",
  COLUMN_WIDTHS: "data-column-widths",
}

// UI styling constants
export const UI_STYLES = {
  CONTAINER: {
    DISPLAY: "flex",
    GAP: "4px",
    ALIGN_ITEMS: "center",
  },
  DROPDOWN: {
    MIN_WIDTH: "120px",
    MAX_HEIGHT: "300px",
    PADDING: "4px 24px 4px 8px",
    BORDER_RADIUS: "4px",
    MENU_MARGIN_TOP: "2px",
    ITEM_PADDING: "8px 12px",
  },
  CURSOR: {
    COL_RESIZE: "col-resize",
    POINTER: "pointer",
  },
  Z_INDEX: {
    DROPDOWN_MENU: "1000",
  },
}

// Event types
export const EVENTS = {
  RHINO_CHANGE: "rhino-change",
  RHINO_SELECTION_CHANGE: "rhino-selection-change",
  RHINO_BEFORE_INITIALIZE: "rhino-before-initialize",
  CLICK: "click",
  FOCUS: "focus",
  CHANGE: "change",
  MOUSEDOWN: "mousedown",
  MOUSEMOVE: "mousemove",
  MOUSEUP: "mouseup",
  MOUSEENTER: "mouseenter",
  MOUSELEAVE: "mouseleave",
  SCROLL: "scroll",
  RESIZE: "resize",
}
