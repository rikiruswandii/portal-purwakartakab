"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UNPOLY_HEADERS = [
    'X-Up-Accept-Layer',
    'X-Up-Clear-Cache',
    'X-Up-Context',
    'X-Up-Dismiss-Layer',
    'X-Up-Events',
    'X-Up-Fail-Context',
    'X-Up-Fail-Mode',
    'X-Up-Fail-Target',
    'X-Up-Location',
    'X-Up-Method',
    'X-Up-Mode',
    'X-Up-Reload-From-Time',
    'X-Up-Target',
    'X-Full-Reload',
];
class Unpoly {
    constructor(ctx) {
        this.ctx = ctx;
        this.headers = {};
    }
    headerToFlashKey(header) {
        return header.replace('X-', '').toLowerCase();
    }
    getProperty(header) {
        return this.ctx.session.flashMessages.get(this.headerToFlashKey(header), this.ctx.request.header(header));
    }
    setProperty(header, value) {
        this.headers[header] = value;
    }
    setHeadersAsFlashMessages(headers) {
        Object.keys(headers).forEach((header) => {
            this.ctx.session.flash(this.headerToFlashKey(header), headers[header]);
        });
    }
    setHeadersAsResponse(headers) {
        Object.keys(headers).forEach((header) => {
            this.ctx.response.header(header, headers[header]);
        });
    }
    commit() {
        const headers = Object.assign(UNPOLY_HEADERS.reduce((result, header) => {
            const value = this.ctx.session.flashMessages.get(this.headerToFlashKey(header));
            if (value)
                result[header] = value;
            return result;
        }, {}), this.headers);
        if (this.ctx.response.getHeader('Location')) {
            this.setHeadersAsFlashMessages(headers);
        }
        else {
            this.setHeadersAsResponse(headers);
        }
    }
    getLayer() {
        return this.getProperty('X-Up-Accept-Layer');
    }
    getCache() {
        return this.getProperty('X-Up-Clear-Cache');
    }
    getContext() {
        return this.getProperty('X-Up-Context');
    }
    getDismissLayer() {
        return this.getProperty('X-Up-Dismiss-Layer');
    }
    getEvents() {
        return this.getProperty('X-Up-Events');
    }
    getFailContext() {
        return this.getProperty('X-Up-Fail-Context');
    }
    getFailMode() {
        return this.getProperty('X-Up-Fail-Mode');
    }
    getFailTarget() {
        return this.getProperty('X-Up-Fail-Target');
    }
    getLocation() {
        return this.getProperty('X-Up-Location');
    }
    getMethod() {
        return this.getProperty('X-Up-Method');
    }
    getMode() {
        return this.getProperty('X-Up-Mode');
    }
    getReloadFromTime() {
        return this.getProperty('X-Up-Reload-From-Time');
    }
    getTarget() {
        return this.getProperty('X-Up-Target') || 'body';
    }
    targetIncludes(selector) {
        const target = this.getTarget()
            .split(',')
            .map((value) => value.trim());
        return target.includes('body') ? true : target.includes(selector);
    }
    getTitle() {
        return this.getProperty('X-Up-Title');
    }
    getValidate() {
        return this.getProperty('X-Up-Validate');
    }
    getVersion() {
        return this.getProperty('X-Up-Version');
    }
    setLayer(value) {
        return this.setProperty('X-Up-Accept-Layer', value);
    }
    setCache(value) {
        return this.setProperty('X-Up-Clear-Cache', value);
    }
    setContext(value) {
        return this.setProperty('X-Up-Context', value);
    }
    setDismissLayer(value) {
        return this.setProperty('X-Up-Dismiss-Layer', value);
    }
    setEvents(value) {
        return this.setProperty('X-Up-Events', value);
    }
    setFailContext(value) {
        return this.setProperty('X-Up-Fail-Context', value);
    }
    setFailMode(value) {
        return this.setProperty('X-Up-Fail-Mode', value);
    }
    setFailTarget(value) {
        return this.setProperty('X-Up-Fail-Target', value);
    }
    setLocation(value) {
        return this.setProperty('X-Up-Location', value);
    }
    setMethod(value) {
        return this.setProperty('X-Up-Method', value);
    }
    setMode(value) {
        return this.setProperty('X-Up-Mode', value);
    }
    setReloadFromTime(value) {
        return this.setProperty('X-Up-Reload-From-Time', value);
    }
    setTarget(value) {
        return this.setProperty('X-Up-Target', value);
    }
    setTitle(value) {
        return this.setProperty('X-Up-Title', value);
    }
    setValidate(value) {
        return this.setProperty('X-Up-Validate', value);
    }
    setVersion(value) {
        return this.setProperty('X-Up-Version', value);
    }
    fullReload() {
        return this.setProperty('X-Full-Reload', 'true');
    }
}
exports.default = Unpoly;
//# sourceMappingURL=Unpoly.js.map