import {TURNSTILE_SITE_KEY} from 'astro:env/client';
import {defineToolbarApp} from 'astro/toolbar';
import {svgIcons, windowHtmlElements} from './strings';

export default defineToolbarApp({
	init(canvas, app, server) {
		// Create a new Astro Dev Toolbar Window
		const appWindow = document.createElement('astro-dev-toolbar-window');

		// Set the window's initial size
		appWindow.style.width = '600px';
		appWindow.style.height = '300px';

		// Create a close button for the window
		const closeButton = document.createElement('button');

		// Set the close button's inner HTML to an SVG icon
		closeButton.innerHTML = svgIcons.close;

		// Style the close button
		closeButton.style.position = 'absolute';
		closeButton.style.top = '0.5rem';
		closeButton.style.right = '0.5rem';
		closeButton.style.padding = '0';
		closeButton.style.width = '2rem';
		closeButton.style.height = '2rem';
		closeButton.style.cursor = 'pointer';
		closeButton.style.border = 'none';
		closeButton.style.backgroundColor = 'transparent';
		closeButton.style.borderRadius = '50%';
		closeButton.style.zIndex = '1000';

		// Add an event listener to the close button to toggle the app's state
		closeButton.onclick = () => {
			app.toggleState({state: false});
		};

		// Create a Header for the app window
		const header = document.createElement('astro-dev-overlay-card');

		// Style the heading
		header.style.textAlign = 'center';
		header.style.marginTop = '0';
		header.style.fontSize = '1.5rem';
		header.style.position = 'absolute';
		header.style.width = '90%';
		header.style.height = '100px';
		header.style.top = '0';

		// Create a Heading for the app window
		const heading = document.createElement('h1');

		// Set the heading's inner HTML
		heading.textContent = 'Astro Turnstile';

		// Style the heading
		heading.style.textAlign = 'center';
		heading.style.marginTop = '1rem';
		heading.style.fontWeight = 'bold';
		heading.style.marginBottom = '0';
		heading.style.fontSize = '1.5rem';

		// Create a Description for the app window
		const description = document.createElement('span');

		// Style the description
		description.style.textAlign = 'center';
		description.style.marginTop = '0';
		description.style.fontSize = '1rem';

		// Set the description's inner HTML
		description.textContent = 'Quickly run tests on your Turnstile config.';

		// Create the testing button and add Turnstile integration
		const testElement = document.createElement('form');

		// Style the form
		testElement.style.display = 'flex';
		testElement.style.flexDirection = 'column';
		testElement.style.justifyContent = 'center';
		testElement.style.alignItems = 'center';
		testElement.style.height = '100%';
		testElement.style.width = '100%';
		testElement.style.padding = '1rem';
		testElement.id = 'turnstile-dev-toolbar-form';
		testElement.innerHTML = windowHtmlElements.button;
		// Append the script to the form
		appWindow.appendChild(testElement);

		// Add an event listener to the form
		testElement.addEventListener('submit', async (event) => {
			// Prevent the default form submission
			event.preventDefault();

			// Send the verification request to the server
			server.send('sendverify', {key: TURNSTILE_SITE_KEY});
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
		server.on('verifyresponse', async (data: {success: boolean}) => {
			// Create a new element to display the response
			const responseElement = document.createElement('div');

			// Style the response element
			responseElement.innerHTML = data.success
				? windowHtmlElements.successBanner
				: windowHtmlElements.errorBanner;

			// Append the response element to the app window
			appWindow.appendChild(responseElement);

			if (data.success) {
				app.toggleNotification({state: true, level: 'info'});
			} else {
				app.toggleNotification({state: true, level: 'error'});
			}

			// Remove the response element after 5 seconds
			setTimeout(() => {
				responseElement.remove();
				app.toggleNotification({state: false});
			}, 5000);
		});
	},
});
