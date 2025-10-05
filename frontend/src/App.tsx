import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import { GlobalErrorAlert } from './components/global/GlobalErrorAlert'
import { CrawlResults } from './views/CrawlResults'

function App() {
  return (
    <Router>
      <GlobalErrorAlert />
      <Routes>
        <Route path="/" element={<CrawlResults />} />
      </Routes>
    </Router>
  )
}

export default App
