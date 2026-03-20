-- =============================================================================
-- Lamtra Seed Data
-- Vietnamese milk tea chain ordering system
-- =============================================================================
-- Run AFTER migrations. Uses ON CONFLICT to allow re-running safely.
-- Backed up from production database on 2026-03-20.
-- =============================================================================

BEGIN;

-- -----------------------------------------------------------------------------
-- 1. Accounts (admin / manager / staff)
-- Passwords are bcrypt hashes of "password123"
-- -----------------------------------------------------------------------------
INSERT INTO accounts (id, username, password, role, status) VALUES
  (1, 'admin',      '$2b$10$5.kEo6g/NppanVVgoDYd9efW.A.1N1zsLtxNwl5Ah7Kf7tb9hnWUK', 'admin',   'active'),
  (2, 'manager_q1', '$2b$10$5.kEo6g/NppanVVgoDYd9efW.A.1N1zsLtxNwl5Ah7Kf7tb9hnWUK', 'manager', 'active'),
  (3, 'manager_q7', '$2b$10$5.kEo6g/NppanVVgoDYd9efW.A.1N1zsLtxNwl5Ah7Kf7tb9hnWUK', 'manager', 'active'),
  (4, 'staff_01',   '$2b$10$5.kEo6g/NppanVVgoDYd9efW.A.1N1zsLtxNwl5Ah7Kf7tb9hnWUK', 'staff',   'active'),
  (5, 'staff_02',   '$2b$10$5.kEo6g/NppanVVgoDYd9efW.A.1N1zsLtxNwl5Ah7Kf7tb9hnWUK', 'staff',   'active')
ON CONFLICT (username) DO NOTHING;

SELECT setval('accounts_id_seq', (SELECT COALESCE(MAX(id), 0) FROM accounts));

-- -----------------------------------------------------------------------------
-- 2. Branches
-- -----------------------------------------------------------------------------
INSERT INTO branches (id, name, address, longitude, latitude, operating_status) VALUES
  (1, 'Lamtra Quận 1',     '123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM',       106.7009, 10.7731, 'open'),
  (2, 'Lamtra Quận 7',     '456 Nguyễn Thị Thập, Phường Tân Phong, Quận 7, TP.HCM',  106.7219, 10.7340, 'open'),
  (3, 'Lamtra Thủ Đức',    '789 Võ Văn Ngân, Phường Linh Chiểu, TP. Thủ Đức, TP.HCM', 106.7585, 10.8510, 'open'),
  (4, 'Lamtra Bình Thạnh', '321 Điện Biên Phủ, Phường 15, Quận Bình Thạnh, TP.HCM',  106.7105, 10.8020, 'maintenance')
ON CONFLICT (id) DO NOTHING;

SELECT setval('branches_id_seq', (SELECT COALESCE(MAX(id), 0) FROM branches));

-- -----------------------------------------------------------------------------
-- 3. Customers
-- -----------------------------------------------------------------------------
INSERT INTO customers (id, full_name, email, phone_number, loyalty_points, membership_tier, date_of_birth) VALUES
  (1,  'Nguyễn Văn An',    'an.nguyen@email.com',    '0901234567', 1500, 'silver',   '1995-03-15'),
  (2,  'Trần Thị Bích',    'bich.tran@email.com',    '0912345678', 350,  'bronze',   '1998-07-22'),
  (3,  'Lê Hoàng Cường',   'cuong.le@email.com',     '0923456789', 5200, 'gold',     '1992-11-08'),
  (4,  'Phạm Minh Dũng',   'dung.pham@email.com',    '0934567890', 120,  'bronze',   '2000-01-30'),
  (5,  'Hoàng Thị Lan',    'lan.hoang@email.com',    '0945678901', 8900, 'platinum', '1990-05-12'),
  (6,  'Võ Đức Minh',      'minh.vo@email.com',      '0956789012', 2100, 'silver',   '1997-09-25'),
  (7,  'Đặng Thị Ngọc',    'ngoc.dang@email.com',    '0967890123', 450,  'bronze',   '1999-12-03'),
  (8,  'Bùi Quang Phúc',   'phuc.bui@email.com',     '0978901234', 3800, 'gold',     '1994-06-18'),
  (9,  'Ngô Thị Quỳnh',    'quynh.ngo@email.com',    '0989012345', 60,   'bronze',   '2001-04-07'),
  (10, 'Lý Thanh Sơn',     'son.ly@email.com',       '0990123456', 720,  'bronze',   '1996-08-14')
ON CONFLICT (id) DO NOTHING;

SELECT setval('customers_id_seq', (SELECT COALESCE(MAX(id), 0) FROM customers));

-- -----------------------------------------------------------------------------
-- 4. Product Categories
-- -----------------------------------------------------------------------------
INSERT INTO product_categories (id, name, description) VALUES
  (1, 'Trà sữa',          'Các loại trà sữa truyền thống và đặc biệt'),
  (2, 'Trà trái cây',     'Trà kết hợp với trái cây tươi'),
  (3, 'Cà phê',           'Cà phê pha máy và cà phê Việt Nam'),
  (4, 'Đá xay',           'Thức uống đá xay mát lạnh'),
  (5, 'Topping đặc biệt', 'Thức uống kèm topping cao cấp')
ON CONFLICT (name) DO NOTHING;

SELECT setval('product_categories_id_seq', (SELECT COALESCE(MAX(id), 0) FROM product_categories));

-- -----------------------------------------------------------------------------
-- 5. Sizes
-- -----------------------------------------------------------------------------
INSERT INTO sizes (id, name, additional_price) VALUES
  (1, 'S',  0.00),
  (2, 'M',  5000.00),
  (3, 'L',  10000.00),
  (4, 'XL', 15000.00)
ON CONFLICT (name) DO NOTHING;

SELECT setval('sizes_id_seq', (SELECT COALESCE(MAX(id), 0) FROM sizes));

-- -----------------------------------------------------------------------------
-- 6. Toppings
-- -----------------------------------------------------------------------------
INSERT INTO toppings (id, name, price, status) VALUES
  (1, 'Trân châu đen',       5000.00,  'available'),
  (2, 'Trân châu trắng',     5000.00,  'available'),
  (3, 'Thạch dừa',           6000.00,  'available'),
  (4, 'Pudding trứng',       8000.00,  'available'),
  (5, 'Kem cheese',          10000.00, 'available'),
  (6, 'Trân châu hoàng kim', 8000.00,  'available'),
  (7, 'Thạch cà phê',        6000.00,  'available'),
  (8, 'Sương sáo',           5000.00,  'unavailable')
ON CONFLICT (id) DO NOTHING;

SELECT setval('toppings_id_seq', (SELECT COALESCE(MAX(id), 0) FROM toppings));

-- -----------------------------------------------------------------------------
-- 7. Vouchers
-- -----------------------------------------------------------------------------
INSERT INTO vouchers (id, code, program_name, discount_value, type, min_order_value, expiration_date, scope) VALUES
  (1, 'WELCOME10',   'Chào mừng khách mới',     10.00,    'percentage', 50000.00,  '2026-12-31', 'all'),
  (2, 'SUMMER25K',   'Khuyến mãi hè 2026',      25000.00, 'fixed',     100000.00, '2026-08-31', 'all'),
  (3, 'VIP20',       'Ưu đãi thành viên VIP',   20.00,    'percentage', 80000.00,  '2026-12-31', 'all'),
  (4, 'TRASUA15',    'Giảm giá trà sữa',        15.00,    'percentage', 60000.00,  '2026-06-30', 'specific_categories'),
  (5, 'FREESHIP30K', 'Miễn phí vận chuyển',      30000.00, 'fixed',     120000.00, '2026-09-30', 'all')
ON CONFLICT (code) DO NOTHING;

SELECT setval('vouchers_id_seq', (SELECT COALESCE(MAX(id), 0) FROM vouchers));

-- -----------------------------------------------------------------------------
-- 8. Products
-- -----------------------------------------------------------------------------
INSERT INTO products (id, category_id, name, description, base_price, image_url, sales_status) VALUES
  -- Trà sữa
  (1,  1, 'Trà sữa trân châu đường đen', 'Trà sữa đậm đà với trân châu đường đen dai giòn',           45000.00, '/images/products/tra-sua-duong-den.jpg',   'discontinued'),
  (2,  1, 'Trà sữa matcha',              'Trà sữa matcha Nhật Bản thơm ngon',                          50000.00, '/images/products/tra-sua-matcha.jpg',       'discontinued'),
  (3,  1, 'Trà sữa khoai môn',           'Trà sữa khoai môn béo ngậy tự nhiên',                       48000.00, '/images/products/tra-sua-khoai-mon.jpg',    'discontinued'),
  (4,  1, 'Trà sữa oolong',              'Trà oolong kết hợp sữa tươi thanh mát',                     42000.00, '/images/products/tra-sua-oolong.jpg',       'discontinued'),
  -- Trà trái cây
  (5,  2, 'Trà đào cam sả',              'Trà đào thơm ngọt với cam tươi và sả',                      40000.00, '/images/products/tra-dao-cam-sa.jpg',       'discontinued'),
  (6,  2, 'Trà vải lychee',              'Trà vải tươi mát ngọt thanh',                               42000.00, '/images/products/tra-vai.jpg',              'discontinued'),
  (7,  2, 'Trà chanh dây',               'Trà chanh dây chua ngọt sảng khoái',                        38000.00, '/images/products/tra-chanh-day.jpg',        'discontinued'),
  -- Cà phê
  (8,  3, 'Cà phê sữa đá',              'Cà phê phin truyền thống Việt Nam với sữa đặc',             35000.00, '/images/products/ca-phe-sua-da.jpg',        'discontinued'),
  (9,  3, 'Bạc xỉu',                    'Cà phê nhẹ nhàng nhiều sữa cho người mới uống',             38000.00, '/images/products/bac-xiu.jpg',              'discontinued'),
  (10, 3, 'Cà phê caramel macchiato',    'Espresso kết hợp caramel và sữa tươi',                     55000.00, '/images/products/caramel-macchiato.jpg',    'discontinued'),
  -- Đá xay
  (11, 4, 'Đá xay chocolate',            'Chocolate đá xay mịn màng béo ngậy',                       52000.00, '/images/products/da-xay-chocolate.jpg',     'discontinued'),
  (12, 4, 'Đá xay dâu tây',             'Dâu tây tươi xay mát lạnh',                                48000.00, '/images/products/da-xay-dau-tay.jpg',       'discontinued'),
  -- Topping đặc biệt
  (13, 5, 'Trà sữa cheese foam',         'Trà sữa phủ lớp kem cheese béo mặn ngọt',                  58000.00, '/images/products/cheese-foam.jpg',          'discontinued'),
  (14, 5, 'Brown sugar boba milk',        'Sữa tươi trân châu đường nâu caramel hoá',                 55000.00, '/images/products/brown-sugar-boba.jpg',     'discontinued'),
  (15, 5, 'Trà sữa pudding trứng',       'Trà sữa kèm pudding trứng mềm mịn',                       52000.00, '/images/products/pudding-trung.jpg',        'unavailable'),
  -- New products (added 2026-03-20)
  (16, 3, 'Phê Xỉu Vani',               '(Có sẵn Thạch) Vị chua nhẹ tự nhiên của hạt Arabica Lạc Dương & Robusta Lâm Hà, hoà quyện cùng Vani Tự Nhiên, Thạch Xỉu Vani mềm mượt và Sữa Tươi Thanh Trùng đem đến hương vị đậm mượt đầy tinh tế.', 45000.00, 'https://dtgjzwujlftmvxnfqdok.supabase.co/storage/v1/object/public/products/2c62ed5d-91b2-4fcd-94ef-3179f99d5779.jpg', 'available'),
  (17, 2, 'Lang Biang',                  'Lang Biang với hương vị thuần khiết của trà Ô Long Đặc Sản cùng mứt hoa nhài thơm nhẹ.', 60000.00, 'https://dtgjzwujlftmvxnfqdok.supabase.co/storage/v1/object/public/products/c51fc7c7-20bb-40ff-84fe-ec56ed671f64.jpg', 'available')
ON CONFLICT (id) DO NOTHING;

SELECT setval('products_id_seq', (SELECT COALESCE(MAX(id), 0) FROM products));

-- -----------------------------------------------------------------------------
-- 9. Employees
-- -----------------------------------------------------------------------------
INSERT INTO employees (id, account_id, branch_id, full_name, email, phone_number, role, status) VALUES
  (1, 2,    1, 'Nguyễn Thị Hương',  'huong.nguyen@lamtra.vn', '0911111111', 'manager',  'active'),
  (2, 3,    2, 'Trần Văn Tùng',     'tung.tran@lamtra.vn',    '0922222222', 'manager',  'active'),
  (3, 4,    1, 'Lê Thị Mai',        'mai.le@lamtra.vn',       '0933333333', 'barista',  'active'),
  (4, 5,    1, 'Phạm Đức Thắng',    'thang.pham@lamtra.vn',   '0944444444', 'cashier',  'active'),
  (5, NULL, 2, 'Hoàng Văn Hải',     'hai.hoang@lamtra.vn',    '0955555555', 'barista',  'active'),
  (6, NULL, 2, 'Võ Thị Trang',      'trang.vo@lamtra.vn',     '0966666666', 'delivery', 'active'),
  (7, NULL, 3, 'Đặng Minh Tuấn',    'tuan.dang@lamtra.vn',    '0977777777', 'barista',  'active'),
  (8, NULL, 3, 'Bùi Thị Hồng',      'hong.bui@lamtra.vn',     '0988888888', 'cashier',  'on_leave')
ON CONFLICT (id) DO NOTHING;

SELECT setval('employees_id_seq', (SELECT COALESCE(MAX(id), 0) FROM employees));

-- -----------------------------------------------------------------------------
-- 10. Branch Product Status
-- -----------------------------------------------------------------------------
INSERT INTO branch_product_status (branch_id, product_id, status) VALUES
  -- Branch 1 (Quận 1) — full menu
  (1, 1, 'available'), (1, 2, 'available'), (1, 3, 'available'), (1, 4, 'available'),
  (1, 5, 'available'), (1, 6, 'available'), (1, 7, 'available'), (1, 8, 'available'),
  (1, 9, 'available'), (1, 10, 'available'), (1, 11, 'available'), (1, 12, 'available'),
  (1, 13, 'available'), (1, 14, 'available'), (1, 15, 'unavailable'),
  -- Branch 2 (Quận 7) — some out of stock
  (2, 1, 'available'), (2, 2, 'out_of_stock'), (2, 3, 'available'), (2, 5, 'available'),
  (2, 6, 'available'), (2, 8, 'available'), (2, 9, 'available'), (2, 11, 'available'),
  (2, 13, 'available'), (2, 14, 'available'),
  -- Branch 3 (Thủ Đức) — limited menu
  (3, 1, 'available'), (3, 3, 'available'), (3, 5, 'available'), (3, 8, 'available'),
  (3, 9, 'available'), (3, 11, 'available'), (3, 14, 'available')
ON CONFLICT (branch_id, product_id) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 11. Category Toppings (which toppings are available per category)
-- -----------------------------------------------------------------------------
INSERT INTO category_toppings (id, category_id, topping_id) VALUES
  -- Trà sữa (category 1) — all toppings
  (1, 1, 1), (2, 1, 2), (3, 1, 3), (4, 1, 4), (5, 1, 5), (6, 1, 6), (7, 1, 7), (8, 1, 8),
  -- Trà trái cây (category 2)
  (9, 2, 2), (10, 2, 3), (11, 2, 8),
  -- Cà phê (category 3)
  (12, 3, 4), (13, 3, 5), (14, 3, 7),
  -- Đá xay (category 4)
  (15, 4, 1), (16, 4, 2), (17, 4, 4), (18, 4, 5)
ON CONFLICT (id) DO NOTHING;

SELECT setval('category_toppings_id_seq', (SELECT COALESCE(MAX(id), 0) FROM category_toppings));

-- -----------------------------------------------------------------------------
-- 12. News
-- -----------------------------------------------------------------------------
INSERT INTO news (id, title, content, article_type, publish_date, publish_status) VALUES
  (1, 'Khai trương chi nhánh Thủ Đức!',
      'Lamtra vui mừng thông báo khai trương chi nhánh mới tại Thủ Đức. Giảm 20% tất cả đồ uống trong tuần khai trương từ ngày 01/04/2026.',
      'announcement', '2026-03-15', 'published'),
  (2, 'Khuyến mãi hè 2026 - Mua 2 tặng 1',
      'Chương trình khuyến mãi hè: mua 2 ly trà sữa bất kỳ size L trở lên, tặng 1 ly trà trái cây size M. Áp dụng từ 01/06 đến 31/08/2026.',
      'promotion', '2026-05-25', 'draft'),
  (3, 'Bí quyết chọn trà sữa phù hợp với bạn',
      'Bạn thích vị ngọt nhẹ? Hãy thử trà oolong sữa với 50% đường. Bạn thích đậm đà? Trà sữa trân châu đường đen là lựa chọn hoàn hảo.',
      'blog', '2026-03-10', 'published')
ON CONFLICT (id) DO NOTHING;

SELECT setval('news_id_seq', (SELECT COALESCE(MAX(id), 0) FROM news));

-- -----------------------------------------------------------------------------
-- 13. Media (news images only — review media omitted since orders are not seeded)
-- -----------------------------------------------------------------------------
INSERT INTO media (id, review_id, news_id, url, file_type) VALUES
  (3, NULL, 1, '/images/news/thu-duc-opening.jpg',       'image'),
  (4, NULL, 2, '/images/news/summer-promo-2026.jpg',     'image'),
  (5, NULL, 3, '/images/news/tra-sua-guide.jpg',         'image')
ON CONFLICT (id) DO NOTHING;

SELECT setval('media_id_seq', (SELECT COALESCE(MAX(id), 0) FROM media));

-- -----------------------------------------------------------------------------
-- 14. Loyalty History
-- -----------------------------------------------------------------------------
INSERT INTO loyalty_history (id, customer_id, points_changed, type, previous_points, date) VALUES
  (1, 1,  950,  'earned',   0,    '2026-01-15'),
  (2, 1,  550,  'earned',   950,  '2026-02-20'),
  (3, 3,  2100, 'earned',   0,    '2026-01-10'),
  (4, 3,  -500, 'redeemed', 2100, '2026-02-05'),
  (5, 3,  3600, 'earned',   1600, '2026-03-01'),
  (6, 5,  4500, 'earned',   0,    '2025-12-01'),
  (7, 5,  4400, 'earned',   4500, '2026-02-15'),
  (8, 8,  3800, 'earned',   0,    '2026-01-20')
ON CONFLICT (id) DO NOTHING;

SELECT setval('loyalty_history_id_seq', (SELECT COALESCE(MAX(id), 0) FROM loyalty_history));

-- -----------------------------------------------------------------------------
-- 15. Customer Vouchers
-- -----------------------------------------------------------------------------
INSERT INTO customer_vouchers (id, customer_id, voucher_id, received_date, used_date, status) VALUES
  (1, 1, 1, '2026-01-15', '2026-02-20', 'used'),
  (2, 2, 1, '2026-02-01', NULL,         'available'),
  (3, 3, 3, '2026-01-10', '2026-03-01', 'used'),
  (4, 5, 3, '2025-12-01', NULL,         'available'),
  (5, 5, 5, '2026-02-15', '2026-03-10', 'used'),
  (6, 4, 2, '2026-03-01', '2026-03-15', 'used'),
  (7, 7, 1, '2026-03-10', NULL,         'available'),
  (8, 8, 4, '2026-02-01', NULL,         'available')
ON CONFLICT (id) DO NOTHING;

SELECT setval('customer_vouchers_id_seq', (SELECT COALESCE(MAX(id), 0) FROM customer_vouchers));

COMMIT;
