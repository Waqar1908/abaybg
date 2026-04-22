const API = `${window.location.origin}/api/products`

let editId = null
let existingImages = []

function getVal(id) {
  return document.getElementById(id).value
}

function setVal(id, value) {
  document.getElementById(id).value = value || ''
}

async function load() {
  const res = await fetch(API)
  const data = await res.json()

  document.getElementById('list').innerHTML = data.map(p => `
    <div class="card">
      <img src="${p.images?.[0] || ''}">
      <div class="card-body">
        <h3>${p.name}</h3>
        <div class="price">₹${p.price}</div>
        <p>${p.shortDescription}</p>

        <div class="card-actions">
          <button class="btn-edit" onclick="edit(${p.id})">Edit</button>
          <button class="btn-delete" onclick="del(${p.id})">Delete</button>
        </div>
      </div>
    </div>
  `).join('')
}

function openModal() {
  document.getElementById('modal').style.display = 'block'
}

function closeModal() {
  document.getElementById('modal').style.display = 'none'
  editId = null
  existingImages = []
}

async function edit(id) {
  editId = id
  openModal()

  const res = await fetch(API + '/' + id)
  const p = await res.json()

  existingImages = p.images || []

  setVal('slug', p.slug)
  setVal('name', p.name)
  setVal('price', p.price)
  setVal('shortDescription', p.shortDescription)
  setVal('description', p.description)
  setVal('fabric', p.fabric)
  setVal('color', p.color)
  setVal('images', existingImages.join(','))
}

async function save() {
  const imgInput = getVal('images').trim()

  const finalImages = imgInput
    ? imgInput.split(',').map(i => i.trim()).filter(i => i)
    : existingImages

  const data = {
    slug: getVal('slug'),
    name: getVal('name'),
    price: +getVal('price'),
    shortDescription: getVal('shortDescription'),
    description: getVal('description'),
    fabric: getVal('fabric'),
    color: getVal('color'),
    images: finalImages
  }


  if (editId) {
    await fetch(API + '/' + editId, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
  } else {
    await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
  }

  closeModal()
  load()
}

async function del(id) {
  if (confirm('Delete?')) {
    await fetch(API + '/' + id, { method: 'DELETE' })
    load()
  }
}

load()