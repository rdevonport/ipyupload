function serialize_content(listBuffer) {
    window.listBuffer = listBuffer;
    const listCompressed = listBuffer.map(e => new DataView(e.slice(0)));
    return listCompressed;
}

function show(name, variable) {
    console.log(name);
    console.log(variable);
}

function build_btn_inner_html(n) {
    const icon = `<i class="fa fa-upload"></i>`;
    const text = `Upload`;
    let html = `${icon}  ${text}`;
    if (n === 1) {
        html += ` (${n} file)`;
    }

    if (n > 1) {
        html += ` (${n} files)`;
    }
    return html;
}

export { serialize_content, show, build_btn_inner_html };
