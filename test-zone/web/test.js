for (f of fileInput.files) {
    console.log(f);
}


for (c of fileContent) {
    console.log(c.metadata.name);
    console.log(c.metadata);
    console.log(c.data);
}
