let PATH_TAG_MAP = null;

/**
 * Load mapping properties file from the server
 * @returns {Promise<void>}
 */
async function loadMapping() {
    if (PATH_TAG_MAP) return; // already loaded

    const response = await fetch('/domain_mapping.properties'); // adjust path if needed
    const text = await response.text();

    PATH_TAG_MAP = {};

    text.split("\n").forEach(line => {
        line = line.trim();
        if (!line || line.startsWith("#")) return; // skip empty lines and comments

        const [key, value] = line.split("=", 2);
        if (key && value) {
            PATH_TAG_MAP[key.trim()] = value.trim();
        }
    });
}

/**
 * Get mapped domain tag for a given path
 * @param {string} requestPath
 * @returns {Promise<string|undefined>}
 */
async function getDomain(requestPath) {
    await loadMapping();

    // simple exact match for now
    return PATH_TAG_MAP[requestPath];
}

document.addEventListener("DOMContentLoaded", async () => {

    const codeItems = document.querySelectorAll("code");

    for (const code of codeItems) {
        if (code && (code.textContent.startsWith("GET ") || code.textContent.startsWith("POST "))) {
            const [method, rawPath] = code.textContent.split(/\s+/, 2);
            const path = rawPath.replace(/"/g, "").trim();

            // Await the domain mapping
            const domain = await getDomain(path);

            if (!domain) {
                console.log("No domain for: " + path);
                continue; // skip if mapping not found
            }

            // Build the Redoc-style fragment URL
            const fragment = `#tag/${domain}/paths/${path.replace(/\//g, "~1")}/${method.toLowerCase()}`;

            // Replace <code> with a link
            const a = document.createElement("a");
            a.href = "/reference.html" + fragment;
            a.textContent = code.textContent;
            a.style.whiteSpace = "nowrap";

            code.replaceWith(a);
        }

    }
});
