const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const {
  sequelize,
  User,
  Service,
  Gallery,
  Photo,
  BlogCategory,
  BlogPost,
  Testimonial
} = require('../models');

async function seed() {
  console.log('Starting seed script...');
  await sequelize.authenticate();
  await sequelize.sync({ alter: true });

  const [admin] = await User.findOrCreate({
    where: { email: 'admin@mophixstudio.com' },
    defaults: {
      first_name: 'Mophix',
      last_name: 'Admin',
      password_hash: 'Admin123!',
      role: 'admin',
      profile_image_url: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=400&q=80',
      bio: 'Studio administrator and photographer',
      city: 'Kigali',
      country: 'Rwanda'
    }
  });

  const serviceData = [
    {
      name: 'Wedding Photography',
      description: 'Cinematic wedding coverage with expert direction and digital delivery.',
      category: 'Wedding',
      price: 4500000,
      duration_hours: 8,
      includes_photos_count: 250,
      includes_album: true,
      includes_prints: true,
      is_active: true
    },
    {
      name: 'Portrait Session',
      description: 'Creative portrait sessions for individuals, families, and professionals.',
      category: 'Portrait',
      price: 1800000,
      duration_hours: 3,
      includes_photos_count: 80,
      includes_album: false,
      includes_prints: false,
      is_active: true
    },
    {
      name: 'Event Coverage',
      description: 'Full event photography for corporate functions, concerts, and launches.',
      category: 'Event',
      price: 3200000,
      duration_hours: 6,
      includes_photos_count: 180,
      includes_album: false,
      includes_prints: true,
      is_active: true
    }
  ];

  for (const data of serviceData) {
    await Service.findOrCreate({ where: { name: data.name }, defaults: data });
  }

  const galleriesData = [
    {
      title: 'Elegant Wedding Story',
      description: 'A heartfelt ceremony captured with intimacy and cinematic style.',
      cover_image_path: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80',
      event_type: 'Wedding',
      photo_count: 120,
      is_published: true,
      created_by: admin.user_id,
      published_date: new Date()
    },
    {
      title: 'Modern Studio Portraits',
      description: 'Styled portrait work showcasing personality and professional branding.',
      cover_image_path: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80',
      event_type: 'Portrait',
      photo_count: 50,
      is_published: true,
      created_by: admin.user_id,
      published_date: new Date()
    },
    {
      title: 'Corporate Event Highlights',
      description: 'High-energy event photography for business conferences and launches.',
      cover_image_path: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
      event_type: 'Event',
      photo_count: 90,
      is_published: true,
      created_by: admin.user_id,
      published_date: new Date()
    }
  ];

  for (const data of galleriesData) {
    const [gallery] = await Gallery.findOrCreate({ where: { title: data.title }, defaults: data });

    await Photo.findOrCreate({
      where: { title: `${gallery.title} Sample Image` },
      defaults: {
        gallery_id: gallery.gallery_id,
        title: `${gallery.title} Sample Image`,
        description: gallery.description,
        file_path: gallery.cover_image_path,
        thumbnail_path: gallery.cover_image_path,
        photographer_name: 'Mophix Studio',
        is_featured: true,
        image_width: 1200,
        image_height: 800
      }
    });
  }

  const [testimonial] = await Testimonial.findOrCreate({
    where: { title: 'Outstanding service and final photos' },
    defaults: {
      booking_id: null,
      user_id: admin.user_id,
      rating: 5,
      title: 'Outstanding service and final photos',
      content: 'The team at Mophix Studio delivered exceptional work with prompt communication and beautiful images.',
      photo_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80',
      is_approved: true,
      approved_by: admin.user_id,
      approved_date: new Date(),
      is_featured: true
    }
  });

  const [category] = await BlogCategory.findOrCreate({
    where: { name: 'Photography Tips' },
    defaults: {
      slug: 'photography-tips',
      description: 'Advice and inspiration for planning your studio session.'
    }
  });

  await BlogPost.findOrCreate({
    where: { title: 'How to prepare for your photography session' },
    defaults: {
      slug: 'prepare-for-photoshoot',
      content: 'Learn how to plan your wardrobe, choose locations, and feel confident in front of the camera.',
      featured_image_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1200&q=80',
      category_id: category.blog_category_id,
      author_id: admin.user_id,
      status: 'published',
      published_date: new Date()
    }
  });

  console.log('Seed complete.');
  await sequelize.close();
}

seed().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
