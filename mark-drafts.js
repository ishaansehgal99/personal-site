#!/usr/bin/env node

import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const contentDir = path.resolve(__dirname, './content');

async function getFiles(dir) {
  const entries = await fs.readdir(dir);
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry);
    const stats = await fs.stat(fullPath);

    if (stats.isDirectory()) {
      files.push(...(await getFiles(fullPath)));
    } else {
      files.push(fullPath);
    }
  }

  return files;
}

async function markTODOFilesAsDrafts() {
  console.log('Marking TODO files as drafts...');
  
  let count = 0;
  
  try {
    const files = await getFiles(contentDir);
    
    for (const filePath of files) {
      // Only process markdown files
      if (!filePath.endsWith('.md')) continue;
      
      try {
        const content = await fs.readFile(filePath, 'utf8');
        const fileName = path.basename(filePath);
        
        // Check if file has TODO in the name or content
        if (fileName.includes('TODO') || content.includes('TODO')) {
          console.log(`Processing: ${filePath}`);
          
          let newContent;
          
          if (content.startsWith('---')) {
            // File already has frontmatter
            if (!content.includes('draft: true')) {
              // Add draft: true to existing frontmatter
              const [firstLine, ...rest] = content.split('\n');
              newContent = [firstLine, 'draft: true', ...rest].join('\n');
            } else {
              // Already has draft: true, no changes needed
              continue;
            }
          } else {
            // No frontmatter, add it
            newContent = `---\ndraft: true\n---\n\n${content}`;
          }
          
          await fs.writeFile(filePath, newContent, 'utf8');
          count++;
        }
      } catch (error) {
        console.error(`Error processing ${filePath}:`, error);
      }
    }
    
    console.log(`Done! Marked ${count} files as drafts.`);
  } catch (error) {
    console.error('Error scanning directory:', error);
  }
}

markTODOFilesAsDrafts(); 