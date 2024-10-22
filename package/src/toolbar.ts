import { TURNSTILE_SITE_KEY } from "astro:env/client";
import { defineToolbarApp } from "astro/toolbar";

// Define the SVG icons for the app
const svgIcons = {
	turnstile: `<svg width="1em" height="1em" viewBox="0 0 54 54" data-icon="turnstile"><symbol id="ai:local:turnstile"><path fill="#e07800" d="M27.315 7.261a19.45 19.45 0 0 0-13.518 4.917l1.23-6.743-3.193-.582-2.162 11.836 11.84 2.16.582-3.193-6.08-1.11a16.173 16.173 0 1 1-4.982 8.064l-3.142-.824A19.478 19.478 0 1 0 27.315 7.261Z"></path><path fill="#e07800" fill-rule="evenodd" d="M38.847 21.919 35.928 19 24.477 30.452 19.923 25.9 17 28.822l7.483 7.484 2.923-2.923-.011-.012L38.847 21.92Z" clip-rule="evenodd"></path></symbol><use xlink:href="#ai:local:turnstile"></use></svg>`,
	close: `<svg xmlns="http://www.w3.org/2000/svg" width="2rem" height="2rem" viewBox="0 0 32 32"><path fill="#e07800" d="M16 2C8.2 2 2 8.2 2 16s6.2 14 14 14s14-6.2 14-14S23.8 2 16 2m5.4 21L16 17.6L10.6 23L9 21.4l5.4-5.4L9 10.6L10.6 9l5.4 5.4L21.4 9l1.6 1.6l-5.4 5.4l5.4 5.4z"/></svg>`,
};

// Define the raw HTML elements for the app window
const windowHtmlElements = {
	button: `<button type="submit" style="margin-top: 1rem; padding: 0.5rem 1rem; border: none; background-color: #e07800; color: black; cursor: pointer; border-radius: 0.25rem; margin-bottom: 0;">Test Turnstile Integration</button>`,
	successBanner: `<div style="margin-top: 0; padding: 0.5rem 1rem; border: none; background-color: green; color: black; cursor: pointer; border-radius: 0.25rem; text-align: center; width: 520px; position: absolute; bottom: 0.5rem;">Token Verification Successful</div>`,
	errorBanner: `<div style="margin-top: 0; padding: 0.5rem 1rem; border: none; background-color: red; color: white; cursor: pointer; border-radius: 0.25rem;" text-align: center; width: 520px; position: absolute; bottom: 0.5rem;">"Unable to verify token"</div>`,
};

export default defineToolbarApp({
	name: "Astro Turnstile",
	id: "astro-turnstile-dev-toolbar",
	icon: svgIcons.turnstile,
	init(canvas, app, server) {
		// Create a new Astro Dev Toolbar Window
		const appWindow = document.createElement("astro-dev-toolbar-window");

		// Set the window's initial size
		appWindow.style.width = "600px";
		appWindow.style.height = "300px";

		// Create a close button for the window
		const closeButton = document.createElement("button");

		// Set the close button's inner HTML to an SVG icon
		closeButton.innerHTML = svgIcons.close;

		// Style the close button
		closeButton.style.position = "absolute";
		closeButton.style.top = "0.5rem";
		closeButton.style.right = "0.5rem";
		closeButton.style.padding = "0";
		closeButton.style.width = "2rem";
		closeButton.style.height = "2rem";
		closeButton.style.cursor = "pointer";
		closeButton.style.border = "none";
		closeButton.style.backgroundColor = "transparent";
		closeButton.style.borderRadius = "50%";
		closeButton.style.zIndex = "1000";

		// Add an event listener to the close button to toggle the app's state
		closeButton.onclick = () => {
			app.toggleState({ state: false });
		};

		// Create a Header for the app window
		const header = document.createElement("astro-dev-overlay-card");

		// Style the heading
		header.style.textAlign = "center";
		header.style.marginTop = "0";
		header.style.fontSize = "1.5rem";
		header.style.position = "absolute";
		header.style.width = "90%";
		header.style.height = "100px";
		header.style.top = "0";

		// Create a Heading for the app window
		const heading = document.createElement("h1");

		// Set the heading's inner HTML
		heading.textContent = "Astro Turnstile";

		// Style the heading
		heading.style.textAlign = "center";
		heading.style.marginTop = "1rem";
		heading.style.fontWeight = "bold";
		heading.style.marginBottom = "0";
		heading.style.fontSize = "1.5rem";

		// Create a Description for the app window
		const description = document.createElement("span");

		// Style the description
		description.style.textAlign = "center";
		description.style.marginTop = "0";
		description.style.fontSize = "1rem";

		// Set the description's inner HTML
		description.textContent = "Quickly run tests on your Turnstile config.";

		// Create the testing button and add Turnstile integration
		const testElement = document.createElement("form");

		// Style the form
		testElement.style.display = "flex";
		testElement.style.flexDirection = "column";
		testElement.style.justifyContent = "center";
		testElement.style.alignItems = "center";
		testElement.style.height = "100%";
		testElement.style.width = "100%";
		testElement.style.padding = "1rem";
		testElement.id = "turnstile-dev-toolbar-form";
		testElement.innerHTML = windowHtmlElements.button;
		// Append the script to the form
		appWindow.appendChild(testElement);

		// Add an event listener to the form
		testElement.addEventListener("submit", async (event) => {
			// Prevent the default form submission
			event.preventDefault();

			// Send the verification request to the server
			server.send("sendverify", { key: TURNSTILE_SITE_KEY });
		});

		// Append the headings to the header
		header.appendChild(heading);
		header.appendChild(description);

		// Append the elements to the app window
		appWindow.appendChild(closeButton);
		appWindow.appendChild(header);
		appWindow.appendChild(testElement);

		// Append the app window to the canvas
		canvas.appendChild(appWindow);

		// Listen for the response from the server
		server.on("verifyresponse", async (data: { success: boolean }) => {
			// Create a new element to display the response
			const responseElement = document.createElement("div");

			// Style the response element
			responseElement.innerHTML = data.success
				? windowHtmlElements.successBanner
				: windowHtmlElements.errorBanner;

			// Append the response element to the app window
			appWindow.appendChild(responseElement);

			if (data.success) {
				app.toggleNotification({ state: true, level: "info" });
			} else {
				app.toggleNotification({ state: true, level: "error" });
			}

			// Remove the response element after 5 seconds
			setTimeout(() => {
				responseElement.remove();
				app.toggleNotification({ state: false });
			}, 5000);
		});
	},
});
