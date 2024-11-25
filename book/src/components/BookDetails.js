


// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';

// const BookDetails = () => {
//   const { id } = useParams(); // Get the book id from the URL
//   const [book, setBook] = useState(null);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const fetchBook = async () => {
//       console.log(`Fetching details for book ID: ${id}`); // Debug log for ID
//       try {
//         const response = await fetch(`http://localhost:3001/books/${id}`);
//         if (!response.ok) {
//           throw new Error('Book not found');
//         }
//         const data = await response.json();
//         console.log('Fetched book data:', data); // Debug log for fetched data
//         setBook(data);
//       } catch (error) {
//         console.error('Error fetching book details:', error);
//         setError('Failed to load book details.');
//       }
//     };

//     fetchBook();
//   }, [id]);

//   if (!book) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div style={{ maxWidth: 600, margin: '40px auto', padding: 20 }}>
//       {error && <p style={{ color: 'red' }}>{error}</p>}
//       <h1>{book.title}</h1>
//       <p><strong>Author:</strong> {book.author}</p>
//       <p><strong>Description:</strong> {book.description || 'No description available'}</p>
//     </div>
//   );
// };

// export default BookDetails;





import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const BookDetails = () => {
  const { id } = useParams(); // Get the book id from the URL
  const [book, setBook] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBook = async () => {
      console.log(`Fetching details for book ID: ${id}`); // Debug log for ID
      try {
        const response = await fetch(`http://localhost:3001/books/${id}`);
        if (!response.ok) {
          throw new Error('Book not found');
        }
        const data = await response.json();
        console.log('Fetched book data:', data); // Debug log for fetched data
        setBook(data);
      } catch (error) {
        console.error('Error fetching book details:', error);
        setError('Failed to load book details.');
      }
    };

    fetchBook();
  }, [id]);

  if (!book) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', padding: 20 }}>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <h1>{book.title}</h1>
      <p><strong>Author:</strong> {book.author}</p>
      <p><strong>Description:</strong> {book.description || 'No description available'}</p> {/* Display description */}
    </div>
  );
};

export default BookDetails;
