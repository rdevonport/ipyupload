import * as widgets from '@jupyter-widgets/base';
import { extend } from 'lodash';
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
        that._counter = this.model.get('_counter');

        const divWidget = this.el;
        const divNew = document.createElement('div');
        divWidget.appendChild(divNew);

        divNew.id = `widget-upload-${this._id}`;

        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.multiple = true;
        divNew.appendChild(fileInput);

        window.fileInput = fileInput;

        fileInput.addEventListener('click', function(e) {
            fileInput.value = '';
        });

        fileInput.addEventListener('change', function(e) {
            console.log('new input');
            window.fileInput = fileInput;
            console.log('nb files = ' + fileInput.files.length);

            const promisesFile = [];

            for (let file of fileInput.files) {
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
                            // let buffer = fileReader.result;
                            let buffer = event.target.result;
                            // let view = new DataView(buffer, 0, buffer.byteLength);
                            // let view = new DataView(buffer.slice(0));
                            resolve({
                                buffer: buffer,
                                // view: view,
                                metadata: metadata,
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
            }

            Promise.all(promisesFile)
                .then(contents => {
                    window.contents = contents;
                    console.log(contents);
                    const li_metadata = [];
                    const li_buffer = [];
                    for (let c of contents) {
                        console.log(c);
                        console.log(c.metadata);
                        console.log(c.buffer);
                        let arrayInt8 = new Int8Array(c.buffer);
                        let arrayUInt8 = new Uint8Array(c.buffer);
                        console.log(JSON.stringify(arrayInt8));
                        console.log(JSON.stringify(arrayUInt8));
                        // let view = c.view;
                        // console.log(view);
                        li_metadata.push(c.metadata);
                        li_buffer.push(c.buffer);
                    }
                    Utils.show('li_metadata', li_metadata);
                    Utils.show('li_buffer', li_buffer);

                    that._counter += 1;

                    that.model.set({
                        _counter: that._counter,
                        li_metadata: li_metadata,
                        li_content: li_buffer,
                        error: '',
                    });
                    that.touch();
                })
                .catch(err => {
                    console.error('error in file upload: %o', err);
                    that._counter += 1;

                    that.model.set({
                        _counter: that._counter,
                        error: err,
                    });
                    that.touch();
                });
        });

        console.log('done');
    },
});

export { FileUploadModel, FileUploadView };
