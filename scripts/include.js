/**
 * Asynchronously includes HTML content into elements with the "w3-include-html" attribute.
 * 
 * This function looks for all elements in the DOM that have the "w3-include-html" attribute.
 * It fetches the content of the file specified by the attribute's value and injects it into the element.
 * Once the inclusion process is completed for all elements, the returned promise is resolved.
 */
function includeHTML() {
  return new Promise(async (resolve) => {
    const elements = document.querySelectorAll("[w3-include-html]");
    const fetchAndInclude = async (element) => {
      const file = element.getAttribute("w3-include-html");
      if (!file) return
      try {
        const response = await fetch(file);
        if (!response.ok) {
          throw new Error("Page not found.");
        }
        element.innerHTML = await response.text();
      } catch (error) {
        element.innerHTML = error.message;
      } finally {
        element.removeAttribute("w3-include-html");
      }
    };
    await Promise.all([...elements].map(fetchAndInclude));
    resolve();
  });
}