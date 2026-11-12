-- V4__seed_rohini_activities.sql
-- 60 Verified Rohini Activity Suggestions across 4 Budget Tiers + Preserved Delhi/India Gate Spots

-- 1. Insert India Gate and Verified Rohini Spots
INSERT INTO spots (name, description, address, city, latitude, longitude, min_cost, max_cost, opening_hours, cover_image_url) VALUES
('India Gate & Kartavya Path', 'Iconic war memorial and ceremonial boulevard with wide lawns, night illuminations, and fountain boat club', 'Rajpath, India Gate, New Delhi', 'Delhi', 28.6129, 77.2295, 0.00, 100.00, '24 Hours Open', 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800'),
('Swarn Jayanti Park (Japanese Park)', 'Sprawling 250-acre scenic municipal park featuring two lakes, Japanese-style pagodas, jogging tracks, and lush picnic lawns', 'Sector 10, Rohini, Delhi', 'Rohini, Delhi', 28.7180, 77.1130, 0.00, 50.00, '05:00 AM - 08:30 PM', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800'),
('Metro Walk Mall & Adventure Island', 'Open-air lakeside retail promenade and amusement park featuring rollercoasters, water rides, carnival games, and waterfront dining', 'Sector 10, Rohini, Delhi', 'Rohini, Delhi', 28.7235, 77.1142, 0.00, 800.00, '11:00 AM - 11:00 PM', 'https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?w=800'),
('DC Chowk Market', 'Vibrant Rohini street food haven famous for crispy gol gappas, tandoori soya chaap, pav bhaji, kulfi falooda, and late-night snacks', 'Sector 9, Rohini, Delhi', 'Rohini, Delhi', 28.7088, 77.1265, 30.00, 300.00, '11:00 AM - 11:00 PM', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800'),
('Prashant Vihar Food & Retail Hub', 'Culinary hotspot packed with modern student cafes, dessert parlours, bakeries, indie boutiques, and cozy study lounges', 'Sector 14, Rohini, Delhi', 'Rohini, Delhi', 28.7165, 77.1350, 50.00, 500.00, '10:30 AM - 11:30 PM', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800'),
('Unity One Mall & Cinepolis', 'Directly connected to Rohini West Metro, featuring Cinepolis multiplex, multi-cuisine food court, and trendy retail shopping', 'Near Rohini West Metro, Sector 10, Rohini, Delhi', 'Rohini, Delhi', 28.7145, 77.1148, 100.00, 800.00, '10:00 AM - 10:30 PM', 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=800'),
('Rohini Sports Complex', 'Comprehensive DDA sports complex offering Olympic swimming, badminton, clay tennis courts, skating rink, squash, and gym', 'Sector 14, Rohini, Delhi', 'Rohini, Delhi', 28.7195, 77.1325, 50.00, 400.00, '06:00 AM - 09:00 PM', 'https://images.unsplash.com/photo-1538510747656-784860010c71?w=800'),
('D-Mall & Twin District Centre Arena', 'Commercial plaza featuring bowling alleys, snooker parlours, gaming zones, fast-casual restaurants, and wellness spas', 'Sector 10, Rohini, Delhi', 'Rohini, Delhi', 28.7175, 77.1175, 100.00, 1000.00, '10:30 AM - 11:00 PM', 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=800'),
('North Ex Cultural & Street Market', 'Neighborhood shopping arcade with budget electronics, fashion thrift stalls, spicy street delicacies, and casual dining', 'Sector 9, Rohini, Delhi', 'Rohini, Delhi', 28.7095, 77.1280, 20.00, 300.00, '11:00 AM - 10:00 PM', 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800'),
('DDA District Park & Jogging Track', 'Dense green urban forest with walking loops, outdoor open gym, duck pond, and meditation gazebos', 'Sector 15, Rohini, Delhi', 'Rohini, Delhi', 28.7280, 77.1320, 0.00, 0.00, '05:00 AM - 08:00 PM', 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800'),
('Ring Road Cafe Street', 'Bustling avenue lined with late-night tea stalls, bakeries, ice cream joints, and outdoor seating', 'Sector 8-9 Ring Road, Rohini, Delhi', 'Rohini, Delhi', 28.7050, 77.1200, 30.00, 400.00, '08:00 AM - 01:00 AM', 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800');

-- 2. Insert India Gate Activity
INSERT INTO activities (category_id, title, description, min_cost, max_cost, duration_minutes, best_time, location_type, group_type, cover_image_url, city, latitude, longitude, min_age) VALUES
(5, 'Evening Stroll & Ice Cream at India Gate', 'Walk down the grand Kartavya Path, view the Amar Jawan memorial illuminations, and enjoy classic ice creams and street corn with friends and family.', 0.00, 80.00, 90, 'Evening', 'Outdoor', 'Both', 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800', 'Delhi', 28.6129, 77.2295, 0);

-- 3. Insert Exactly 60 Rohini Activities:
-- 20 Solo (5 Under ₹100, 5 Under ₹300, 5 Under ₹500, 5 Above ₹500)
-- 20 With Friends (5 Under ₹100, 5 Under ₹300, 5 Under ₹500, 5 Above ₹500)
-- 20 With Family (5 Under ₹100, 5 Under ₹300, 5 Under ₹500, 5 Above ₹500)

-- =========================================================================
-- SOLO ACTIVITIES (20 Total)
-- =========================================================================

-- Solo: Under ₹100 (1 to 5)
INSERT INTO activities (category_id, title, description, min_cost, max_cost, duration_minutes, best_time, location_type, group_type, cover_image_url, city, latitude, longitude, min_age) VALUES
(2, 'Early Morning Jog & Calisthenics at Japanese Park', 'Breathe in the crisp morning air along the paved 4-km track around the lake and use the free open-air calisthenics gym.', 0.00, 0.00, 60, 'Morning', 'Outdoor', 'Solo', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800', 'Rohini, Delhi', 28.7180, 77.1130, 0),
(2, 'Quiet Botanical Walk & Bird Photography at DDA Park Sec 15', 'Unwind with an undisturbed nature walk under eucalyptus groves, capturing local birdlife and calm morning mist.', 0.00, 0.00, 75, 'Morning', 'Outdoor', 'Solo', 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800', 'Rohini, Delhi', 28.7280, 77.1320, 0),
(1, 'Street Chai & Newspaper Solitude at DC Chowk', 'Sip fresh ginger-infused kulhad chai while catching up on the morning news or people-watching at the corner stall.', 15.00, 45.00, 45, 'Morning', 'Outdoor', 'Solo', 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800', 'Rohini, Delhi', 28.7088, 77.1265, 0),
(8, 'Afternoon Reading & Journaling under Japanese Park Gazebo', 'Pack your favorite novel, sit under the shaded wooden pagoda by the lotus pond, and enjoy peace away from the urban hum.', 0.00, 0.00, 90, 'Afternoon', 'Outdoor', 'Solo', 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800', 'Rohini, Delhi', 28.7180, 77.1130, 0),
(5, 'Window Shopping & Promenade Stroll at Metro Walk', 'Take a calm solo walk around the European-style cobblestone walkways admiring lake views, retail displays, and buskers.', 0.00, 0.00, 60, 'Evening', 'Outdoor', 'Solo', 'https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?w=800', 'Rohini, Delhi', 28.7235, 77.1142, 0);

-- Solo: Under ₹300 (6 to 10)
INSERT INTO activities (category_id, title, description, min_cost, max_cost, duration_minutes, best_time, location_type, group_type, cover_image_url, city, latitude, longitude, min_age) VALUES
(1, 'Solo Coffee & Study Hour at Prashant Vihar Cafe', 'Grab a corner table with free Wi-Fi, order an iced brew with cinnamon twist, and power through your reading or coursework.', 150.00, 280.00, 120, 'Afternoon', 'Indoor', 'Solo', 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800', 'Rohini, Delhi', 28.7165, 77.1350, 0),
(1, 'Crispy Soya Chaap & Rumali Roti Solo Lunch at DC Chowk', 'Treat yourself to freshly grilled malai soya chaap paired with piping hot rumali roti and tangy mint chutney.', 120.00, 260.00, 45, 'Evening', 'Outdoor', 'Solo', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800', 'Rohini, Delhi', 28.7088, 77.1265, 0),
(3, 'Morning Badminton Practice at Rohini Sports Complex', 'Book an indoor wooden court for a solo smash session and drills to break a solid sweat.', 100.00, 220.00, 60, 'Morning', 'Indoor', 'Solo', 'https://images.unsplash.com/photo-1538510747656-784860010c71?w=800', 'Rohini, Delhi', 28.7195, 77.1325, 13),
(1, 'North Ex Street Momos & Boba Tea Solo Break', 'Sample piping hot steamed Kurkure momos washed down with chilled fruit boba tea at North Ex Market.', 130.00, 260.00, 50, 'Evening', 'Outdoor', 'Solo', 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800', 'Rohini, Delhi', 28.7095, 77.1280, 0),
(6, 'Matinee Cinema Escape at Cinepolis Unity One', 'Enjoy a midday solo film screening with recliner comfort and discounted weekday matinee ticket rates.', 160.00, 290.00, 150, 'Afternoon', 'Indoor', 'Solo', 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800', 'Rohini, Delhi', 28.7145, 77.1148, 13);

-- Solo: Under ₹500 (11 to 15)
INSERT INTO activities (category_id, title, description, min_cost, max_cost, duration_minutes, best_time, location_type, group_type, cover_image_url, city, latitude, longitude, min_age) VALUES
(7, 'Clay Pottery & Mug Sculpting Workshop at Prashant Vihar', 'Sit down at the spinning wheel with an expert ceramicist and mould your own handcrafted cup or planter bowl.', 350.00, 480.00, 90, 'Afternoon', 'Indoor', 'Solo', 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800', 'Rohini, Delhi', 28.7165, 77.1350, 12),
(3, 'Olympic Pool Lap Swimming at Rohini Sports Complex', 'Refresh your mind and body with an intensive lap workout in the temperature-controlled Olympic-sized pool.', 300.00, 450.00, 75, 'Morning', 'Outdoor', 'Solo', 'https://images.unsplash.com/photo-1538510747656-784860010c71?w=800', 'Rohini, Delhi', 28.7195, 77.1325, 12),
(4, 'VR Gaming Immersion Session at Metro Walk Arcade', 'Equip the headset and battle across futuristic cyberpunk landscapes and sci-fi simulators in the dedicated VR bay.', 320.00, 490.00, 45, 'Evening', 'Indoor', 'Solo', 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=800', 'Rohini, Delhi', 28.7235, 77.1142, 10),
(1, 'Artisanal Croissant & Pour-Over Tasting at Ring Road Roastery', 'Savor single-origin specialty roast coffee paired with a warm almond chocolate croissant in a boutique bakery.', 320.00, 480.00, 60, 'Morning', 'Indoor', 'Solo', 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800', 'Rohini, Delhi', 28.7050, 77.1200, 0),
(3, 'Evening Mountain Bike Rental & Lake Circuit Ride', 'Rent a performance geared bicycle for 2 hours and pedal through the Japanese Park perimeter trails.', 300.00, 450.00, 120, 'Evening', 'Outdoor', 'Solo', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800', 'Rohini, Delhi', 28.7180, 77.1130, 12);

-- Solo: Above ₹500 (16 to 20)
INSERT INTO activities (category_id, title, description, min_cost, max_cost, duration_minutes, best_time, location_type, group_type, cover_image_url, city, latitude, longitude, min_age) VALUES
(8, 'Holistic Spa Relaxation & Steam Therapy at D-Mall', 'Treat yourself to an aromatherapeutic full-body Swedish massage, hot towel treatment, and herbal steam bath.', 600.00, 1200.00, 90, 'Afternoon', 'Indoor', 'Solo', 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800', 'Rohini, Delhi', 28.7175, 77.1175, 18),
(6, 'IMAX Laser 3D Blockbuster Experience at Cinepolis', 'Watch the latest Hollywood or Pan-Indian spectacle on the giant IMAX laser screen with Dolby Atmos surround sound.', 550.00, 850.00, 180, 'Night', 'Indoor', 'Solo', 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800', 'Rohini, Delhi', 28.7145, 77.1148, 12),
(3, 'Private Tennis Coaching & Drill Session at Sector 14', 'One-on-one session with a certified tennis coach focusing on forehand topspin, serve mechanics, and court strategy.', 600.00, 1000.00, 60, 'Morning', 'Outdoor', 'Solo', 'https://images.unsplash.com/photo-1538510747656-784860010c71?w=800', 'Rohini, Delhi', 28.7195, 77.1325, 12),
(1, 'Gourmet Ramen & Gyoza Solo Dining at Metro Walk', 'Indulge in a rich piping hot bowl of Japanese Tonkotsu or spicy miso ramen served with pan-fried vegetable gyoza.', 550.00, 950.00, 60, 'Evening', 'Indoor', 'Solo', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800', 'Rohini, Delhi', 28.7235, 77.1142, 0),
(3, 'Adventure Island Unlimited Solo Rollercoaster Pass', 'Full single-rider access to adrenaline thrill rides including Twister, Flip-Out, Sky Riders, and Wild Wheels.', 650.00, 950.00, 240, 'Afternoon', 'Outdoor', 'Solo', 'https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?w=800', 'Rohini, Delhi', 28.7235, 77.1142, 12);


-- =========================================================================
-- WITH FRIENDS ACTIVITIES (20 Total)
-- =========================================================================

-- Friends: Under ₹100 (21 to 25)
INSERT INTO activities (category_id, title, description, min_cost, max_cost, duration_minutes, best_time, location_type, group_type, cover_image_url, city, latitude, longitude, min_age) VALUES
(8, 'Sunset Frisbee & Acoustic Jam at Japanese Park', 'Bring an acoustic guitar, throw a frisbee across the massive lawns, and sing along as the dusk lights illuminate the lake.', 0.00, 0.00, 120, 'Sunset', 'Outdoor', 'Friends', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800', 'Rohini, Delhi', 28.7180, 77.1130, 0),
(1, 'DC Chowk Gol Gappa & Spicy Chaat Face-Off', 'Challenge your friends to see who can handle the spiciest hing-paani puris and spicy papdi chaat at Rohini Sector 9.', 30.00, 90.00, 45, 'Evening', 'Outdoor', 'Friends', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800', 'Rohini, Delhi', 28.7088, 77.1265, 0),
(3, 'Gully Cricket & Football Match at Sector 14 Grounds', 'Assemble your squad for 8-a-side box cricket or football on open community grounds with banter and bragging rights.', 0.00, 0.00, 120, 'Evening', 'Outdoor', 'Friends', 'https://images.unsplash.com/photo-1538510747656-784860010c71?w=800', 'Rohini, Delhi', 28.7195, 77.1325, 0),
(1, 'Late Night Kulfi Falooda & Rabri Stroll at Prashant Vihar', 'End your night out with rich kesar pista kulfi on a stick or rose-syrup drizzled falooda bowls with your best buddies.', 40.00, 95.00, 45, 'Night', 'Outdoor', 'Friends', 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800', 'Rohini, Delhi', 28.7165, 77.1350, 0),
(7, 'Lakefront Reel & Photo Walk at Metro Walk Bridge', 'Stage aesthetic golden hour photos and creative Instagram reels against the lake bridge and colorful promenade facades.', 0.00, 0.00, 75, 'Sunset', 'Outdoor', 'Friends', 'https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?w=800', 'Rohini, Delhi', 28.7235, 77.1142, 0);

-- Friends: Under ₹300 (26 to 30)
INSERT INTO activities (category_id, title, description, min_cost, max_cost, duration_minutes, best_time, location_type, group_type, cover_image_url, city, latitude, longitude, min_age) VALUES
(4, 'Board Game Showdown & Peri-Peri Fries at Prashant Vihar Cafe', 'Battle your group over Catan, Exploding Kittens, and Uno with overflowing baskets of peri-peri fries and iced tea.', 140.00, 280.00, 150, 'Evening', 'Indoor', 'Friends', 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=800', 'Rohini, Delhi', 28.7165, 77.1350, 0),
(1, 'DC Chowk Group Street Food Crawl', 'Pool ₹250 per person to devour stuffed kulchas, pav bhaji, momos, and chocolate shakes across the bustling market alleys.', 150.00, 280.00, 90, 'Evening', 'Outdoor', 'Friends', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800', 'Rohini, Delhi', 28.7088, 77.1265, 0),
(3, 'Box Cricket Turf Match under Floodlights Sector 16', 'Split the hourly turf fee with your group for a fast-paced 6-a-side rubber ball tournament under evening floodlights.', 150.00, 280.00, 90, 'Night', 'Outdoor', 'Friends', 'https://images.unsplash.com/photo-1538510747656-784860010c71?w=800', 'Rohini, Delhi', 28.7280, 77.1320, 0),
(4, 'Air Hockey & Racing Arcade Duel at Unity One', 'Challenge friends on twin racing cockpits, fast air hockey tables, and basketball hoop machines with reloadable cards.', 150.00, 290.00, 60, 'Afternoon', 'Indoor', 'Friends', 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800', 'Rohini, Delhi', 28.7145, 77.1148, 0),
(1, 'Midnight Tea & Cheese Maggi Hangout on Ring Road', 'Gather your squad around the roadside dhaba tables for butter garlic Maggi, Bun Makkhan, and endless midnight conversations.', 100.00, 240.00, 75, 'Late Night', 'Outdoor', 'Friends', 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800', 'Rohini, Delhi', 28.7050, 77.1200, 0);

-- Friends: Under ₹500 (31 to 35)
INSERT INTO activities (category_id, title, description, min_cost, max_cost, duration_minutes, best_time, location_type, group_type, cover_image_url, city, latitude, longitude, min_age) VALUES
(3, '10-Pin Bowling Match & Snack Platter at Metro Walk', 'Hit the neon bowling alleys, throw strikes, and share nachos and chicken popcorn with your group of friends.', 350.00, 480.00, 90, 'Night', 'Indoor', 'Friends', 'https://images.unsplash.com/photo-1538510747656-784860010c71?w=800', 'Rohini, Delhi', 28.7235, 77.1142, 10),
(8, 'Group Karaoke Booth Party at D-Mall', 'Book a private acoustic karaoke lounge, belt out classic 90s Bollywood tracks and rock anthems with dynamic party lighting.', 320.00, 490.00, 90, 'Night', 'Indoor', 'Friends', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800', 'Rohini, Delhi', 28.7175, 77.1175, 14),
(4, 'Escape Room Mystery Quest at Prashant Vihar', 'Race against a 60-minute countdown clock solving cryptic riddles, opening secret locks, and breaking out together.', 350.00, 490.00, 60, 'Afternoon', 'Indoor', 'Friends', 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=800', 'Rohini, Delhi', 28.7165, 77.1350, 12),
(3, '8-Ball Pool & Snooker Tournament at North Ex', 'Rent professional pool tables, order iced mocktails, and hold a competitive knockout tournament amongst friends.', 300.00, 450.00, 90, 'Evening', 'Indoor', 'Friends', 'https://images.unsplash.com/photo-1538510747656-784860010c71?w=800', 'Rohini, Delhi', 28.7095, 77.1280, 14),
(1, 'Wood-Fired Pizza & Mocktail Hangout at Sector 9', 'Share artisanal thin-crust sourdough pizzas loaded with toppings and sparkling passionfruit spritzers in a lively ambiance.', 350.00, 490.00, 90, 'Evening', 'Indoor', 'Friends', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800', 'Rohini, Delhi', 28.7088, 77.1265, 0);

-- Friends: Above ₹500 (36 to 40)
INSERT INTO activities (category_id, title, description, min_cost, max_cost, duration_minutes, best_time, location_type, group_type, cover_image_url, city, latitude, longitude, min_age) VALUES
(3, 'Adventure Island Thrill Rides Day Out with Friends', 'Full-day pass tackling Delhi most intense rollercoasters, free-fall towers, and high-speed pendulum rides with your group.', 650.00, 1100.00, 240, 'Afternoon', 'Outdoor', 'Friends', 'https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?w=800', 'Rohini, Delhi', 28.7235, 77.1142, 12),
(1, 'Rooftop Lounge Live Music & Dinner on Ring Road', 'Experience lively DJ beats, acoustic singers, craft mocktails, and sizzler platters under the starlit Rohini skyline.', 600.00, 1400.00, 180, 'Night', 'Indoor', 'Friends', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800', 'Rohini, Delhi', 28.7050, 77.1200, 18),
(3, 'Go-Karting Grand Prix Race at Rohini Adventure Circuit', 'Put on helmets and speed around sharp chicanes and hairpins in twin 200cc karts with digital lap timing boards.', 600.00, 1000.00, 60, 'Evening', 'Outdoor', 'Friends', 'https://images.unsplash.com/photo-1538510747656-784860010c71?w=800', 'Rohini, Delhi', 28.7235, 77.1142, 14),
(1, 'Unlimited Barbeque Buffet Feast at Unity One', 'Feast on unlimited skewered grilled kebabs cooked on your table grill, followed by a grand buffet spread and desserts.', 650.00, 1100.00, 120, 'Evening', 'Indoor', 'Friends', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800', 'Rohini, Delhi', 28.7145, 77.1148, 0),
(4, 'Laser Tag Tactical Arena Showdown at Sector 10', 'Wear infrared vests and battle through multi-level glow-in-the-dark maze corridors in high-energy team deathmatches.', 550.00, 850.00, 60, 'Evening', 'Indoor', 'Friends', 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800', 'Rohini, Delhi', 28.7175, 77.1175, 10);


-- =========================================================================
-- WITH FAMILY ACTIVITIES (20 Total)
-- =========================================================================

-- Family: Under ₹100 (41 to 45)
INSERT INTO activities (category_id, title, description, min_cost, max_cost, duration_minutes, best_time, location_type, group_type, cover_image_url, city, latitude, longitude, min_age) VALUES
(2, 'Sunday Morning Family Picnic on Japanese Park Grasslands', 'Spread out a large picnic sheet, bring home-cooked parathas and games, and enjoy quality time across open sunny lawns.', 0.00, 0.00, 150, 'Morning', 'Outdoor', 'Family', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800', 'Rohini, Delhi', 28.7180, 77.1130, 0),
(8, 'Evening Musical Fountain & Light Show at Swarn Jayanti Park', 'Watch the synchronized dancing water fountains illuminated in vibrant colors accompanied by patriotic and classical music.', 20.00, 50.00, 60, 'Evening', 'Outdoor', 'Family', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800', 'Rohini, Delhi', 28.7180, 77.1130, 0),
(5, 'Family Temple Darshan & Garden Walk at Sector 9', 'Visit the peaceful local spiritual temple followed by a serene walking circuit in the adjacent community landscape.', 0.00, 0.00, 60, 'Morning', 'Outdoor', 'Family', 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=800', 'Rohini, Delhi', 28.7088, 77.1265, 0),
(2, 'Sunset Lake View & Duck Watching at Japanese Park', 'Walk along the lakeside with elderly family members and kids feeding local ducks and watching sunset reflections.', 0.00, 0.00, 75, 'Sunset', 'Outdoor', 'Family', 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800', 'Rohini, Delhi', 28.7180, 77.1130, 0),
(5, 'Weekend Vegetable & Flower Bazaar Stroll with Parents at Sector 14', 'Take an engaging morning stroll through the colorful weekend market choosing exotic fresh produce, herbs, and potted plants.', 0.00, 50.00, 60, 'Morning', 'Outdoor', 'Family', 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800', 'Rohini, Delhi', 28.7165, 77.1350, 0);

-- Family: Under ₹300 (46 to 50)
INSERT INTO activities (category_id, title, description, min_cost, max_cost, duration_minutes, best_time, location_type, group_type, cover_image_url, city, latitude, longitude, min_age) VALUES
(1, 'Family Ice Cream Sundae & Falooda Night at Giani Prashant Vihar', 'Treat your family to classic Belgian chocolate sundaes, rabri falooda cups, and cassata slices after dinner.', 100.00, 250.00, 45, 'Night', 'Indoor', 'Family', 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800', 'Rohini, Delhi', 28.7165, 77.1350, 0),
(1, 'South Indian Dosa & Filter Coffee Breakfast at Sagar Ratna Sec 9', 'Enjoy paper-thin Mysore masala dosas, steaming soft idlis, and foaming filter coffee in a family-friendly vegetarian restaurant.', 150.00, 290.00, 60, 'Morning', 'Indoor', 'Family', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800', 'Rohini, Delhi', 28.7088, 77.1265, 0),
(2, 'Paddle Boating on Japanese Park Lake with Family', 'Rent a 4-seater pedal boat and glide across the calm waters, taking in the picturesque park banks together.', 120.00, 250.00, 45, 'Evening', 'Outdoor', 'Family', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800', 'Rohini, Delhi', 28.7180, 77.1130, 0),
(1, 'North Ex Family Chaat & Sweets Treat', 'Gather for freshly prepared raj kachori, dhokla, and hot gulab jamuns in a sanitized, comfortable family sweets parlour.', 120.00, 280.00, 60, 'Evening', 'Indoor', 'Family', 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800', 'Rohini, Delhi', 28.7095, 77.1280, 0),
(3, 'Metro Walk Kids Carnival Rides & Carousel', 'Take the little ones on the vintage horses carousel, mini roller coaster, and water bumper boats.', 100.00, 250.00, 60, 'Evening', 'Outdoor', 'Family', 'https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?w=800', 'Rohini, Delhi', 28.7235, 77.1142, 0);

-- Family: Under ₹500 (51 to 55)
INSERT INTO activities (category_id, title, description, min_cost, max_cost, duration_minutes, best_time, location_type, group_type, cover_image_url, city, latitude, longitude, min_age) VALUES
(6, 'Family Movie & Popcorn Show at Cinepolis Unity One', 'Enjoy the latest family animation or comedy film in air-conditioned stadium seating with giant tubs of buttered popcorn.', 300.00, 480.00, 150, 'Evening', 'Indoor', 'Family', 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800', 'Rohini, Delhi', 28.7145, 77.1148, 0),
(1, 'Royal North Indian Thali Dinner at Prashant Vihar', 'Relish an authentic multi-dish thali with dal makhani, paneer lababdar, fresh naans, raita, and hot jalebis.', 320.00, 490.00, 90, 'Evening', 'Indoor', 'Family', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800', 'Rohini, Delhi', 28.7165, 77.1350, 0),
(7, 'Pottery & Terracotta Painting Workshop for Family & Kids', 'Engage children and grandparents in hand-painting pre-fired clay diyas and decorative tiles to take home.', 300.00, 480.00, 90, 'Weekend Afternoon', 'Indoor', 'Family', 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800', 'Rohini, Delhi', 28.7165, 77.1350, 0),
(2, 'Guided Ecology & Nature Walk at Rohini Biodiversity Park', 'Explore indigenous trees, medicinal shrubs, and butterfly conservatory zones with an informative nature guide.', 300.00, 450.00, 90, 'Morning', 'Outdoor', 'Family', 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800', 'Rohini, Delhi', 28.7280, 77.1320, 0),
(1, 'Festive Sweets & Bakery Hamper Shopping at Sector 9', 'Pick out artisanal baklavas, dry fruit laddoos, and fresh almond cookies for a family celebration.', 300.00, 490.00, 60, 'Evening', 'Indoor', 'Family', 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800', 'Rohini, Delhi', 28.7088, 77.1265, 0);

-- Family: Above ₹500 (56 to 60)
INSERT INTO activities (category_id, title, description, min_cost, max_cost, duration_minutes, best_time, location_type, group_type, cover_image_url, city, latitude, longitude, min_age) VALUES
(3, 'Full Family Day at Adventure Island Theme Park', 'Experience complete access to all family rides, water slides, dance shows, and stunt performances for all generations.', 650.00, 1200.00, 240, 'Afternoon', 'Outdoor', 'Family', 'https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?w=800', 'Rohini, Delhi', 28.7235, 77.1142, 0),
(1, 'Grand Sunday Brunch Buffet at Crowne Plaza Twin District Centre', 'A lavish 7-course international buffet featuring live pasta stations, dim sum carts, Indian curries, and an extravagant dessert salon.', 800.00, 1600.00, 180, 'Afternoon', 'Indoor', 'Family', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800', 'Rohini, Delhi', 28.7175, 77.1175, 0),
(6, 'VIP Recliner Luxury Cinema Experience for Family at Unity One', 'Plush motorized recliners with personal service, warm blankets, and gourmet finger foods for an unforgettable family movie night.', 600.00, 1000.00, 180, 'Evening', 'Indoor', 'Family', 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800', 'Rohini, Delhi', 28.7145, 77.1148, 0),
(1, 'Waterfront Family Celebration & Dinner at Metro Walk', 'Celebrate family anniversaries and milestones with multi-cuisine dining on an open terrace directly facing the water lake.', 550.00, 1100.00, 120, 'Night', 'Outdoor', 'Family', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800', 'Rohini, Delhi', 28.7235, 77.1142, 0),
(4, 'Private Bowling Lane & Family Arcade Party at Sector 10', 'Book an exclusive lane for two hours with personalized bumpers for kids, arcade coins, pizza, and sodas.', 600.00, 1200.00, 120, 'Evening', 'Indoor', 'Family', 'https://images.unsplash.com/photo-1538510747656-784860010c71?w=800', 'Rohini, Delhi', 28.7175, 77.1175, 0);

-- 4. Associate Rohini Activities with their primary Spots (activity_spots)
-- Using subqueries to link cleanly based on titles and spots
INSERT INTO activity_spots (activity_id, spot_id)
SELECT a.id, s.id
FROM activities a, spots s
WHERE s.name = 'India Gate & Kartavya Path' AND a.title LIKE '%India Gate%'
ON CONFLICT DO NOTHING;

INSERT INTO activity_spots (activity_id, spot_id)
SELECT a.id, s.id
FROM activities a, spots s
WHERE s.name = 'Swarn Jayanti Park (Japanese Park)' AND (a.title LIKE '%Japanese Park%' OR a.title LIKE '%Swarn Jayanti%')
ON CONFLICT DO NOTHING;

INSERT INTO activity_spots (activity_id, spot_id)
SELECT a.id, s.id
FROM activities a, spots s
WHERE s.name = 'Metro Walk Mall & Adventure Island' AND (a.title LIKE '%Metro Walk%' OR a.title LIKE '%Adventure Island%')
ON CONFLICT DO NOTHING;

INSERT INTO activity_spots (activity_id, spot_id)
SELECT a.id, s.id
FROM activities a, spots s
WHERE s.name = 'DC Chowk Market' AND a.title LIKE '%DC Chowk%'
ON CONFLICT DO NOTHING;

INSERT INTO activity_spots (activity_id, spot_id)
SELECT a.id, s.id
FROM activities a, spots s
WHERE s.name = 'Prashant Vihar Food & Retail Hub' AND a.title LIKE '%Prashant Vihar%'
ON CONFLICT DO NOTHING;

INSERT INTO activity_spots (activity_id, spot_id)
SELECT a.id, s.id
FROM activities a, spots s
WHERE s.name = 'Unity One Mall & Cinepolis' AND (a.title LIKE '%Unity One%' OR a.title LIKE '%Cinepolis%')
ON CONFLICT DO NOTHING;

INSERT INTO activity_spots (activity_id, spot_id)
SELECT a.id, s.id
FROM activities a, spots s
WHERE s.name = 'Rohini Sports Complex' AND a.title LIKE '%Rohini Sports Complex%'
ON CONFLICT DO NOTHING;

INSERT INTO activity_spots (activity_id, spot_id)
SELECT a.id, s.id
FROM activities a, spots s
WHERE s.name = 'D-Mall & Twin District Centre Arena' AND (a.title LIKE '%D-Mall%' OR a.title LIKE '%Crowne Plaza%' OR a.title LIKE '%Sector 10%')
ON CONFLICT DO NOTHING;

INSERT INTO activity_spots (activity_id, spot_id)
SELECT a.id, s.id
FROM activities a, spots s
WHERE s.name = 'North Ex Cultural & Street Market' AND a.title LIKE '%North Ex%'
ON CONFLICT DO NOTHING;

INSERT INTO activity_spots (activity_id, spot_id)
SELECT a.id, s.id
FROM activities a, spots s
WHERE s.name = 'DDA District Park & Jogging Track' AND (a.title LIKE '%DDA Park%' OR a.title LIKE '%Sector 15%' OR a.title LIKE '%Biodiversity%')
ON CONFLICT DO NOTHING;

INSERT INTO activity_spots (activity_id, spot_id)
SELECT a.id, s.id
FROM activities a, spots s
WHERE s.name = 'Ring Road Cafe Street' AND a.title LIKE '%Ring Road%'
ON CONFLICT DO NOTHING;
