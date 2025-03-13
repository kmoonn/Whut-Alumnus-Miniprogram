CREATE DATABASE wut_alumnus_management DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE wut_alumnus_management;

-- 1. 用户表（users）
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    role ENUM('admin', 'reviewer', 'user') NOT NULL DEFAULT 'user',
    email VARCHAR(100) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. 源校友库（source_alumnus）
CREATE TABLE source_alumnus (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    gender ENUM('男', '女', '未知') NOT NULL,
    birthday DATE,
    graduation_year INT,
    department VARCHAR(100),
    major VARCHAR(100),
    region VARCHAR(100),
    company VARCHAR(100),
    position VARCHAR(100)
);

-- 3. 待审核校友（pending_alumnus）
CREATE TABLE pending_alumnus (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category ENUM('政界', '商界', '学界', '其他') NOT NULL,
    name VARCHAR(50) NOT NULL,
    gender ENUM('男', '女', '未知') NOT NULL,
    birthday DATE,
    region VARCHAR(100),
    company VARCHAR(100),
    position VARCHAR(100),
    graduation_year INT,
    major VARCHAR(100),
    source VARCHAR(255),  -- 例如：用户提交、网络收集
    status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 4. 审核记录（review_note）
CREATE TABLE review_note (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pending_id INT NOT NULL,
    reviewer_id INT NOT NULL,
    status ENUM('approved', 'rejected') NOT NULL,
    note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pending_id) REFERENCES pending_alumnus(id) ON DELETE CASCADE,
    FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 5. 知名校友（famous_alumnus）
CREATE TABLE famous_alumnus (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category ENUM('政界', '商界', '学界', '其他') NOT NULL,
    name VARCHAR(50) NOT NULL,
    region VARCHAR(100),
    company VARCHAR(100),
    position VARCHAR(100),
    graduation_year INT,
    major VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- 创建触发器：当审核记录新增时检查通过次数
DELIMITER //
CREATE TRIGGER after_review_insert
AFTER INSERT ON review_note
FOR EACH ROW
BEGIN
    DECLARE approve_count INT;
    
    -- 获取该校友的审核通过次数
    SELECT COUNT(*) INTO approve_count
    FROM review_note
    WHERE pending_id = NEW.pending_id
    AND status = 'approved';
    
    -- 如果通过次数达到10次
    IF approve_count >= 10 THEN
        -- 将该校友信息插入到知名校友表
        INSERT INTO famous_alumnus (
            category,
            name,
            region,
            company,
            position,
            graduation_year,
            major
        )
        SELECT 
            category,
            name,
            region,
            company,
            position,
            graduation_year,
            major
        FROM pending_alumnus
        WHERE id = NEW.pending_id
        AND NOT EXISTS (
            -- 检查是否已经在知名校友表中
            SELECT 1 FROM famous_alumnus
            WHERE name = pending_alumnus.name
            AND graduation_year = pending_alumnus.graduation_year
        );
        
        -- 更新待审核校友状态为已通过
        UPDATE pending_alumnus
        SET status = 'approved'
        WHERE id = NEW.pending_id;
    END IF;
END //
DELIMITER ;