# Rive Beat Wishlist Animation Integration Guide

## Overview
This guide explains how to integrate the "beat" wishlist animation from a Rive file into your project. The animation provides an engaging heart-beating effect when users interact with wishlist buttons.

## Prerequisites
- The `wishlist.riv` file (contains the animation assets)
- Basic knowledge of HTML, CSS, and JavaScript
- Internet connection for CDN resources

## What You Get
The beat animation includes:
- A heart icon that "beats" when clicked
- Smooth state transitions between selected/unselected states
- Customizable colors (fill, outline, background)
- Responsive sizing options
- Full accessibility support

## Quick Start

### 1. Include Required Dependencies
Add the Rive runtime to your HTML:

```html
<script src="https://unpkg.com/@rive-app/canvas"></script>
```

### 2. Basic HTML Structure
```html
<button class="wishlist-button" id="beatButton" aria-label="Add to wishlist" aria-pressed="false" type="button">
  <canvas class="wishlist-canvas" id="canvas-beat" aria-hidden="true"></canvas>
</button>
```

### 3. CSS Styling
```css
.wishlist-button {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: white;
  border: none;
  padding: 0;
  position: relative;
  cursor: pointer;
  outline: none;
  transition: all 0.2s ease;
}

.wishlist-button:focus,
.wishlist-button:hover {
  outline: none;
  box-shadow: 0 0 0 1px white, 0 0 0 4px #00539F;
}

.wishlist-canvas {
  width: 36px;
  height: 36px;
  display: block;
  border-radius: 50%;
  pointer-events: none;
}
```

### 4. JavaScript Implementation
```javascript
// Store button state
let buttonState = null;
let riveInstance = null;

// Color conversion utility
function hexToRgba(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (255 << 24) | (r << 16) | (g << 8) | b;
}

// Create the Rive instance
function initializeBeatAnimation() {
  riveInstance = new rive.Rive({
    src: './wishlist.riv', // Path to your .riv file
    canvas: document.getElementById('canvas-beat'),
    autoplay: true,
    autoBind: true,
    artboard: 'beat', // Specific artboard for beat animation
    stateMachines: 'beat', // State machine name
    onLoad: () => {
      console.log('Beat animation loaded');
      
      const vmi = riveInstance.viewModelInstance;
      if (vmi) {
        // Get the IsSelected boolean property
        buttonState = vmi.boolean('IsSelected');
        buttonState.value = false; // Initial state
        
        // Set initial colors (optional)
        setColors('#FFFFFF', '#00539F', '#FFD2C3');
      }
      
      riveInstance.resizeDrawingSurfaceToCanvas();
    },
    onLoadError: (error) => {
      console.error('Failed to load beat animation:', error);
    }
  });
}

// Handle button click
function handleWishlistClick() {
  if (buttonState) {
    const currentValue = buttonState.value;
    const newValue = !currentValue;
    buttonState.value = newValue;
    
    // Update accessibility
    const button = document.getElementById('beatButton');
    const ariaLabel = newValue ? 'Remove from wishlist' : 'Add to wishlist';
    button.setAttribute('aria-label', ariaLabel);
    button.setAttribute('aria-pressed', newValue.toString());
    
    console.log('Wishlist state:', newValue ? 'Added' : 'Removed');
  }
}

// Set custom colors (optional)
function setColors(fillColor, outlineColor, backgroundColor) {
  if (riveInstance && riveInstance.viewModelInstance) {
    const vmi = riveInstance.viewModelInstance;
    
    try {
      const fillProp = vmi.color('Fill');
      const outlineProp = vmi.color('Outline');
      const backgroundProp = vmi.color('Background');
      
      if (fillProp) fillProp.value = hexToRgba(fillColor);
      if (outlineProp) outlineProp.value = hexToRgba(outlineColor);
      if (backgroundProp) backgroundProp.value = hexToRgba(backgroundColor);
    } catch (error) {
      console.warn('Error setting colors:', error);
    }
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initializeBeatAnimation();
  
  // Add click handler
  document.getElementById('beatButton').addEventListener('click', handleWishlistClick);
});
```

## Customization Options

### Size Variations
To create a larger button (72x72px):
```css
.wishlist-button.large {
  width: 72px;
  height: 72px;
}

.wishlist-canvas.large {
  width: 72px;
  height: 72px;
}
```

Update canvas dimensions in JavaScript:
```javascript
const canvas = document.getElementById('canvas-beat');
canvas.width = 72;
canvas.height = 72;
if (riveInstance) {
  riveInstance.resizeDrawingSurfaceToCanvas();
}
```

### Color Presets
Common color combinations:
```javascript
// Blue theme (default)
setColors('#FFFFFF', '#00539F', '#00539F');

// Red theme
setColors('#FFFFFF', '#E81C2D', '#E81C2D');

// Neutral theme
setColors('#FFFFFF', '#333333', '#333333');
```

### Advanced Features

#### Multiple Buttons
To add multiple beat animations:
```javascript
function createBeatButton(canvasId, buttonId) {
  return new rive.Rive({
    src: './wishlist.riv',
    canvas: document.getElementById(canvasId),
    autoplay: true,
    autoBind: true,
    artboard: 'beat',
    stateMachines: 'beat',
    onLoad: () => {
      // Store reference for this specific button
      // ... initialization code
    }
  });
}
```

#### State Persistence
To remember wishlist state:
```javascript
// Save state
function saveWishlistState(itemId, isSelected) {
  localStorage.setItem(`wishlist_${itemId}`, isSelected.toString());
}

// Load state
function loadWishlistState(itemId) {
  const saved = localStorage.getItem(`wishlist_${itemId}`);
  return saved === 'true';
}
```

## Accessibility Features
The implementation includes:
- ARIA labels that update based on state
- Keyboard navigation support
- Screen reader announcements
- High contrast focus indicators
- Semantic button markup

## Browser Support
- Modern browsers supporting Canvas API
- IE11+ (with Rive polyfills)
- Mobile browsers (iOS Safari 12+, Chrome 70+)

## File Structure
Ensure your project includes:
```
your-project/
├── wishlist.riv          # Animation file (copy this)
├── index.html            # Your HTML file
├── styles.css            # Your CSS file
└── script.js             # Your JavaScript file
```

## Troubleshooting

### Animation Not Loading
- Verify the path to `wishlist.riv` is correct
- Check browser console for errors
- Ensure Rive CDN is accessible

### Colors Not Changing
- Verify the artboard contains 'Fill', 'Outline', and 'Background' color properties
- Check that hex colors are valid (include #)
- Ensure the Rive instance has loaded before setting colors

### Button Not Responding
- Verify the state machine contains an 'IsSelected' boolean input
- Check that the artboard name is exactly 'beat'
- Ensure click handlers are attached after DOM load

## Performance Tips
- Reuse Rive instances when possible
- Call `resizeDrawingSurfaceToCanvas()` after size changes
- Consider lazy loading for multiple animations
- Use `autoplay: false` and manual control for better performance

## Example Implementation
See the complete working example in the original `index.html` file, specifically the "Beat" button implementation (lines 334-341 and 751-753).

---

*Note: This animation requires the specific `wishlist.riv` file that contains the 'beat' artboard and state machine. Make sure to copy this file to your project directory.*
