const multer = require('multer')

const storage = multer.memoryStorage()

const uploadMedia = multer({
  storage: storage,
  limits: { fileSize: 20000000 },
})

module.exports = uploadMedia
