import { Controller } from "@hotwired/stimulus"
import { run } from "controllers/rhino"

export default class extends Controller {
  connect() {
    console.log("Rhino controller connected")
    // Load all ES5 modules in order (they register themselves on window)
    // The modules are loaded via import maps and self-register
    run()
  }
}