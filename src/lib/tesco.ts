// Tesco Shopping Experience API client and GraphQL queries

export type ShoppingMode = 'tesco' | 'fnf'

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

export interface VariationAttribute {
  name: string
  value: string
  __typename?: string
}

export interface AttributeGroupData {
  name: string
  value: string
  attributes: VariationAttribute[]
  __typename?: string
}

export interface VariationAttributeType {
  attributeGroup: string  // "colour" or "size"
  attributeGroupData: AttributeGroupData
  __typename?: string
}

export interface ProductItem {
  id: string
  baseProductId: string
  tpnc: string
  title: string
  brandName: string
  shortDescription: string
  defaultImageUrl: string
  superDepartmentName?: string
  departmentName?: string
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
  reviews?: {
    stats?: {
      noOfReviews?: number
      overallRating?: number
      overallRatingRange?: number
    }
  }
  promotions?: Promotion[]
  variationAttributes?: VariationAttributeType[]
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
    info: PageInformation
    products: ProductItem[]
  }
}

export interface SearchProductsResponse {
  search: {
    pageInformation: PageInformation
    productItems: ProductItem[]
  }
}

export interface ProductVariation {
  id: string
  tpnc: string
  title: string
  variationAttributes?: VariationAttributeType[]
  sellers?: {
    results: Array<{
      isForSale: boolean
      status: string
    }>
  }
}

export interface GetProductResponse {
  product: {
    id: string
    baseProductId: string
    tpnc: string
    title: string
    description?: string
    brandName?: string
    defaultImageUrl?: string
    superDepartmentName?: string
    departmentName?: string
    aisleName?: string
    shelfName?: string
    price?: {
      actual: number
      unitPrice: string
      unitOfMeasure: string
    }
    promotions?: Array<{
      id: string
      promotionType: string
      description: string
      price?: {
        beforeDiscount: number
        afterDiscount: number
      }
    }>
    media?: {
      defaultImage?: { url: string; aspectRatio?: number | string }
      images?: Array<{ url: string; aspectRatio?: number | string }>
      videos?: Array<{ url: string; mimeType: string; aspectRatio?: number | string }>
    }
    images?: {
      display?: {
        default?: { url: string; originalUrl: string }
        zoom?: { url: string }
      }
    }
    reviews?: {
      stats?: {
        noOfReviews: number
        overallRating: number
      }
      entries?: Array<{
        rating: { value: number; range: number }
        author: { nickname: string; authoredByMe: boolean }
        summary: string
        text: string
        submissionDateTime: string
        verifiedBuyer: boolean
      }>
    }
    details?: {
      ingredients?: string
      storage?: string
      nutritionInfo?: Array<{
        name: string
        perComp: string
        perServing: string
        referenceIntake: string
        referencePercentage: string
      }>
      allergenInfo?: Array<{
        name: string
        values: string[]
      }>
      specifications?: {
        specificationAttributes?: Array<{
          attributeName: string
          attributeValue: string
        }>
      }
      clothingInfo?: {
        fibreComposition?: string[]
        specialFeature?: string[]
        careInstructions?: string[]
        sizeChart?: {
          url: string
          id: string | null
        }
      }
    }
    variations?: {
      products: ProductVariation[]
    }
    sellers?: {
      results: Array<{
        id: string
        isForSale: boolean
        status: string
        price?: {
          actual: number
          unitPrice: string
          unitOfMeasure: string
        }
      }>
    }
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
query Search(
  $query: String!
  $page: Int
  $count: Int
  $sortBy: String
  $offset: Int
  $filterCriteria: [filterCriteria]
  $facet: ID
  $superDepartment: String
  $department: String
  $aisle: String
  $shelf: String
  $offers: Boolean
  $new: Boolean
  $favourites: Boolean
  $brand: String
  $brands: [String]
  $dietary: String
  $dietaries: [String]
  $params: BrowseSearchConfig
  $startDateTime: String
  $endDateTime: String
  $pageName: String
  $configs: [ConfigArgType]
) {
  search(
    query: $query
    page: $page
    count: $count
    sortBy: $sortBy
    offset: $offset
    filterCriteria: $filterCriteria
    facet: $facet
    superDepartment: $superDepartment
    department: $department
    aisle: $aisle
    shelf: $shelf
    offers: $offers
    new: $new
    favourites: $favourites
    brand: $brand
    brands: $brands
    dietary: $dietary
    dietaries: $dietaries
    config: $params
    configs: $configs
  ) {
    pageInformation: info {
      ...PageInformation
    }
    productItems: products {
      ...ProductItem
    }
    facetLists: facetGroups {
      ...FacetLists
    }
    options {
      sortBy
    }
  }
}

fragment PageInformation on ListInfoInterface {
  totalCount: total
  pageNo: page
  count
  pageSize
  offset
}

fragment ProductItem on ProductInterface {
  id
  baseProductId
  tpnc
  title
  brandName
  shortDescription
  defaultImageUrl
  media {
    defaultImage {
      url
      aspectRatio
    }
    images {
      url
      aspectRatio
    }
  }
  images {
    display {
      default {
        url
        originalUrl
      }
    }
    default {
      url
      originalUrl
    }
  }
  badgeDetails(pageName: $pageName) {
    badges
    subText
  }
  superDepartmentId
  superDepartmentName
  departmentId
  departmentName
  aisleId
  aisleName
  shelfId
  shelfName
  displayType
  productType
  averageWeight
  bulkBuyLimit
  maxQuantityAllowed: bulkBuyLimit
  groupBulkBuyLimit
  bulkBuyLimitMessage
  bulkBuyLimitGroupId
  timeRestrictedDelivery
  restrictedDelivery
  isForSale
  isNew
  isRestrictedOrderAmendment
  status
  maxWeight
  minWeight
  increment
  catchWeightList {
    price
    weight
    default
  }
  restrictedDeliveryTime {
    day
    startDateTime
    endDateTime
    message
  }
  restrictedDeliveryDate {
    startDate
    endDate
    leadTimeValue
    message
  }
  price {
    price: actual
    unitPrice
    unitOfMeasure
  }
  promotions {
    promotionId: id
    promotionType
    startDate
    endDate
    offerText: description
    price {
      beforeDiscount
      intermediate
      afterDiscount
    }
    metaData {
      seo {
        scheme
        currency
        afterDiscountPrice
      }
    }
  }
  restrictions(startDateTime: $startDateTime, endDateTime: $endDateTime) {
    type
    isViolated
    message
  }
  reviews {
    stats {
      noOfReviews
      overallRating
      overallRatingRange
    }
  }
  substitutionOptions {
    isBlocked
  }
  variationAttributes {
    attributeGroup
    attributeGroupData {
      name
      value
      attributes {
        name
        value
      }
    }
  }
}

fragment FacetLists on ProductListFacetGroupInterface {
  categoryId
  category
  facets {
    facetId: id
    facetName: name
    binCount: count
    isSelected: selected
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
query GetCategoryProducts($superDepartment: String, $department: String, $page: Int, $count: Int, $sortBy: String) {
  category(superDepartment: $superDepartment, department: $department, page: $page, count: $count, sortBy: $sortBy) {
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
      superDepartmentId
      superDepartmentName
      departmentId
      departmentName
    }
  }
}
`

export const GET_PRODUCT_QUERY = `#graphql
query GetProduct($tpnc: String, $skipReviews: Boolean!, $offset: Int, $count: Int, $includeVariations: Boolean = false, $includeFulfilment: Boolean = false, $sellersType: SellersAttribute, $sellerTypeForVariations: SellersAttribute, $markRecentlyViewed: Boolean = false) {
  product(tpnc: $tpnc, markRecentlyViewed: $markRecentlyViewed) {
    id
    baseProductId
    isRestrictedOrderAmendment
    gtin
    tpnb
    tpnc
    title
    description
    brandName
    isInFavourites
    defaultImageUrl
    superDepartmentName
    superDepartmentId
    departmentName
    departmentId
    aisleName
    aisleId
    seller {
      id
      __typename
    }
    shelfName
    displayType
    shelfId
    averageWeight
    bulkBuyLimit
    bulkBuyLimitGroupId
    bulkBuyLimitMessage
    groupBulkBuyLimit
    isNew
    depositAmount
    media {
      videos {
        url
        mimeType
        __typename
        aspectRatio
      }
      defaultImage {
        url
        aspectRatio
        __typename
      }
      __typename
    }
    icons {
      id
      caption
      __typename
    }
    status
    isForSale
    price {
      actual
      unitPrice
      unitOfMeasure
      __typename
    }
    promotions {
      id
      promotionType
      startDate
      endDate
      description
      unitSellingInfo
      price {
        beforeDiscount
        afterDiscount
        __typename
      }
      attributes
      qualities
      info {
        title
        __typename
      }
      metaData {
        seo {
          afterDiscountPrice
          __typename
        }
        __typename
      }
      __typename
    }
    productType
    charges {
      ... on ProductDepositReturnCharge {
        __typename
        amount
      }
      __typename
    }
    __typename
    ... on FNFProduct {
      variations {
        ...VariationProducts @include(if: $includeVariations)
        __typename
      }
      media {
        defaultImage {
          url
          aspectRatio
          __typename
        }
        images {
          url
          aspectRatio
          ... on ModelImage {
            modelHeight
            modelWearingSize
            __typename
          }
          __typename
        }
        __typename
      }
      sellers(type: $sellersType) {
        results {
          isForSale
          status
          fulfilment @include(if: $includeFulfilment) {
            ...Fulfilment
            ... on ProductReturnType {
              __typename
              daysToReturn
            }
            __typename
          }
          returnDetails {
            displayName
            returnMethod
            daysToReturn
            charges {
              value
              currency
              __typename
            }
            __typename
          }
          __typename
        }
        __typename
      }
      __typename
    }
    __typename
    ... on MPProduct {
      variations {
        ...VariationProducts @include(if: $includeVariations)
        __typename
      }
      __typename
    }
    sellers(type: $sellersType) {
      ...Sellers
      __typename
    }
    images {
      display {
        default {
          url
          originalUrl
          __typename
        }
        zoom {
          url
          __typename
        }
        __typename
      }
      __typename
    }
    foodIcons
    shelfLife {
      url
      message
      __typename
    }
    restrictions {
      type
      isViolated
      message
      __typename
    }
    distributorAddress {
      ...Address
      __typename
    }
    manufacturer {
      addresses
      __typename
    }
    importerAddress {
      ...Address
      __typename
    }
    returnTo {
      ...Address
      __typename
    }
    maxWeight
    minWeight
    catchWeightList {
      price
      weight
      default
      __typename
    }
    multiPackDetails {
      ...Multipack
      __typename
    }
    details {
      energyEfficiency {
        class
        energyClassUrl
        productInfoDoc
        __typename
      }
      clothingInfo {
        fibreComposition
        specialFeature
        careInstructions
        sizeChart {
          url
          id
          __typename
        }
        __typename
      }
      ...Details
      components {
        ... on CompetitorsInfo {
          competitors {
            id
            priceMatch {
              isMatching
              __typename
            }
            __typename
          }
          __typename
        }
        ... on AdditionalInfo {
          isLowEverydayPricing
          isLowPricePromise
          __typename
        }
        __typename
      }
      __typename
    }
    reviews(offset: $offset, count: $count) @skip(if: $skipReviews) {
      info {
        offset
        total
        page
        count
        __typename
      }
      entries {
        rating {
          value
          range
          __typename
        }
        author {
          nickname
          authoredByMe
          __typename
        }
        status
        summary
        text
        syndicated
        syndicationSource {
          name
          clientUrl
          __typename
        }
        submissionDateTime
        reviewId
        verifiedBuyer
        promotionalReview
        __typename
      }
      stats {
        noOfReviews
        overallRating
        __typename
      }
      __typename
    }
  }
}

fragment GDA on GuidelineDailyAmountType {
  title
  dailyAmounts {
    name
    value
    percent
    rating
    __typename
  }
  __typename
}

fragment Alcohol on AlcoholInfoItemType {
  tastingNotes
  grapeVariety
  vinificationDetails
  history
  regionalInformation
  storageType
  storageInstructions
  alcoholUnitsOtherText
  regionOfOrigin
  alcoholType
  wineColour
  alcoholUnits
  percentageAlcohol
  currentVintage
  producer
  typeOfClosure
  wineMaker
  packQty
  packMeasure
  country
  tasteCategory
  alcoholByVolumeOtherText
  wineEffervescence
  legalNotice {
    message
    link
    __typename
  }
  __typename
}

fragment Nutrition on NutritionalInfoItemType {
  name
  perComp: value1
  perServing: value2
  referenceIntake: value3
  referencePercentage: value4
  __typename
}

fragment CookingInstructions on CookingInstructionsType {
  oven {
    chilled {
      time
      instructions
      temperature {
        value
        __typename
      }
      __typename
    }
    frozen {
      time
      instructions
      temperature {
        value
        __typename
      }
      __typename
    }
    __typename
  }
  microwave {
    chilled {
      detail {
        step
        T650
        T750
        T850
        __typename
      }
      instructions
      __typename
    }
    frozen {
      detail {
        step
        T650
        T750
        T850
        __typename
      }
      instructions
      __typename
    }
    __typename
  }
  cookingMethods {
    name
    instructions
    time
    __typename
  }
  otherInstructions
  cookingGuidelines
  cookingPrecautions
  __typename
}

fragment Address on AddressType {
  addressLine1
  addressLine2
  addressLine3
  addressLine4
  addressLine5
  addressLine6
  addressLine7
  addressLine8
  addressLine9
  addressLine10
  addressLine11
  addressLine12
  addressLine13
  addressLine14
  addressLine15
  addressLine16
  addressLine18
  addressLine19
  addressLine20
  __typename
}

fragment Multipack on MultipackDetailType {
  name
  description
  sequence
  numberOfUses
  features
  boxContents
  storage
  nutritionIconInfo
  nutritionalClaims
  healthClaims
  preparationAndUsage
  otherInformation
  ingredients
  cookingInstructions {
    ...CookingInstructions
    __typename
  }
  originInformation {
    title
    value
    __typename
  }
  guidelineDailyAmount {
    ...GDA
    __typename
  }
  allergenInfo: allergens {
    name
    values
    __typename
  }
  nutritionInfo {
    name
    perComp: value1
    perServing: value2
    referenceIntake: value3
    referencePercentage: value4
    __typename
  }
  __typename
}

fragment Details on ProductDetailsType {
  ingredients
  legalLabelling
  packSize {
    value
    units
    __typename
  }
  allergenInfo: allergens {
    name
    values
    __typename
  }
  storage
  nutritionInfo: nutrition {
    ...Nutrition
    __typename
  }
  specifications {
    specificationAttributes {
      attributeName: name
      attributeValue: value
      __typename
    }
    __typename
  }
  otherNutritionInformation
  hazardInfo {
    chemicalName
    productName
    signalWord
    statements
    symbolCodes
    __typename
  }
  guidelineDailyAmount {
    ...GDA
    __typename
  }
  numberOfUses
  preparationAndUsage
  freezingInstructions {
    standardGuidelines
    freezingGuidelines
    defrosting
    __typename
  }
  manufacturerMarketing
  productMarketing
  brandMarketing
  otherInformation
  additives
  warnings
  netContents
  drainedWeight
  safetyWarning
  lowerAgeLimit
  upperAgeLimit
  healthmark
  recyclingInfo
  nappyInfo: nappies {
    quantity
    nappySize
    __typename
  }
  alcoholInfo: alcohol {
    ...Alcohol
    __typename
  }
  cookingInstructions {
    ...CookingInstructions
    __typename
  }
  originInformation {
    title
    value
    __typename
  }
  dosage
  preparationGuidelines
  directions
  features
  healthClaims
  boxContents
  nutritionalClaims
  __typename
}

fragment VariationProducts on VariationsType {
  products {
    title
    tpnc
    tpnb
    id
    variationAttributes {
      ...VariationAttributes
      __typename
    }
    gtin
    seller {
      id
      __typename
    }
    sellers(type: $sellerTypeForVariations) {
      results {
        promotions {
          id
          description
          __typename
        }
        isForSale
        status
        id
        __typename
        seller {
          id
          __typename
        }
      }
      __typename
    }
    __typename
  }
  __typename
}

fragment VariationAttributes on VariationAttributesType {
  attributeGroup
  attributeGroupData {
    name
    value
    attributes {
      name
      value
      __typename
    }
    __typename
  }
  __typename
}

fragment Fulfilment on ProductDeliveryType {
  cutoff
  deliveryType
  start
  end
  minDeliveryDays
  maxDeliveryDays
  charges {
    value
    __typename
    criteria {
      __typename
      ... on ProductDeliveryCriteria {
        deliveryType: type
        deliveryvalue: value
        __typename
      }
      ... on ProductDeliveryBasketValueCriteria {
        type
        value
        __typename
      }
    }
  }
  __typename
}

fragment Sellers on ProductSellers {
  results {
    id
    __typename
    seller {
      id
      name
      partnerName
      businessName
      __typename
    }
    price {
      actual
      unitPrice
      unitOfMeasure
      __typename
    }
    promotions {
      id
      promotionType
      startDate
      endDate
      description
      unitSellingInfo
      price {
        beforeDiscount
        afterDiscount
        __typename
      }
      attributes
      qualities
      info {
        title
        __typename
      }
      metaData {
        seo {
          afterDiscountPrice
          __typename
        }
        __typename
      }
      __typename
    }
    ... on MPProduct {
      bestDelivery: fulfilment(deliveryOptions: BEST) {
        ...Fulfilment
        ... on ProductReturnType {
          __typename
          daysToReturn
        }
        __typename
      }
      fulfilment {
        ...Fulfilment
        ... on ProductReturnType {
          __typename
          daysToReturn
        }
        __typename
      }
      __typename
    }
    returnDetails {
      displayName
      returnMethod
      daysToReturn
      charges {
        value
        currency
        __typename
      }
      __typename
    }
    status
    unavailabilityReasons {
      type
      subReason
      __typename
    }
    isForSale
  }
  totalCount
  __typename
}`

export interface FilterCriteria {
  name: string
  values: string[]
}

export class TescoAPI {
  private static proxyUrl = "https://tesco-proxy-b4fena2ys-robdgraham-gmailcoms-projects.vercel.app/api/tesco"

  static async searchProducts(options: { query: string; page?: number; count?: number; sortBy?: string; filterCriteria?: FilterCriteria[] }) {
    const variables = {
      query: options.query,
      page: options.page ?? 0,
      count: options.count ?? 20,
      sortBy: options.sortBy,
      filterCriteria: options.filterCriteria,
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

  static async getCategoryProducts(options: { 
    superDepartment?: string;
    department?: string; 
    page?: number; 
    count?: number; 
    sortBy?: string;
  }) {
    const variables = {
      superDepartment: options.superDepartment,
      department: options.department,
      page: options.page ?? 0,
      count: options.count ?? 48,
      sortBy: options.sortBy ?? "relevance",
    }
    return graphqlRequest<GetCategoryProductsResponse>(CATEGORY_PRODUCTS_QUERY, variables, this.proxyUrl)
  }

  static async getProduct(options: { tpnc: string }) {
    // Try a simpler query first to test if the API works
    const simpleQuery = `#graphql
      query GetProduct($tpnc: String!) {
        product(tpnc: $tpnc) {
          id
          tpnc
          title
          price {
            actual
            unitPrice
            unitOfMeasure
          }
        }
      }`
    
    const variables = {
      tpnc: options.tpnc
    }
    
    console.log('Testing simple product query with TPNC:', options.tpnc)
    const simpleResponse = await graphqlRequest<GetProductResponse>(simpleQuery, variables, this.proxyUrl)
    
    if (simpleResponse.errors) {
      console.log('Simple query failed:', simpleResponse.errors)
      return simpleResponse
    }
    
    console.log('Simple query succeeded, trying full query')
    
    // If simple query works, try the full query
    const fullVariables = {
      tpnc: options.tpnc,
      skipReviews: false,
      offset: 0,
      count: 10,
      includeVariations: true,
      includeFulfilment: true,
      markRecentlyViewed: false,
      sellersType: "ALL",
      sellerTypeForVariations: "TOP"
    }
    return graphqlRequest<GetProductResponse>(GET_PRODUCT_QUERY, fullVariables, this.proxyUrl)
  }
}


