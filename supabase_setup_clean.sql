-- 如果表已存在，先删除（可选，如果之前创建过表的话）
DROP TABLE IF EXISTS books CASCADE;

-- 创建 books 表
CREATE TABLE books (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  cover TEXT,
  status TEXT NOT NULL CHECK (status IN ('Reading', 'Finished', 'Wishlist')),
  rating INTEGER DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  note TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 创建索引以提高查询性能
CREATE INDEX idx_books_status ON books(status);
CREATE INDEX idx_books_created_at ON books(created_at DESC);

-- 启用 Row Level Security (RLS)
ALTER TABLE books ENABLE ROW LEVEL SECURITY;

-- 创建策略：允许所有人读取和写入
CREATE POLICY "Allow all operations for all users" ON books
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- 创建更新 updated_at 的触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 创建触发器
CREATE TRIGGER update_books_updated_at
  BEFORE UPDATE ON books
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

