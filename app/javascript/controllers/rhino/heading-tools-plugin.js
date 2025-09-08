// Heading tools plugin for Rhino Editor
// @flow
import Heading from "@tiptap/extension-heading"
import { createDropdown, createToolContainer } from "controllers/rhino/utils"
import { HEADINGS, CSS_CLASSES, TIMEOUTS, ATTRIBUTES } from "controllers/rhino/config"
import { attachEditorListeners, EVENT_CONFIGS } from "controllers/rhino/editor-events"

export const addHeadingExtensions = (rhinoEditor) => {
  // Heading extension
  rhinoEditor.addExtensions(
    Heading.configure({
      levels: HEADINGS.LEVELS,
      HTMLAttributes: {
        class: CSS_CLASSES.TABLE.RHINO_HEADING,
      },
    })
  )
}

// Detect current heading level using both methods
const detectHeadingLevel = (editor) => {
  if (!editor.editor) return HEADINGS.DEFAULT_LEVEL

  // Method 1: Check using isActive for each level
  for (let level = 1; level <= 6; level++) {
    if (editor.editor.isActive("heading", { level })) {
      return level.toString()
    }
  }

  // Method 2: Examine the current node
  try {
    const { selection } = editor.editor.state
    const { $from } = selection

    for (let depth = 0; depth <= $from.depth; depth++) {
      const node = $from.node(depth)
      if (node?.type.name === "heading") {
        const level = node.attrs?.level
        if (level && level >= 1 && level <= 6) {
          return level.toString()
        }
      }
    }
  } catch (error) {
    // Silently fail
  }

  return HEADINGS.DEFAULT_LEVEL
}

// Update heading dropdown display
const updateHeadingDropdown = (headingSelect, currentLevel) => {
  const headingSelectEl = headingSelect.querySelector("select")
  if (!headingSelectEl || headingSelectEl.value === currentLevel) return

  // Mark as updating to prevent triggering command handler
  headingSelectEl.dataset.updating = "true"
  headingSelectEl.value = currentLevel

  // Force visual refresh
  headingSelectEl.style.display = "none"
  headingSelectEl.offsetHeight // Trigger reflow
  headingSelectEl.style.display = ""
  headingSelectEl.dispatchEvent(new Event("change", { bubbles: true }))

  delete headingSelectEl.dataset.updating
  headingSelectEl.style.color = currentLevel === HEADINGS.DEFAULT_LEVEL ? "#999" : "inherit"
}

// Main heading state update function
const updateHeadingState = (headingSelect, editor) => {
  if (!editor.editor) return

  try {
    const currentLevel = detectHeadingLevel(editor)
    updateHeadingDropdown(headingSelect, currentLevel)
  } catch (error) {
    // Silently fail - errors will be handled in Phase 7
  }
}

// Attach heading event listeners
const attachHeadingEventListeners = (editor, headingSelect) => {
  const updateState = () => updateHeadingState(headingSelect, editor)
  attachEditorListeners(editor, updateState, EVENT_CONFIGS.COMPLEX)
}

export const createHeadingTools = (editor) => {
  const headingContainer = createToolContainer(CSS_CLASSES.CONTAINERS.HEADING_TOOLS, ATTRIBUTES.SLOT_BEFORE_BOLD_BUTTON)

  // Heading dropdown
  const headingSelect = createDropdown(
    "Heading",
    HEADINGS.OPTIONS,
    (value) => {
      if (value === HEADINGS.DEFAULT_LEVEL) {
        editor.editor?.chain().focus().setParagraph().run()
      } else {
        editor.editor
          ?.chain()
          .focus()
          .setHeading({ level: parseInt(value) })
          .run()
      }
      setTimeout(() => updateHeadingState(headingSelect, editor), TIMEOUTS.INITIALIZATION_DELAY)
    },
    { renderWithHeading: true }
  )

  headingContainer.appendChild(headingSelect)
  editor.appendChild(headingContainer)

  // Set default value for heading dropdown
  const headingSelectEl = headingSelect.querySelector("select")
  if (headingSelectEl) {
    headingSelectEl.value = HEADINGS.DEFAULT_LEVEL
  }

  attachHeadingEventListeners(editor, headingSelect)
}
