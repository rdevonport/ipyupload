import * as base from '@jupyter-widgets/base';

import * as myWidget from './widget';
import { version } from './index';

const id = 'ipyupload';
const requires = [base.IJupyterWidgetRegistry];
const autoStart = true;

const activate = (app, widgets) => {
    console.log(`JupyterLab extension ${id} is activated!`);

    widgets.registerWidget({
        name: id,
        version,
        exports: myWidget,
    });
};

export default {
    id,
    requires,
    activate,
    autoStart,
};
