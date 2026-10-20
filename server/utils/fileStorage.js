import { readFile, writeFile, rename } from 'node:fs/promises'
import { dirname,join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const userPath = join(__dirname, '../data')


const approved_paths = {
    'users': join(userPath, 'users.json'),
    'workouts': join(userPath, 'workouts.json')
}

export async function readJson(fileType) {
    try { 
        if(!fileType || !approved_paths[fileType]) {
            return 'Invalid path given '+fileType
        }
        const path = approved_paths[fileType]
        const data = await readFile(path, 'utf8')
        const json = JSON.parse(data)
        return json
    }catch(v1) {
        console.warn('reading file failed '+v1 )
        throw v1
    }
}

export async function  writeJson(data, fileType) {
    try{
        if(!data || !Array.isArray(data)) {
            return 'Invalid data given'
        }
        if(!fileType || !approved_paths[fileType]) {
            return 'unsupported file type used '+fileType
        }
        const path = approved_paths[fileType]
        //const existingData = await readJson(path)
        const jsonData = JSON.stringify(data)

        const targetDir = dirname(path)
        const targetName = basename(path)
        const tempPath = join(targetDir, `.tmp_${Date.now()}_${targetName}`)
        await writeFile(tempPath, jsonData)
        await rename(tempPath, path)
        return 'Success'
    }catch(v2) {
        console.warn('writing a file failed '+v2)
        throw v2
    }
}