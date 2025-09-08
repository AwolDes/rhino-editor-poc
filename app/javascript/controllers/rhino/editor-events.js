// @flow
// Shared event handling utilities for Rhino Editor plugins

import { TIMEOUTS, EVENTS } from "controllers/rhino/config"

// Debounced update function to replace multiple setTimeout calls
const createDebouncedUpdate = (updateFunction, delay = TIMEOUTS.SELECTION_UPDATE_DELAY) => {
  let timeoutId = null
  return (...args) => {
    if (timeoutId) clearTimeout(timeoutId)
    timeoutId = setTimeout(() => updateFunction(...args), delay)
  }
}

// Central error handling for all event callbacks
const safeExecute = (fn, fallbackValue = null) => {
  try {
    return fn()
  } catch (error) {
    // Silently fail - can be enhanced in future to log to monitoring service
    return fallbackValue
  }
}

// Single attachEditorListeners function used by all plugins
export const attachEditorListeners = (editor, updateFunction, options = {}) => {
  const {
    debounceDelay = TIMEOUTS.SELECTION_UPDATE_DELAY,
    initializationDelay = TIMEOUTS.INITIALIZATION_DELAY,
    includeClickEvents = true,
    includeFocusEvents = true,
  } = options

  // Create debounced version of update function
  const debouncedUpdate = createDebouncedUpdate(updateFunction, debounceDelay)

  // Wrap update function with error handling
  const safeUpdate = (...args) => safeExecute(() => updateFunction(...args))
  const safeDebouncedUpdate = (...args) => safeExecute(() => debouncedUpdate(...args))

  // Attach listeners after initialization delay
  setTimeout(() => {
    // Core editor events
    editor.addEventListener(EVENTS.RHINO_SELECTION_CHANGE, safeUpdate)
    editor.addEventListener(EVENTS.RHINO_CHANGE, safeUpdate)

    // Optional additional events
    if (includeFocusEvents) {
      editor.addEventListener(EVENTS.FOCUS, safeUpdate)
    }

    if (includeClickEvents) {
      editor.addEventListener(EVENTS.CLICK, safeDebouncedUpdate)
    }

    // Initial update
    safeUpdate()
  }, initializationDelay)
}

// Helper function for creating event listener cleanup
export const createEventCleanup = (editor, eventListeners) => () => {
  eventListeners.forEach(({ event, handler }) => {
    editor.removeEventListener(event, handler)
  })
}

// Standard event listener configuration for different plugin types
export const EVENT_CONFIGS = {
  // For plugins that need immediate updates (alignment, table state)
  IMMEDIATE: {
    debounceDelay: 0,
    includeClickEvents: true,
    includeFocusEvents: false,
  },

  // For plugins with complex state detection (font, heading)
  COMPLEX: {
    debounceDelay: TIMEOUTS.SELECTION_UPDATE_DELAY,
    includeClickEvents: true,
    includeFocusEvents: true,
  },

  // For plugins that only need basic change detection
  BASIC: {
    debounceDelay: TIMEOUTS.INITIALIZATION_DELAY,
    includeClickEvents: false,
    includeFocusEvents: false,
  },
}
