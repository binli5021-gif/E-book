import React, { useState } from 'react'

const App = () => {
  const [books, setBooks] = useState([
    {
      id: 1,
      title: 'JavaScript高级程序设计',
      author: 'Matt Frisbie',
      cover: 'https://via.placeholder.com/150x200?text=JS',
      status: 'Finished',
      rating: 5,
      note: '非常全面的JavaScript参考书'
    },
    {
      id: 2,
      title: 'React技术揭秘',
      author: '卡颂',
      cover: 'https://via.placeholder.com/150x200?text=React',
      status: 'Reading',
      rating: 4,
      note: '深入理解React原理'
    },
    {
      id: 3,
      title: '深入理解计算机系统',
      author: 'Randal E. Bryant',
      cover: 'https://via.placeholder.com/150x200?text=CSAPP',
      status: 'Wishlist',
      rating: 0,
      note: ''
    }
  ])

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

  const filteredBooks = filter === 'All' 
    ? books 
    : books.filter(book => book.status === filter)

  const handleAddBook = () => {
    if (!newBook.title || !newBook.author) {
      alert('请填写书名和作者')
      return
    }
    const book = {
      id: Date.now(),
      ...newBook,
      cover: newBook.cover || 'https://via.placeholder.com/150x200?text=Book'
    }
    setBooks([...books, book])
    setNewBook({
      title: '',
      author: '',
      cover: '',
      status: 'Wishlist',
      rating: 0,
      note: ''
    })
    setShowAddForm(false)
  }

  const handleRating = (bookId, rating) => {
    setBooks(books.map(book => 
      book.id === bookId ? { ...book, rating } : book
    ))
  }

  const handleNoteChange = (bookId, note) => {
    setEditingNote({ ...editingNote, [bookId]: note })
  }

  const handleNoteSave = (bookId) => {
    setBooks(books.map(book => 
      book.id === bookId ? { ...book, note: editingNote[bookId] || book.note } : book
    ))
    const newEditingNote = { ...editingNote }
    delete newEditingNote[bookId]
    setEditingNote(newEditingNote)
  }

  const handleDeleteBook = (bookId) => {
    if (window.confirm('确定要删除这本书吗？')) {
      setBooks(books.filter(book => book.id !== bookId))
    }
  }

  const handleStatusChange = (bookId, newStatus) => {
    setBooks(books.map(book => 
      book.id === bookId ? { ...book, status: newStatus } : book
    ))
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
            <img
              src={book.cover}
              alt={book.title}
              style={{
                width: '100%',
                height: '200px',
                objectFit: 'cover',
                borderRadius: '4px',
                marginBottom: '10px'
              }}
            />
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
              currentRating={book.rating}
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

