import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import ProductPage from './ProductPage'
import { TescoAPI } from '../lib/tesco'

// Mock the TescoAPI
vi.mock('../lib/tesco', () => ({
  TescoAPI: {
    getProduct: vi.fn()
  }
}))

const mockProduct = {
  id: '123',
  baseProductId: '456',
  tpnc: '317401565',
  title: 'Test Product',
  description: 'This is a test product',
  brandName: 'Test Brand',
  price: {
    actual: 2.50,
    unitPrice: '£2.50',
    unitOfMeasure: 'each'
  },
  reviews: {
    stats: {
      noOfReviews: 10,
      overallRating: 4.5
    }
  }
}

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('ProductPage', () => {
  it('renders loading state initially', () => {
    vi.mocked(TescoAPI.getProduct).mockImplementation(() => 
      new Promise(() => {}) // Never resolves to keep loading state
    )

    renderWithRouter(<ProductPage />)
    
    // Check for loading skeleton elements
    expect(document.querySelector('.react-loading-skeleton')).toBeInTheDocument()
  })

  it('renders product details when loaded', async () => {
    vi.mocked(TescoAPI.getProduct).mockResolvedValue({
      data: { product: mockProduct }
    })

    // Mock useParams to return a tpnc
    vi.mock('react-router-dom', async () => {
      const actual = await vi.importActual('react-router-dom')
      return {
        ...actual,
        useParams: () => ({ tpnc: '317401565' }),
        useNavigate: () => vi.fn()
      }
    })

    renderWithRouter(<ProductPage />)
    
    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument()
      expect(screen.getByText('Test Brand')).toBeInTheDocument()
      expect(screen.getByText('£2.50')).toBeInTheDocument()
    })
  })

  it('renders error state when product not found', async () => {
    vi.mocked(TescoAPI.getProduct).mockResolvedValue({
      errors: [{ message: 'Product not found' }]
    })

    // Mock useParams to return a tpnc
    vi.mock('react-router-dom', async () => {
      const actual = await vi.importActual('react-router-dom')
      return {
        ...actual,
        useParams: () => ({ tpnc: 'invalid' }),
        useNavigate: () => vi.fn()
      }
    })

    renderWithRouter(<ProductPage />)
    
    await waitFor(() => {
      expect(screen.getByText('Product Not Found')).toBeInTheDocument()
      expect(screen.getByText('Product not found')).toBeInTheDocument()
    })
  })
})
