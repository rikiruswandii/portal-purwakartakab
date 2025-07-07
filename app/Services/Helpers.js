"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const https_1 = __importDefault(require("https"));
const crypto_1 = __importDefault(require("crypto"));
const redis = __importStar(require("redis"));
const luxon_1 = require("luxon");
const Env_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Env"));
const View_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/View"));
const Helpers_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Helpers");
const axios_cache_adapter_1 = require("axios-cache-adapter");
class Helpers {
    static baseUrl(...segments) {
        let result = View_1.default.GLOBALS.env('APP_URL');
        if (segments.length > 0 && segments[0].match(/^https?:\/\//)) {
            result = segments[0];
            segments.shift();
        }
        segments.map((value) => {
            const prefixed = value.toString().match(/^\//);
            if (Helpers_1.types.isNull(prefixed)) {
                result += '/' + value;
                return;
            }
            result += value;
        });
        return result;
    }
    static axios(options) {
        const host = Env_1.default.get('REDIS_HOST');
        const password = Env_1.default.get('REDIS_PASSWORD');
        const port = Env_1.default.get('REDIS_PORT');
        const client = redis.createClient({ host, port, password });
        const store = new axios_cache_adapter_1.RedisDefaultStore(client, { prefix: 'axios:' });
        return (0, axios_cache_adapter_1.setup)({
            cache: {
                maxAge: 15 * 60 * 1000,
                store,
            },
            httpsAgent: new https_1.default.Agent({
                rejectUnauthorized: false,
            }),
            ...options,
        });
    }
    static parseJson(data) {
        try {
            data = JSON.parse(data);
        }
        catch (_) { }
        return data;
    }
    static objectFromDot(data) {
        return data.reduce(function (previous, current) {
            let path = current.code.split('.');
            let last = path.pop();
            path.reduce(function (prev, curr) {
                return (prev[curr] = prev[curr] || {});
            }, previous)[last] = Helpers.parseJson(current.content);
            return previous;
        }, {});
    }
    static numberify(data) {
        return Number(data.replace(/\D/g, ''));
    }
    static capitalize(value) {
        return value.toLowerCase().replace(/^\w/, (s) => s.toUpperCase());
    }
    static ucwords(value) {
        return value.toLowerCase().replace(/(\b\w)/g, (s) => s.toUpperCase());
    }
    static padZero(value, zero) {
        value = typeof value === 'number' ? value.toString() : value;
        return value.padStart(zero, '0');
    }
    static errorParser({ messages }) {
        const errors = Object.values(messages).flat();
        return errors.shift() || 'Terjadi kesalahan tidak terduga.';
    }
    static parseDate(date, withTime = true) {
        if (!date)
            return null;
        if (typeof date === 'string')
            date = luxon_1.DateTime.fromISO(new Date(date).toISOString());
        if (typeof date?.toFormat !== 'function')
            date = luxon_1.DateTime.fromObject(date);
        const time = withTime ? ' HH:mm:ss' : '';
        return date.setLocale('id-ID').toFormat('dd MMMM yyyy' + time);
    }
    static dateTime(date) {
        if (!date)
            return null;
        if (typeof date === 'string')
            date = luxon_1.DateTime.fromISO(new Date(date).toISOString());
        if (typeof date?.toFormat !== 'function')
            date = luxon_1.DateTime.fromObject(date);
        return date.setLocale('id-ID').toFormat('yyyy-MM-dd HH:mm:ss');
    }
    static trim(string) {
        return string.replace(/\s+/g, ' ').trim();
    }
    static generateRandomNumber(length = 6) {
        const byteLength = Math.ceil(length / 2);
        const randomBuffer = crypto_1.default.randomBytes(byteLength);
        const randomNumber = randomBuffer.toString('hex').slice(0, length);
        return parseInt(randomNumber, 16);
    }
    static slugify(title) {
        return title
            .toString()
            .toLowerCase()
            .trim()
            .replace(/(\s+|&)/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-')
            .replace(/^-+/, '')
            .replace(/-+$/, '');
    }
    static appendHttp(url) {
        url = url.trim();
        if (url === '')
            return null;
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            return `https://${url}`;
        }
        return url;
    }
    static countyFromGeo(reversed, type) {
        let result = '';
        if (type === 'district') {
            const level = 'administrative_area_level_4';
            result = reversed.find((item) => item.types.includes(level))?.short_name || '';
        }
        if (type === 'region' || result === '') {
            const level = 'administrative_area_level_3';
            result = reversed.find((item) => item.types.includes(level))?.short_name || '';
        }
        return result || 'Purwakarta';
    }
    static dateParser(date) {
        const parts = date.split('/');
        const [day, month, year] = parts;
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    static getAttachmentUrl(attachment) {
        if (!attachment)
            return null;
        if (Env_1.default.get('DRIVE_DISK') === 'local')
            return Helpers.baseUrl(attachment.url);
        const name = attachment.name.split('/');
        return Helpers.baseUrl('api', 'v1', 'attachments', ...name);
    }
}
exports.default = Helpers;
//# sourceMappingURL=Helpers.js.map