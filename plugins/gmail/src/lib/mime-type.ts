import mime from 'mime'
import { fileTypeFromBuffer } from 'file-type'

export function getType(ext: string) {
  return mime.getType(ext)
}

export function getExtension(fileName: string) {
  return fileName.slice(fileName.lastIndexOf(".") + 1)
}

export function conformityType(fileName: string, mimeType: string): boolean {
  const ext = getExtension(fileName)
  const fileType = mime.getType(ext)
  return mimeType == fileType
}

function base64ToBuffer(str: string) {
  const binStr = atob(str)
  const len = binStr.length
  const bytes = new Uint8Array(len)

  for (let i = 0; i < len; i++) {
    bytes[i] = binStr.charCodeAt(i)
  }

  return bytes
}

export async function getMimeFromBase64(base64Str: string) {
  const buff = base64ToBuffer(base64Str)
  const res = await fileTypeFromBuffer(buff)
  if (!res) {
    throw new Error("can not get extension and mime-type")
  }
  return res
}