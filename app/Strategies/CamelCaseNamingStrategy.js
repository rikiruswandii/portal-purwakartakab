"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("@poppinss/utils/build/helpers");
class CamelCaseNamingStrategy {
    tableName(model) {
        return helpers_1.string.pluralize(helpers_1.string.snakeCase(model.name));
    }
    columnName(_, attributeName) {
        return helpers_1.string.snakeCase(attributeName);
    }
    serializedName(_, attributeName) {
        return helpers_1.string.camelCase(attributeName);
    }
    relationLocalKey(relation, model, relatedModel) {
        if (relation === 'belongsTo') {
            return relatedModel.primaryKey;
        }
        return model.primaryKey;
    }
    relationForeignKey(relation, model, relatedModel) {
        if (relation === 'belongsTo') {
            return helpers_1.string.camelCase(`${relatedModel.name}_${relatedModel.primaryKey}`);
        }
        return helpers_1.string.camelCase(`${model.name}_${model.primaryKey}`);
    }
    relationPivotTable(_, model, relatedModel) {
        return helpers_1.string.snakeCase([relatedModel.name, model.name].sort().join('_'));
    }
    relationPivotForeignKey(_, model) {
        return helpers_1.string.snakeCase(`${model.name}_${model.primaryKey}`);
    }
    paginationMetaKeys() {
        return {
            total: 'total',
            perPage: 'perPage',
            currentPage: 'currentPage',
            lastPage: 'lastPage',
            firstPage: 'firstPage',
            firstPageUrl: 'firstPageUrl',
            lastPageUrl: 'lastPageUrl',
            nextPageUrl: 'nextPageUrl',
            previousPageUrl: 'previousPageUrl',
        };
    }
}
exports.default = CamelCaseNamingStrategy;
//# sourceMappingURL=CamelCaseNamingStrategy.js.map