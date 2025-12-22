#!/bin/bash

echo "=========================================="
echo "Supabase 配置向导"
echo "=========================================="
echo ""
echo "请按照以下步骤获取你的 Supabase 信息："
echo "1. 打开 Supabase 网站并登录"
echo "2. 进入你的项目"
echo "3. 点击左侧 Settings（设置）"
echo "4. 点击 API"
echo "5. 找到 Project URL 和 anon public key"
echo ""
echo "=========================================="
echo ""

read -p "请输入你的 Supabase URL (例如: https://xxxxx.supabase.co): " SUPABASE_URL
read -p "请输入你的 Supabase ANON KEY (长串字符): " SUPABASE_KEY

if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_KEY" ]; then
    echo "错误：URL 和 Key 不能为空！"
    exit 1
fi

cat > .env << EOF
VITE_SUPABASE_URL=$SUPABASE_URL
VITE_SUPABASE_ANON_KEY=$SUPABASE_KEY
EOF

echo ""
echo "✅ 配置已保存到 .env 文件！"
echo ""
echo "请重启服务器："
echo "1. 按 Ctrl+C 停止当前服务器"
echo "2. 运行: npm run dev"
echo ""

