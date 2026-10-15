-- V2__seed_dummy_data.sql
-- Seed initial categories, spots, activities, and images for Delhi NCR / Noida

-- 1. Insert Standard Categories
INSERT INTO categories (id, name, description, icon_name) VALUES
(1, 'Food & Cafes', 'Budget student eats, chai points, street food walks and aesthetic cafes', 'Utensils'),
(2, 'Outdoors & Nature', 'Lush parks, lakes, sunset points, and green getaways', 'Trees'),
(3, 'Adventure & Sports', 'Bowling, go-karting, turf football, cycling, and trampolining', 'Compass'),
(4, 'Games & Arcades', 'Board game cafes, retro video arcades, and VR zones', 'Gamepad2'),
(5, 'Exploring & Heritage', 'Historical monuments, cultural bazaars, and scenic city walks', 'MapPin'),
(6, 'Movies & Cinema', 'Indie screenings, open-air cinema, and movie nights', 'Film'),
(7, 'Creative & Arts', 'Pottery workshops, open mics, art galleries, and craft centers', 'Palette'),
(8, 'Chill & Hangouts', 'Quiet reading spots, scenic viewpoints, and peaceful evening hubs', 'Coffee');

-- 2. Insert Physical Spots (Delhi NCR / Central Delhi / South Delhi / Noida)
INSERT INTO spots (id, name, description, address, city, latitude, longitude, min_cost, max_cost, opening_hours, cover_image_url) VALUES
(1, 'Lodhi Art District & Gardens', 'Open-air mural gallery and heritage garden with peaceful strolls', 'Lodhi Colony, New Delhi', 'Delhi', 28.5892, 77.2272, 0.00, 50.00, '06:00 AM - 08:00 PM', 'https://images.unsplash.com/photo-1598970434795-0c54fe7c0648?w=800'),
(2, 'Hudson Lane & Majnu Ka Tilla', 'University student food street famous for Tibetan delicacies, laphing, and aesthetic cafes', 'North Campus, GTB Nagar, Delhi', 'Delhi', 28.7005, 77.2065, 80.00, 350.00, '11:00 AM - 10:30 PM', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800'),
(3, 'Sunder Nursery Heritage Park', '16th-century Mughal heritage park featuring lake viewpoints and weekend flea markets', 'Bharat Scouts and Guides Marg, Nizamuddin, Delhi', 'Delhi', 28.5950, 77.2428, 50.00, 100.00, '07:00 AM - 09:30 PM', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800'),
(4, 'Connaught Place & Underground Palika', 'Iconic Georgian colonnade with cheap underground shopping, street artists, and Keventers shakes', 'Connaught Place, Central Delhi', 'Delhi', 28.6328, 77.2197, 30.00, 300.00, '10:00 AM - 09:00 PM', 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800'),
(5, 'Hauz Khas Social & Fort View', 'Historic 13th-century lake ruins adjacent to hip indie boutiques and rooftop music spots', 'Hauz Khas Village, South Delhi', 'Delhi', 28.5494, 77.1937, 0.00, 450.00, '10:30 AM - 11:00 PM', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800'),
(6, 'Yes Minister Bowling Alley', 'Popular student sports bar with neon bowling lanes, pool tables, and arcade machines', 'Essex Farms, Aurobindo Marg, Delhi', 'Delhi', 28.5445, 77.2062, 350.00, 700.00, '12:00 PM - 12:30 AM', 'https://images.unsplash.com/photo-1538510747656-784860010c71?w=800'),
(7, 'Okhla Bird Sanctuary Boardwalk', 'Peaceful boardwalk sanctuary along the Yamuna River with migrating birds', 'Sector 95, Noida Border', 'Noida', 28.5583, 77.3111, 30.00, 60.00, '07:00 AM - 05:30 PM', 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800'),
(8, 'National Crafts Museum & Village Complex', 'Open-air village crafts courtyard with traditional artisans and terracotta cafe', 'Bhairon Marg, Pragati Maidan, Delhi', 'Delhi', 28.6146, 77.2415, 20.00, 150.00, '09:30 AM - 06:00 PM', 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=800');

-- 3. Insert Activities (Covering Free, <100, 100-300, 300-500, 500+)
INSERT INTO activities (id, category_id, title, description, min_cost, max_cost, duration_minutes, best_time, location_type, group_type, cover_image_url, city, latitude, longitude) VALUES
(1, 2, 'Sunset Picnic & Frisbee at Sunder Nursery', 'Spread a mat, grab some snacks, and spend a relaxing golden hour by the historic lakeside pavilions.', 50.00, 100.00, 150, 'Evening', 'Outdoor', 'Friends', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800', 'Delhi', 28.5950, 77.2428),
(2, 1, 'Laphing & Tibetan Street Food Walk', 'Try spicy soupy laphing, tingmo, steamed pork/paneer momos, and iced lemon tea along Majnu Ka Tilla alleyways.', 80.00, 250.00, 120, 'Afternoon', 'Outdoor', 'Friends', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800', 'Delhi', 28.7005, 77.2065),
(3, 5, 'Graffiti Hunt & Photo Walk in Lodhi Art District', 'Explore India first public open-air art district with over 50 massive street murals painted by international artists.', 0.00, 0.00, 90, 'Morning / Late Afternoon', 'Outdoor', 'Both', 'https://images.unsplash.com/photo-1598970434795-0c54fe7c0648?w=800', 'Delhi', 28.5892, 77.2272),
(4, 3, 'Late Night Neon Bowling Showdown', 'Lace up your bowling shoes and challenge your group to a strike-off with music and retro neon vibes.', 350.00, 600.00, 90, 'Night', 'Indoor', 'Friends', 'https://images.unsplash.com/photo-1538510747656-784860010c71?w=800', 'Delhi', 28.5445, 77.2062),
(5, 7, 'Pottery Masterclass & Clay Sculpting', 'Get hands messy on a potter wheel, sculpt a personalized terracotta cup, and take your creation home.', 400.00, 750.00, 120, 'Weekend Afternoon', 'Indoor', 'Both', 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800', 'Delhi', 28.5494, 77.1937),
(6, 4, 'Board Game Marathon at Indie Cafe', 'Unlimited access to Catan, Secret Hitler, Exploding Kittens, and Uno with iced coffee on tap.', 150.00, 300.00, 180, 'Evening', 'Indoor', 'Friends', 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=800', 'Delhi', 28.6328, 77.2197),
(7, 2, 'Sunrise Birdwatching on Yamuna Boardwalk', 'Catch the early morning river mist and spot Siberian migratory birds along the tranquil bamboo paths.', 30.00, 60.00, 120, 'Early Morning', 'Outdoor', 'Solo', 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800', 'Noida', 28.5583, 77.3111),
(8, 8, 'Fort Sunset Watch & Lakeside Jam Session', 'Sit along the old stone fortress walls overlooking the water reservoir with guitars and friends as the sky turns orange.', 0.00, 0.00, 120, 'Sunset', 'Outdoor', 'Friends', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800', 'Delhi', 28.5494, 77.1937),
(9, 1, 'Midnight Chai & Bun Makkhan Drive', 'Experience Delhi vibrant late-night tea culture with hot kulhad chai, buttered pav, and endless banter.', 40.00, 90.00, 60, 'Late Night', 'Outdoor', 'Friends', 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800', 'Delhi', 28.6328, 77.2197),
(10, 5, 'Underground Palika Bazaar Bargain Challenge', 'Split into teams with ₹300 budget and see who can find the coolest vintage band tee or eccentric accessory.', 100.00, 300.00, 90, 'Afternoon', 'Indoor', 'Friends', 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800', 'Delhi', 28.6328, 77.2197);

-- 4. Insert Activity Images (For expandable card gallery)
INSERT INTO activity_images (activity_id, image_url, display_order, caption) VALUES
(1, 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800', 1, 'Lakeside lawns at Sunder Nursery'),
(1, 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800', 2, 'Picnic spread with friends'),
(2, 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800', 1, 'Aesthetic Tibetan cafe in MKT'),
(2, 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800', 2, 'Steamed momos with chili oil'),
(3, 'https://images.unsplash.com/photo-1598970434795-0c54fe7c0648?w=800', 1, 'Giant street mural by Lodhi Colony'),
(3, 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800', 2, 'Vibrant graffiti background for portraits'),
(4, 'https://images.unsplash.com/photo-1538510747656-784860010c71?w=800', 1, 'Glow-in-the-dark neon bowling lane'),
(8, 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800', 1, 'Hauz Khas lake view at dusk');

-- 5. Link Activities to Spots
INSERT INTO activity_spots (activity_id, spot_id) VALUES
(1, 3),
(2, 2),
(3, 1),
(4, 6),
(7, 7),
(8, 5),
(10, 4);

-- Ensure auto-increment sequences are aligned
SELECT setval('categories_id_seq', (SELECT MAX(id) FROM categories));
SELECT setval('spots_id_seq', (SELECT MAX(id) FROM spots));
SELECT setval('activities_id_seq', (SELECT MAX(id) FROM activities));
SELECT setval('activity_images_id_seq', (SELECT MAX(id) FROM activity_images));
