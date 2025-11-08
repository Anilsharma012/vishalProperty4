import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';
import Property from '../models/Property';
import Enquiry from '../models/Enquiry';
import Page from '../models/Page';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI not set in environment variables');
  process.exit(1);
}

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✓ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Property.deleteMany({});
    await Enquiry.deleteMany({});
    await Page.deleteMany({});
    console.log('✓ Cleared existing data');

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@vishalproperties.com',
      phone: '9876543210',
      password: 'Admin@12345',
      role: 'admin',
      status: 'active'
    });
    console.log('✓ Created admin user:', adminUser.email);

    // Create multiple regular users
    const users = await User.insertMany([
      {
        name: 'Rahul Kumar',
        email: 'rahul@example.com',
        phone: '9876543211',
        password: 'User@12345',
        role: 'user',
        status: 'active'
      },
      {
        name: 'Priya Singh',
        email: 'priya@example.com',
        phone: '9876543212',
        password: 'User@12345',
        role: 'user',
        status: 'active'
      },
      {
        name: 'Amit Patel',
        email: 'amit@example.com',
        phone: '9876543213',
        password: 'User@12345',
        role: 'user',
        status: 'active'
      },
      {
        name: 'Neha Verma',
        email: 'neha@example.com',
        phone: '9876543214',
        password: 'User@12345',
        role: 'user',
        status: 'active'
      },
      {
        name: 'John Doe',
        email: 'user@example.com',
        phone: '9876543215',
        password: 'User@12345',
        role: 'user',
        status: 'active'
      }
    ]);
    console.log('✓ Created', users.length, 'regular users');

    // Create properties
    const properties = await Property.insertMany([
      {
        title: '3 BHK Luxury Flat in Sector 36',
        slug: '3-bhk-luxury-flat-in-sector-36',
        price: 8500000,
        propertyType: 'Apartment',
        status: 'active',
        location: 'Sector 36, Rohtak',
        city: 'Rohtak',
        area: 1500,
        bedrooms: 3,
        bathrooms: 2,
        features: ['Parking', 'Balcony', 'Gym', 'Security'],
        description: 'Spacious 3 BHK luxury apartment with modern amenities, located in prime area of Sector 36 Rohtak.',
        images: [
          'https://via.placeholder.com/400x300?text=Luxury+Flat+1',
          'https://via.placeholder.com/400x300?text=Luxury+Flat+2'
        ],
        coverImage: 'https://via.placeholder.com/400x300?text=Luxury+Flat+1',
        premium: true,
        ownerContact: '9876543210',
        createdBy: adminUser._id
      },
      {
        title: 'Residential Plot - Suncity Heights',
        slug: 'residential-plot-suncity-heights',
        price: 4500000,
        propertyType: 'Plot',
        status: 'active',
        location: 'Suncity Heights, Rohtak',
        city: 'Rohtak',
        area: 2500,
        bedrooms: 0,
        bathrooms: 0,
        features: ['Open Plot', 'Road Facing', 'Good Location'],
        description: 'Beautiful residential plot in Suncity Heights with all modern facilities and good connectivity.',
        images: [
          'https://via.placeholder.com/400x300?text=Plot+1',
          'https://via.placeholder.com/400x300?text=Plot+2'
        ],
        coverImage: 'https://via.placeholder.com/400x300?text=Plot+1',
        premium: false,
        ownerContact: '9876543210',
        createdBy: adminUser._id
      },
      {
        title: '2 BHK Apartment - Suncity Projects',
        slug: '2-bhk-apartment-suncity-projects',
        price: 5500000,
        propertyType: 'Apartment',
        status: 'active',
        location: 'Suncity Projects, Rohtak',
        city: 'Rohtak',
        area: 1100,
        bedrooms: 2,
        bathrooms: 1,
        features: ['Parking', 'Balcony', 'Water Supply'],
        description: 'Comfortable 2 BHK apartment in well-developed Suncity Projects area.',
        images: [
          'https://via.placeholder.com/400x300?text=Apartment+1',
          'https://via.placeholder.com/400x300?text=Apartment+2'
        ],
        coverImage: 'https://via.placeholder.com/400x300?text=Apartment+1',
        premium: false,
        ownerContact: '9876543210',
        createdBy: adminUser._id
      },
      {
        title: 'Commercial Space - Sector 3',
        slug: 'commercial-space-sector-3',
        price: 12000000,
        propertyType: 'Commercial',
        status: 'active',
        location: 'Sector 3, Rohtak',
        city: 'Rohtak',
        area: 2500,
        bedrooms: 0,
        bathrooms: 2,
        features: ['Loading Area', 'Power Backup', 'Security'],
        description: 'Prime commercial space ideal for offices, retail, or warehousing in Sector 3.',
        images: [
          'https://via.placeholder.com/400x300?text=Commercial+1',
          'https://via.placeholder.com/400x300?text=Commercial+2'
        ],
        coverImage: 'https://via.placeholder.com/400x300?text=Commercial+1',
        premium: true,
        ownerContact: '9876543210',
        createdBy: adminUser._id
      },
      {
        title: '4 BHK Villa - Premium Location',
        slug: '4-bhk-villa-premium-location',
        price: 15000000,
        propertyType: 'House',
        status: 'active',
        location: 'Suncity Heights, Rohtak',
        city: 'Rohtak',
        area: 3000,
        bedrooms: 4,
        bathrooms: 3,
        features: ['Garden', 'Parking', 'Security', 'Swimming Pool'],
        description: 'Luxurious 4 BHK villa with premium amenities and spacious garden.',
        images: [
          'https://via.placeholder.com/400x300?text=Villa+1',
          'https://via.placeholder.com/400x300?text=Villa+2'
        ],
        coverImage: 'https://via.placeholder.com/400x300?text=Villa+1',
        premium: true,
        ownerContact: '9876543210',
        createdBy: adminUser._id
      },
      {
        title: '1 BHK Affordable Apartment - Sector 7',
        slug: '1-bhk-affordable-apartment-sector-7',
        price: 2500000,
        propertyType: 'Apartment',
        status: 'active',
        location: 'Sector 7, Rohtak',
        city: 'Rohtak',
        area: 600,
        bedrooms: 1,
        bathrooms: 1,
        features: ['Parking', 'Water Supply', 'Electricity'],
        description: 'Budget-friendly 1 BHK apartment perfect for young professionals and first-time buyers.',
        images: [
          'https://via.placeholder.com/400x300?text=Affordable+1',
          'https://via.placeholder.com/400x300?text=Affordable+2'
        ],
        coverImage: 'https://via.placeholder.com/400x300?text=Affordable+1',
        premium: false,
        ownerContact: '9876543210',
        createdBy: adminUser._id
      },
      {
        title: 'Studio Apartment - City Center',
        slug: 'studio-apartment-city-center',
        price: 1800000,
        propertyType: 'Apartment',
        status: 'active',
        location: 'City Center, Rohtak',
        city: 'Rohtak',
        area: 400,
        bedrooms: 1,
        bathrooms: 1,
        features: ['Near Market', 'Public Transport', 'Security'],
        description: 'Compact studio apartment in the heart of the city with excellent connectivity.',
        images: [
          'https://via.placeholder.com/400x300?text=Studio+1',
          'https://via.placeholder.com/400x300?text=Studio+2'
        ],
        coverImage: 'https://via.placeholder.com/400x300?text=Studio+1',
        premium: false,
        ownerContact: '9876543210',
        createdBy: adminUser._id
      },
      {
        title: '5 BHK Duplex - Premium Sector',
        slug: '5-bhk-duplex-premium-sector',
        price: 25000000,
        propertyType: 'House',
        status: 'active',
        location: 'Premium Sector, Rohtak',
        city: 'Rohtak',
        area: 4500,
        bedrooms: 5,
        bathrooms: 4,
        features: ['Duplex', 'Garden', 'Security', 'Swimming Pool', 'Home Theater'],
        description: 'Ultra-luxury duplex with world-class amenities and spacious living areas.',
        images: [
          'https://via.placeholder.com/400x300?text=Duplex+1',
          'https://via.placeholder.com/400x300?text=Duplex+2'
        ],
        coverImage: 'https://via.placeholder.com/400x300?text=Duplex+1',
        premium: true,
        ownerContact: '9876543210',
        createdBy: adminUser._id
      }
    ]);
    console.log(`✓ Created ${properties.length} properties`);

    // Create sample enquiries
    const enquiries = await Enquiry.insertMany([
      {
        name: 'Rahul Kumar',
        email: 'rahul@example.com',
        phone: '9876543212',
        message: 'Interested in the 3 BHK flat. Can you provide more details and schedule a site visit?',
        propertyId: properties[0]._id,
        status: 'new'
      },
      {
        name: 'Priya Singh',
        email: 'priya@example.com',
        phone: '9876543213',
        message: 'Looking for commercial space for office setup. What is the rental price?',
        propertyId: properties[3]._id,
        status: 'reviewed'
      },
      {
        name: 'Amit Patel',
        email: 'amit@example.com',
        phone: '9876543214',
        message: 'Interested in the 2 BHK apartment. Is it available for immediate possession?',
        propertyId: properties[2]._id,
        status: 'new'
      },
      {
        name: 'Neha Verma',
        email: 'neha@example.com',
        phone: '9876543215',
        message: 'Looking for a residential plot. Can you provide details about the construction timeline?',
        propertyId: properties[1]._id,
        status: 'reviewed'
      },
      {
        name: 'Aman Sharma',
        email: 'aman@example.com',
        phone: '9876543216',
        message: 'Very interested in the luxury villa. Can I schedule a property visit this weekend?',
        propertyId: properties[4]._id,
        status: 'reviewed'
      },
      {
        name: 'Sanjana Gupta',
        email: 'sanjana@example.com',
        phone: '9876543217',
        message: 'Looking for 1 BHK apartment near city center. Can you provide nearby properties?',
        propertyId: properties[5]._id,
        status: 'new'
      },
      {
        name: 'Vikram Singh',
        email: 'vikram@example.com',
        phone: '9876543218',
        message: 'Interested in the duplex. What is the payment plan available?',
        propertyId: properties[7]._id,
        status: 'reviewed'
      },
      {
        name: 'Anjali Reddy',
        email: 'anjali@example.com',
        phone: '9876543219',
        message: 'Looking for rental property. Is the commercial space available for lease?',
        propertyId: properties[3]._id,
        status: 'new'
      }
    ]);
    console.log(`✓ Created ${enquiries.length} enquiries`);

    // Create sample pages
    const pages = await Page.insertMany([
      {
        slug: 'about',
        title: 'About Vishal Properties',
        content: 'Vishal Properties is a leading real estate company in Rohtak providing premium residential and commercial properties. With over 20 years of experience in the real estate industry, we are committed to helping our clients find their dream homes and investment properties.',
        metaTitle: 'About Vishal Properties',
        metaDescription: 'Learn more about Vishal Properties and our services'
      },
      {
        slug: 'contact',
        title: 'Contact Us',
        content: 'Contact Vishal Properties for property inquiries, sales, or rentals. Our team is available 24/7 to assist you. Email: info@vishalproperties.com | Phone: +91-9876543210 | Address: 123 Business Park, Rohtak, Haryana 124001',
        metaTitle: 'Contact Vishal Properties',
        metaDescription: 'Get in touch with our team for property assistance'
      },
      {
        slug: 'privacy-policy',
        title: 'Privacy Policy',
        content: 'Your privacy is important to us. We collect and process personal information to provide better services. All your data is secured and not shared with third parties without your consent.',
        metaTitle: 'Privacy Policy - Vishal Properties',
        metaDescription: 'Privacy policy for Vishal Properties'
      },
      {
        slug: 'terms-and-conditions',
        title: 'Terms and Conditions',
        content: 'By using our website and services, you agree to our terms and conditions. Please read this document carefully to understand our policies and procedures.',
        metaTitle: 'Terms and Conditions - Vishal Properties',
        metaDescription: 'Terms and conditions for using Vishal Properties services'
      },
      {
        slug: 'faq',
        title: 'Frequently Asked Questions',
        content: 'Find answers to common questions about buying, selling, and renting properties. Our FAQ section covers property valuation, investment tips, and more.',
        metaTitle: 'FAQ - Vishal Properties',
        metaDescription: 'Frequently asked questions about real estate services'
      }
    ]);
    console.log(`✓ Created ${pages.length} pages`);

    console.log('\n✅ Seed data inserted successfully!\n');
    console.log('='.repeat(60));
    console.log('ADMIN LOGIN CREDENTIALS:');
    console.log('='.repeat(60));
    console.log('Email: admin@vishalproperties.com');
    console.log('Password: Admin@12345');
    console.log('='.repeat(60));
    console.log('\nUSER LOGIN CREDENTIALS (Multiple Users Available):');
    console.log('='.repeat(60));
    console.log('Email: rahul@example.com         | Password: User@12345');
    console.log('Email: priya@example.example.com | Password: User@12345');
    console.log('Email: amit@example.com          | Password: User@12345');
    console.log('Email: neha@example.com          | Password: User@12345');
    console.log('Email: user@example.com          | Password: User@12345');
    console.log('='.repeat(60));
    console.log('\nDATA SUMMARY:');
    console.log('='.repeat(60));
    console.log(`✓ Users: ${users.length + 1} (1 admin, ${users.length} regular users)`);
    console.log(`✓ Properties: ${properties.length} (residential, commercial, plots, villas)`);
    console.log(`✓ Enquiries: ${enquiries.length} (various statuses)`);
    console.log(`✓ Pages: ${pages.length} (About, Contact, Privacy, Terms, FAQ)`);
    console.log('='.repeat(60));

    process.exit(0);
  } catch (error) {
    console.error('✗ Seed error:', error);
    process.exit(1);
  }
};

seedDatabase();
