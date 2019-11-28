function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function blinking(id) {
	id.setAttribute("style", "font-weight: 501;");
	await sleep(333);

	id.setAttribute("style", "color: black;");
}