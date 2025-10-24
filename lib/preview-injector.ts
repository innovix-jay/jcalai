// Preview Inspector Script
// This script gets injected into the preview iframe to enable element selection and inspection

export const inspectorScript = `
(function() {
  let selectedElement = null;
  let overlay = null;
  let isInspecting = false;

  // Create overlay element for highlighting
  function createOverlay() {
    if (overlay) return overlay;
    
    overlay = document.createElement('div');
    overlay.id = 'jcal-inspector-overlay';
    overlay.style.cssText = \`
      position: absolute;
      border: 2px solid #6366f1;
      background: rgba(99, 102, 241, 0.1);
      pointer-events: none;
      z-index: 999999;
      transition: all 0.15s ease;
      box-shadow: 0 0 0 1px rgba(99, 102, 241, 0.2);
    \`;
    document.body.appendChild(overlay);
    return overlay;
  }

  // Get element's XPath
  function getXPath(element) {
    if (element.id) return \`//*[@id="\${element.id}"]\`;
    if (element === document.body) return '/html/body';
    
    let ix = 0;
    const siblings = element.parentNode?.childNodes || [];
    for (let i = 0; i < siblings.length; i++) {
      const sibling = siblings[i];
      if (sibling === element) {
        const parent = element.parentNode;
        return getXPath(parent) + '/' + element.tagName.toLowerCase() + '[' + (ix + 1) + ']';
      }
      if (sibling.nodeType === 1 && sibling.tagName === element.tagName) {
        ix++;
      }
    }
    return '';
  }

  // Get computed styles as object
  function getComputedStyles(element) {
    const computed = window.getComputedStyle(element);
    const styles = {};
    
    // Get important style properties
    const props = [
      'display', 'position', 'width', 'height',
      'margin', 'marginTop', 'marginRight', 'marginBottom', 'marginLeft',
      'padding', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
      'fontSize', 'fontWeight', 'fontFamily', 'lineHeight',
      'color', 'backgroundColor',
      'border', 'borderRadius',
      'flexDirection', 'justifyContent', 'alignItems',
      'gridTemplateColumns', 'gridTemplateRows',
      'zIndex', 'opacity', 'transform'
    ];
    
    props.forEach(prop => {
      styles[prop] = computed.getPropertyValue(prop);
    });
    
    return styles;
  }

  // Highlight element on hover
  document.addEventListener('mousemove', (e) => {
    if (e.altKey || isInspecting) {
      const element = e.target;
      if (!element || element === overlay) return;
      
      const overlayEl = createOverlay();
      const rect = element.getBoundingClientRect();
      
      overlayEl.style.left = (rect.left + window.scrollX) + 'px';
      overlayEl.style.top = (rect.top + window.scrollY) + 'px';
      overlayEl.style.width = rect.width + 'px';
      overlayEl.style.height = rect.height + 'px';
      overlayEl.style.display = 'block';
      
      // Add label
      overlayEl.innerHTML = \`
        <div style="position: absolute; top: -24px; left: 0; 
                    background: #6366f1; color: white; padding: 2px 8px; 
                    border-radius: 4px; font-size: 11px; font-family: monospace;">
          \${element.tagName.toLowerCase()}\${element.className ? '.' + element.className.split(' ')[0] : ''}
        </div>
      \`;
    } else {
      if (overlay) overlay.style.display = 'none';
    }
  });

  // Select element on Alt+Click
  document.addEventListener('click', (e) => {
    if (e.altKey || isInspecting) {
      e.preventDefault();
      e.stopPropagation();
      
      selectedElement = e.target;
      if (!selectedElement) return;
      
      // Get element data
      const elementData = {
        id: selectedElement.id,
        tagName: selectedElement.tagName.toLowerCase(),
        className: selectedElement.className,
        textContent: selectedElement.textContent?.substring(0, 100),
        innerHTML: selectedElement.innerHTML?.substring(0, 200),
        styles: getComputedStyles(selectedElement),
        attributes: Object.fromEntries(
          Array.from(selectedElement.attributes).map(attr => [attr.name, attr.value])
        ),
        xpath: getXPath(selectedElement),
        rect: selectedElement.getBoundingClientRect()
      };

      // Highlight selected element with different color
      if (overlay) {
        overlay.style.borderColor = '#8b5cf6';
        overlay.style.background = 'rgba(139, 92, 246, 0.2)';
      }

      // Send to parent
      window.parent.postMessage({
        type: 'element-selected',
        element: elementData
      }, '*');
      
      console.log('[Inspector] Element selected:', elementData);
    }
  });

  // Receive style updates from parent
  window.addEventListener('message', (event) => {
    const { type, data } = event.data;
    
    if (type === 'update-element-style') {
      const { xpath, property, value } = data;
      const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
      const element = result.singleNodeValue;
      
      if (element) {
        element.style[property] = value;
        console.log('[Inspector] Style updated:', property, '=', value);
      }
    }
    
    if (type === 'toggle-inspector') {
      isInspecting = data.enabled;
      console.log('[Inspector] Mode:', isInspecting ? 'ON' : 'OFF');
      if (!isInspecting && overlay) {
        overlay.style.display = 'none';
      }
    }

    if (type === 'update-element-content') {
      const { xpath, content } = data;
      const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
      const element = result.singleNodeValue;
      
      if (element) {
        element.textContent = content;
        console.log('[Inspector] Content updated');
      }
    }
  });

  // Keyboard shortcut to toggle inspector
  document.addEventListener('keydown', (e) => {
    if (e.altKey && e.key === 'i') {
      e.preventDefault();
      isInspecting = !isInspecting;
      window.parent.postMessage({
        type: 'inspector-toggled',
        enabled: isInspecting
      }, '*');
    }
  });

  console.log('[Inspector] Initialized. Press Alt+I to toggle, Alt+Click to select elements');
})();
`;

export function injectInspectorScript(iframeWindow: Window) {
  if (!iframeWindow) return;
  
  try {
    const script = iframeWindow.document.createElement('script');
    script.textContent = inspectorScript;
    iframeWindow.document.head.appendChild(script);
    console.log('[Inspector] Script injected successfully');
  } catch (error) {
    console.error('[Inspector] Failed to inject script:', error);
  }
}
