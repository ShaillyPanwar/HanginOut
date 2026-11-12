-- V6__delhi_ncr_zones_and_activities.sql
-- Add zone and locality columns and seed verified spots and activities across all 15 Delhi NCR zones

-- 1. Add zone and locality columns to activities and spots
ALTER TABLE activities ADD COLUMN IF NOT EXISTS zone VARCHAR(100);
ALTER TABLE activities ADD COLUMN IF NOT EXISTS locality VARCHAR(100);

ALTER TABLE spots ADD COLUMN IF NOT EXISTS zone VARCHAR(100);
ALTER TABLE spots ADD COLUMN IF NOT EXISTS locality VARCHAR(100);

-- 2. Classify existing Rohini, India Gate, and NCR spots and activities
UPDATE activities SET zone = 'North-West Delhi', locality = 'Rohini' WHERE (city LIKE '%Rohini%' OR title LIKE '%Rohini%') AND zone IS NULL;
UPDATE activities SET zone = 'New Delhi', locality = 'India Gate' WHERE (title LIKE '%India Gate%' OR city = 'Delhi') AND zone IS NULL;
UPDATE activities SET zone = 'Noida', locality = 'Sector 95' WHERE (city ILIKE '%Noida%' OR title ILIKE '%Yamuna%' OR title ILIKE '%Okhla%') AND zone IS NULL;
UPDATE activities SET zone = 'Gurugram', locality = 'Cyber Hub' WHERE city ILIKE '%Gurugram%' AND zone IS NULL;
UPDATE activities SET zone = 'Ghaziabad', locality = 'Indirapuram' WHERE city ILIKE '%Ghaziabad%' AND zone IS NULL;
UPDATE activities SET zone = 'Faridabad', locality = 'Surajkund' WHERE city ILIKE '%Faridabad%' AND zone IS NULL;
UPDATE activities SET zone = 'North-West Delhi', locality = 'Rohini' WHERE zone IS NULL;

UPDATE spots SET zone = 'North-West Delhi', locality = 'Rohini' WHERE (city LIKE '%Rohini%' OR name LIKE '%Rohini%') AND zone IS NULL;
UPDATE spots SET zone = 'New Delhi', locality = 'India Gate' WHERE (name LIKE '%India Gate%' OR city = 'Delhi') AND zone IS NULL;
UPDATE spots SET zone = 'Noida', locality = 'Sector 95' WHERE (city ILIKE '%Noida%' OR name ILIKE '%Yamuna%' OR name ILIKE '%Okhla%') AND zone IS NULL;
UPDATE spots SET zone = 'Gurugram', locality = 'Cyber Hub' WHERE city ILIKE '%Gurugram%' AND zone IS NULL;
UPDATE spots SET zone = 'Ghaziabad', locality = 'Indirapuram' WHERE city ILIKE '%Ghaziabad%' AND zone IS NULL;
UPDATE spots SET zone = 'Faridabad', locality = 'Surajkund' WHERE city ILIKE '%Faridabad%' AND zone IS NULL;
UPDATE spots SET zone = 'North-West Delhi', locality = 'Rohini' WHERE zone IS NULL;

-- 3. Indexes for fast zone & locality lookup
CREATE INDEX IF NOT EXISTS idx_activities_zone ON activities (zone);
CREATE INDEX IF NOT EXISTS idx_activities_locality ON activities (locality);
CREATE INDEX IF NOT EXISTS idx_spots_zone ON spots (zone);
CREATE INDEX IF NOT EXISTS idx_spots_locality ON spots (locality);

-- 4. Seed Verified Physical Spots across Delhi NCR Zones
INSERT INTO spots (name, description, address, city, zone, locality, latitude, longitude, min_cost, max_cost, opening_hours, cover_image_url) VALUES
-- North Delhi
('Majnu Ka Tilla Tibetan Colony', 'Historic riverside settlement famous for authentic Tibetan monasteries, laphing street stalls, and cozy book cafes', 'Majnu Ka Tilla, New Aruna Nagar, North Delhi', 'Delhi', 'North Delhi', 'Majnu Ka Tilla', 28.7032, 77.2263, 80.00, 350.00, '10:00 AM - 10:00 PM', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80'),
('Hudson Lane Student Cafe Strip', 'Bustling college avenue lined with rooftop eateries, indie waffle parlours, and board game lounges', 'Hudson Lane, GTB Nagar, North Delhi', 'Delhi', 'North Delhi', 'Hudson Lane', 28.6945, 77.2052, 150.00, 500.00, '11:00 AM - 11:30 PM', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80'),
('Kamla Nagar Market', 'Lively campus market renowned for thrift streetwear, stationery shops, and iconic chole bhature', 'Bada Golchakkar, Kamla Nagar, North Delhi', 'Delhi', 'North Delhi', 'Kamla Nagar', 28.6812, 77.2038, 50.00, 300.00, '10:30 AM - 09:30 PM', 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&auto=format&fit=crop&q=80'),
('Coronation Memorial Park', 'Historic open memorial park with tree-lined paved tracks and British Raj stone obelisks', 'Bhai Parmanand Marg, Civil Lines, North Delhi', 'Delhi', 'North Delhi', 'Civil Lines', 28.7230, 77.1985, 0.00, 20.00, '06:00 AM - 07:00 PM', 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop&q=80'),

-- North-West Delhi (Pitampura & NSP)
('Netaji Subhash Place (NSP) Food Promenade', 'Commercial culinary hub featuring late-night food trucks, bubble tea cafes, and bowling arenas', 'Ring Road, Pitampura, North-West Delhi', 'Delhi', 'North-West Delhi', 'NSP / Netaji Subhash Place', 28.6915, 77.1518, 100.00, 450.00, '10:00 AM - 11:00 PM', 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=80'),
('Dilli Haat Pitampura', 'Open-air craft bazaar with regional artisan stalls, open amphitheatre, and state food kiosks', 'Near TV Tower, Pitampura, North-West Delhi', 'Delhi', 'North-West Delhi', 'Pitampura', 28.6985, 77.1482, 30.00, 200.00, '11:00 AM - 09:30 PM', 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&auto=format&fit=crop&q=80'),

-- West Delhi
('Dilli Haat Janakpuri', 'Expansive cultural craft village featuring musical water fountains, regional handicraft huts, and food plazas', 'Lal Sai Mandir Marg, Janakpuri, West Delhi', 'Delhi', 'West Delhi', 'Janakpuri', 28.6253, 77.0818, 30.00, 250.00, '11:00 AM - 10:00 PM', 'https://images.unsplash.com/photo-1598970434795-0c54fe7c0648?w=800&auto=format&fit=crop&q=80'),
('Rajouri Garden Main Market', 'Dynamic fashion market packed with bridal boutiques, trendy sneaker shops, and tandoori food joints', 'Rajouri Garden, West Delhi', 'Delhi', 'West Delhi', 'Rajouri Garden', 28.6475, 77.1215, 100.00, 400.00, '11:00 AM - 09:30 PM', 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&auto=format&fit=crop&q=80'),
('Pacific Mall & Smaaash Tagore Garden', 'Premium shopping and entertainment destination featuring gaming arcades, bowling, and cinema', 'Najafgarh Road, Tagore Garden, West Delhi', 'Delhi', 'West Delhi', 'Tagore Garden', 28.6425, 77.1082, 150.00, 800.00, '10:00 AM - 11:00 PM', 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=800&auto=format&fit=crop&q=80'),
('District Park Paschim Vihar', 'Scenic community woodland park with water body, paved loop track, and open gym stations', 'A-Block, Paschim Vihar, West Delhi', 'Delhi', 'West Delhi', 'Paschim Vihar', 28.6738, 77.0988, 0.00, 0.00, '05:30 AM - 08:00 PM', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&auto=format&fit=crop&q=80'),

-- Central Delhi
('Connaught Place Inner Circle & Central Park', 'Iconic Georgian colonnade surrounding Central Park with fountain lawns, underground Palika Bazaar, and heritage cafes', 'Connaught Place, Central Delhi', 'Delhi', 'Central Delhi', 'Connaught Place', 28.6328, 77.2197, 30.00, 300.00, '06:00 AM - 10:00 PM', 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&auto=format&fit=crop&q=80'),
('Chandni Chowk & Gali Paranthe Wali', 'Legendary Mughal-era marketplace world-famous for historic street foods, jalebis, and centuries-old parantha shops', 'Old Delhi, Central Delhi', 'Delhi', 'Central Delhi', 'Chandni Chowk', 28.6562, 77.2307, 60.00, 250.00, '09:00 AM - 10:00 PM', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80'),
('Mandi House Cultural Hub', 'National theatrical epicenter with renowned auditoriums, open-air drama rehearsals, and budget student canteens', 'Mandi House, Copernicus Marg, Central Delhi', 'Delhi', 'Central Delhi', 'Mandi House', 28.6248, 77.2345, 50.00, 250.00, '09:00 AM - 09:30 PM', 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80'),

-- New Delhi
('Lodhi Garden Heritage Complex', 'Serene 90-acre Mughal and Sayyid tomb gardens perfect for morning jogging, sketching, and weekend picnics', 'Lodhi Road, New Delhi', 'Delhi', 'New Delhi', 'Lodhi Garden', 28.5933, 77.2197, 0.00, 50.00, '06:00 AM - 08:00 PM', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&auto=format&fit=crop&q=80'),
('National Gallery of Modern Art (NGMA)', 'Historic Jaipur House showcasing premier modern Indian paintings, open sculpture garden, and tranquil cafe', 'India Gate Hexagon, New Delhi', 'Delhi', 'New Delhi', 'National Gallery of Modern Art', 28.6095, 77.2355, 20.00, 100.00, '10:00 AM - 06:00 PM', 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&auto=format&fit=crop&q=80'),
('Khan Market Literary Cafes', 'Upscale colonial market renowned for independent book stores, specialty coffee roasters, and Italian bakeries', 'Khan Market, New Delhi', 'Delhi', 'New Delhi', 'Khan Market', 28.6002, 77.2272, 180.00, 500.00, '10:00 AM - 11:00 PM', 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=80'),

-- South Delhi
('Hauz Khas Fort & Deer Park', '14th-century medieval reservoir and madrasa ruins overlooking scenic Deer Park lake and heritage walking loops', 'Hauz Khas Village, South Delhi', 'Delhi', 'South Delhi', 'Hauz Khas', 28.5535, 77.1945, 25.00, 100.00, '06:00 AM - 07:00 PM', 'https://images.unsplash.com/photo-1598970434795-0c54fe7c0648?w=800&auto=format&fit=crop&q=80'),
('Select CITYWALK & Saket Plaza', 'Premier South Delhi lifestyle hub with open-air courtyard events, flagship brands, and Cinepolis multiplex', 'District Centre, Saket, South Delhi', 'Delhi', 'South Delhi', 'Saket', 28.5284, 77.2192, 100.00, 700.00, '10:00 AM - 11:00 PM', 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=800&auto=format&fit=crop&q=80'),
('Mehrauli Archaeological Park', 'Verdant historical park with over 100 monument ruins, Rajon ki Baoli stepwell, and forest pathways', 'Opposite Qutub Minar, Mehrauli, South Delhi', 'Delhi', 'South Delhi', 'Mehrauli', 28.5244, 77.1855, 0.00, 50.00, '06:00 AM - 06:30 PM', 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&auto=format&fit=crop&q=80'),

-- South-East Delhi
('Lotus Temple (Bahai House of Worship)', 'World-renowned architectural marvel shaped like a blooming lotus with peaceful silent contemplation halls', 'Lotus Temple Road, Bahapur, Kalkaji, South-East Delhi', 'Delhi', 'South-East Delhi', 'Kalkaji', 28.5535, 77.2588, 0.00, 0.00, '09:00 AM - 05:30 PM', 'https://images.unsplash.com/photo-1598970434795-0c54fe7c0648?w=800&auto=format&fit=crop&q=80'),
('CR Park Market 1 Bengali Hub', 'Lively neighborhood market renowned for Kolkata kathi rolls, mustard fish curries, and mishti doi', 'Market 1, CR Park, South-East Delhi', 'Delhi', 'South-East Delhi', 'CR Park', 28.5392, 77.2514, 60.00, 250.00, '10:00 AM - 10:30 PM', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80'),
('Lajpat Nagar Central Market', 'One of Delhis largest retail bazaars celebrated for thrift apparel, designer fabrics, and street momos', 'Lajpat Nagar II, South-East Delhi', 'Delhi', 'South-East Delhi', 'Lajpat Nagar', 28.5684, 77.2435, 50.00, 250.00, '10:30 AM - 09:30 PM', 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&auto=format&fit=crop&q=80'),

-- East Delhi
('Sanjay Lake & Promenade Mayur Vihar', 'Sprawling 170-acre man-made lake with boating jetty, eucalyptus walking loops, and open lawns', 'Mayur Vihar Phase II, East Delhi', 'Delhi', 'East Delhi', 'Mayur Vihar', 28.6182, 77.3065, 30.00, 100.00, '06:00 AM - 07:00 PM', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&auto=format&fit=crop&q=80'),
('Preet Vihar Food & Retail Hub', 'Popular East Delhi evening adda packed with pastry shops, pizza outlets, and fashion boutiques', 'Vikas Marg, Preet Vihar, East Delhi', 'Delhi', 'East Delhi', 'Preet Vihar', 28.6395, 77.2942, 80.00, 300.00, '11:00 AM - 10:30 PM', 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=80'),

-- North-East Delhi
('Yamuna Sports Complex', 'Comprehensive DDA sports complex offering indoor badminton, Olympic swimming, athletics, and tennis courts', 'Surajmal Vihar, North-East Delhi', 'Delhi', 'North-East Delhi', 'Yamuna Vihar', 28.6658, 77.3082, 40.00, 200.00, '06:00 AM - 09:00 PM', 'https://images.unsplash.com/photo-1538510747656-784860010c71?w=800&auto=format&fit=crop&q=80'),

-- South-West Delhi
('Vegas Mall & IMAX Dwarka', 'Spectacular lifestyle shopping centre featuring Delhi NCRs largest IMAX screen and indoor amusement zone', 'Sector 14, Dwarka, South-West Delhi', 'Delhi', 'South-West Delhi', 'Dwarka', 28.5992, 77.0315, 150.00, 700.00, '10:00 AM - 11:00 PM', 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80'),
('Air Force Museum Palam', 'Premier national aviation museum with outdoor aircraft hangars, vintage fighter jets, and war memorabilia', 'Palam Way, Cantonment, South-West Delhi', 'Delhi', 'South-West Delhi', 'Palam', 28.5835, 77.1215, 20.00, 50.00, '10:00 AM - 05:00 PM', 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&auto=format&fit=crop&q=80'),

-- Shahdara
('Cross River Mall & Gaming Hub', 'Major retail and entertainment complex in Karkardooma featuring multi-lane bowling, arcade games, and dining', 'CBD Ground, Shahdara, Karkardooma, Delhi', 'Delhi', 'Shahdara', 'Karkardooma', 28.6535, 77.3032, 100.00, 500.00, '10:30 AM - 11:00 PM', 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=800&auto=format&fit=crop&q=80'),
('Krishna Nagar Lal Quarter Market', 'Bustling bazaar famous for traditional street snacks, apparel bargains, and festive food stalls', 'Lal Quarter, Krishna Nagar, Shahdara, Delhi', 'Delhi', 'Shahdara', 'Krishna Nagar', 28.6582, 77.2882, 40.00, 200.00, '11:00 AM - 09:30 PM', 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&auto=format&fit=crop&q=80'),

-- Gurugram
('DLF CyberHub & Promenade', 'Futuristic pedestrian dining promenade featuring live music amphitheatre, premier brewpubs, and international bistros', 'DLF Cyber City, Phase 2, Gurugram', 'Gurugram', 'Gurugram', 'Cyber Hub', 28.4950, 77.0895, 200.00, 900.00, '10:00 AM - 01:00 AM', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80'),
('Sector 29 Leisure Valley Park', 'Vibrant recreational zone surrounded by popular microbreweries, lush walking tracks, and musical fountains', 'Sector 29, City Centre, Gurugram', 'Gurugram', 'Gurugram', 'Sector 29', 28.4682, 77.0635, 80.00, 600.00, '06:00 AM - 11:00 PM', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&auto=format&fit=crop&q=80'),
('Aravalli Biodiversity Park Gurugram', 'Ecologically restored 380-acre nature reserve nestled in the Aravalli hills with scenic sunset trekking loops', 'MG Road, Near Guru Dronacharya Metro, Gurugram', 'Gurugram', 'Gurugram', 'MG Road', 28.4875, 77.1022, 0.00, 0.00, '06:00 AM - 07:00 PM', 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop&q=80'),

-- Noida
('Sector 18 Atta Market & DLF Mall of India', 'Mega retail epicentre housing India’s largest shopping mall, indoor snow arena, and budget street chaat vendors', 'Sector 18, Noida', 'Noida', 'Noida', 'Sector 18', 28.5675, 77.3210, 80.00, 600.00, '10:30 AM - 11:00 PM', 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=800&auto=format&fit=crop&q=80'),
('Worlds of Wonder (WOW) Amusement Park', 'State-of-the-art amusement and water park featuring adrenaline rollercoasters, wave pools, and go-kart tracks', 'Sector 38A, Near GIP Mall, Noida', 'Noida', 'Noida', 'Sector 38A', 28.5645, 77.3265, 450.00, 1100.00, '11:00 AM - 08:00 PM', 'https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?w=800&auto=format&fit=crop&q=80'),
('Noida Biodiversity Park Sector 91', 'Tranquil 140-acre ecological park with wooden gazebos, wide jogging trails, and diverse medicinal plant gardens', 'Sector 91, Expressway, Noida', 'Noida', 'Noida', 'Sector 137', 28.5085, 77.3872, 0.00, 0.00, '06:00 AM - 08:00 PM', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&auto=format&fit=crop&q=80'),

-- Ghaziabad
('Indirapuram Habitat Centre', 'Modern outdoor community hub with open-air courtyard cafes, live weekend events, and retail arcade', 'Ahinsa Khand 1, Indirapuram, Ghaziabad', 'Ghaziabad', 'Ghaziabad', 'Indirapuram', 28.6385, 77.3685, 100.00, 450.00, '11:00 AM - 11:00 PM', 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=80'),
('Swarn Jayanti Park Indirapuram', 'Green public park with Japanese garden bridges, children’s playground, and tranquil morning lake walkway', 'Sector 11, Indirapuram, Ghaziabad', 'Ghaziabad', 'Ghaziabad', 'Indirapuram', 28.6415, 77.3712, 10.00, 50.00, '05:30 AM - 08:00 PM', 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop&q=80'),

-- Faridabad
('Surajkund Lake & Heritage Crafts Arena', 'Historic 10th-century reservoir amphitheatre set against scenic Aravalli rocks and folk craft heritage grounds', 'Surajkund Road, Faridabad', 'Faridabad', 'Faridabad', 'Surajkund', 28.4895, 77.2842, 20.00, 100.00, '06:00 AM - 07:00 PM', 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&auto=format&fit=crop&q=80'),
('Sector 15 Community Market Faridabad', 'Lively neighborhood market packed with beloved street food stalls, chai joints, and student study cafes', 'Sector 15, Faridabad', 'Faridabad', 'Faridabad', 'Sector 15', 28.4115, 77.3195, 50.00, 220.00, '10:00 AM - 10:30 PM', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80');

-- 5. Seed Real Curated Activities for Every Delhi NCR Zone
INSERT INTO activities (category_id, title, description, min_cost, max_cost, duration_minutes, best_time, location_type, group_type, cover_image_url, city, zone, locality, latitude, longitude, min_age) VALUES
-- North Delhi
(1, 'Authentic Laphing & Cafe Stroll at Majnu Ka Tilla', 'Explore narrow Tibetan lanes, sample spicy cold dry laphing, and relax with iced fruit tea by the Yamuna riverside monastery.', 80.00, 250.00, 90, 'Afternoon', 'Mixed', 'Both', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80', 'Delhi', 'North Delhi', 'Majnu Ka Tilla', 28.7032, 77.2263, 0),
(1, 'Rooftop Cafe Hangout & Board Games at Hudson Lane', 'Gather your friends at vibrant GTB Nagar cafes for woodfired pizza, chilled shakes, and competitive Catan or Jenga.', 200.00, 450.00, 120, 'Evening', 'Indoor', 'Friends', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80', 'Delhi', 'North Delhi', 'Hudson Lane', 28.6945, 77.2052, 0),
(2, 'Scenic Heritage Cycling & Sunset Photography at Coronation Park', 'Ride your cycle along wide paved paths, admire historic British obelisks, and capture golden hour hues over peaceful lawns.', 0.00, 0.00, 75, 'Morning', 'Outdoor', 'Solo', 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop&q=80', 'Delhi', 'North Delhi', 'Civil Lines', 28.7230, 77.1985, 0),

-- North-West Delhi
(1, 'Evening Street Food Feast & Tower Walk at NSP', 'Indulge in grilled tandoori momos, pasta bowls, and thick chocolate shakes at the bustling Netaji Subhash Place plaza.', 100.00, 320.00, 75, 'Evening', 'Outdoor', 'Friends', 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=80', 'Delhi', 'North-West Delhi', 'NSP / Netaji Subhash Place', 28.6915, 77.1518, 0),
(5, 'Artisanal Craft Exploring & Cultural Food at Dilli Haat Pitampura', 'Browse handloom shawls, terracotta pottery, and sample authentic regional state thalis at Dilli Haat Pitampura.', 40.00, 200.00, 90, 'Evening', 'Outdoor', 'Both', 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&auto=format&fit=crop&q=80', 'Delhi', 'North-West Delhi', 'Pitampura', 28.6985, 77.1482, 0),

-- West Delhi
(5, 'Regional Crafts & Musical Fountain Evening at Dilli Haat Janakpuri', 'Walk through stunning themed Mughal courts, shop indie handicrafts, and watch musical fountain shows under the evening lights.', 30.00, 180.00, 90, 'Evening', 'Outdoor', 'Both', 'https://images.unsplash.com/photo-1598970434795-0c54fe7c0648?w=800&auto=format&fit=crop&q=80', 'Delhi', 'West Delhi', 'Janakpuri', 28.6253, 77.0818, 0),
(1, 'Tandoori Chaap & Kulhad Lassi Evening Crawl at Rajouri Garden', 'Feast on smoky Afghani soya chaap, garlic naan, and creamy saffron kulhad lassi along the legendary Rajouri Garden food strip.', 120.00, 300.00, 60, 'Evening', 'Outdoor', 'Friends', 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&auto=format&fit=crop&q=80', 'Delhi', 'West Delhi', 'Rajouri Garden', 28.6475, 77.1215, 0),
(4, 'Laser Tag & VR Arcade Battle at Smaaash Pacific Mall', 'Suit up with your squad for intense laser tag skirmishes, virtual reality rollercoasters, and arcade basketball.', 350.00, 750.00, 90, 'Afternoon', 'Indoor', 'Friends', 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=800&auto=format&fit=crop&q=80', 'Delhi', 'West Delhi', 'Tagore Garden', 28.6425, 77.1082, 10),

-- Central Delhi
(5, 'Sunset Flagpole Picnic & Heritage Colonnade Walk at Connaught Place', 'Sit on the lush lawns of CP Central Park beneath the giant Indian flag, watch street acoustic performers, and grab famous milkshakes.', 20.00, 150.00, 90, 'Evening', 'Outdoor', 'Both', 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&auto=format&fit=crop&q=80', 'Delhi', 'Central Delhi', 'Connaught Place', 28.6328, 77.2197, 0),
(1, 'Old Delhi Heritage Food Trail & Paranthe Wali Gali Feasting', 'Navigate historic alleyways to taste deep-fried mixed vegetable paranthas, hot jalebis, and creamy rabri in Chandni Chowk.', 90.00, 250.00, 90, 'Morning', 'Outdoor', 'Both', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80', 'Delhi', 'Central Delhi', 'Chandni Chowk', 28.6562, 77.2307, 0),
(7, 'Live Street Theatre & Chai Adda at Mandi House', 'Catch raw experimental Hindi theatre rehearsals, sip roadside elaichi chai, and discuss arts with fellow creators.', 30.00, 150.00, 100, 'Evening', 'Mixed', 'Both', 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80', 'Delhi', 'Central Delhi', 'Mandi House', 28.6248, 77.2345, 0),

-- New Delhi
(2, 'Morning Yoga, Heritage Stroll & Reading at Lodhi Garden', 'Start your day among blooming roses and medieval Sultanate domes, finding peaceful stone gazebos for novel reading or meditation.', 0.00, 0.00, 90, 'Morning', 'Outdoor', 'Solo', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&auto=format&fit=crop&q=80', 'Delhi', 'New Delhi', 'Lodhi Garden', 28.5933, 77.2197, 0),
(7, 'Contemporary Art Exhibition & Sculpture Walk at NGMA', 'Immerse yourself in masterpieces by Amrita Sher-Gil and Raja Ravi Varma before enjoying tea in the serene Jaipur House garden.', 20.00, 100.00, 90, 'Afternoon', 'Indoor', 'Both', 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&auto=format&fit=crop&q=80', 'Delhi', 'New Delhi', 'National Gallery of Modern Art', 28.6095, 77.2355, 0),
(8, 'Bookstore Browsing & Artisanal Coffee at Khan Market', 'Spend a quiet afternoon thumbing through bestsellers at iconic bookshops followed by specialty pour-over coffee.', 180.00, 480.00, 75, 'Evening', 'Indoor', 'Solo', 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=80', 'Delhi', 'New Delhi', 'Khan Market', 28.6002, 77.2272, 0),

-- South Delhi
(5, '14th-Century Fort Ruins & Sunset Lake Views at Hauz Khas', 'Climb historic stone battlements, look out over Deer Park lake, and wander through hip design shops in Hauz Khas Village.', 25.00, 120.00, 100, 'Evening', 'Outdoor', 'Both', 'https://images.unsplash.com/photo-1598970434795-0c54fe7c0648?w=800&auto=format&fit=crop&q=80', 'Delhi', 'South Delhi', 'Hauz Khas', 28.5535, 77.1945, 0),
(4, 'Bowling, Gelato & Mall Promenade at Select CITYWALK Saket', 'Challenge friends to a 10-pin bowling showdown, catch outdoor weekend events, and indulge in artisan waffle cones.', 180.00, 600.00, 120, 'Evening', 'Mixed', 'Friends', 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=800&auto=format&fit=crop&q=80', 'Delhi', 'South Delhi', 'Saket', 28.5284, 77.2192, 0),
(5, 'Ancient Stepwell & Forest Tomb Trek at Mehrauli Park', 'Hike through green forest groves discovering hidden 16th-century stepwells, ornate mosques, and peaceful sunlit courtyards.', 0.00, 40.00, 90, 'Morning', 'Outdoor', 'Both', 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&auto=format&fit=crop&q=80', 'Delhi', 'South Delhi', 'Mehrauli', 28.5244, 77.1855, 0),

-- South-East Delhi
(2, 'Peaceful Meditation & Architectural Marvel at Lotus Temple', 'Experience the profound stillness of the Bahai prayer hall surrounded by nine tranquil ponds and lush gardens.', 0.00, 0.00, 60, 'Morning', 'Mixed', 'Both', 'https://images.unsplash.com/photo-1598970434795-0c54fe7c0648?w=800&auto=format&fit=crop&q=80', 'Delhi', 'South-East Delhi', 'Kalkaji', 28.5535, 77.2588, 0),
(1, 'Kolkata Kathi Rolls & Puchka Trail at CR Park Market 1', 'Relish authentic spicy mutton kathi rolls, crispy spicy puchkas in mint water, and fresh sandesh sweets in Mini Kolkata.', 90.00, 260.00, 60, 'Evening', 'Outdoor', 'Friends', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80', 'Delhi', 'South-East Delhi', 'CR Park', 28.5392, 77.2514, 0),
(1, 'Thrift Fashion Bargaining & Steamed Momos at Lajpat Nagar', 'Hunt for trendy clothes and accessories at unbeatable college prices and celebrate your finds with famous red chutney momos.', 60.00, 240.00, 90, 'Evening', 'Outdoor', 'Both', 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&auto=format&fit=crop&q=80', 'Delhi', 'South-East Delhi', 'Lajpat Nagar', 28.5684, 77.2435, 0),

-- East Delhi
(2, 'Sunset Pedal Boating & Lakeside Walk at Sanjay Lake Mayur Vihar', 'Rent a paddle boat on the sparkling lake waters, watch kingfishers, and unwind on manicured green lawns.', 40.00, 120.00, 75, 'Evening', 'Outdoor', 'Both', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&auto=format&fit=crop&q=80', 'Delhi', 'East Delhi', 'Mayur Vihar', 28.6182, 77.3065, 0),
(1, 'Pastry Tasting & Coffee Adda at Preet Vihar Community Centre', 'Drop by cozy neighbourhood bakeries for hot chocolate, loaded churros, and late-night chats with friends.', 90.00, 280.00, 60, 'Evening', 'Indoor', 'Friends', 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=80', 'Delhi', 'East Delhi', 'Preet Vihar', 28.6395, 77.2942, 0),

-- North-East Delhi
(3, 'Table Tennis & Athletics Workout at Yamuna Sports Complex', 'Book an indoor sports session with high-quality tables, run the Olympic-grade track, or practice in the badminton courts.', 50.00, 180.00, 75, 'Morning', 'Indoor', 'Friends', 'https://images.unsplash.com/photo-1561089489-f13d5e730d72?w=800&auto=format&fit=crop&q=80', 'Delhi', 'North-East Delhi', 'Yamuna Vihar', 28.6658, 77.3082, 0),

-- South-West Delhi
(6, 'IMAX 3D Movie Night & Gourmet Food Court at Vegas Mall Dwarka', 'Experience jaw-dropping cinema visuals on Delhi NCRs largest IMAX screen followed by street delicacies in the mega food hall.', 250.00, 650.00, 150, 'Evening', 'Indoor', 'Both', 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80', 'Delhi', 'South-West Delhi', 'Dwarka', 28.5992, 77.0315, 0),
(5, 'Vintage Jet & Aviation History Tour at Air Force Museum Palam', 'Stand beneath supersonic MiG fighters, helicopters, and historic wartime uniforms in an inspiring museum walk.', 20.00, 50.00, 90, 'Morning', 'Mixed', 'Both', 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&auto=format&fit=crop&q=80', 'Delhi', 'South-West Delhi', 'Palam', 28.5835, 77.1215, 0),

-- Shahdara
(4, 'Multi-Lane Bowling Match & Fast Food at Cross River Mall', 'Hit the pins with your squad on modern neon bowling lanes, play retro arcade games, and grab burgers in Karkardooma.', 150.00, 480.00, 90, 'Afternoon', 'Indoor', 'Friends', 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=800&auto=format&fit=crop&q=80', 'Delhi', 'Shahdara', 'Karkardooma', 28.6535, 77.3032, 0),
(1, 'Crispy Bedmi Puri Breakfast & Lal Quarter Thrift Walk', 'Wake up early for steaming potato curry and crispy spiced bedmi puris before exploring East Delhis most lively morning market.', 50.00, 160.00, 60, 'Morning', 'Outdoor', 'Both', 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&auto=format&fit=crop&q=80', 'Delhi', 'Shahdara', 'Krishna Nagar', 28.6582, 77.2882, 0),

-- Gurugram
(1, 'Live Music Evening & Global Food Walk at DLF CyberHub', 'Stroll through the dazzling glass boulevard, catch acoustic live sets in the amphitheatre, and taste world-class ramen or burritos.', 220.00, 750.00, 120, 'Evening', 'Outdoor', 'Friends', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80', 'Gurugram', 'Gurugram', 'Cyber Hub', 28.4950, 77.0895, 0),
(8, 'Sunset Lawn Picnic & Craft Drinks at Sector 29 Gurugram', 'Lounge on open green lawns in Leisure Valley Park before heading across to Sector 29s vibrant rooftop scene.', 120.00, 650.00, 120, 'Evening', 'Mixed', 'Friends', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&auto=format&fit=crop&q=80', 'Gurugram', 'Gurugram', 'Sector 29', 28.4682, 77.0635, 0),
(2, 'Aravalli Hill Sunset Trek & Wild Flora Walk', 'Escape the highway concrete for quiet dirt pathways, birdwatching, and panoramic rocky skyline views in the Aravalli foothills.', 0.00, 0.00, 90, 'Evening', 'Outdoor', 'Solo', 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop&q=80', 'Gurugram', 'Gurugram', 'MG Road', 28.4875, 77.1022, 0),

-- Noida
(4, 'Snow World Chill & Mall of India Arcade Adventure', 'Step into sub-zero snow slides, race virtual supercars, and browse 300+ stores in Noida Sector 18.', 150.00, 650.00, 120, 'Afternoon', 'Indoor', 'Friends', 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=800&auto=format&fit=crop&q=80', 'Noida', 'Noida', 'Sector 18', 28.5675, 77.3210, 0),
(3, 'Rollercoaster Adrenaline Rush at Worlds of Wonder', 'Take on high-speed looping coasters, carnival drop towers, and track go-karts with friends at Noida Sector 38A.', 450.00, 1100.00, 180, 'Afternoon', 'Outdoor', 'Friends', 'https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?w=800&auto=format&fit=crop&q=80', 'Noida', 'Noida', 'Sector 38A', 28.5645, 77.3265, 12),
(2, 'Bamboo Grove Walking Trails & Lake Loop at Noida Bio Park', 'Enjoy quiet morning cycling along water lily ponds and shaded bamboo canopies in Sector 91.', 0.00, 30.00, 90, 'Morning', 'Outdoor', 'Solo', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&auto=format&fit=crop&q=80', 'Noida', 'Noida', 'Sector 137', 28.5085, 77.3872, 0),

-- Ghaziabad
(4, 'Courtyard Live Shows & Gaming at Indirapuram Habitat Centre', 'Watch street bands play under the open sky, play arcade pool, and grab delicious momos and bubble waffles.', 100.00, 400.00, 90, 'Evening', 'Outdoor', 'Friends', 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=80', 'Ghaziabad', 'Ghaziabad', 'Indirapuram', 28.6385, 77.3685, 0),
(2, 'Morning Lakeside Jogging & Japanese Bridges at Swarn Jayanti Park', 'Breathe in the morning freshness alongside the peaceful lake and beautiful wooden arch bridges in Indirapuram.', 10.00, 50.00, 75, 'Morning', 'Outdoor', 'Solo', 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop&q=80', 'Ghaziabad', 'Ghaziabad', 'Indirapuram', 28.6415, 77.3712, 0),

-- Faridabad
(5, 'Ancient Amphitheatre Exploration & Pottery Walk at Surajkund', 'Marvel at the ancient sun pool masonry, take peaceful walks in the surrounding hills, and view craft artisans at work.', 20.00, 100.00, 90, 'Morning', 'Outdoor', 'Both', 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&auto=format&fit=crop&q=80', 'Faridabad', 'Faridabad', 'Surajkund', 28.4895, 77.2842, 0),
(1, 'Street Food Feast & Evening Chai at Sector 15 Market', 'Gather with fellow students for steaming butter chhole kulche, paneer tikkas, and hot ginger kulhad chai.', 60.00, 200.00, 60, 'Evening', 'Outdoor', 'Friends', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80', 'Faridabad', 'Faridabad', 'Sector 15', 28.4115, 77.3195, 0);
