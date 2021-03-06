import winston from 'winston';
import process from 'process';

const { combine, timestamp, label, printf } = winston.format;

const myFormat = printf(({ level, message, label, timestamp }) => {
	const options = {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		weekday: 'long',
		hour: '2-digit',
		minute: '2-digit',
	};
	const date = new Date(timestamp).toLocaleDateString(undefined, options);
	return `${date} [${label}] ${level}: ${message}`; // log 출력 포맷 정의
});

const options = {
	// log파일
	file: {
		level: 'info',
		filename: `logs/winston-test.log`, // 로그파일을 남길 경로
		handleExceptions: true,
		json: false,
		maxsize: 5242880, // 5MB
		maxFiles: 5,
		colorize: false,
		format: combine(
			label({ label: 'winston-test' }),
			timestamp(),
			myFormat // log 출력 포맷
		),
	},
	// 개발 시 console에 출력
	console: {
		level: 'debug',
		handleExceptions: true,
		json: false, // 로그형태를 json으로도 뽑을 수 있다.
		colorize: true,
		prettyPrint: true,
		format: combine(label({ label: 'nba_express' }), timestamp(), myFormat),
	},
};
winston.addColors({
	info: '\x1b[36m',
	error: '\x1b[31m',
	warn: '\x1b[33m',
	verbose: '\x1b[43m',
});

let logger = new winston.createLogger({
	transports: [
		new winston.transports.File(options.file), // 중요! 위에서 선언한 option으로 로그 파일 관리 모듈 transport
	],
	exitOnError: false,
});

if (process.env.NODE_ENV !== 'production') {
	console.log('%c\n\n======== DEVELOPMENT MODE ========\n\n', 'background: #222; color: #bada55');
	logger.add(new winston.transports.Console(options.console)); // 개발 시 console로도 출력
}

module.exports = logger;