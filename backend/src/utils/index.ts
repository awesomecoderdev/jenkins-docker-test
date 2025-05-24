import { format, subDays } from "date-fns";
import { parse } from "tldts";

export const getDate = (sub: number = 0) => {
	const dateXDaysAgo = subDays(new Date(), sub);
	return format(dateXDaysAgo, "dd/MM/yyyy");
};

export const domain = (host: string): string => {
	const { domain } = parse(host);
	if (!domain) return "localhost";
	return `${domain}`;
};

export const getTimeHSI = () => {
	const now = new Date();
	const h = now.getHours();
	const s = now.getSeconds();
	const i = now.getMilliseconds();
	return `${h}${s}${i}`;
};

export const wait = async (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function nFormatter(num?: number, digits?: number) {
	if (!num) return "0";
	const lookup = [
		{ value: 1, symbol: "" },
		{ value: 1e3, symbol: "K" },
		{ value: 1e6, symbol: "M" },
		{ value: 1e9, symbol: "G" },
		{ value: 1e12, symbol: "T" },
		{ value: 1e15, symbol: "P" },
		{ value: 1e18, symbol: "E" },
	];
	const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
	const item = lookup
		.slice()
		.reverse()
		.find(function (item) {
			return num >= item.value;
		});
	return item ? (num / item.value).toFixed(digits || 1).replace(rx, "$1") + item.symbol : "0";
}

export function capitalize(str: string) {
	if (!str || typeof str !== "string") return str;
	if (isValidDomain(str)) return str;
	return str.charAt(0).toUpperCase() + str.slice(1);
}

export function capitalizeFirstLetterOfEachWord(str: string) {
	return str.replace(/\b\w/g, (match) => match.toUpperCase());
}

export function isValidDomain(domain: string) {
	try {
		const pattern = /^(?:[-A-Za-z0-9]+\.)+[A-Za-z]{2,}$/;
		return pattern.test(domain);
	} catch (error) {
		return false;
	}
}

export const chunk = <T>(array: T[], chunk_size: number): T[][] => {
	return array.reduce((resultArray, item, index) => {
		const chunkIndex = Math.floor(index / chunk_size);

		if (!resultArray[chunkIndex]) {
			resultArray[chunkIndex] = []; // start a new chunk
		}

		resultArray[chunkIndex].push(item);

		return resultArray;
	}, [] as T[][]);
};

export const getDateTimeLocal = (timestamp?: Date): string => {
	const d = timestamp ? new Date(timestamp) : new Date();
	if (d.toString() === "Invalid Date") return "";
	return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().split(":").slice(0, 2).join(":");
};

export const formatDate = (dateString: string) => {
	return new Date(`${dateString}T00:00:00Z`).toLocaleDateString("en-US", {
		day: "numeric",
		month: "long",
		year: "numeric",
		timeZone: "UTC",
	});
};

export const getFirstAndLastDay = (day: number) => {
	const today = new Date();
	const currentDay = today.getDate();
	const currentMonth = today.getMonth();
	const currentYear = today.getFullYear();
	if (currentDay >= day) {
		// if the current day is greater than target day, it means that we just passed it
		return {
			firstDay: new Date(currentYear, currentMonth, day),
			lastDay: new Date(currentYear, currentMonth + 1, day - 1),
		};
	} else {
		// if the current day is less than target day, it means that we haven't passed it yet
		const lastYear = currentMonth === 0 ? currentYear - 1 : currentYear; // if the current month is January, we need to go back a year
		const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1; // if the current month is January, we need to go back to December
		return {
			firstDay: new Date(lastYear, lastMonth, day),
			lastDay: new Date(currentYear, currentMonth, day - 1),
		};
	}
};

// courtesy of ChatGPT: https://sharegpt.com/c/pUYXtRs
export const validDomainRegex = new RegExp(/^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/);

export const validSlugRegex = new RegExp(/^[a-zA-Z0-9\-]+$/);

export const getSubdomain = (name: string, apexName: string) => {
	if (name === apexName) return null;
	return name.slice(0, name.length - apexName.length - 1);
};

export const isValidUrl = (url: string) => {
	try {
		new URL(url);
		return true;
	} catch (e) {
		return false;
	}
};

type LocationProps = {
	href?: any;
	protocol?: any;
	host?: any;
	hostname?: any;
	port?: any;
	pathname?: any;
	search?: any;
	hash?: any;
};

export function getLocation(href: string): LocationProps {
	try {
		const match: any = href.match(/^(https?\:)\/\/(([^:\/?#]*)(?:\:([0-9]+))?)([\/]{0,1}[^?#]*)(\?[^#]*|)(#.*|)$/);

		if (match) {
			return {
				href: href,
				protocol: match[1],
				host: match[2],
				hostname: match[3],
				port: match[4],
				pathname: match[5],
				search: match[6],
				hash: match[7],
			};
		}
	} catch (error) {
		// nothing
	}

	return {
		href: null,
		protocol: null,
		host: null,
		hostname: null,
		port: null,
		pathname: null,
		search: null,
		hash: null,
	};
}

export const getUrlFromString = (str: string) => {
	if (isValidUrl(str)) return str;
	try {
		if (str.includes(".") && !str.includes(" ")) {
			return new URL(`https://${str}`).toString();
		}
	} catch (e) {
		return null;
	}
};

export const getDomainWithoutWWW = (url: string) => {
	if (isValidUrl(url)) {
		return new URL(url).hostname.replace(/^www\./, "");
	}
	try {
		if (url.includes(".") && !url.includes(" ")) {
			return new URL(`https://${url}`).hostname.replace(/^www\./, "");
		}
	} catch (e) {
		return null;
	}
};

export const truncate = (str: string | null, length: number) => {
	if (!str || str.length <= length) return str;
	return `${str.slice(0, length - 3)}...`;
};

export const constructURLFromString = (path: string, utmParams: Record<string, string | number> = {}) => {
	const url = path.replace(/\/$/, "");
	const props: string[] = [];
	for (const [key, value] of Object.entries(utmParams)) {
		if (value !== "") props.push(`${key}=${value}`);
	}
	const query = props.join("&");
	return `${url}?${query}`;
};

export const constructURLFromUTMParams = (url: string, utmParams: Record<string, string | number>) => {
	if (!url) return "";
	try {
		const newURL = new URL(url);
		for (const [key, value] of Object.entries(utmParams)) {
			if (value === "") {
				newURL.searchParams.delete(key);
			} else {
				newURL.searchParams.set(key, String(value));
			}
		}
		return newURL.toString();
	} catch (e) {
		return "";
	}
};

export const paramsMetadata = [
	{ display: "Referral (ref)", key: "ref", examples: "twitter, facebook" },
	{ display: "UTM Source", key: "utm_source", examples: "twitter, facebook" },
	{ display: "UTM Medium", key: "utm_medium", examples: "social, email" },
	{ display: "UTM Campaign", key: "utm_campaign", examples: "summer_sale" },
	{ display: "UTM Term", key: "utm_term", examples: "blue_shoes" },
	{ display: "UTM Content", key: "utm_content", examples: "logolink" },
];

export const getUrlWithoutUTMParams = (url: string) => {
	try {
		const newURL = new URL(url);
		paramsMetadata.forEach((param) => newURL.searchParams.delete(param.key));
		return newURL.toString();
	} catch (e) {
		return url;
	}
};

export async function generateMD5Hash(message: any) {
	// Convert the message string to a Uint8Array
	const encoder = new TextEncoder();
	const data = encoder.encode(message);

	// Generate the hash using the SubtleCrypto interface
	const hashBuffer = await crypto.subtle.digest("MD5", data);

	// Convert the hash to a hexadecimal string
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	const hashHex = hashArray.map((byte) => byte.toString(16).padStart(2, "0")).join("");

	return hashHex;
}

export const ArrayChunk = <T>(arr: T[], by: number = 3): T[][] => {
	const result = [];
	for (let i = 0; i < arr.length; i += by) {
		result.push(arr.slice(i, i + by));
	}
	return result;
};
export const ArrayGroup = <T>(array: T[], groups: number): T[][] => {
	const result: T[][] = Array.from({ length: groups }, () => []);

	for (let i = 0; i < array.length; i++) {
		const groupIndex = i % groups; // Use modulo to distribute items evenly
		result[groupIndex].push(array[i]);
	}

	return result;
};
export async function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export function currency(amount: number = 0, currency: string = "USD", local: string = "en-US") {
	try {
		return new Intl.NumberFormat(local, {
			style: "currency",
			currency: String(currency).toUpperCase(),
		}).format(amount);
		// .format(0)
		// .toString()
		// .replace("0.00", nFormatter(amount));
	} catch (error) {
		return `${nFormatter(amount)} ${currency}`;
	}
}

export function number(number: number | string | null): number {
	if (typeof number == "number") return Math.abs(number);
	let result = 0;

	if (number) {
		const balance = parseFloat(number.replace(/[^\d.]/g, ""));
		result = typeof balance == "number" ? balance : 0;
	}

	return Math.abs(result || 0);
}

// Function to strip HTML tags from a string
export const StripHtmlTags = (html: string): string => {
	return html.replace(/<[^>]*>/g, ""); // Remove all HTML tags
};

export function getWalletAvatarName(text: string): string {
	const pattern = /^(\w).*?(\b\w)\w*$/;
	const match = text.match(pattern);
	let output = text.substring(0, 2);
	if (match) {
		// Extract the first characters of the first and last words
		output = match[1] + match[2].trim();
	}

	return output.toUpperCase();
}

export async function waitUntil(callback: Function, seconds: number = 1) {
	const start = Date.now(); // Start time

	const response = callback instanceof Promise ? await callback() : callback(); // Execute the callback here

	const current = Date.now() - start; // Calculate elapsed time
	const remain = Math.max(seconds * 1000 - current, 0); // Calculate remaining time to wait

	if (remain > 0) {
		await sleep(remain); // Wait for the remaining time if any
	}

	return response;
}

export function ObjectArrayFirstItem<T>(slots: [string, T][]): T {
	const [key, details] = slots.at!(0)!;
	return details;
}

export function ArrayLeftOver(num: number, divisor: number = 4): number {
	const remainder = num % divisor;
	return remainder === 0 ? divisor : remainder;
}

export function has(routes: string[], route: string = "index") {
	return routes.includes(route);
}

export function getLanguageFromClassName(string?: string, pattern: string = "language-"): string {
	if (!string) return "";
	const className = string.split(" ").find((c: string) => c.startsWith(pattern)) ?? "";
	const language = className.replace(pattern, "") ?? "";
	return language;
}
