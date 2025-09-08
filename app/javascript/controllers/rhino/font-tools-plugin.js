// Font tools plugin for Rhino Editor
// @flow
import { TextStyle, FontSize, FontFamily } from "@tiptap/extension-text-style"
import { createDropdown, createTableButton, createToolContainer } from "controllers/rhino/utils"
import { FONTS, CSS_CLASSES, TIMEOUTS, EVENTS, ATTRIBUTES } from "controllers/rhino/config"
import { attachEditorListeners, EVENT_CONFIGS } from "controllers/rhino/editor-events"

export const addFontExtensions = (rhinoEditor) => {
  // Text styling extensions
  rhinoEditor.addExtensions(TextStyle)
  rhinoEditor.addExtensions(
    FontFamily.configure({
      types: ["textStyle"],
    })
  )
  rhinoEditor.addExtensions(
    FontSize.configure({
      types: ["textStyle"],
    })
  )
}

// Extract font family detection logic
const detectFontFamily = (editor) => {
  if (!editor.editor) return ""

  // Method 1: Use TipTap's getAttributes method
  const textStyleAttrs = editor.editor.getAttributes("textStyle")
  let fontFamily = textStyleAttrs.fontFamily || ""
  if (fontFamily) return fontFamily

  // Method 2: Check marks directly from selection
  try {
    const { state } = editor.editor
    const { selection } = state
    const { from, to } = selection

    state.doc.nodesBetween(from, to, (node) => {
      if (node.marks) {
        const textStyleMark = node.marks.find((mark) => mark.type.name === "textStyle")
        if (textStyleMark?.attrs.fontFamily) {
          fontFamily = textStyleMark.attrs.fontFamily
          return false // Stop iteration
        }
      }
    })
    if (fontFamily) return fontFamily
  } catch (e) {}

  // Method 3: Check computed style from DOM
  try {
    const { selection } = editor.editor.state
    const dom = editor.editor.view.domAtPos(selection.from)
    const computedStyle = window.getComputedStyle(
      dom.node.nodeType === Node.TEXT_NODE ? dom.node.parentElement : dom.node
    )
    const computedFamily = computedStyle.fontFamily

    if (computedFamily) {
      const cleanFamily = computedFamily.toLowerCase().replace(/['"]/g, "").trim()
      if (cleanFamily.includes("arial")) return "Arial"
      if (cleanFamily.includes("helvetica")) return "Helvetica"
      if (cleanFamily.includes("times")) return "Times New Roman"
      if (cleanFamily.includes("georgia")) return "Georgia"
      if (cleanFamily.includes("verdana")) return "Verdana"
      if (cleanFamily.includes("courier")) return "Courier New"
      if (cleanFamily.includes("monospace")) return "monospace"
    }
  } catch (e) {}

  return ""
}

// Map font family names to dropdown values
const mapFontFamilyToDropdownValue = (fontFamily) => {
  if (!fontFamily) return FONTS.DEFAULT_FAMILY

  const fontLower = fontFamily.toLowerCase()
  const mapping = {
    arial: "Arial",
    helvetica: "Helvetica",
    "times new roman": "'Times New Roman', serif",
    georgia: "Georgia, serif",
    verdana: "Verdana",
    "courier new": "'Courier New', monospace",
    monospace: "monospace",
    garamond: "Garamond, serif",
    monaco: "Monaco, monospace",
    "segoe ui": "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    tahoma: "Tahoma",
    "open sans": "'Open Sans', sans-serif",
    roboto: "Roboto, sans-serif",
    "system-ui": "system-ui",
    lato: "lato",
  }

  return mapping[fontLower] || fontFamily || FONTS.DEFAULT_FAMILY
}

// Update font family dropdown display
const updateFontDropdown = (fontFamilySelect, fontFamily) => {
  const fontFamilySelectEl = fontFamilySelect.querySelector("select")
  if (!fontFamilySelectEl) return

  const targetValue = mapFontFamilyToDropdownValue(fontFamily)
  if (fontFamilySelectEl.value === targetValue) return

  // Mark as updating to prevent triggering command handler
  fontFamilySelectEl.dataset.updating = "true"
  fontFamilySelectEl.value = targetValue
  fontFamilySelectEl.style.fontFamily = targetValue

  // Force visual refresh
  fontFamilySelectEl.style.display = "none"
  fontFamilySelectEl.offsetHeight // Trigger reflow
  fontFamilySelectEl.style.display = ""
  fontFamilySelectEl.dispatchEvent(new Event("change", { bubbles: true }))

  delete fontFamilySelectEl.dataset.updating
  fontFamilySelectEl.style.color = fontFamily ? "inherit" : "#999"
}

export const createFontTools = (editor) => {
  const fontToolsContainer = createToolContainer(CSS_CLASSES.CONTAINERS.FONT_TOOLS, ATTRIBUTES.SLOT_BEFORE_BOLD_BUTTON)

  // Font size +/- controls - create first so we can reference it
  const fontSizeControls = createFontSizeControls(editor)

  // Font family dropdown
  const fontFamilySelect = createDropdown(
    "Font Family",
    FONTS.FAMILIES,
    (value) => {
      editor.editor?.chain().focus().setFontFamily(value).run()
      setTimeout(() => updateFontState(fontFamilySelect, fontSizeControls, editor), TIMEOUTS.INITIALIZATION_DELAY)
    },
    { renderWithFont: true }
  )

  // Extract font size detection logic
  const detectFontSize = (editor) => {
    if (!editor.editor) return ""

    // Method 1: Use TipTap's getAttributes method
    const textStyleAttrs = editor.editor.getAttributes("textStyle")
    let fontSize = textStyleAttrs.fontSize || ""
    if (fontSize) return fontSize

    // Method 2: Check marks directly from selection
    try {
      const { state } = editor.editor
      const { selection } = state
      const { from, to } = selection

      state.doc.nodesBetween(from, to, (node) => {
        if (node.marks) {
          const textStyleMark = node.marks.find((mark) => mark.type.name === "textStyle")
          if (textStyleMark?.attrs.fontSize) {
            fontSize = textStyleMark.attrs.fontSize
            return false // Stop iteration
          }
        }
      })
      if (fontSize) return fontSize
    } catch (e) {}

    // Method 3: Check computed style from DOM
    try {
      const { selection } = editor.editor.state
      const dom = editor.editor.view.domAtPos(selection.from)
      const computedStyle = window.getComputedStyle(
        dom.node.nodeType === Node.TEXT_NODE ? dom.node.parentElement : dom.node
      )
      return computedStyle.fontSize || ""
    } catch (e) {}

    return ""
  }

  // Update font size input display
  const updateSizeInput = (fontSizeControls, fontSize) => {
    const fontSizeInput = fontSizeControls.querySelector("input")
    if (!fontSizeInput) return

    const numericValue = fontSize ? parseInt(fontSize.replace(/px|pt|em|rem|%/g, "")) : ""
    if (fontSizeInput.value !== numericValue.toString()) {
      fontSizeInput.value = numericValue || ""
      fontSizeInput.placeholder = numericValue ? "" : "Size"
    }
  }

  // Main update function - now much smaller
  const updateFontState = (fontFamilySelect, fontSizeControls, editor) => {
    if (!editor.editor) return

    try {
      const fontFamily = detectFontFamily(editor)
      const fontSize = detectFontSize(editor)

      updateFontDropdown(fontFamilySelect, fontFamily)
      updateSizeInput(fontSizeControls, fontSize)
    } catch (error) {
      // Silently fail - errors will be handled in Phase 7
    }
  }

  // Attach font event listeners
  const attachFontEventListeners = (editor, fontFamilySelect, fontSizeControls) => {
    const updateState = () => updateFontState(fontFamilySelect, fontSizeControls, editor)
    attachEditorListeners(editor, updateState, EVENT_CONFIGS.COMPLEX)
  }

  fontToolsContainer.appendChild(fontFamilySelect)
  fontToolsContainer.appendChild(fontSizeControls)
  editor.appendChild(fontToolsContainer)

  // Set default value for font family dropdown
  const fontFamilySelectEl = fontFamilySelect.querySelector("select")
  if (fontFamilySelectEl) {
    fontFamilySelectEl.value = FONTS.DEFAULT_FAMILY
    fontFamilySelectEl.style.fontFamily = FONTS.DEFAULT_FAMILY
  }

  attachFontEventListeners(editor, fontFamilySelect, fontSizeControls)
}

// Create font size +/- controls
const createFontSizeControls = (editor) => {
  const container = document.createElement("div")
  container.className = "font-size-controls"
  container.style.display = "flex"
  container.style.alignItems = "center"
  container.style.gap = "2px"
  container.style.border = "1px solid var(--rhino-border-color, #ccc)"
  container.style.borderRadius = "4px"
  container.style.padding = "2px"
  container.style.backgroundColor = "var(--rhino-toolbar-background, white)"

  // Decrease button
  const decreaseBtn = createTableButton(
    "Decrease Font Size",
    `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M5 12h14"/>
    </svg>`,
    () => {
      const input = container.querySelector("input")
      const currentSize = parseInt(input.value) || FONTS.SIZE.DEFAULT
      const newSize = Math.max(FONTS.SIZE.MIN, currentSize - FONTS.SIZE.STEP)
      input.value = newSize
      editor.editor?.chain().focus().setFontSize(`${newSize}px`).run()
    }
  )
  decreaseBtn.style.padding = "2px 4px"
  decreaseBtn.style.minWidth = "20px"
  decreaseBtn.style.fontSize = "12px"

  // Font size input
  const input = document.createElement("input")
  input.type = "number"
  input.min = FONTS.SIZE.MIN.toString()
  input.max = FONTS.SIZE.MAX.toString()
  input.placeholder = "Size"
  input.style.width = "40px"
  input.style.border = "none"
  input.style.textAlign = "center"
  input.style.fontSize = "12px"
  input.style.padding = "2px"
  input.style.backgroundColor = "transparent"

  input.addEventListener(EVENTS.CHANGE, (e) => {
    const size = parseInt(e.target.value)
    if (size && size >= FONTS.SIZE.MIN && size <= FONTS.SIZE.MAX) {
      editor.editor?.chain().focus().setFontSize(`${size}px`).run()
    }
  })

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      const size = parseInt(e.target.value)
      if (size && size >= FONTS.SIZE.MIN && size <= FONTS.SIZE.MAX) {
        editor.editor?.chain().focus().setFontSize(`${size}px`).run()
      }
    }
  })

  // Increase button
  const increaseBtn = createTableButton(
    "Increase Font Size",
    `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M12 5v14M5 12h14"/>
    </svg>`,
    () => {
      const input = container.querySelector("input")
      const currentSize = parseInt(input.value) || FONTS.SIZE.DEFAULT
      const newSize = Math.min(FONTS.SIZE.MAX, currentSize + FONTS.SIZE.STEP)
      input.value = newSize
      editor.editor?.chain().focus().setFontSize(`${newSize}px`).run()
    }
  )
  increaseBtn.style.padding = "2px 4px"
  increaseBtn.style.minWidth = "20px"
  increaseBtn.style.fontSize = "12px"

  container.appendChild(decreaseBtn)
  container.appendChild(input)
  container.appendChild(increaseBtn)

  return container
}
