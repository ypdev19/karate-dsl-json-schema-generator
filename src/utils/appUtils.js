/**
 * App Utilities - Extracted from App.jsx
 * Handles demo data, clipboard operations, and toast logic.
 * Performance: useCallback, centralized clipboard handling
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
  export const triggerToast = (setShowToast) => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 1800);
  };
  
  /**
   * Copy to clipboard with error handling
   */
  export const copyToClipboard = async (text, setError, triggerToastFn) => {
    try {
      await navigator.clipboard.writeText(text);
      triggerToastFn();
    } catch {
      setError('Failed to copy to clipboard');
    }
  };