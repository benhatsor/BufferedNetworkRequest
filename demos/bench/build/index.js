import { JSONObjectStream } from "bufferednetworkrequest";
//#region bench/throttle.ts
const throttleProfiles = {
	none: {
		bytesPerSecond: Infinity,
		latencyMs: 0
	},
	fast4g: {
		bytesPerSecond: 9 * 1e3 * 1e3 / 8 * .9,
		latencyMs: 60 * 2.75
	},
	slow4g: {
		bytesPerSecond: 1.6 * 1e3 * 1e3 / 8 * .9,
		latencyMs: 150 * 3.75
	},
	"3g": {
		bytesPerSecond: 500 * 1e3 / 8 * .8,
		latencyMs: 400 * 5
	}
};
function throttleStream(body, profile) {
	let initialDelay = true;
	return body.pipeThrough(new TransformStream({ async transform(chunk, controller) {
		if (initialDelay && profile.latencyMs > 0) {
			await sleep(profile.latencyMs);
			initialDelay = false;
		}
		const sliceSize = Math.max(1, Math.floor(profile.bytesPerSecond / 10));
		let offset = 0;
		while (offset < chunk.length) {
			const end = Math.min(offset + sliceSize, chunk.length);
			controller.enqueue(new Uint8Array(chunk.subarray(offset, end)));
			offset = end;
			if (offset < chunk.length) await sleep(100);
		}
		await sleep(chunk.length / profile.bytesPerSecond * 1e3);
	} }));
}
function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
//#endregion
//#region bench/ui.ts
const statusEl = document.querySelector(".status");
const throttleSelect = document.querySelector("#throttle");
const runButton = document.querySelector("#run");
const cancelButton = document.querySelector("#cancel");
const clearButton = document.querySelector("#clear");
function getSelectedProfile() {
	return throttleSelect.value;
}
function clear() {
	statusEl.innerHTML = "";
}
function setRunning(value) {
	runButton.disabled = value;
	cancelButton.disabled = !value;
}
function onRun(handler) {
	runButton.addEventListener("click", handler);
}
function onCancel(handler) {
	cancelButton.addEventListener("click", handler);
}
function onClear(handler) {
	clearButton.addEventListener("click", handler);
}
function log(tag, text) {
	const el = document.createElement(tag);
	el.textContent = text;
	statusEl.appendChild(el);
	return el;
}
function scrollToBottom() {
	document.body.scrollIntoView({ block: "end" });
}
function round(value, decimals) {
	const m = 10 ** decimals;
	return Math.round(value * m) / m;
}
//#endregion
//#region bench/index.ts
let running = false;
let abortController = null;
onRun(run);
onCancel(() => abortController?.abort());
onClear(clear);
async function run() {
	if (running) return;
	running = true;
	setRunning(true);
	clear();
	abortController = new AbortController();
	const { signal } = abortController;
	const profile = throttleProfiles[getSelectedProfile()];
	log("h5", "Fetching...");
	try {
		const response = await fetch("https://jsonplaceholder.typicode.com/photos", {
			cache: "no-store",
			signal
		});
		if (!response.ok || !response.body) {
			log("h3", "An error occured while fetching the response.");
			return;
		}
		showResults(await streamObjects(profile.latencyMs > 0 || isFinite(profile.bytesPerSecond) ? throttleStream(response.body, profile) : response.body, signal));
		console.info("[done] response", response);
	} catch (e) {
		if (e instanceof DOMException && e.name === "AbortError") log("h3", "Cancelled.");
		else throw e;
	} finally {
		running = false;
		setRunning(false);
	}
}
async function streamObjects(body, signal) {
	const startTime = performance.now();
	let prevTime = startTime;
	let firstLoadTime = null;
	let totalObjects = 0;
	const stream = new JSONObjectStream(body);
	for await (const objects of stream) {
		signal.throwIfAborted();
		totalObjects += objects.length;
		for (const object of objects) log("code", JSON.stringify(object));
		const now = performance.now();
		log("h2", `loaded ${objects.length} in +${round(now - prevTime, 2)}ms`);
		scrollToBottom();
		prevTime = now;
		firstLoadTime ??= now;
	}
	return {
		startTime,
		firstLoadTime,
		totalObjects
	};
}
function showResults({ startTime, firstLoadTime, totalObjects }) {
	const endTime = performance.now();
	const totalTime = endTime - startTime;
	const timeSaved = endTime - firstLoadTime;
	const improvement = round(timeSaved / totalTime * 100, 2);
	log("h3", `done. (loaded ${totalObjects} objects)`);
	log("h1", `time saved: ${improvement}% (${round(timeSaved / 1e3, 2)}s of ${round(totalTime / 1e3, 2)}s)`);
	scrollToBottom();
}
//#endregion

//# sourceMappingURL=index.js.map