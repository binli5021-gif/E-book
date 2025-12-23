import React, { useState, useEffect } from 'react'
import { supabase } from './supabase'

const App = () => {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All')
  const [showAddForm, setShowAddForm] = useState(false)
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    cover: '',
    status: 'Wishlist',
    rating: 0,
    note: ''
  })
  const [editingNote, setEditingNote] = useState({})
  const [editingCover, setEditingCover] = useState({})

  useEffect(() => {
    loadBooks()
  }, [])

  const loadBooks = async () => {
    if (!supabase) {
      setLoading(false)
      return
    }
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setBooks(data || [])
    } catch (error) {
      console.error('Error loading books:', error)
      alert('加载书籍失败: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const filteredBooks = filter === 'All' 
    ? books 
    : books.filter(book => book.status === filter)

  const handleAddBook = async () => {
    if (!supabase) {
      alert('Supabase 未配置，无法添加书籍')
      return
    }
    if (!newBook.title || !newBook.author) {
      alert('请填写书名和作者')
      return
    }
    try {
      const bookData = {
        title: newBook.title,
        author: newBook.author,
        cover: newBook.cover || 'https://via.placeholder.com/150x200?text=Book',
        status: newBook.status,
        rating: newBook.rating,
        note: newBook.note || ''
      }

      const { data, error } = await supabase
        .from('books')
        .insert([bookData])
        .select()

      if (error) throw error

      setBooks([data[0], ...books])
      setNewBook({
        title: '',
        author: '',
        cover: '',
        status: 'Wishlist',
        rating: 0,
        note: ''
      })
      setShowAddForm(false)
    } catch (error) {
      console.error('Error adding book:', error)
      alert('添加书籍失败: ' + error.message)
    }
  }

  const handleRating = async (bookId, rating) => {
    if (!supabase) return
    try {
      const { error } = await supabase
        .from('books')
        .update({ rating })
        .eq('id', bookId)

      if (error) throw error

      setBooks(books.map(book => 
        book.id === bookId ? { ...book, rating } : book
      ))
    } catch (error) {
      console.error('Error updating rating:', error)
      alert('更新评分失败: ' + error.message)
    }
  }

  const handleNoteChange = (bookId, note) => {
    setEditingNote({ ...editingNote, [bookId]: note })
  }

  const handleNoteSave = async (bookId) => {
    if (!supabase) return
    try {
      const note = editingNote[bookId] || ''
      const { error } = await supabase
        .from('books')
        .update({ note })
        .eq('id', bookId)

      if (error) throw error

      setBooks(books.map(book => 
        book.id === bookId ? { ...book, note } : book
      ))
      const newEditingNote = { ...editingNote }
      delete newEditingNote[bookId]
      setEditingNote(newEditingNote)
    } catch (error) {
      console.error('Error saving note:', error)
      alert('保存笔记失败: ' + error.message)
    }
  }

  const handleDeleteBook = async (bookId) => {
    if (!supabase) return
    if (!window.confirm('确定要删除这本书吗？')) {
      return
    }
    try {
      const { error } = await supabase
        .from('books')
        .delete()
        .eq('id', bookId)

      if (error) throw error

      setBooks(books.filter(book => book.id !== bookId))
    } catch (error) {
      console.error('Error deleting book:', error)
      alert('删除书籍失败: ' + error.message)
    }
  }

  const handleStatusChange = async (bookId, newStatus) => {
    if (!supabase) return
    try {
      const { error } = await supabase
        .from('books')
        .update({ status: newStatus })
        .eq('id', bookId)

      if (error) throw error

      setBooks(books.map(book => 
        book.id === bookId ? { ...book, status: newStatus } : book
      ))
    } catch (error) {
      console.error('Error updating status:', error)
      alert('更新状态失败: ' + error.message)
    }
  }

  const handleCoverSave = async (bookId) => {
    if (!supabase) return
    try {
      const coverUrl = (editingCover[bookId] || '').trim()
      if (!coverUrl) {
        alert('请输入封面URL')
        return
      }
      
      console.log('保存封面URL:', coverUrl, 'for book:', bookId)
      
      const { data, error } = await supabase
        .from('books')
        .update({ cover: coverUrl })
        .eq('id', bookId)
        .select()

      if (error) throw error

      console.log('封面更新成功:', data)

      setBooks(books.map(book => 
        book.id === bookId ? { ...book, cover: coverUrl } : book
      ))
      const newEditingCover = { ...editingCover }
      delete newEditingCover[bookId]
      setEditingCover(newEditingCover)
      
      alert('封面已更新！')
    } catch (error) {
      console.error('Error updating cover:', error)
      alert('更新封面失败: ' + error.message)
    }
  }

  // 图片代理函数：解决 CORS 问题
  const getImageUrl = (url) => {
    if (!url || !url.trim()) return null
    
    const trimmedUrl = url.trim()
    
    // 如果已经是占位图，直接返回
    if (trimmedUrl.includes('placeholder')) {
      return trimmedUrl
    }
    
    // 如果已经是代理过的图片，直接返回
    if (trimmedUrl.includes('images.weserv.nl') || 
        trimmedUrl.includes('corsproxy.io') ||
        trimmedUrl.includes('api.allorigins.win') ||
        trimmedUrl.includes('proxy.duckduckgo.com')) {
      return trimmedUrl
    }
    
    // 检测需要代理的图片源（Amazon、Wikipedia 等）
    const needsProxy = 
      trimmedUrl.includes('images-na.ssl-images-amazon.com') ||
      trimmedUrl.includes('amazon.com') ||
      trimmedUrl.includes('amazonaws.com') ||
      trimmedUrl.includes('wikipedia.org') ||
      trimmedUrl.includes('wikimedia.org')
    
    if (needsProxy) {
      // 确保 URL 是完整的，包含协议
      let finalUrl = trimmedUrl
      if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
        finalUrl = 'https://' + finalUrl
      }
      
      // 优先使用自己的 Vercel serverless function 代理（最可靠）
      // 如果部署在 Vercel 上，使用相对路径会自动调用 serverless function
      const encodedUrl = encodeURIComponent(finalUrl)
      return `/api/proxy-image?url=${encodedUrl}`
    }
    
    // 其他图片源直接返回
    return trimmedUrl
  }

  const StarRating = ({ bookId, currentRating, onRating }) => {
    return (
      <div style={{ display: 'flex', gap: '4px', marginTop: '8px' }}>
        {[1, 2, 3, 4, 5].map(star => (
          <span
            key={star}
            onClick={() => onRating(bookId, star)}
            style={{
              cursor: 'pointer',
              fontSize: '20px',
              color: star <= currentRating ? '#ffd700' : '#ddd'
            }}
          >
            ★
          </span>
        ))}
      </div>
    )
  }

  if (!supabase) {
    return (
      <div style={{ textAlign: 'center', padding: '50px', maxWidth: '600px', margin: '0 auto' }}>
        <h2 style={{ color: '#dc3545', marginBottom: '20px' }}>配置错误</h2>
        <p style={{ marginBottom: '10px' }}>Supabase 配置缺失或未正确填写。</p>
        <p style={{ marginBottom: '20px', color: '#666' }}>请在项目根目录的 <code style={{ backgroundColor: '#f5f5f5', padding: '2px 6px', borderRadius: '3px' }}>.env</code> 文件中填写：</p>
        <div style={{ textAlign: 'left', backgroundColor: '#f5f5f5', padding: '15px', borderRadius: '5px', marginBottom: '20px' }}>
          <code style={{ display: 'block', marginBottom: '5px' }}>VITE_SUPABASE_URL=你的_supabase_url</code>
          <code style={{ display: 'block' }}>VITE_SUPABASE_ANON_KEY=你的_supabase_anon_key</code>
        </div>
        <p style={{ color: '#666', fontSize: '14px' }}>填写后请重启服务器（按 Ctrl+C 停止，然后运行 npm run dev）</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <p>加载中...</p>
      </div>
    )
  }

  return (
    <div>
      <h1 style={{ marginBottom: '20px', textAlign: 'center' }}>我的书架</h1>
      
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button
          onClick={() => setFilter('All')}
          style={{
            padding: '8px 16px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            backgroundColor: filter === 'All' ? '#007bff' : '#fff',
            color: filter === 'All' ? '#fff' : '#000',
            cursor: 'pointer'
          }}
        >
          全部
        </button>
        <button
          onClick={() => setFilter('Reading')}
          style={{
            padding: '8px 16px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            backgroundColor: filter === 'Reading' ? '#007bff' : '#fff',
            color: filter === 'Reading' ? '#fff' : '#000',
            cursor: 'pointer'
          }}
        >
          在读
        </button>
        <button
          onClick={() => setFilter('Finished')}
          style={{
            padding: '8px 16px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            backgroundColor: filter === 'Finished' ? '#007bff' : '#fff',
            color: filter === 'Finished' ? '#fff' : '#000',
            cursor: 'pointer'
          }}
        >
          已读
        </button>
        <button
          onClick={() => setFilter('Wishlist')}
          style={{
            padding: '8px 16px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            backgroundColor: filter === 'Wishlist' ? '#007bff' : '#fff',
            color: filter === 'Wishlist' ? '#fff' : '#000',
            cursor: 'pointer'
          }}
        >
          想读
        </button>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          style={{
            padding: '8px 16px',
            border: '1px solid #28a745',
            borderRadius: '4px',
            backgroundColor: '#28a745',
            color: '#fff',
            cursor: 'pointer'
          }}
        >
          {showAddForm ? '取消' : '新增书籍'}
        </button>
      </div>

      {showAddForm && (
        <div style={{
          marginBottom: '20px',
          padding: '20px',
          backgroundColor: '#fff',
          borderRadius: '8px',
          border: '1px solid #ddd'
        }}>
          <h3 style={{ marginBottom: '15px' }}>新增书籍</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input
              type="text"
              placeholder="书名"
              value={newBook.title}
              onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
              style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
            <input
              type="text"
              placeholder="作者"
              value={newBook.author}
              onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
              style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
            <input
              type="text"
              placeholder="封面URL（可选）"
              value={newBook.cover}
              onChange={(e) => setNewBook({ ...newBook, cover: e.target.value })}
              style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
            <select
              value={newBook.status}
              onChange={(e) => setNewBook({ ...newBook, status: e.target.value })}
              style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            >
              <option value="Reading">在读</option>
              <option value="Finished">已读</option>
              <option value="Wishlist">想读</option>
            </select>
            <textarea
              placeholder="笔记（可选）"
              value={newBook.note}
              onChange={(e) => setNewBook({ ...newBook, note: e.target.value })}
              style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px', minHeight: '60px' }}
            />
            <button
              onClick={handleAddBook}
              style={{
                padding: '10px',
                backgroundColor: '#007bff',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              添加
            </button>
          </div>
        </div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '20px'
      }}>
        {filteredBooks.map(book => (
          <div
            key={book.id}
            style={{
              backgroundColor: '#fff',
              borderRadius: '8px',
              padding: '15px',
              border: '1px solid #ddd',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            <div style={{ position: 'relative', marginBottom: '10px' }}>
              <img
                src={getImageUrl(book.cover) || 'https://via.placeholder.com/150x200?text=' + encodeURIComponent(book.title)}
                alt={book.title}
                crossOrigin="anonymous"
                onError={(e) => {
                  const placeholderUrl = 'https://via.placeholder.com/150x200?text=' + encodeURIComponent(book.title)
                  const originalUrl = book.cover && book.cover.trim() ? book.cover.trim() : null
                  
                  if (!originalUrl) {
                    e.target.src = placeholderUrl
                    return
                  }
                  
                  // 如果自己的代理失败，尝试其他代理服务
                  if (e.target.src.includes('/api/proxy-image')) {
                    const retryCount = parseInt(e.target.dataset.retryCount || '0')
                    
                    if (retryCount === 0) {
                      // 第一次重试：尝试使用 DuckDuckGo 代理
                      let retryUrl = originalUrl
                      if (!retryUrl.startsWith('http://') && !retryUrl.startsWith('https://')) {
                        retryUrl = 'https://' + retryUrl
                      }
                      console.log('Vercel 代理失败，尝试 DuckDuckGo 代理:', retryUrl)
                      e.target.dataset.retryCount = '1'
                      e.target.src = `https://proxy.duckduckgo.com/iu/?u=${encodeURIComponent(retryUrl)}`
                    } else if (retryCount === 1) {
                      // 第二次重试：尝试使用 images.weserv.nl
                      console.log('DuckDuckGo 失败，尝试 images.weserv.nl:', originalUrl)
                      e.target.dataset.retryCount = '2'
                      let retryUrl = originalUrl
                      if (!retryUrl.startsWith('http://') && !retryUrl.startsWith('https://')) {
                        retryUrl = 'https://' + retryUrl
                      }
                      e.target.src = `https://images.weserv.nl/?url=${encodeURIComponent(retryUrl)}`
                    } else {
                      // 所有代理都失败，使用占位图
                      console.log('所有代理都失败，使用占位图。原始URL:', originalUrl)
                      e.target.src = placeholderUrl
                    }
                  } else if (e.target.src.includes('proxy.duckduckgo.com') || 
                             e.target.src.includes('images.weserv.nl') || 
                             e.target.src.includes('corsproxy.io')) {
                    // 如果其他代理也失败，使用占位图
                    console.log('代理服务失败，使用占位图。URL:', e.target.src)
                    e.target.src = placeholderUrl
                  } else if (e.target.src !== placeholderUrl && !e.target.src.includes('placeholder')) {
                    // 其他错误，使用占位图
                    console.log('图片加载失败，使用占位图。URL:', e.target.src)
                    e.target.src = placeholderUrl
                  }
                }}
                onLoad={(e) => {
                  console.log('图片加载成功:', e.target.src)
                  // 清除重试计数
                  if (e.target.dataset.retryCount) {
                    delete e.target.dataset.retryCount
                  }
                }}
                style={{
                  width: '100%',
                  height: '200px',
                  objectFit: 'cover',
                  borderRadius: '4px',
                  backgroundColor: '#f0f0f0',
                  display: 'block'
                }}
              />
              {editingCover[book.id] !== undefined ? (
                <div style={{ marginTop: '8px' }}>
                  <input
                    type="text"
                    value={editingCover[book.id]}
                    onChange={(e) => setEditingCover({ ...editingCover, [book.id]: e.target.value })}
                    placeholder="输入封面URL（Wikipedia图片可能无法显示，建议使用其他图片源）"
                    style={{
                      width: '100%',
                      padding: '6px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '12px',
                      marginBottom: '5px'
                    }}
                  />
                  <p style={{ fontSize: '10px', color: '#666', marginBottom: '5px', marginTop: 0 }}>
                    提示：Amazon、Wikipedia 等图片会自动通过代理服务加载，无需担心 CORS 问题。也可以使用 Imgur、Cloudinary 等图片托管服务。
                  </p>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <button
                      onClick={() => handleCoverSave(book.id)}
                      style={{
                        flex: 1,
                        padding: '5px',
                        backgroundColor: '#28a745',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      保存
                    </button>
                    <button
                      onClick={() => {
                        const newEditingCover = { ...editingCover }
                        delete newEditingCover[book.id]
                        setEditingCover(newEditingCover)
                      }}
                      style={{
                        flex: 1,
                        padding: '5px',
                        backgroundColor: '#6c757d',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      取消
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setEditingCover({ ...editingCover, [book.id]: book.cover || '' })}
                  style={{
                    width: '100%',
                    marginTop: '8px',
                    padding: '5px',
                    backgroundColor: '#6c757d',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  编辑封面
                </button>
              )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '5px' }}>
              <h3 style={{ fontSize: '16px', margin: 0, flex: 1 }}>{book.title}</h3>
              <button
                onClick={() => handleDeleteBook(book.id)}
                style={{
                  padding: '4px 8px',
                  backgroundColor: '#dc3545',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  marginLeft: '8px'
                }}
                title="删除"
              >
                删除
              </button>
            </div>
            <p style={{ color: '#666', fontSize: '14px', marginBottom: '10px' }}>{book.author}</p>
            <select
              value={book.status}
              onChange={(e) => handleStatusChange(book.id, e.target.value)}
              style={{
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '12px',
                marginBottom: '10px',
                border: '1px solid #ddd',
                backgroundColor: 
                  book.status === 'Reading' ? '#fff3cd' :
                  book.status === 'Finished' ? '#d4edda' : '#e2e3e5',
                cursor: 'pointer'
              }}
            >
              <option value="Reading">在读</option>
              <option value="Finished">已读</option>
              <option value="Wishlist">想读</option>
            </select>
            <StarRating
              bookId={book.id}
              currentRating={book.rating || 0}
              onRating={handleRating}
            />
            <div style={{ marginTop: '10px' }}>
              {editingNote[book.id] !== undefined ? (
                <div>
                  <textarea
                    value={editingNote[book.id]}
                    onChange={(e) => handleNoteChange(book.id, e.target.value)}
                    placeholder="写笔记..."
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      minHeight: '60px',
                      fontSize: '14px'
                    }}
                  />
                  <button
                    onClick={() => handleNoteSave(book.id)}
                    style={{
                      marginTop: '5px',
                      padding: '5px 10px',
                      backgroundColor: '#28a745',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    保存
                  </button>
                </div>
              ) : (
                <div>
                  <p style={{
                    fontSize: '14px',
                    color: '#666',
                    minHeight: '40px',
                    marginBottom: '5px'
                  }}>
                    {book.note || '暂无笔记'}
                  </p>
                  <button
                    onClick={() => setEditingNote({ ...editingNote, [book.id]: book.note || '' })}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: '#6c757d',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    {book.note ? '编辑笔记' : '添加笔记'}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
