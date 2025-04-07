
// include.js
/**
 * Asynchronously includes HTML content into elements with the "w3-include-html" attribute.
 * 
 * This function looks for all elements in the DOM that have the "w3-include-html" attribute.
 * It fetches the content of the file specified by the attribute's value and injects it into the element.
 * Once the inclusion process is completed for all elements, the returned promise is resolved.
 * 
 * @returns {Promise<void>} A promise that resolves when all elements are processed.
 */
function includeHTML() {
  return new Promise(async (resolve) => {
// Select all elements with the "w3-include-html" attribute
    const elements = document.querySelectorAll("[w3-include-html]");
/**
 * Fetches the specified file and includes its content in the given element.
 * 
 * @param {HTMLElement} element - The DOM element to include the content into.
 * @returns {Promise<void>} A promise that resolves when the content is fetched and included.
 */
  const fetchAndInclude = async (element) => {
    const file = element.getAttribute("w3-include-html");
    if (!file) return
     // Fetch the file's content
    try {
      const response = await fetch(file);
      if (!response.ok) {
        throw new Error("Page not found.");
      }
      // Inject the content into the element
      element.innerHTML = await response.text();
    } catch (error) {
      // Display the error message in the element
      element.innerHTML = error.message;
    } finally {
      // Remove the "w3-include-html" attribute from the element
      element.removeAttribute("w3-include-html");
    }
  };
  // Wait for all elements to be processed
    await Promise.all([...elements].map(fetchAndInclude));
    resolve(); // Resolve the promise when all inclusions are complete  
  });
}