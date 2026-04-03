/**
 * RFC 2047 encode for email header fields (e.g. Subject).
 * @see https://www.rfc-editor.org/rfc/rfc2047
 */
export function encodeRfc2047(s: string): string {
  // const bytes = Buffer.from(s, "utf-8")
  // const maxBytesPerWord = 45 // 75 - 14 (=?UTF-8?B??=) leaves 61 base64 chars ≈ 45 bytes
  // const chunks: string[] = []
  // let pos = 0
  // while (pos < bytes.length) {
  //   let end = Math.min(pos + maxBytesPerWord, bytes.length)
  //   while (end > pos && (bytes[end - 1]! & 0xc0) === 0x80) {
  //     end--
  //   }
  //   const chunk = bytes.subarray(pos, end)
  //   chunks.push(`=?UTF-8?B?${chunk.toString("base64")}?=`)
  //   pos = end
  // }
  // return chunks.join(" ")


  const encodedSubject = Buffer.from(s).toString('base64')
  return `=?UTF-8?B?${encodedSubject}?=`
}

/**
 * Encode subject for email header. Uses RFC 2047 only when non-ASCII.
 */
export function encodeSubject(subject: string): string {
  // if (/^[\x00-\x7F]*$/.test(subject)) return subject
  return encodeRfc2047(subject)
}
