/**
 * App Utilities - Demo data, clipboard, toast with i18n support
 */

/**
 * Demo datasets
 */
export const DEMO_DATA = {
  base: {
    id: 101,
    name: "Alice",
    active: true,
    roles: ["admin", "user"],
    user: { email: "alice@example.com" }
  },
  advanced: {
    id: 101,
    name: "Alice",
    active: true,
    user: {
      email: "alice@example.com",
      profile: {
        age: 30,
        verified: true
      }
    },
    orders: [{
      orderId: 1,
      amount: 99.99
    }]
  }
};

/**
 * Load demo data
 */
export const loadDemo = (type, setInputJson, setOutputSchema, setError, setIsInputError) => {
  const demoData = DEMO_DATA[type === 'advance' ? 'advanced' : 'base'];
  setInputJson(JSON.stringify(demoData, null, 2));
  setOutputSchema('');
  setError(null);
  setIsInputError(false);
};

/**
 * Toast trigger utility
 */
export const triggerToast = (setShowToast, message = 'Copied to clipboard!') => {
  setShowToast(message);  // Pass message directly
  setTimeout(() => setShowToast(false), 2000);
};

/**
 * Copy to clipboard with fallback - TOAST OPTIONAL
 */
export const copyToClipboard = async (text, setError, triggerToastFn, successMsg) => {
  if (!text) return;
  
  try {
    await navigator.clipboard.writeText(text);
    if (triggerToastFn) {  // ✅ OPTIONAL toast
      triggerToastFn(successMsg || 'Copied!');
    }
  } catch {
    // Fallback
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    if (triggerToastFn) {  // ✅ OPTIONAL toast
      triggerToastFn(successMsg || 'Copied!');
    }
  }
};

/**
 * 🆕 Download schema as JSON file
 * Filename: "karate-schema.json"
 */
export const downloadSchema = (schemaJson) => {
  if (!schemaJson) return;
  
  const blob = new Blob([schemaJson], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'karate-schema.json'; // ✅ Perfect filename
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};