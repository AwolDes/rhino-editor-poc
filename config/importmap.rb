# Pin npm packages by running ./bin/importmap

pin "application"
pin "@hotwired/turbo-rails", to: "turbo.min.js"
pin "@hotwired/stimulus", to: "stimulus.min.js"
pin "@hotwired/stimulus-loading", to: "stimulus-loading.js"
pin "@rails/actiontext", to: "actiontext.esm.js"
pin "rhino-editor", to: "rhino-editor.js"
pin_all_from "app/javascript/controllers", under: "controllers"
pin_all_from "app/javascript/controllers/rhino", under: "controllers/rhino"
pin "trix"
pin "@rails/actiontext", to: "actiontext.esm.js"
pin "@tiptap/extension-heading", to: "@tiptap--extension-heading.js" # @3.4.1
pin "@tiptap/extension-table", to: "@tiptap--extension-table.js" # @3.4.1
pin "@tiptap/extension-table-cell", to: "@tiptap--extension-table-cell.js" # @3.4.1
pin "@tiptap/extension-table-header", to: "@tiptap--extension-table-header.js" # @3.4.1
pin "@tiptap/extension-table-row", to: "@tiptap--extension-table-row.js" # @3.4.1
pin "@tiptap/extension-text-align", to: "@tiptap--extension-text-align.js" # @3.4.1
pin "@tiptap/extension-text-style", to: "@tiptap--extension-text-style.js" # @3.4.1
pin "@tiptap/core", to: "@tiptap--core.js" # @3.4.1
pin "@tiptap/pm/commands", to: "@tiptap--pm--commands.js" # @3.4.1
pin "@tiptap/pm/keymap", to: "@tiptap--pm--keymap.js" # @3.4.1
pin "@tiptap/pm/model", to: "@tiptap--pm--model.js" # @3.4.1
pin "@tiptap/pm/schema-list", to: "@tiptap--pm--schema-list.js" # @3.4.1
pin "@tiptap/pm/state", to: "@tiptap--pm--state.js" # @3.4.1
pin "@tiptap/pm/tables", to: "@tiptap--pm--tables.js" # @3.4.1
pin "@tiptap/pm/transform", to: "@tiptap--pm--transform.js" # @3.4.1
pin "@tiptap/pm/view", to: "@tiptap--pm--view.js" # @3.4.1
pin "orderedmap" # @2.1.1
pin "prosemirror-commands" # @1.7.1
pin "prosemirror-keymap" # @1.2.3
pin "prosemirror-model" # @1.25.3
pin "prosemirror-schema-list" # @1.5.1
pin "prosemirror-state" # @1.4.3
pin "prosemirror-tables" # @1.8.1
pin "prosemirror-transform" # @1.10.4
pin "prosemirror-view" # @1.41.0
pin "w3c-keyname" # @2.2.8
