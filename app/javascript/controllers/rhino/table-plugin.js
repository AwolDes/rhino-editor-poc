// Table plugin for Rhino Editor
// @flow
import { Table } from "@tiptap/extension-table"
import { TableRow } from "@tiptap/extension-table-row"
import { TableCell } from "@tiptap/extension-table-cell"
import { TableHeader } from "@tiptap/extension-table-header"
import { createTableButton, createToolContainer } from "controllers/rhino/utils"
import { TABLE, CSS_CLASSES, TIMEOUTS } from "controllers/rhino/config"
import { attachEditorListeners, EVENT_CONFIGS } from "controllers/rhino/editor-events"

export const addTableExtensions = (rhinoEditor) => {
  // Table extensions
  rhinoEditor.addExtensions(
    Table.configure({
      resizable: false,
      HTMLAttributes: {
        class: CSS_CLASSES.TABLE.RHINO_TABLE,
      },
    })
  )
  rhinoEditor.addExtensions(TableRow)
  rhinoEditor.addExtensions(TableHeader)
  rhinoEditor.addExtensions(TableCell)
}

// Extract table detection logic into separate function
const detectIfInTable = (editor) => {
  if (!editor.editor) return false

  try {
    const { selection } = editor.editor.state
    const { $from } = selection

    // Check if cursor is inside a table - walk up the node tree
    for (let depth = 0; depth <= TABLE.MAX_DEPTH_CHECK; depth++) {
      const node = $from.node(-depth)
      if (node && TABLE.NODE_TYPES.includes(node.type.name)) {
        return true
      }
    }

    // Fallback: DOM-based detection
    const domNode = editor.editor.view.dom.querySelector(".ProseMirror")
    const focusedElement = domNode?.contains(document.activeElement) ? document.activeElement : null
    return focusedElement?.closest("table") !== null
  } catch (error) {
    return false // Fallback to false on any error
  }
}

// Create individual table command buttons
const createInsertTableButton = (editor) =>
  createTableButton("Insert Table", TABLE.ICONS.INSERT_TABLE, () => {
    if (editor.editor?.commands?.insertTable) {
      editor.editor
        .chain()
        .insertTable({
          rows: TABLE.DEFAULT_DIMENSIONS.ROWS,
          cols: TABLE.DEFAULT_DIMENSIONS.COLS,
          withHeaderRow: TABLE.DEFAULT_DIMENSIONS.WITH_HEADER,
        })
        .insertContent("<p></p>")
        .focus()
        .run()
    }
  })

const createAddColumnBeforeButton = (editor) =>
  createTableButton("Add Column Before", TABLE.ICONS.ADD_COLUMN_BEFORE, () => {
    editor.editor?.chain().focus().addColumnBefore().run()
  })

const createAddColumnAfterButton = (editor) =>
  createTableButton("Add Column After", TABLE.ICONS.ADD_COLUMN_AFTER, () => {
    editor.editor?.chain().focus().addColumnAfter().run()
  })

const createDeleteColumnButton = (editor) =>
  createTableButton("Delete Column", TABLE.ICONS.DELETE_COLUMN, () => {
    editor.editor?.chain().focus().deleteColumn().run()
  })

const createAddRowBeforeButton = (editor) =>
  createTableButton("Add Row Before", TABLE.ICONS.ADD_ROW_BEFORE, () => {
    editor.editor?.chain().focus().addRowBefore().run()
  })

const createAddRowAfterButton = (editor) =>
  createTableButton("Add Row After", TABLE.ICONS.ADD_ROW_AFTER, () => {
    editor.editor?.chain().focus().addRowAfter().run()
  })

const createDeleteRowButton = (editor) =>
  createTableButton("Delete Row", TABLE.ICONS.DELETE_ROW, () => {
    editor.editor?.chain().focus().deleteRow().run()
  })

// Extract table button creation and event listener setup
const createTableButtons = (editor) => [
  createInsertTableButton(editor),
  createAddColumnBeforeButton(editor),
  createAddColumnAfterButton(editor),
  createDeleteColumnButton(editor),
  createAddRowBeforeButton(editor),
  createAddRowAfterButton(editor),
  createDeleteRowButton(editor),
]

const attachTableEventListeners = (editor, tableButtonsContainer) => {
  const checkTableSelection = () => {
    const isInTable = detectIfInTable(editor)
    tableButtonsContainer.style.display = isInTable ? "flex" : "none"
  }

  attachEditorListeners(editor, checkTableSelection, {
    ...EVENT_CONFIGS.IMMEDIATE,
    initializationDelay: TIMEOUTS.STARTUP_DELAY,
  })
}

export const addTableButtonToEditor = (editor) => {
  // Check if buttons already exist to prevent duplication
  if (editor.querySelector(`.${CSS_CLASSES.CONTAINERS.TABLE_BUTTONS}`)) {
    return
  }

  // Add table management buttons (columns and rows)
  addTableManagementButtons(editor)
}

const addTableManagementButtons = (editor) => {
  // Create a container for table-specific buttons
  const tableButtonsContainer = createToolContainer(CSS_CLASSES.CONTAINERS.TABLE_BUTTONS)
  tableButtonsContainer.style.display = "flex" // Always visible for testing

  // Create and add all table buttons
  const tableButtons = createTableButtons(editor)
  tableButtons.forEach((button) => {
    tableButtonsContainer.appendChild(button)
  })

  editor.appendChild(tableButtonsContainer)
  attachTableEventListeners(editor, tableButtonsContainer)
}
