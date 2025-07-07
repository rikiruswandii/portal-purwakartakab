"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const xml_js_1 = require("xml-js");
const Helpers_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/Helpers"));
class WeatherController {
    async index(_ctx) {
        const request = Helpers_1.default.axios({
            baseURL: 'https://data.bmkg.go.id/DataMKG/MEWS/DigitalForecast',
        });
        const response = await request.get('DigitalForecast-JawaBarat.xml');
        const weathers = (0, xml_js_1.xml2js)(response.data, { compact: true });
        const weather = weathers.data.forecast.area.find((area) => area._attributes.description === 'Purwakarta');
        const data = weather.parameter.map((param) => [
            param._attributes.id,
            {
                name: param._attributes.description,
                type: param._attributes.type,
                times: param.timerange.map((time) => {
                    const attributes = {
                        ...time._attributes,
                        h: time._attributes.h ? Number(time._attributes.h) : undefined,
                        day: time._attributes.day ? Number(time._attributes.day) : undefined,
                        datetime: time._attributes.datetime ? Number(time._attributes.datetime) : undefined,
                    };
                    const type = param._attributes.id;
                    if (['t', 'tmax', 'tmin'].includes(type)) {
                        const celcius = Number(time.value[0]._text);
                        const fahrenheit = Number(time.value[1]._text);
                        return { ...attributes, celcius, fahrenheit };
                    }
                    if (type === 'ws') {
                        const kt = Number(time.value[0]._text);
                        const mph = Number(time.value[1]._text);
                        const kph = Number(time.value[2]._text);
                        const ms = Number(time.value[3]._text);
                        return { ...attributes, kt, mph, kph, ms };
                    }
                    if (type === 'wd') {
                        const codes = {
                            N: 'North',
                            NNE: 'North-Northeast',
                            NE: 'Northeast',
                            ENE: 'East-Northeast',
                            E: 'East',
                            ESE: 'East-Southeast',
                            SE: 'Southeast',
                            SSE: 'South-Southeast',
                            S: 'South',
                            SSW: 'South-Southwest',
                            SW: 'Southwest',
                            WSW: 'West-Southwest',
                            W: 'West',
                            WNW: 'West-Northwest',
                            NW: 'Northwest',
                            NNW: 'North-Northwest',
                        };
                        const deg = Number(time.value[0]._text);
                        const card = codes[time.value[1]._text] || '';
                        const sexa = time.value[2]._text;
                        return { ...attributes, deg, card, sexa };
                    }
                    if (['hu', 'humin', 'humax'].includes(type)) {
                        const value = Number(time.value._text);
                        const unit = time.value._attributes.unit;
                        return { ...attributes, value, unit };
                    }
                    const code = Number(time.value._text);
                    const name = code >= 95
                        ? 'Hujan Petir'
                        : code >= 80
                            ? 'Hujan Lokal'
                            : code >= 63
                                ? 'Hujan Lebat'
                                : code >= 61
                                    ? 'Hujan Sedang'
                                    : code >= 60
                                        ? 'Hujan Ringan'
                                        : code >= 45
                                            ? 'Kabut'
                                            : code >= 10
                                                ? 'Asap'
                                                : code === 5
                                                    ? 'Udara Kabur'
                                                    : code === 4
                                                        ? 'Berawan Tebal'
                                                        : code === 3
                                                            ? 'Berawan'
                                                            : code >= 1
                                                                ? 'Cerah Berawan'
                                                                : 'Cerah';
                    return { ...attributes, code, name };
                }),
            },
        ]);
        return Object.fromEntries(data);
    }
}
exports.default = WeatherController;
//# sourceMappingURL=WeatherController.js.map