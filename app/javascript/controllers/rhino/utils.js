// @flow
// Shared utility functions for Rhino Editor plugins

import { CSS_CLASSES, ATTRIBUTES, UI_STYLES, HEADINGS } from "controllers/rhino/config"

// ID generation using counter instead of Math.random()
let idCounter = 0
const generateUniqueId = (prefix = "tooltip") => `${prefix}-${++idCounter}`

// Helper function to create tooltip element
const createTooltip = (text, id) => {
  const roleTooltip = document.createElement("role-tooltip")
  roleTooltip.id = id
  roleTooltip.textContent = text
  roleTooltip.setAttribute("slot", "tooltip")
  return roleTooltip
}

// Helper function to create table buttons with proper tooltip system
export const createTableButton = (title, svgIcon, clickHandler) => {
  const tooltipId = generateUniqueId("tooltip")

  // Create button following rhino pattern
  const button = document.createElement("button")
  button.type = "button"
  button.className = CSS_CLASSES.BUTTONS.TOOLBAR
  button.setAttribute(ATTRIBUTES.DOM_ROLE, "toolbar-item")
  button.setAttribute("tabindex", ATTRIBUTES.TABINDEX)
  button.setAttribute(ATTRIBUTES.TOOLTIP_ROLE, tooltipId)

  // Add SVG icon and tooltip to button
  button.innerHTML = svgIcon
  button.appendChild(createTooltip(title, tooltipId))

  button.addEventListener("click", (e) => {
    e.preventDefault()
    clickHandler()
  })

  return button
}

// Helper function to create container with standard styling
export const createToolContainer = (className, slot = ATTRIBUTES.SLOT) => {
  const container = document.createElement("div")
  container.className = className
  container.setAttribute("slot", slot)
  container.style.display = UI_STYLES.CONTAINER.DISPLAY
  container.style.gap = UI_STYLES.CONTAINER.GAP
  container.style.alignItems = UI_STYLES.CONTAINER.ALIGN_ITEMS
  return container
}

// Helper function to create dropdowns with proper tooltip system
export const createDropdown = (title, options, commandHandler, styleOptions = {}) => {
  // If renderWithFont or renderWithHeading is enabled, create a custom dropdown
  if (styleOptions.renderWithFont || styleOptions.renderWithHeading) {
    return createCustomStyledDropdown(title, options, commandHandler, styleOptions)
  }

  const select = document.createElement("select")
  select.className = CSS_CLASSES.DROPDOWNS.TOOLBAR_SELECT
  select.title = title

  const tooltipId = generateUniqueId("tooltip")
  select.setAttribute(ATTRIBUTES.TOOLTIP_ROLE, tooltipId)

  options.forEach((option) => {
    const optionEl = document.createElement("option")
    optionEl.value = option.value
    optionEl.textContent = option.label
    select.appendChild(optionEl)
  })

  select.addEventListener("change", (e) => {
    // Only trigger command if this is a user-initiated change
    if (!e.target.dataset.updating) {
      commandHandler(e.target.value)
    }
  })

  // Wrap select and tooltip in a container
  const container = document.createElement("div")
  container.style.position = "relative"
  container.appendChild(select)
  container.appendChild(createTooltip(title, tooltipId))

  return container
}

// Custom styled dropdown with proper font/heading rendering
const createCustomStyledDropdown = (title, options, commandHandler, styleOptions = {}) => {
  const container = document.createElement("div")
  container.className = CSS_CLASSES.DROPDOWNS.CUSTOM_FONT
  container.style.position = "relative"
  container.style.display = "inline-block"

  // Create button that shows current selection
  const button = document.createElement("button")
  button.type = "button"
  button.className = CSS_CLASSES.BUTTONS.CUSTOM_FONT
  button.style.minWidth = UI_STYLES.DROPDOWN.MIN_WIDTH
  button.style.textAlign = "left"
  button.style.padding = UI_STYLES.DROPDOWN.PADDING
  button.style.position = "relative"
  button.style.cursor = UI_STYLES.CURSOR.POINTER
  button.style.backgroundColor = "var(--rhino-toolbar-background, white)"
  button.style.border = "1px solid var(--rhino-border-color, #ccc)"
  button.style.borderRadius = UI_STYLES.DROPDOWN.BORDER_RADIUS

  // Add dropdown arrow
  const arrow = document.createElement("span")
  arrow.innerHTML = "▼"
  arrow.style.position = "absolute"
  arrow.style.right = "8px"
  arrow.style.top = "50%"
  arrow.style.transform = "translateY(-50%)"
  arrow.style.fontSize = "10px"
  arrow.style.pointerEvents = "none"
  arrow.style.color = "var(--rhino-button-text-color, #889)"
  button.appendChild(arrow)

  // Create tooltip
  const tooltipId = generateUniqueId("tooltip")
  button.setAttribute(ATTRIBUTES.TOOLTIP_ROLE, tooltipId)

  const roleTooltip = createTooltip(title, tooltipId)

  // Create dropdown menu
  const menu = document.createElement("div")
  menu.className = CSS_CLASSES.DROPDOWNS.CUSTOM_FONT_MENU
  menu.style.position = "absolute"
  menu.style.top = "100%"
  menu.style.left = "0"
  menu.style.minWidth = "150px"
  menu.style.maxHeight = UI_STYLES.DROPDOWN.MAX_HEIGHT
  menu.style.overflowY = "auto"
  menu.style.backgroundColor = "var(--rhino-toolbar-background, white)"
  menu.style.border = "1px solid var(--rhino-border-color, #ccc)"
  menu.style.borderRadius = UI_STYLES.DROPDOWN.BORDER_RADIUS
  menu.style.boxShadow = "0 2px 8px rgba(0,0,0,0.15)"
  menu.style.zIndex = UI_STYLES.Z_INDEX.DROPDOWN_MENU
  menu.style.display = "none"
  menu.style.marginTop = UI_STYLES.DROPDOWN.MENU_MARGIN_TOP

  // Create menu items
  options.forEach((option) => {
    const item = document.createElement("div")
    item.className = CSS_CLASSES.DROPDOWNS.CUSTOM_FONT_ITEM
    item.textContent = option.label
    item.dataset.value = option.value
    item.style.padding = UI_STYLES.DROPDOWN.ITEM_PADDING
    item.style.cursor = UI_STYLES.CURSOR.POINTER
    item.style.transition = "background-color 0.2s"

    // Apply styling based on options
    if (styleOptions.renderWithFont) {
      item.style.fontFamily = option.value
      item.style.fontSize = "14px"
    } else if (styleOptions.renderWithHeading) {
      // Apply heading styles
      if (option.value === "normal") {
        item.style.fontSize = "14px"
        item.style.fontWeight = "normal"
      } else {
        const level = parseInt(option.value)
        if (level >= 1 && level <= 6) {
          item.style.fontSize = HEADINGS.FONT_SIZES.DISPLAY[level] || "14px"
          item.style.fontWeight = "bold"
        }
      }
    } else {
      item.style.fontSize = "14px"
    }

    item.addEventListener("mouseenter", () => {
      item.style.backgroundColor = "var(--rhino-hover-background, #f0f0f0)"
    })

    item.addEventListener("mouseleave", () => {
      item.style.backgroundColor = "transparent"
    })

    item.addEventListener("click", (e) => {
      e.stopPropagation()
      updateButtonText(option.label, option.value)
      menu.style.display = "none"
      commandHandler(option.value)
    })

    menu.appendChild(item)
  })

  // Function to update button text and styling
  const updateButtonText = (label, value) => {
    button.childNodes[0].textContent = label

    if (styleOptions.renderWithFont) {
      button.style.fontFamily = value
    } else if (styleOptions.renderWithHeading) {
      // Apply heading styles to button
      if (value === "normal") {
        button.style.fontSize = "13px"
        button.style.fontWeight = "normal"
      } else {
        const level = parseInt(value)
        if (level >= 1 && level <= 6) {
          button.style.fontSize = HEADINGS.FONT_SIZES.BUTTON[level] || "13px"
          button.style.fontWeight = "bold"
        }
      }
    }
  }

  // Set initial value
  const buttonText = document.createTextNode(options[0].label)
  button.insertBefore(buttonText, arrow)

  if (styleOptions.renderWithFont) {
    button.style.fontFamily = options[0].value
  } else if (styleOptions.renderWithHeading) {
    // Set initial heading style
    updateButtonText(options[0].label, options[0].value)
  }

  // Menu click handler is now defined above

  // Close menu when clicking outside or scrolling (but not inside the menu)
  const closeMenu = (e) => {
    // Don't close if scrolling within the menu itself
    if (e && e.type === "scroll" && menu.contains(e.target)) {
      return
    }
    menu.style.display = "none"
  }

  // Close on outside click
  document.addEventListener("click", (e) => {
    if (!container.contains(e.target) && !menu.contains(e.target)) {
      closeMenu()
    }
  })

  // Close on page scroll (but not menu scroll)
  document.addEventListener(
    "scroll",
    (e) => {
      if (!menu.contains(e.target)) {
        closeMenu(e)
      }
    },
    true
  )

  window.addEventListener("resize", closeMenu)

  // Add select element for programmatic updates (hidden but accessible)
  const hiddenSelect = document.createElement("select")
  hiddenSelect.style.position = "absolute"
  hiddenSelect.style.opacity = "0"
  hiddenSelect.style.pointerEvents = "none"
  hiddenSelect.style.width = "1px"
  hiddenSelect.style.height = "1px"
  hiddenSelect.className = CSS_CLASSES.DROPDOWNS.HIDDEN_SELECT
  options.forEach((option) => {
    const optionEl = document.createElement("option")
    optionEl.value = option.value
    optionEl.textContent = option.label
    hiddenSelect.appendChild(optionEl)
  })

  // Override select's dataset.updating behavior
  Object.defineProperty(hiddenSelect, "dataset", {
    get() {
      return {
        updating: false,
      }
    },
  })

  // When hidden select changes, update the custom dropdown
  hiddenSelect.addEventListener("change", (e) => {
    const option = options.find((o) => o.value === e.target.value)
    if (option) {
      updateButtonText(option.label, option.value)
    }
  })

  // Append menu to document body to avoid layout issues
  document.body.appendChild(menu)

  // Update menu positioning when button is clicked
  const updateMenuPosition = () => {
    const rect = button.getBoundingClientRect()
    menu.style.position = "fixed"
    menu.style.top = rect.bottom + "px"
    menu.style.left = rect.left + "px"
    menu.style.width = rect.width + "px"
  }

  // Update button click handler to position menu correctly
  button.addEventListener("click", (e) => {
    e.stopPropagation()
    const isOpen = menu.style.display !== "none"
    if (isOpen) {
      menu.style.display = "none"
    } else {
      updateMenuPosition()
      menu.style.display = "block"
    }
  })

  container.appendChild(button)
  container.appendChild(roleTooltip)
  container.appendChild(hiddenSelect)

  // Make querySelector work for the font state updates
  container.querySelector = (selector) => {
    if (selector === "select") {
      return hiddenSelect
    }
    return Document.prototype.querySelector.call(this, selector)
  }

  return container
}
