import fs from 'fs';
import path from 'path';

export async function deleteUploadedPicture(filenames: string[] | string){
  
  if(!Array.isArray(filenames))
    filenames = [filenames];

  filenames.forEach(async (filename) => {
    if(!filename) return;
    
    const filepath =  path.join(__dirname, '..', 'public', 'uploads', filename);

    if(fs.existsSync(filepath))
      await fs.promises.unlink(filepath);
  }); 
}