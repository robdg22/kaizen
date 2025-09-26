// Tesco Shopping Experience API client and GraphQL queries

export interface GraphQLResponse<T> {
  data?: T
  errors?: Array<{ message: string }>
}

export interface Image {
  type: string
  url: string
  region?: string
  title?: string
}

export interface TaxonomyItemImageStyle {
  style: string
  images: Image[]
}

export interface TaxonomyItem {
  id: string
  name: string
  label: string
  pageType: string
  images?: TaxonomyItemImageStyle[]
  children?: TaxonomyItem[]
}

export interface Promotion {
  promotionId: string
  promotionType: string
  startDate: string
  endDate: string
  offerText: string
}

export interface ProductItem {
  id: string
  baseProductId: string
  title: string
  brandName: string
  shortDescription: string
  defaultImageUrl: string
  media?: {
    defaultImage?: { url: string; aspectRatio?: number | string }
    images?: Array<{ url: string; aspectRatio?: number | string }>
  }
  images?: {
    display?: { default?: { url: string; originalUrl: string } }
    default?: { url: string; originalUrl: string }
  }
  price?: {
    actual?: number
    price?: number
    unitPrice: string
    unitOfMeasure: string
  }
  promotions?: Promotion[]
}

export interface PageInformation {
  totalCount: number
  pageNo: number
  count: number
  pageSize: number
  offset: number
}

export interface GetTaxonomyResponse {
  taxonomy: TaxonomyItem[]
}

export interface GetCategoryProductsResponse {
  category: {
    pageInformation: PageInformation
    productItems: ProductItem[]
  }
}

export interface SearchProductsResponse {
  search: {
    pageInformation: PageInformation
    productItems: ProductItem[]
  }
}

export async function graphqlRequest<T>(
  query: string,
  variables: Record<string, any> = {},
  proxyUrl: string = "https://tesco-proxy-b4fena2ys-robdgraham-gmailcoms-projects.vercel.app/api/tesco"
): Promise<GraphQLResponse<T>> {
  try {
    const response = await fetch(proxyUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, variables }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return { errors: [{ message: `API request failed with status ${response.status} ${JSON.stringify(errorData)}` }] }
    }

    const result: GraphQLResponse<T> = await response.json()
    return result
  } catch (error) {
    return {
      errors: [{ message: `Network or parsing error: ${error instanceof Error ? error.message : String(error)}` }],
    }
  }
}

export const SEARCH_PRODUCTS_QUERY = `#graphql
query SearchProducts($query: String!, $page: Int, $count: Int, $sortBy: String, $filters: [BrowseFilterType]) {
  search(query: $query, page: $page, count: $count, sortBy: $sortBy, filters: $filters) {
    info { total page count pageSize offset }
    products {
      id
      baseProductId
      title
      brandName
      shortDescription
      defaultImageUrl
      media {
        defaultImage { url aspectRatio }
        images { url aspectRatio }
      }
      images { display { default { url originalUrl } } default { url originalUrl } }
      price { actual unitPrice unitOfMeasure }
      promotions { id promotionType startDate endDate description }
    }
  }
}`

export const TAXONOMY_QUERY = `#graphql
query GetTaxonomy($storeId: ID, $includeInspirationEvents: Boolean, $style: String, $categoryId: String) {
  taxonomy(storeId: $storeId, includeInspirationEvents: $includeInspirationEvents, categoryId: $categoryId) {
    id name label pageType
    images(style: $style) { style images { type url region title } }
    children {
      id name label pageType
      images(style: $style) { style images { type url region title } }
      children {
        id name label pageType
        images(style: $style) { style images { type url region title } }
      }
    }
  }
}`

export const CATEGORY_PRODUCTS_QUERY = `#graphql
query GetCategoryProducts($categoryId: ID, $page: Int, $count: Int, $sortBy: String, $offers: Boolean) {
  category(page: $page, count: $count, sortBy: $sortBy, categoryId: $categoryId, offers: $offers) {
    info { total page count pageSize offset }
    products {
      id
      baseProductId
      title
      brandName
      shortDescription
      defaultImageUrl
      media {
        defaultImage { url aspectRatio }
        images { url aspectRatio }
      }
      images { display { default { url originalUrl } } default { url originalUrl } }
      price { actual unitPrice unitOfMeasure }
      promotions { id promotionType startDate endDate description }
    }
  }
}`

export class TescoAPI {
  private static proxyUrl = "https://tesco-proxy-b4fena2ys-robdgraham-gmailcoms-projects.vercel.app/api/tesco"

  static async searchProducts(options: { query: string; page?: number; count?: number; sortBy?: string; filters?: string[] }) {
    const variables = {
      query: options.query,
      page: options.page ?? 0,
      count: options.count ?? 20,
      sortBy: options.sortBy,
      filters: options.filters,
    }
    return graphqlRequest<SearchProductsResponse>(SEARCH_PRODUCTS_QUERY, variables, this.proxyUrl)
  }

  static async getTaxonomy(options: { storeId?: string; includeInspirationEvents?: boolean; style?: string; categoryId?: string } = {}) {
    const variables = {
      storeId: options.storeId ?? "3060",
      includeInspirationEvents: options.includeInspirationEvents ?? false,
      style: options.style ?? "rounded",
      categoryId: options.categoryId,
    }
    return graphqlRequest<GetTaxonomyResponse>(TAXONOMY_QUERY, variables, this.proxyUrl)
  }

  static async getCategoryProducts(options: { categoryId: string; page?: number; count?: number; sortBy?: string; offers?: boolean }) {
    const variables = {
      categoryId: options.categoryId,
      page: options.page ?? 0,
      count: options.count ?? 20,
      sortBy: options.sortBy,
      offers: options.offers ?? false,
    }
    return graphqlRequest<GetCategoryProductsResponse>(CATEGORY_PRODUCTS_QUERY, variables, this.proxyUrl)
  }
}


