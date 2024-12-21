import './style.css'
import { supabase } from './supabaseClient.js'
import { v4 as uuidv4 } from 'uuid'

document.querySelector('#app').innerHTML = `
  <div class="blog-editor">
    <h1>Blog Editor</h1>
    <form id="blog-form">
      <div class="form-group">
        <label for="user-id">User ID:</label>
        <input type="text" id="user-id" required>
      </div>
      <div class="form-group">
        <label for="name">Name:</label>
        <input type="text" id="name" required>
      </div>
      <div class="form-group">
        <label for="title">Title:</label>
        <input type="text" id="title" required>
      </div>
      <div class="form-group">
        <label for="content">Content:</label>
        <textarea id="content" required></textarea>
      </div>
      <button type="submit">Save Blog</button>
    </form>
    <div id="status-message"></div>
  </div>
`

const form = document.getElementById('blog-form')
const statusMessage = document.getElementById('status-message')
let timeoutId
let currentBlogId = null
let isUserInfoLocked = false

// Lock user info fields after first save
function lockUserInfo() {
  if (!isUserInfoLocked) {
    document.getElementById('user-id').readOnly = true
    document.getElementById('name').readOnly = true
    isUserInfoLocked = true
  }
}

// Show status message
function showStatus(message, isError = false) {
  statusMessage.textContent = message
  statusMessage.className = isError ? 'error' : 'success'
}

async function saveBlog() {
  const userId = document.getElementById('user-id').value
  const name = document.getElementById('name').value
  const title = document.getElementById('title').value
  const content = document.getElementById('content').value
  const timestamp = new Date().toISOString()
  
  if (!currentBlogId) {
    currentBlogId = uuidv4()
  }

  try {
    const { data, error } = await supabase
      .from('blogs')
      .upsert([
        {
          id: currentBlogId,
          user_id: userId,
          name,
          title,
          content,
          created_at: timestamp,
          last_saved_at: timestamp
        }
      ], { onConflict: ['id'] })

    if (error) throw error

    showStatus('Blog saved successfully!')
    lockUserInfo()
  } catch (error) {
    console.error('Error:', error)
    showStatus('Error saving blog: ' + error.message, true)
  }
}

async function autoSave() {
  if (!currentBlogId || !isUserInfoLocked) return

  const title = document.getElementById('title').value
  const content = document.getElementById('content').value
  const timestamp = new Date().toISOString()

  try {
    const { error } = await supabase
      .from('blogs')
      .update({
        title,
        content,
        last_saved_at: timestamp
      })
      .match({ id: currentBlogId })

    if (error) throw error
    
    showStatus('Auto-saved')
  } catch (error) {
    console.error('Auto-save error:', error)
    showStatus('Auto-save failed', true)
  }
}

form.addEventListener('submit', async (event) => {
  event.preventDefault()
  await saveBlog()
})

form.addEventListener('input', (event) => {
  if (['title', 'content'].includes(event.target.id)) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(autoSave, 200)
  }
})