export function changeUpload(value) {
    const data = new FormData()
    data.append("file", value)
    return data
}