import BaseValidator from './base';

export default BaseValidator.create({
    properties: ['label', 'url'],

    label(model) {
        let label = model.get('label');
        let hasValidated = model.get('hasValidated');

        if (this.canBeIgnored(model)) {
            return;
        }

        if (validator.empty(label)) {
            model.get('errors').add('label', '必须设置一个标题');
            this.invalidate();
        }

        hasValidated.addObject('label');
    },

    url(model) {
        let url = model.get('url');
        let hasValidated = model.get('hasValidated');
        /* jscs:disable requireCamelCaseOrUpperCaseIdentifiers */
        let validatorOptions = {require_protocol: true};
        /* jscs:enable requireCamelCaseOrUpperCaseIdentifiers */
        let urlRegex = new RegExp(/^(\/|#|[a-zA-Z0-9\-]+:)/);

        if (this.canBeIgnored(model)) {
            return;
        }

        if (validator.empty(url)) {
            model.get('errors').add('url', '必须指定一个 URL 或相对路径');
            this.invalidate();
        } else if (url.match(/\s/) || (!validator.isURL(url, validatorOptions) && !url.match(urlRegex))) {
            model.get('errors').add('url', 'URL 或相对路径无效');
            this.invalidate();
        }

        hasValidated.addObject('url');
    },

    canBeIgnored(model) {
        let label = model.get('label');
        let url = model.get('url');
        let isLast = model.get('last');

        // if nav item is last and completely blank, mark it valid and skip
        if (isLast && (validator.empty(url) || url === '/') && validator.empty(label)) {
            model.get('errors').clear();
            return true;
        }

        return false;
    }
});
