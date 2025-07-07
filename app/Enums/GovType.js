"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GovTypeDesc = void 0;
var GovType;
(function (GovType) {
    GovType[GovType["DISTRICT"] = 1] = "DISTRICT";
    GovType[GovType["BLUD"] = 2] = "BLUD";
    GovType[GovType["SECRETARIAT"] = 3] = "SECRETARIAT";
    GovType[GovType["AGENCY"] = 4] = "AGENCY";
    GovType[GovType["SERVICE"] = 5] = "SERVICE";
})(GovType || (GovType = {}));
exports.GovTypeDesc = {
    1: 'Kecamatan',
    2: 'BLUD',
    3: 'Sekretariat',
    4: 'Badan',
    5: 'Dinas dan Kantor',
};
exports.default = GovType;
//# sourceMappingURL=GovType.js.map