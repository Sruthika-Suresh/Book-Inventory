import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Updated imports
import AddBook from './components/AddBook';
import BookDetails from './components/BookDetails';
function App() {
  return (
    <Router>
      <Routes>
        {/* Route for the AddBook component */}
        <Route path="/" element={<AddBook />} />
        
        {/* Route for displaying book details */}
        <Route path="/books/:id" element={<BookDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
