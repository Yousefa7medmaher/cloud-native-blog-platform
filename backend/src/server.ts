import app from './app';
import { connectDB } from './config/db';
import { env } from './config/env';
import { Category } from './models/Category';
import slugify from 'slugify';

const seedCategories = async () => {
  const defaults = [
    { name: 'Technology', description: 'Tech news and tutorials' },
    { name: 'Design', description: 'UI/UX and creative design' },
    { name: 'Development', description: 'Software development topics' },
    { name: 'DevOps', description: 'Infrastructure and deployment' },
    { name: 'Lifestyle', description: 'Personal stories and lifestyle' },
  ];

  for (const cat of defaults) {
    const slug = slugify(cat.name, { lower: true, strict: true });
    await Category.updateOne({ slug }, { ...cat, slug }, { upsert: true });
  }
};

const start = async () => {
  await connectDB();
  await seedCategories();

  app.listen(env.port, () => {
    console.log(`JooBlog API running on port ${env.port}`);
  });
};

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
