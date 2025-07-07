"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Bps_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/Bps"));
const cache_1 = global[Symbol.for('ioc.use')]("Config/cache");
const Adonis_Cache_1 = __importDefault(global[Symbol.for('ioc.use')]("Kaperskyguru/Adonis-Cache"));
const NotFoundException_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Exceptions/NotFoundException"));
const BadRequestException_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Exceptions/BadRequestException"));
class BpsController {
    async subjects(_ctx) {
        return await Adonis_Cache_1.default.remember('api:bps:subjects', cache_1.ONE_YEAR / 2, async () => {
            let result = [];
            const categories = await Bps_1.default.categories();
            for await (const category of categories) {
                const subjects = await Bps_1.default.subjects(category.subcat_id);
                if (subjects && !!category.title) {
                    result.push({
                        id: category.subcat_id,
                        name: category.title,
                        subjects: subjects
                            .map((subject) => ({
                            id: subject.sub_id,
                            name: subject.title.trim(),
                        }))
                            .filter((s) => !!s.name),
                    });
                }
            }
            return Object.values(result);
        });
    }
    async indicators(ctx) {
        const subject = ctx.request.input('subject');
        if (!subject) {
            throw new BadRequestException_1.default();
        }
        return await Adonis_Cache_1.default.remember(`api:bps:indicators/${subject}`, cache_1.ONE_YEAR / 2, async () => {
            const indicators = await Bps_1.default.indicators(subject);
            if (!indicators) {
                throw new NotFoundException_1.default();
            }
            return indicators
                .map((variable) => ({
                id: variable.var_id,
                name: variable.title.trim(),
                subject_id: variable.sub_id,
                subject_name: variable.sub_name,
                definition: variable.def,
                notes: variable.notes,
                vertical: variable.vertical,
                unit: variable.unit,
                graph_id: variable.graph_id,
                graph_name: variable.graph_name,
            }))
                .filter((v) => !!v.name);
        });
    }
    async characteristics(ctx) {
        const variable = ctx.request.input('variable');
        if (!variable) {
            throw new BadRequestException_1.default();
        }
        return await Adonis_Cache_1.default.remember(`api:bps:characteristics/${variable}`, cache_1.ONE_YEAR / 2, async () => {
            const characteristics = await Bps_1.default.characteristics(variable);
            if (!characteristics) {
                throw new NotFoundException_1.default();
            }
            return characteristics
                .map((char) => ({
                id: char.turvar_id,
                name: char.turvar.trim(),
                group_id: char.group_turvar_id,
                group_name: char.name_group_turvar,
            }))
                .filter((c) => !!c.name);
        });
    }
    async periods(ctx) {
        const variable = ctx.request.input('variable');
        if (!variable) {
            throw new BadRequestException_1.default();
        }
        return await Adonis_Cache_1.default.remember(`api:bps:periods/${variable}`, cache_1.ONE_YEAR / 2, async () => {
            const periods = await Bps_1.default.periods(variable);
            if (!periods) {
                throw new NotFoundException_1.default();
            }
            return periods
                .map((period) => ({
                id: period.th_id,
                name: period.th.trim(),
            }))
                .filter((p) => !!p.name);
        });
    }
    async verticals(ctx) {
        const variable = ctx.request.input('variable');
        if (!variable) {
            throw new BadRequestException_1.default();
        }
        return await Adonis_Cache_1.default.remember(`api:bps:verticals/${variable}`, cache_1.ONE_YEAR / 2, async () => {
            const verticals = await Bps_1.default.verticals(variable);
            if (!verticals) {
                throw new NotFoundException_1.default();
            }
            return verticals
                .map((vertical) => ({
                id: vertical.item_ver_id,
                name: vertical.vervar.trim(),
                code: vertical.kode_ver_id,
                group_id: vertical.group_ver_id,
                group_name: vertical.name_group_ver_id,
            }))
                .filter((v) => !!v.name);
        });
    }
    async data(ctx) {
        const variable = ctx.request.input('variable');
        if (!variable) {
            throw new BadRequestException_1.default();
        }
        return await Adonis_Cache_1.default.remember(`api:bps:data/${variable}`, cache_1.ONE_YEAR / 2, async () => {
            const data = await Bps_1.default.data(variable);
            const content = data.datacontent;
            if (!content) {
                throw new NotFoundException_1.default();
            }
            let result = {};
            for (const vervar of data.vervar) {
                for (const vars of data.var) {
                    for (const turvar of data.turvar) {
                        for (const tahun of data.tahun) {
                            for (const turtahun of data.turtahun) {
                                const key = `${vervar.val}${vars.val}${turvar.val}${tahun.val}${turtahun.val}`;
                                const value = content[key] || 0;
                                const item = { key: vervar.label, group: turvar.label, value };
                                if (tahun.label in result) {
                                    result[tahun.label].push(item);
                                }
                                else {
                                    result[tahun.label] = [item];
                                }
                            }
                        }
                    }
                }
            }
            return result;
        });
    }
}
exports.default = BpsController;
//# sourceMappingURL=BpsController.js.map