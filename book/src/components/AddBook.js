
import React, { useState, useEffect } from 'react';


const AddBook = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState(''); // New state for description
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null); // To track the selected book for details or editing
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // New state to track if we are editing a book

  // Fetch the list of books when the component mounts
  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await fetch('http://localhost:3004/books');
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error('Error fetching books:', error);
      setError('Failed to load books.');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    const book = { title, author,description };

    try {
      if (isEditing && selectedBook) {
        // Update the existing book
        const response = await fetch(`http://localhost:3004/books/${selectedBook._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(book),
        });

        if (!response.ok) {
          throw new Error('Failed to update book.');
        }
        setIsEditing(false);
        setSelectedBook(null);
      } else {
        // Add a new book
        const response = await fetch('http://localhost:3004/books', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(book),
        });

        if (!response.ok) {
          throw new Error('Failed to add book.');
        }
      }

      setTitle('');
      setAuthor('');
      setDescription('');
      fetchBooks(); // Fetch updated books after adding or updating
    } catch (error) {
      setError(isEditing ? 'Failed to update book. Please try again.' : 'Failed to add book. Please try again.');
      console.error('Error saving book:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (book) => {
    setTitle(book.title);
    setAuthor(book.author);
    setDescription(book.description || '');
    setSelectedBook(book);
    setIsEditing(true); // Set editing state to true
  };

  const handleDeleteClick = async (id) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;

    try {
      const response = await fetch(`http://localhost:3004/books/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete book.');
      }
      fetchBooks(); // Refresh the list of books after deletion
    } catch (error) {
      console.error('Error deleting book:', error);
      setError('Failed to delete book. Please try again.');
    }
  };

  const handleBookClick = (book) => {
    setSelectedBook(book); // Set the selected book to show its details
  };

  const handleBackToList = () => {
    setSelectedBook(null); // Clear the selected book and go back to the list
    setIsEditing(false); // Reset editing state when going back to list
    setTitle(''); // Reset title input
    setAuthor(''); // Reset author input
    setDescription(''); // Reset description input
  };

  if (selectedBook && !isEditing) {
    // Render the details of the selected book
    return (
      <div style={{ maxWidth: 600, margin: '40px auto', padding: 20 }}>
        <h1>{selectedBook.title}</h1>
        <p><strong>Author:</strong> {selectedBook.author}</p>
        <p><strong>Description:</strong> {selectedBook.description || 'No description available'}</p>
        <button onClick={handleBackToList}>Back to List</button>
        <button onClick={() => handleEditClick(selectedBook)} style={{ marginLeft: 10 }}>Edit</button>
        <button onClick={() => handleDeleteClick(selectedBook._id)} style={{ marginLeft: 10, color: 'red' }}>
          Delete
        </button>
      </div>
    );
  }

  return (
    <div
    style={{
      maxWidth: 1000,
      margin: '40px auto',
      padding: 20,
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      borderRadius: 90,
      border: '1px solid #ccc',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
      backgroundImage: `url(image/image.jpg)`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}
  >
    <h1 style={{ fontSize: 38, marginBottom: 10 }}>{isEditing ? 'Edit Book' : 'Add Book'}</h1>
    {error && <p style={{ color: 'red' }}>{error}</p>}
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: 20 }}>
        <label htmlFor="title" style={{ display: 'block', marginBottom: 10, fontWeight: 'bold' ,fontSize: 24}}>Title</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ width: '95%', height: 30, padding: 10, fontSize: 20, borderRadius:50 }}
        />
      </div>
      <div style={{ marginBottom: 20 }}>
        <label htmlFor="author" style={{ display: 'block', marginBottom: 10, fontWeight: 'bold' ,fontSize: 24}}>Author</label>
        <input
          id="author"
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
          style={{ width: '95%', height: 30, padding: 10, fontSize: 16, borderRadius:50 }}
        />
      </div>
      <div style={{ marginBottom: 20 }}>
        <label htmlFor="description" style={{ display: 'block', marginBottom: 10, fontWeight: 'bold',fontSize: 24 }}>Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ width: '95%', height: 80, padding: 10, fontSize: 16, borderRadius:50 }}
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        style={{
          backgroundColor: '#4CAF50',
          color: '#fff',
          padding: 10,
          border: 'none',
          borderRadius: 50,
          cursor: 'pointer',
          opacity: loading ? 0.6 : 1,
        }}
      >
        {loading ? (isEditing ? 'Updating...' : 'Adding...') : (isEditing ? 'Update Book' : 'Add Book')}
      </button>
      {isEditing && (
        <button
          onClick={handleBackToList}
          style={{
            marginLeft: 10,
            padding: 10,
            border: 'none',
            borderRadius: 50,
            cursor: 'pointer',
            backgroundColor: '#f44336',
            color: '#fff',
          }}
        >
          Cancel Edit
        </button>
      )}
    </form>

    <h2 style={{ marginTop: 30 }}>Book List</h2>
    {books.length === 0 ? (
      <p>No books added yet.</p>
    ) : (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '20px',
        }}
      >
        {books.map((book) => (
          <div key={book._id} style={{ padding: 20, border: '1px solid #ccc', borderRadius: 10, backgroundColor: '#f9f9f9' }}>
            <h3>{book.title}</h3>
            <p><strong>Author:</strong> {book.author}</p>
            <button onClick={() => handleBookClick(book)} style={{ marginRight: 10 }}>View Details</button>
            <button onClick={() => handleEditClick(book)} style={{ marginRight: 10 }}>Edit</button>
            <button onClick={() => handleDeleteClick(book._id)} style={{ color: 'red' }}>Delete</button>
          </div>
        ))}
      </div>
    )}
  </div>
);
};

export default AddBook;
