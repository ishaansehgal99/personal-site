#!/usr/bin/env bun

import { watch } from 'fs/promises'
import { spawn } from 'child_process'
import { join, extname } from 'path'

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
}

console.log(`${colors.bright}${colors.cyan}🌱 Quartz Development Server (Bun Edition)${colors.reset}`)
console.log(`${colors.yellow}Starting server and watching for changes...${colors.reset}\n`)

let quartzProcess = null
let isFirstRun = true
let isProcessing = false
let cooldownActive = false

// Directories to watch for changes
const watchDirs = [
  './content',
  './quartz/styles',
  './quartz/components',
  './quartz.config.ts',
]

// File extensions to ignore for triggering rebuilds
const ignoredExtensions = [
  '.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.ico', '.pdf', 
  '.mp4', '.mp3', '.webm', '.zip', '.tar', '.gz'
]

// Function to start the Quartz process
async function startQuartz() {
  if (isProcessing) {
    console.log(`${colors.yellow}Build already in progress, skipping restart${colors.reset}`)
    return
  }

  isProcessing = true

  if (quartzProcess) {
    console.log(`${colors.yellow}Restarting Quartz server...${colors.reset}`)
    quartzProcess.kill()
  } else {
    console.log(`${colors.green}Starting Quartz server...${colors.reset}`)
  }

  // Use bun to run the bootstrap CLI
  quartzProcess = spawn('bun', ['./quartz/bootstrap-cli.mjs', 'build', '--serve'], {
    stdio: 'inherit',
  })

  quartzProcess.on('error', (err) => {
    console.error(`${colors.red}Failed to start Quartz process:${colors.reset}`, err)
    isProcessing = false
  })

  // Set a cooldown period after startup to avoid recursive builds
  cooldownActive = true
  setTimeout(() => {
    cooldownActive = false
    isProcessing = false
    console.log(`${colors.green}Build process complete, now watching for changes${colors.reset}`)
  }, 10000) // 10-second cooldown

  return quartzProcess
}

// Start the initial Quartz process
await startQuartz()

// Helper to check if file should trigger a rebuild
function shouldTriggerRebuild(filename) {
  // Skip hidden files
  if (filename && filename.startsWith('.')) return false
  
  // Skip ignored extensions
  if (filename && ignoredExtensions.includes(extname(filename).toLowerCase())) return false
  
  return true
}

// Set up file watchers for each directory
const watchers = []

for (const dir of watchDirs) {
  try {
    const watcher = watch(dir, { recursive: true })
    console.log(`${colors.green}Watching ${dir} for changes${colors.reset}`)

    // Debounce function to avoid multiple restarts
    let debounceTimer = null
    
    // Process to handle file change events
    ;(async () => {
      for await (const event of watcher) {
        // Skip if we're in cooldown period
        if (cooldownActive || isProcessing) continue

        // Skip certain files
        if (!shouldTriggerRebuild(event.filename)) continue
        
        console.log(`${colors.yellow}Change detected in ${dir}/${event.filename}${colors.reset}`)
        
        // Debounce restart
        clearTimeout(debounceTimer)
        debounceTimer = setTimeout(() => {
          if (!cooldownActive) {
            startQuartz()
          }
        }, 1000) // Wait 1000ms before restarting
      }
    })()
    
    watchers.push(watcher)
  } catch (err) {
    console.error(`${colors.red}Error watching ${dir}:${colors.reset}`, err)
  }
}

// Handle process termination
process.on('SIGINT', () => {
  console.log(`\n${colors.bright}${colors.yellow}Shutting down Quartz development server...${colors.reset}`)
  if (quartzProcess) {
    quartzProcess.kill()
  }
  process.exit(0)
}) 