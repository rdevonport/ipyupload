const fileInput = document.getElementById('fileInput');
const output1 = document.getElementById('output');
const output2 = document.getElementById('output2');

fileInput.addEventListener('change', function(e) {
    console.log('new input');
    window.fileInput = fileInput;
    console.log('nb files = ' + fileInput.files.length);

    const promisesFileContent = [];
    let fileContent = [];

    for (let file of fileInput.files) {
        console.log(file);
        promisesFileContent.push(
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
                    let buffer = event.target.result;
                    // let buffer = fileReader.result;
                    let view = new DataView(buffer, 0, buffer.byteLength);;
                    resolve({
                        buffer: buffer,
                        view: view,
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

    Promise.all(promisesFileContent)
        .then(contents => {
            fileContent = contents;
            window.fileContent = fileContent;
            console.log(fileContent);
            for (c of fileContent) {
                console.log(c.metadata);
                console.log(c.buffer);
                let arrayInt8 = new Int8Array(c.buffer);
                let arrayUInt8 = new Uint8Array(c.buffer);
                console.log(JSON.stringify(arrayInt8));
                console.log(JSON.stringify(arrayUInt8));
                let view = c.view;
                console.log(view);
            }
        })
        .catch(err => {
            console.error('error in file upload: %o', err);
        });
});
