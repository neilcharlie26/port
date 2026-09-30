const TARGET_BYTES = 250_000

/** Prepare the stored image, not just its preview. Animated images become stills. */
export default async function compressImage(file: File): Promise<{ data: string; name: string; size: number; mime: string }> {
  const url = URL.createObjectURL(file)
  const image = new Image()
  try {
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve()
      image.onerror = () => reject(new Error('Could not read this image. Try another file.'))
      image.src = url
    })
    if (!image.naturalWidth || !image.naturalHeight) throw new Error('This image has no valid dimensions.')
    const scale = Math.min(1, 1600 / Math.max(image.naturalWidth, image.naturalHeight))
    const canvas = document.createElement('canvas')
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale))
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale))
    const context = canvas.getContext('2d')
    if (!context) throw new Error('Image compression is unavailable in this browser.')
    let output: Blob | undefined
    // Lower quality first, then dimensions, until the stored file fits the target.
    for (let resize = 0; resize < 10 && !output; resize++) {
      context.clearRect(0, 0, canvas.width, canvas.height)
      context.drawImage(image, 0, 0, canvas.width, canvas.height)
      for (const quality of [0.82, 0.68, 0.52]) {
        const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/webp', quality))
        if (!blob) throw new Error('Could not compress this image. Try another file.')
        if (blob.size <= TARGET_BYTES) { output = blob; break }
      }
      if (!output) {
        canvas.width = Math.max(1, Math.floor(canvas.width * 0.75))
        canvas.height = Math.max(1, Math.floor(canvas.height * 0.75))
      }
    }
    if (!output) throw new Error('Could not shrink this image below 250 KB. Try a smaller image.')
    // Already-small static images need no extra loss or larger replacement.
    if (file.type !== 'image/gif' && file.size <= output.size && scale === 1) output = file
    const data = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(String(reader.result))
      reader.onerror = () => reject(new Error('Could not prepare this image.'))
      reader.readAsDataURL(output)
    })
    const extension = output.type === 'image/webp' ? 'webp' : output.type === 'image/jpeg' ? 'jpg' : 'png'
    return { data, name: output === file ? file.name : `${file.name.replace(/\.[^.]+$/, '')}.${extension}`, size: output.size, mime: output.type }
  } finally { URL.revokeObjectURL(url) }
}
