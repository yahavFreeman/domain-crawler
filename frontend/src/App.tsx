import './App.css'
import { GlobalErrorAlert } from './components/global/GlobalErrorAlert'
import { CrawlResults } from './views/CrawlResults'

function App() {

  return (
    <>
    <GlobalErrorAlert />
    <CrawlResults />
    </>
  )
}

export default App
