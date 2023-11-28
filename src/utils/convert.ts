export function hexStringToBlobUrl(hexString: string) {
  function blobToUrl(blob: Blob) {
    return URL.createObjectURL(blob)
  }

  const arrayBuffer = new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16))).buffer
  const blob = new Blob([arrayBuffer])

  const blobUrl = blobToUrl(blob)

  return blobUrl
}
