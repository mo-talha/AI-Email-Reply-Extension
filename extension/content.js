console.log("Extension loaded");

function getEmailContent() {
  const selectors = [
    ".h7, .a3s.aiL",
    "gmail_quote",
    ".gU.Up",
    "[role='presentation']",
  ];

  const content = document.querySelector(".a3s.aiL");
  if (content) {
    // console.log("email content: " + content.innerText.trim());
    return content.innerText.trim();
  }
  return "";
}

function findComposeToolbar() {
  const toolbar = document.querySelector(".btC");
  if (toolbar) {
    return toolbar;
  }
  return null;
}

function injectButton() {
  let toneSelected = "▾";
  const existingButton = document.querySelector(".ai-reply-button");
  if (existingButton) existingButton.remove();

  const toolbar = findComposeToolbar();
  if (!toolbar) {
    console.log("Toolbar not found");
    return;
  }

  // Create main AI Reply button
  const button = document.createElement("button");
  button.className = "ai-reply-button T-I J-J5-Ji aoO T-I-atl L3";
  button.innerHTML = "AI Reply";

  // Create tone selection button
  const optionsBtn = document.createElement("button");
  optionsBtn.className = "tone-select-button T-I J-J5-Ji aoO T-I-atl L3";
  optionsBtn.style.marginRight = "5px";

  // Create dropdown
  const optionsDropdown = document.createElement("div");
  optionsDropdown.id = "customDropdown";
  optionsDropdown.className = "q8NmZb J-M jQjAxd";
  optionsDropdown.style.display = "none";

  // Create options list
  const optionsList = document.createElement("ul");
  optionsList.className = "options";

  // Add options
  optionsList.innerHTML = `
  <li class="list-value">Angry</li>  
  <li class="list-value">Friendly</li>
  <li class="list-value">Polite</li>
  <li class="list-value">Professional</li>
  `;

  // Handle option selection
  optionsList.addEventListener("click", (e) => {
    const listItem = e.target.closest(".list-value");
    if (listItem) {
      e.stopPropagation();
      toneSelected = listItem.textContent;
      optionsBtn.firstChild.textContent = toneSelected;
      optionsDropdown.style.display = "none";
    }
  });

  optionsDropdown.appendChild(optionsList);

  // Create a text node for the options button
  const optionsBtnText = document.createTextNode(toneSelected);
  optionsBtn.appendChild(optionsBtnText);
  optionsBtn.appendChild(optionsDropdown);

  // Handle options button click
  optionsBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    optionsDropdown.style.display =
      optionsDropdown.style.display === "none" ? "block" : "none";
  });

  // Handle clicking outside
  document.addEventListener("click", (e) => {
    if (!optionsDropdown.contains(e.target) && e.target !== optionsBtn) {
      optionsDropdown.style.display = "none";
    }
  });

  // AI reply button click handler
  button.addEventListener("click", async () => {
    try {
      button.innerHTML = "Generating AI reply ...";
      button.disabled = true;
      const emailContent = getEmailContent();

      // Checking if any tone is selected by the user, if not default tone is professional
      toneSelected === "▾" ? (toneSelected = "Professional") : toneSelected;

      console.log("Selected Tone: ", toneSelected);

      const response = await fetch("http://127.0.0.1:8001/api/email/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email_content: emailContent,
          tone: toneSelected,
        }),
      });

      if (!response.ok) {
        throw new Error("API request failed.");
      }

      const data = await response.json();
      const generatedReply = data.generated_email;
      const composeBox = document.querySelector(
        '[role="textbox"][g_editable="true"]'
      );

      if (composeBox) {
        composeBox.focus();
        document.execCommand("insertText", false, generatedReply);
      } else {
        console.log("Compose box not found.");
      }
    } catch (error) {
      console.log(error);
      alert("Failed to generate reply.");
    } finally {
      button.innerHTML = "AI Reply";
      button.disabled = false;
    }
  });

  // Add buttons to toolbar
  toolbar.insertBefore(optionsBtn, toolbar.firstChild);
  toolbar.insertBefore(button, toolbar.firstChild);
}

// MutationObserver is a browser API which watches changes on the DOM, this helps us check if the compose
// is added or not.
// It can take a callback function, which will retur a list of mutations, mutations are nothing but changes
// that occurred on the DOM.
const observer = new MutationObserver((mutations) => {
  // Every mutataion has a property addedNodes, these are nothing but the changes to the DOM
  for (const mutation of mutations) {
    // Each mutation has a property named addedNodes, we are taking each change of the DOM and are adding
    // it to an array
    const addedNodes = Array.from(mutation.addedNodes);
    // We are checking if any node is an html element and if the element has a class .aDh, .btc, a property
    // called role="dialog", or we are trying to select the elements with the same classes using, query selector.
    const hasComposeElements = addedNodes.some(
      (node) =>
        node.nodeType === Node.ELEMENT_NODE &&
        (node.matches('.aDh, .btC, [role="dialog"]') ||
          node.querySelector('.aDh, .btC, [role="dialog"]'))
    );

    // If any such element is found then we console log a statement, and we set a timeout of 500ms so that
    // the concerned element loads into its full state and we call the injectButton function which will
    // load our AI Reply button.
    if (hasComposeElements) {
      console.log("Compose window detected");
      setTimeout(injectButton, 500);
    }
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});
