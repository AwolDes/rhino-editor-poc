// Color picker plugin for Rhino Editor
// @flow
import { Color, TextStyle } from "@tiptap/extension-text-style"
import { createToolContainer } from "controllers/rhino/utils"
import { CSS_CLASSES } from "controllers/rhino/config"
import { attachEditorListeners, EVENT_CONFIGS } from "controllers/rhino/editor-events"

const DEFAULT_COLOR = "#000000"

export function addColorExtensions(rhinoEditor) {
  rhinoEditor.addExtensions(Color, TextStyle)
}

// Detect current text color
function detectTextColor(editor) {
  if (!editor.editor) return DEFAULT_COLOR

  // Method 1: Use TipTap's getAttributes method
  const textStyleAttrs = editor.editor.getAttributes("textStyle")
  let color = textStyleAttrs.color || ""
  if (color) return color

  // Method 2: Check marks directly from selection
  try {
    const { state } = editor.editor
    const { selection } = state
    const { from, to } = selection

    state.doc.nodesBetween(from, to, (node) => {
      if (node.marks) {
        const textStyleMark = node.marks.find((mark) => mark.type.name === "textStyle")
        if (textStyleMark?.attrs.color) {
          color = textStyleMark.attrs.color
          return false // Stop iteration
        }
      }
    })
    if (color) return color
  } catch (e) {}

  // Method 3: Check computed style from DOM
  try {
    const { selection } = editor.editor.state
    const dom = editor.editor.view.domAtPos(selection.from)
    const computedStyle = window.getComputedStyle(
      dom.node.nodeType === Node.TEXT_NODE ? dom.node.parentElement : dom.node
    )
    return computedStyle.color || DEFAULT_COLOR
  } catch (e) {}

  return DEFAULT_COLOR
}

// Update color indicator
function updateColorIndicator(indicator, color) {
  if (indicator) {
    indicator.style.backgroundColor = color || DEFAULT_COLOR
  }
}

// Create color picker UI
export function createColorPicker(editor) {
  const container = document.createElement("div")
  container.className = "rhino-color-picker-wrapper"
  container.style.display = "inline-flex"
  container.style.alignItems = "center"
  container.style.position = "relative"
  container.style.marginLeft = "4px"

  // Hidden color input
  const colorInput = document.createElement("input")
  colorInput.type = "color"
  colorInput.className = "rhino-color-picker-input"
  colorInput.style.position = "absolute"
  colorInput.style.opacity = "0"
  colorInput.style.width = "0"
  colorInput.style.height = "0"
  colorInput.style.padding = "0"
  colorInput.style.border = "none"

  // Visible button
  const colorButton = document.createElement("button")
  colorButton.type = "button"
  colorButton.className = "rhino-color-picker-button"
  colorButton.title = "Text Color"
  colorButton.style.display = "flex"
  colorButton.style.flexDirection = "column"
  colorButton.style.alignItems = "center"
  colorButton.style.justifyContent = "center"
  colorButton.style.padding = "4px 6px"
  colorButton.style.border = "1px solid var(--rhino-border-color, #ccc)"
  colorButton.style.borderRadius = "4px"
  colorButton.style.backgroundColor = "var(--rhino-toolbar-background, white)"
  colorButton.style.cursor = "pointer"
  colorButton.style.minWidth = "28px"
  colorButton.style.height = "28px"
  colorButton.style.position = "relative"

  // "A" icon
  const aIcon = document.createElement("span")
  aIcon.className = "rhino-color-a-icon"
  aIcon.textContent = "A"
  aIcon.style.fontSize = "14px"
  aIcon.style.fontWeight = "bold"
  aIcon.style.lineHeight = "1"
  aIcon.style.marginBottom = "2px"

  // Color indicator bar
  const colorIndicator = document.createElement("div")
  colorIndicator.className = "rhino-color-indicator"
  colorIndicator.style.width = "16px"
  colorIndicator.style.height = "3px"
  colorIndicator.style.backgroundColor = "#000000"
  colorIndicator.style.borderRadius = "1px"
  colorIndicator.style.position = "absolute"
  colorIndicator.style.bottom = "3px"

  colorButton.appendChild(aIcon)
  colorButton.appendChild(colorIndicator)

  // Event handlers
  const handleColorChange = (e) => {
    const color = e.target.value
    editor.editor?.chain().focus().setColor(color).run()
    updateColorIndicator(colorIndicator, color)
  }

  colorButton.addEventListener("click", (e) => {
    e.preventDefault()
    e.stopPropagation()
    colorInput.click()
  })

  colorInput.addEventListener("input", handleColorChange)
  colorInput.addEventListener("change", handleColorChange)

  // Add hover effect
  colorButton.addEventListener("mouseenter", () => {
    colorButton.style.backgroundColor = "var(--rhino-button-hover, #f0f0f0)"
  })

  colorButton.addEventListener("mouseleave", () => {
    colorButton.style.backgroundColor = "var(--rhino-toolbar-background, white)"
  })

  container.appendChild(colorInput)
  container.appendChild(colorButton)

  // Update color on selection change
  const updateState = () => {
    const currentColor = detectTextColor(editor)
    updateColorIndicator(colorIndicator, currentColor)
    colorInput.value = currentColor
  }

  attachEditorListeners(editor, updateState, EVENT_CONFIGS.SIMPLE)

  return container
}

// Main function to add color tools to editor
export function createColorTools(editor) {
  const colorPicker = createColorPicker(editor)

  // Try to insert into font tools container if it exists
  const fontToolsContainer = editor.querySelector(`.${CSS_CLASSES.CONTAINERS.FONT_TOOLS}`)
  if (fontToolsContainer) {
    fontToolsContainer.appendChild(colorPicker)
  } else {
    // Create a new container if font tools don't exist
    const colorToolsContainer = createToolContainer("rhino-color-tools")
    colorToolsContainer.appendChild(colorPicker)
    editor.appendChild(colorToolsContainer)
  }
}
