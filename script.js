// DOM Elements
const canvas = document.getElementById('canvas');
const addTextButton = document.getElementById('addText');
const undoButton = document.getElementById('undo');
const redoButton = document.getElementById('redo');
const boldButton = document.getElementById('boldText');
const italicButton = document.getElementById('italicText');
const underlineButton = document.getElementById('underlineText');
const fontSelector = document.getElementById('fontSelector');
const fontSizeInput = document.getElementById('fontSize');
const alignLeftButton = document.getElementById('alignLeft');
const alignCenterButton = document.getElementById('alignCenter');
const alignRightButton = document.getElementById('alignRight');

// State
let textElements = []; // Array of all added text elements
let undoStack = []; // Stack to store canvas states for undo
let redoStack = []; // Stack to store canvas states for redo
let selectedElement = null; // Currently selected text element

// Helper Functions
function saveState() {
  // Save the current state of the canvas to the undo stack
  undoStack.push([...textElements.map(e => e.outerHTML)]);
  redoStack = []; // Clear redo stack on new actions
}

function restoreState(state) {
  // Clear the canvas
  canvas.innerHTML = '';
  textElements = []; // Reset textElements array
  
  // Reconstruct the canvas elements
  state.forEach(html => {
    const tempContainer = document.createElement('div');
    tempContainer.innerHTML = html;
    const element = tempContainer.firstChild;
    addTextListeners(element);
    canvas.appendChild(element);
    textElements.push(element); // Add to textElements array
  });
}

function setSelected(element) {
  if (selectedElement) {
    selectedElement.classList.remove('selected');
  }
  selectedElement = element;
  selectedElement.classList.add('selected');
}

function addTextListeners(element) {
  // Select the element on click
  element.addEventListener('mousedown', (e) => {
    setSelected(element);
    
    // Only start drag if it's not being edited
    if (!element.isContentEditable) {
      const rect = element.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const offsetY = e.clientY - rect.top;

      function onMouseMove(e) {
        // Calculate new position relative to canvas
        const canvasRect = canvas.getBoundingClientRect();
        const newX = e.clientX - canvasRect.left - offsetX;
        const newY = e.clientY - canvasRect.top - offsetY;
        
        // Apply new position
        element.style.left = `${newX}px`;
        element.style.top = `${newY}px`;
      }

      function onMouseUp() {
        saveState(); // Save the state after moving
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      }

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
      
      // Prevent text selection during drag
      e.preventDefault();
    }
  });

  // Allow editing text on double-click
  element.addEventListener('dblclick', () => {
    element.contentEditable = true;
    element.focus();
    
    function onBlur() {
      element.contentEditable = false;
      saveState();
      element.removeEventListener('blur', onBlur);
    }
    
    element.addEventListener('blur', onBlur);
  });
}
// Undo/Redo Functionality
undoButton.addEventListener('click', () => {
  if (undoStack.length > 0) {
    const currentState = textElements.map(e => e.outerHTML);
    redoStack.push(currentState); // Save current state to redo stack
    const prevState = undoStack.pop();
    restoreState(prevState);
  }
});

redoButton.addEventListener('click', () => {
  if (redoStack.length > 0) {
    const currentState = textElements.map(e => e.outerHTML);
    undoStack.push(currentState); // Save current state to undo stack
    const nextState = redoStack.pop();
    restoreState(nextState);
  }
});

// Add Text Functionality
addTextButton.addEventListener('click', () => {
  const textElement = document.createElement('div');
  textElement.textContent = 'Click here to write';
  textElement.classList.add('text-element');
  textElement.contentEditable = false; // Start as non-editable

  // Default styles
  textElement.style.position = 'absolute';
  textElement.style.left = '50px';
  textElement.style.top = '50px';
  textElement.style.fontSize = '20px';
  textElement.style.fontFamily = 'Arial';
  textElement.style.cursor = 'move'; // Add move cursor

  addTextListeners(textElement);

  canvas.appendChild(textElement);
  textElements.push(textElement);

  saveState();
});

// Text Styling
boldButton.addEventListener('click', () => {
  if (selectedElement) {
    saveState();
    selectedElement.style.fontWeight = selectedElement.style.fontWeight === 'bold' ? 'normal' : 'bold';
  }
});

italicButton.addEventListener('click', () => {
  if (selectedElement) {
    saveState();
    selectedElement.style.fontStyle = selectedElement.style.fontStyle === 'italic' ? 'normal' : 'italic';
  }
});

underlineButton.addEventListener('click', () => {
  if (selectedElement) {
    saveState();
    selectedElement.style.textDecoration = selectedElement.style.textDecoration === 'underline' ? 'none' : 'underline';
  }
});

// Font and Size
fontSelector.addEventListener('change', () => {
  if (selectedElement) {
    saveState();
    selectedElement.style.fontFamily = fontSelector.value;
  }
});

fontSizeInput.addEventListener('input', () => {
  if (selectedElement) {
    saveState();
    selectedElement.style.fontSize = `${fontSizeInput.value}px`;
  }
});

// Text Alignment
alignLeftButton.addEventListener('click', () => {
  if (selectedElement) {
    saveState();
    selectedElement.style.textAlign = 'left';
  }
});

alignCenterButton.addEventListener('click', () => {
  if (selectedElement) {
    saveState();
    selectedElement.style.textAlign = 'center';
  }
});

alignRightButton.addEventListener('click', () => {
  if (selectedElement) {
    saveState();
    selectedElement.style.textAlign = 'right';
  }
});

