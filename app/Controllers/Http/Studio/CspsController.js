"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Csps_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Csps"));
const ua_parser_js_1 = require("ua-parser-js");
const route_model_binding_1 = require("@adonisjs/route-model-binding");
class CspsController {
    async index(ctx) {
        const csps = await Csps_1.default.query().orderBy('created_at', 'desc').orderBy('solved', 'desc');
        const dataRaw = {};
        const chartRaw = {};
        for (const csp of csps.map((c) => c.toJSON())) {
            const { scriptSample, blockedUri, violatedDirective, solved } = csp;
            csp['browser'] = new ua_parser_js_1.UAParser(csp.userAgent).getBrowser().name;
            if (violatedDirective in chartRaw && Number(solved) in chartRaw[violatedDirective]) {
                chartRaw[violatedDirective][Number(solved)] += 1;
            }
            else {
                chartRaw[violatedDirective] = { [Number(solved)]: 1, [Number(!solved)]: 0 };
            }
            if (solved) {
                continue;
            }
            if (!!scriptSample && scriptSample in dataRaw) {
                dataRaw[scriptSample].push(csp);
            }
            else if (scriptSample) {
                dataRaw[scriptSample] = [csp];
            }
            else if (blockedUri in dataRaw) {
                dataRaw[blockedUri].push(csp);
            }
            else {
                dataRaw[blockedUri] = [csp];
            }
        }
        const chart = {
            labels: Object.keys(chartRaw),
            datasets: [
                {
                    label: 'Solved',
                    color: '#9cabff',
                    data: Object.values(chartRaw).map((c) => c[1]),
                },
                {
                    label: 'Unsolved',
                    color: '#f4aaa4',
                    data: Object.values(chartRaw).map((c) => c[0]),
                },
            ],
        };
        return ctx.view.render('studio/csp', {
            page: 'Laporan CSP',
            data: Object.values(dataRaw),
            chart,
        });
    }
    async all(ctx) {
        await Csps_1.default.query().where('solved', false).update('solved', true);
        return ctx.response.redirect().back();
    }
    async solve(ctx, csps) {
        csps.solved = true;
        await csps.save();
        return ctx.response.redirect().back();
    }
}
__decorate([
    (0, route_model_binding_1.bind)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Csps_1.default]),
    __metadata("design:returntype", Promise)
], CspsController.prototype, "solve", null);
exports.default = CspsController;
//# sourceMappingURL=CspsController.js.map