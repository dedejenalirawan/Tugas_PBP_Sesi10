const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const app = express();
const port = 3000;

app.use(express.json());

app.get('/api/mahasiswa', async (req, res) => {
  try {
    const mahasiswa = await prisma.mahasiswa.findMany();
    res.json(mahasiswa);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.post('/api/mahasiswa', async (req, res) => {
  const newMahasiswa = req.body;
  try {
    const createdMahasiswa = await prisma.mahasiswa.create({ data: newMahasiswa });
    res.json({ message: 'Mahasiswa berhasil ditambahkan.', data: createdMahasiswa });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.put('/api/mahasiswa/:nim', async (req, res) => {
  const updatedMahasiswa = req.body;
  const nim = req.params.nim;
  try {
    const existingMahasiswa = await prisma.mahasiswa.findUnique({ where: { nim } });
    if (!existingMahasiswa) {
      return res.status(404).json({ message: `Mahasiswa dengan NIM ${nim} tidak ditemukan.` });
    }
    const updatedMahasiswaResult = await prisma.mahasiswa.update({ where: { nim }, data: updatedMahasiswa });
    res.json({ message: `Mahasiswa dengan NIM ${nim} berhasil diperbarui.`, data: updatedMahasiswaResult });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.delete('/api/mahasiswa/:nim', async (req, res) => {
  const nim = req.params.nim;
  try {
    const existingMahasiswa = await prisma.mahasiswa.findUnique({ where: { nim } });
    if (!existingMahasiswa) {
      return res.status(404).json({ message: `Mahasiswa dengan NIM ${nim} tidak ditemukan.` });
    }
    await prisma.mahasiswa.delete({ where: { nim } });
    res.json({ message: `Mahasiswa dengan NIM ${nim} berhasil dihapus.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
