import { IFilter, FILTER_OPERATOR } from 'common/constant';

export class BaseTypeormParser {

    parseFilter(obj: Object, operator: string = FILTER_OPERATOR.EQUALS) {
        const query = {};
        for (const [key, val] of Object.entries(obj)) {
            
        }
    }

    parseQuery(filter: IFilter) {
        
    }
}
