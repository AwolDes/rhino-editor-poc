// Alignment tools plugin for Rhino Editor
// @flow
import TextAlign from "@tiptap/extension-text-align"
import { createTableButton, createToolContainer } from "controllers/rhino/utils"
import { ALIGNMENTS, CSS_CLASSES } from "controllers/rhino/config"
import { attachEditorListeners, EVENT_CONFIGS } from "controllers/rhino/editor-events"

export function addAlignmentExtensions(rhinoEditor) {
  // Text alignment extension
  rhinoEditor.addExtensions(
    TextAlign.configure({
      types: ["heading", "paragraph"],
      alignments: ALIGNMENTS.OPTIONS,
      defaultAlignment: ALIGNMENTS.DEFAULT,
    })
  )
}

function updateAlignmentState(editor, alignButtons) {
  if (!editor.editor) return

  try {
    alignButtons.forEach((btn) => {
      const alignment = btn.dataset.alignment
      const isActive = editor.editor.isActive({ textAlign: alignment })
      btn.setAttribute("aria-pressed", isActive.toString())
    })
  } catch (error) {
    // Silently fail - errors will be handled in Phase 7
  }
}

function attachAlignmentEventListeners(editor, alignButtons) {
  const updateState = () => updateAlignmentState(editor, alignButtons)
  attachEditorListeners(editor, updateState, EVENT_CONFIGS.IMMEDIATE)
}

export function createAlignmentTools(editor) {
  const alignContainer = createToolContainer(CSS_CLASSES.CONTAINERS.ALIGNMENT_TOOLS, "after-strike-button")

  const alignButtons = []
  ALIGNMENTS.BUTTONS.forEach((alignment) => {
    const button = createTableButton(alignment.title, alignment.icon, () => {
      editor.editor?.chain().focus().setTextAlign(alignment.value).run()
    })
    button.dataset.alignment = alignment.value
    button.classList.add(CSS_CLASSES.BUTTONS.ALIGNMENT)
    alignButtons.push(button)
    alignContainer.appendChild(button)
  })

  editor.appendChild(alignContainer)
  attachAlignmentEventListeners(editor, alignButtons)
}
