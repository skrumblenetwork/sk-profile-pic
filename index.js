const { SVG, registerWindow } = require('@svgdotjs/svg.js');
 const window = require('svgdom');
 const http = require('http');
 const { getRandomInt } = require('./src/util');
 const ColorConfig = require('./src/color.config');

 const { document } = window;
 registerWindow(window, window.document);

 let AVATAR_SIZE = 80;
 let LINE_WIDTH_PERCENT = 0.1;
 let SC_PERCENT = 0.2;
 let MC_PERCENT = 0.7;
 let BC_PERCENT = 0.9;
 let FC_PERCENT = 1.0;

 const hostname = '127.0.0.1';
 const port = 4000;

 const server = http.createServer((req, res) => {
 	if (req.url.match(/favicon/)) {
 		res.end('');
 		return;
 	}

 	const args = req.url.split('/').filter((arg) => arg);

 	AVATAR_SIZE = parseInt(args[0], 10);
 	LINE_WIDTH_PERCENT = parseInt(args[1], 10) / 100;
 	SC_PERCENT = parseInt(args[2], 10) / 100;
 	MC_PERCENT = parseInt(args[3], 10) / 100;
 	BC_PERCENT = parseInt(args[4], 10) / 100;
 	FC_PERCENT = parseInt(args[5], 10) / 100;
 	const theme = args[6];

 	const color = new ColorConfig(theme);
 	const canvas = SVG(document.documentElement).size(AVATAR_SIZE, AVATAR_SIZE);
 	canvas.clear();

 	canvas.rect(AVATAR_SIZE, AVATAR_SIZE).fill(color.RGB);
 	const scCenter = {
 		x: getRandomInt(AVATAR_SIZE * 0.1, AVATAR_SIZE * 0.9),
 		y: getRandomInt(AVATAR_SIZE * 0.1, AVATAR_SIZE * 0.9),
 	};

 	canvas.circle(AVATAR_SIZE * SC_PERCENT).fill('none').stroke({
 		color: color.lineRGB,
 		width: AVATAR_SIZE * LINE_WIDTH_PERCENT,
 	}).center(scCenter.x, scCenter.y);

 	const scRadius = SC_PERCENT * AVATAR_SIZE / 2;

 	const mcRadius = MC_PERCENT * AVATAR_SIZE / 2;
 	const mcOffset = mcRadius - scRadius;
 	const mcAngle = Math.random() * Math.PI * 2;
 	const xMC = Math.cos(mcAngle) * mcOffset;
 	const yMC = Math.sin(mcAngle) * mcOffset;

 	canvas.circle(AVATAR_SIZE * MC_PERCENT).fill('none').stroke({
 		color: color.lineRGB,
 		width: AVATAR_SIZE * LINE_WIDTH_PERCENT,
 	}).center(scCenter.x + xMC, scCenter.y + yMC);

 	const fcRadius = FC_PERCENT * AVATAR_SIZE / 2;
 	const fcOffset = fcRadius - scRadius;
 	const fcAngle = Math.random() * Math.PI * 2;
 	const xFC = Math.cos(fcAngle) * fcOffset;
 	const yFC = Math.sin(fcAngle) * fcOffset;

 	canvas.circle(AVATAR_SIZE * FC_PERCENT).fill(color.lineRGB)
 		.stroke({
 			color: color.lineRGB,
 			width: AVATAR_SIZE * LINE_WIDTH_PERCENT,
 		})
 		.opacity(0.7)
 		.center(scCenter.x + xFC, scCenter.y + yFC);

 	const bcRadius = BC_PERCENT * AVATAR_SIZE / 2;
 	const bcOffset = bcRadius - scRadius;
 	let bcAngle = Math.random() * Math.PI * 2;

 	let angleDiff = Math.abs(mcAngle > bcAngle ? mcAngle - bcAngle : bcAngle - mcAngle);
 	if (angleDiff > Math.PI) {
 		angleDiff = Math.PI * 2 - angleDiff;
 	}

 	if (angleDiff < Math.PI / 4) {
 		const needAdd = Math.PI / 4 - angleDiff;
 		if (bcAngle > mcAngle) {
 			bcAngle += needAdd;
 		} else {
 			bcAngle -= needAdd;
 		}
 	}

 	const xBC = Math.cos(bcAngle) * bcOffset;
 	const yBC = Math.sin(bcAngle) * bcOffset;

 	canvas.circle(AVATAR_SIZE * BC_PERCENT).fill('none').stroke({
 		color: '#fff',
 		width: AVATAR_SIZE * LINE_WIDTH_PERCENT,
 	}).center(scCenter.x + xBC, scCenter.y + yBC);

 	res.statusCode = 200;
 	res.setHeader('Content-Type', 'text/html');
 	res.end(canvas.svg());
 	document.removeChild(document.documentElement);
 });

 server.listen(port, hostname, () => {
 	console.log(`Server running at http://${hostname}:${port}/`);
 });
