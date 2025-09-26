import { Layout } from './components'
import Search from './components/Search'

function App() {
  return (
    <Layout>
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-8">Tesco Product Search</h1>
        <Search />
      </div>
    </Layout>
  )
}

export default App
