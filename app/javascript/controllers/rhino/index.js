// Import plugin modules
import { addTableExtensions, addTableButtonToEditor } from "controllers/rhino/table-plugin"
import { addFontExtensions, createFontTools } from "controllers/rhino/font-tools-plugin"
import { addColorExtensions, createColorTools } from "controllers/rhino/color-picker-plugin"
import { addAlignmentExtensions, createAlignmentTools } from "controllers/rhino/alignment-tools-plugin"
import { addHeadingExtensions, createHeadingTools } from "controllers/rhino/heading-tools-plugin"
import { CSS_CLASSES, EVENTS } from "controllers/rhino/config"

// Add all TipTap extensions to the editor
const addRhinoExtensions = (rhinoEditor) => {
  addTableExtensions(rhinoEditor)
  addFontExtensions(rhinoEditor)
  addColorExtensions(rhinoEditor)
  addAlignmentExtensions(rhinoEditor)
  addHeadingExtensions(rhinoEditor)

  // Configure starter kit options
  rhinoEditor.starterKitOptions = {
    ...rhinoEditor.starterKitOptions,
    // Do not remove the code item - it breaks the editor
    // code: false,
    codeBlock: false,
  }
  rhinoEditor.rebuildEditor()
}

// Add all UI tools to the editor
const addRhinoTools = (rhinoEditor) => {
  addFormattingTools(rhinoEditor)
  addTableButtonToEditor(rhinoEditor)
}

const initializeRhinoEditor = (e) => {
  const rhinoEditor = e.target
  if (!rhinoEditor) return

  try {
    addRhinoExtensions(rhinoEditor)
    addRhinoTools(rhinoEditor)
  } catch (error) {
    // Silently fail - proper error handling can be added later
  }
}

// Add formatting tools to the editor
const addFormattingTools = (editor) => {
  // Check if any formatting tools already exist
  const existingContainers = [
    `.${CSS_CLASSES.CONTAINERS.FONT_TOOLS}`,
    `.${CSS_CLASSES.CONTAINERS.ALIGNMENT_TOOLS}`,
    `.${CSS_CLASSES.CONTAINERS.HEADING_TOOLS}`,
  ]

  if (existingContainers.some((selector) => editor.querySelector(selector))) {
    return
  }

  // Create containers for different tool groups using plugin functions
  createHeadingTools(editor)
  createFontTools(editor)
  createColorTools(editor)
  createAlignmentTools(editor)
}

const run = () => {
  console.log("Rhino editor running")
  
  // Check if rhino editors already exist on the page
  const existingEditors = document.querySelectorAll('rhino-editor')
  if (existingEditors.length > 0) {
    console.log("Found existing rhino editors, initializing them")
    existingEditors.forEach(editor => {
      initializeRhinoEditor({ target: editor })
    })
  }
  
  // Also listen for future editors
  document.addEventListener(EVENTS.RHINO_BEFORE_INITIALIZE, initializeRhinoEditor)
}

export { run }