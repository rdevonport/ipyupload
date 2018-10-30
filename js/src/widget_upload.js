import * as widgets from '@jupyter-widgets/base';
import { extend } from 'lodash';
import '@jupyter-widgets/controls/css/widgets.css';

import { version } from '../package.json';
import * as Utils from './widget_utils';

const semver_range = `~${version}`;

const FileUploadModel = widgets.DOMWidgetModel.extend(
    {
        defaults() {
            return extend(FileUploadModel.__super__.defaults.call(this), {
                _model_name: 'FileUploadModel',
                _view_name: 'FileUploadView',
                _model_module: 'ipyupload',
                _view_module: 'ipyupload',
                _model_module_version: semver_range,
                _view_module_version: semver_range,

                _id: 0,
                _counter: 0,

                accept: '',
                disabled: false,
                multiple: false,
                style: '',

                li_metadata: [],
                li_content: [],
                error: '',
            });
        },
    },
    {
        serializers: _.extend(
            {
                li_content: { serialize: Utils.serialize_content },
            },
            widgets.DOMWidgetModel.serializers
        ),
    }
);

const FileUploadView = widgets.DOMWidgetView.extend({
    render() {
        const that = this;
        that._id = this.model.get('_id');
        that.counter = this.model.get('_counter');

        const divWidget = this.el;
        const divNew = document.createElement('div');
        divWidget.appendChild(divNew);

        divNew.id = `widget-upload-${this._id}`;

        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.multiple = that.model.get('multiple');
        fileInput.style = 'display: none';
        divNew.appendChild(fileInput);
        that.fileInput = fileInput;

        const btn = document.createElement('button');
        btn.innerHTML = Utils.build_btn_inner_html(null);
        btn.className = 'p-Widget jupyter-widgets jupyter-button widget-button';
        btn.disabled = this.model.get('disabled');
        btn.style = this.model.get('style_button');
        divNew.appendChild(btn);
        that.btn = btn;

        // debug
        window.fileInput = fileInput;

        btn.addEventListener('click', () => {
            fileInput.click();
        });

        fileInput.addEventListener('click', () => {
            fileInput.value = '';
        });

        fileInput.addEventListener('change', () => {
            console.log(`new input: nb files = ${fileInput.files.length}`);
            const promisesFile = [];
            Array.from(fileInput.files).forEach(file => {
                console.log(file);
                promisesFile.push(
                    new Promise((resolve, reject) => {
                        const metadata = {
                            name: file.name,
                            type: file.type,
                            size: file.size,
                            lastModified: file.lastModified,
                            lastModifiedDate: file.lastModifiedDate,
                            error: file.error,
                        };
                        const fileReader = new FileReader();
                        fileReader.onload = event => {
                            const buffer = event.target.result;
                            resolve({
                                buffer,
                                metadata,
                            });
                        };
                        fileReader.onerror = () => {
                            metadata.error = fileReader.error.message;
                            reject();
                        };
                        fileReader.onabort = fileReader.onerror;
                        fileReader.readAsArrayBuffer(file);
                    })
                );
            });
            Promise.all(promisesFile)
                .then(contents => {
                    window.contents = contents;
                    console.log(contents);
                    const li_metadata = [];
                    const li_buffer = [];
                    contents.forEach(c => {
                        // console.log(c);
                        // let arrayInt8 = new Int8Array(c.buffer);
                        // let arrayUInt8 = new Uint8Array(c.buffer);
                        // console.log(JSON.stringify(arrayInt8));
                        // console.log(JSON.stringify(arrayUInt8));
                        li_metadata.push(c.metadata);
                        li_buffer.push(c.buffer);
                    });
                    Utils.show('li_metadata', li_metadata);
                    Utils.show('li_buffer', li_buffer);
                    that.counter += 1;
                    that.model.set({
                        _counter: that.counter,
                        li_metadata,
                        li_content: li_buffer,
                        error: '',
                    });
                    that.touch();
                    btn.innerHTML = Utils.build_btn_inner_html(li_metadata.length);
                })
                .catch(err => {
                    console.error('error in file upload: %o', err);
                    that.counter += 1;
                    that.model.set({
                        _counter: that.counter,
                        error: err,
                    });
                    that.touch();
                    btn.innerHTML = Utils.build_btn_inner_html(null);
                });
        });

        that.model.on('change:accept', that.update_accept, that);
        that.model.on('change:disabled', that.toggle_disabled, that);
        that.model.on('change:multiple', that.update_multiple, that);
        that.model.on('change:style_button', that.update_style_button, that);

        console.log('widget FileUpload ready');

        // debug
        window.that = that;
    },
    update_accept() {
        // console.log('in update_accept');
        this.fileInput.accept = this.model.get('accept');
    },
    toggle_disabled() {
        // console.log('in toggle_disabled');
        this.btn.disabled = this.model.get('disabled');
    },
    update_multiple() {
        // console.log('in update_multiple');
        this.fileInput.multiple = this.model.get('multiple');
    },
    update_style_button() {
        // console.log('in update_style_button');
        this.btn.style = this.model.get('style_button');
    },
});

export { FileUploadModel, FileUploadView };
