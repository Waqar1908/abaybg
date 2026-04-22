const express = require('express')
const router = express.Router()
const db = require('./db')

router.get('/products', async (req, res) => {
  const result = await db.query('SELECT * FROM abaya_products ORDER BY id DESC')
  res.json(result.rows)
})

router.get('/products/:id', async (req, res) => {
  const result = await db.query('SELECT * FROM abaya_products WHERE id=$1', [req.params.id])
  res.json(result.rows[0])
})

router.post('/products', async (req, res) => {
  const { slug, name, price, shortDescription, description, fabric, color, images } = req.body
  const result = await db.query(
    'INSERT INTO abaya_products (slug,name,price,"shortDescription",description,fabric,color,images) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *',
    [slug, name, price, shortDescription, description, fabric, color, images]
  )
  res.json(result.rows[0])
})

router.put('/products/:id', async (req, res) => {
  const { slug, name, price, shortDescription, description, fabric, color, images } = req.body
  const result = await db.query(
    'UPDATE abaya_products SET slug=$1,name=$2,price=$3,"shortDescription"=$4,description=$5,fabric=$6,color=$7,images=$8 WHERE id=$9 RETURNING *',
    [slug, name, price, shortDescription, description, fabric, color, images, req.params.id]
  )
  res.json(result.rows[0])
})

router.delete('/products/:id', async (req, res) => {
  await db.query('DELETE FROM abaya_products WHERE id=$1', [req.params.id])
  res.json({ success: true })
})

module.exports = router