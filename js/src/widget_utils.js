function serialize_content(listBuffer) {
    window.listBuffer = listBuffer;
    const listCompressed = listBuffer.map(e => new DataView(e.slice(0)));
    return listCompressed;
}

function show(name, variable) {
    console.log(name);
    console.log(variable);
}

export { serialize_content, show };
