function serialize_content(listBuffer) {
    return listBuffer.map(e => new DataView(e.slice(0)));
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

function show(name, variable) {
    console.log(name);
    console.log(variable);
}

export { serialize_content, build_btn_inner_html, show };
