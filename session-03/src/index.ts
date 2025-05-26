import express, { Request, Response } from 'express';

const app = express();
const port = 3000;

app.use(express.json());

// POST /blobs/:id
app.post('/blobs/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;

  // Do something with data, maybe save it to memory or DB
  console.log(`Received blob with ID: ${id}`, data);

  res.status(201).json({ message: `Blob ${id} created`, data });
});

// DELETE /blobs/:id
app.delete('/blobs/:id', (req: Request, res: Response) => {
  const { id } = req.params;

  // Delete logic here
  console.log(`Deleted blob with ID: ${id}`);

  res.status(200).json({ message: `Blob ${id} deleted` });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
