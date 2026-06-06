export const CLOUDINARY_ROOT_FOLDER = 'dc_prime'

export type CloudinaryFolderContext = {
  projectId?: string | number | null
  listingId?: string | number | null
  clientId?: string | number | null
  clientUnitId?: string | number | null
  buyer?: string | null
  unitId?: string | number | null
  role?: string | null
}

export type CloudinaryResourceType = 'image' | 'video' | 'raw' | 'auto'

export type CloudinaryUploadOptions = {
  folder?: string
  resourceType?: CloudinaryResourceType
  tags?: string[]
}

export type CloudinaryUploadResult = {
  secure_url: string
  public_id: string
  resource_type: string
  original_filename?: string
  bytes?: number
  format?: string
}

export const cloudinaryFolders = {
  root: CLOUDINARY_ROOT_FOLDER,
  assets: () => joinCloudinaryFolder(CLOUDINARY_ROOT_FOLDER, 'assets'),
  projects: (context: Pick<CloudinaryFolderContext, 'projectId'> = {}) =>
    joinCloudinaryFolder(CLOUDINARY_ROOT_FOLDER, 'projects', context.projectId),
  listings: (context: Pick<CloudinaryFolderContext, 'projectId' | 'listingId'> = {}) =>
    joinCloudinaryFolder(CLOUDINARY_ROOT_FOLDER, 'listings', context.projectId, context.listingId),
  clientDocuments: (context: Pick<CloudinaryFolderContext, 'clientId' | 'clientUnitId' | 'buyer' | 'unitId'> = {}) =>
    joinCloudinaryFolder(
      CLOUDINARY_ROOT_FOLDER,
      'documents',
      'clients',
      context.clientId ?? context.buyer,
      context.clientUnitId ? 'units' : undefined,
      context.clientUnitId ?? context.unitId,
    ),
  receipts: (context: Pick<CloudinaryFolderContext, 'clientId' | 'buyer' | 'unitId'> = {}) =>
    joinCloudinaryFolder(CLOUDINARY_ROOT_FOLDER, 'receipts', context.clientId ?? context.buyer, context.unitId),
  avatars: (context: Pick<CloudinaryFolderContext, 'role'> = {}) =>
    joinCloudinaryFolder(CLOUDINARY_ROOT_FOLDER, 'avatars', context.role),
  people: (context: Pick<CloudinaryFolderContext, 'role'> = {}) =>
    joinCloudinaryFolder(CLOUDINARY_ROOT_FOLDER, 'people', context.role),
}

export async function uploadToCloudinary(file: File, options: CloudinaryUploadOptions = {}) {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary is not configured. Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET.')
  }

  const resourceType = options.resourceType ?? 'auto'
  const folder = options.folder ?? cloudinaryFolders.assets()
  const formData = new FormData()

  formData.append('file', file)
  formData.append('upload_preset', uploadPreset)
  formData.append('folder', folder)
  formData.append('asset_folder', folder)
  if (options.tags?.length) formData.append('tags', options.tags.join(','))

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || 'Cloudinary upload failed.')
  }

  return response.json() as Promise<CloudinaryUploadResult>
}

function joinCloudinaryFolder(...parts: Array<string | number | null | undefined>) {
  return parts.map(toFolderPart).filter(Boolean).join('/')
}

function toFolderPart(part: string | number | null | undefined) {
  if (part === null || part === undefined) return ''

  return String(part)
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
}
